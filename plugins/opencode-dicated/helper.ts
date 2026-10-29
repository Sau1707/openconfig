import { dlopen, ptr } from "bun:ffi"
// Adapted from Uncode (Apache-2.0); changed for a cancellable TUI helper.
import { createHash, randomUUID } from "node:crypto"
import { spawn } from "node:child_process"
import { mkdir, readFile, rename, rm } from "node:fs/promises"
import { homedir } from "node:os"
import { join } from "node:path"
import { createInterface } from "node:readline"
import { decodePCM, type Message } from "./session.ts"

const engineRevision = "93e88ede867e4311c39151285e74df513e4b835b"
const modelRevision = "ca5287601bef25af26dcf2e1b2bdc0843a7c19e5"
const modelHash = "b6e02f048568ac5d01a2042556c658061e699acbc0aa2a1439f52f3d461dffeb"
const controller = new AbortController()
let stopRecording: (() => void) | undefined

function send(message: Message) {
  process.stdout.write(`${JSON.stringify(message)}\n`)
}

async function download(url: string, destination: string, hash?: string) {
  try {
    const bytes = await readFile(destination)
    if (!hash || createHash("sha256").update(bytes).digest("hex") === hash) return
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
  }
  const response = await fetch(url, { signal: controller.signal })
  if (!response.ok) throw new Error(`Asset download failed: HTTP ${response.status}`)
  const bytes = new Uint8Array(await response.arrayBuffer())
  if (!bytes.length) throw new Error("Downloaded asset is empty")
  if (hash && createHash("sha256").update(bytes).digest("hex") !== hash)
    throw new Error("Whistle model checksum mismatch")
  const temporary = `${destination}.${randomUUID()}.partial`
  try {
    await Bun.write(temporary, bytes)
    await rename(temporary, destination)
  } finally {
    await rm(temporary, { force: true })
  }
}

async function loadEngine() {
  if (process.platform !== "linux" || !["x64", "arm64"].includes(process.arch))
    throw new Error("Dictation currently supports Linux x64 and arm64 only")
  for (const command of ["pw-record", "unzip"])
    if (!Bun.which(command)) throw new Error(`Missing ${command}; see the plugin README`)
  const directory = join(
    process.env.XDG_CACHE_HOME ?? join(homedir(), ".cache"),
    "opencode-dicated",
    `${engineRevision}-${modelRevision}`,
  )
  await mkdir(directory, { recursive: true, mode: 0o700 })
  const model = join(directory, "whistle.cact")
  const arch = process.arch === "x64" ? "x86_64" : "aarch64"
  const wheel = `cactus_needle-3.3.1-py3-none-manylinux2014_${arch}.whl`
  const wheelPath = join(directory, wheel)
  await download(
    `https://huggingface.co/Cactus-Compute/whistle/resolve/${modelRevision}/whistle.cact`,
    model,
    modelHash,
  )
  await download(
    `https://huggingface.co/Cactus-Compute/needle3/resolve/${engineRevision}/python/${wheel}`,
    wheelPath,
  )
  const libraryPath = join(directory, `libneedle3-${arch}.so`)
  if (!(await Bun.file(libraryPath).exists())) {
    const child = Bun.spawn(["unzip", "-p", wheelPath, "needle/libneedle3.so"], {
      stdout: "pipe", stderr: "pipe", signal: controller.signal,
    })
    const [bytes, stderr, code] = await Promise.all([
      new Response(child.stdout).arrayBuffer(),
      new Response(child.stderr).text(),
      child.exited,
    ])
    if (code !== 0 || !bytes.byteLength) throw new Error(`Engine extraction failed: ${stderr}`)
    const temporary = `${libraryPath}.${randomUUID()}.partial`
    try {
      await Bun.write(temporary, bytes)
      await rename(temporary, libraryPath)
    } finally {
      await rm(temporary, { force: true })
    }
  }
  const library = dlopen(libraryPath, {
    needle_load: { args: ["ptr", "u64"], returns: "i32" },
    needle_transcribe: {
      args: ["ptr", "i32", "ptr", "ptr", "i32", "ptr", "i32"], returns: "i32",
    },
    needle_last_error: { args: [], returns: "cstring" },
  })
  const weights = new Uint8Array(await readFile(model))
  if (library.symbols.needle_load(ptr(weights), weights.byteLength) < 0)
    throw new Error(library.symbols.needle_last_error()?.toString() ?? "Model load failed")
  return { library, weights }
}

function record() {
  const child = spawn("pw-record", ["--raw", "--format", "s16", "--rate", "16000", "--channels", "1", "-"], {
    stdio: ["ignore", "pipe", "pipe"],
  })
  const chunks: Buffer[] = []
  const maxBytes = 16000 * 30 * 2
  let length = 0
  let stopped = false
  let stderr = ""
  let killTimer: ReturnType<typeof setTimeout> | undefined
  const stop = () => {
    if (stopped) return
    stopped = true
    child.kill("SIGINT")
    killTimer = setTimeout(() => child.kill("SIGKILL"), 1000)
  }
  stopRecording = stop
  const timer = setTimeout(stop, 30000)
  return new Promise<Float32Array>((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer)
      clearTimeout(killTimer)
      stopRecording = undefined
    }
    child.once("spawn", () => send({ type: "recording" }))
    child.stdout.on("data", (chunk: Buffer) => {
      const bytes = chunk.subarray(0, maxBytes - length)
      chunks.push(bytes)
      length += bytes.length
      if (length >= maxBytes) stop()
    })
    child.stderr.on("data", (chunk) => { stderr = (stderr + chunk.toString()).slice(-4000) })
    child.once("error", (error) => { cleanup(); reject(error) })
    child.once("close", (code, signal) => {
      cleanup()
      if (controller.signal.aborted) return reject(new Error("Recording cancelled"))
      if (!stopped && (code !== 0 || signal))
        return reject(new Error(`Microphone failed: ${stderr.trim() || signal || code}`))
      resolve(decodePCM(Buffer.concat(chunks, length)))
    })
  })
}

function cancel() {
  controller.abort()
  stopRecording?.()
}

const input = createInterface({ input: process.stdin })
input.on("line", (line) => {
  if (line === "stop") stopRecording?.()
  if (line === "cancel") cancel()
})
input.on("close", cancel)
process.on("SIGTERM", cancel)
process.on("SIGINT", cancel)

try {
  const engine = await loadEngine()
  controller.signal.throwIfAborted()
  try {
    const audio = await record()
    if (!audio.length) throw new Error("No microphone audio captured")
    send({ type: "transcribing" })
    const output = Buffer.alloc(262144)
    if (engine.library.symbols.needle_transcribe(ptr(audio), audio.length, null, null, 0, ptr(output), output.length) < 0)
      throw new Error(engine.library.symbols.needle_last_error()?.toString() ?? "Transcription failed")
    const end = output.indexOf(0)
    if (end < 0) throw new Error("Invalid transcription output")
    const result = JSON.parse(output.toString("utf8", 0, end))
    if (typeof result.text !== "string") throw new Error("Whistle returned an invalid transcript")
    send({ type: "transcript", text: result.text.trim() })
  } finally {
    engine.library.close()
  }
} catch (error) {
  if (!controller.signal.aborted) {
    send({ type: "error", message: error instanceof Error ? error.message : String(error) })
    process.exitCode = 1
  }
} finally {
  input.close()
}
