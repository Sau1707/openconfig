import { describe, expect, test } from "bun:test"
import { decodePCM, parseMessage } from "./session.ts"
import { fileURLToPath } from "node:url"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

describe("helper messages", () => {
  test("accepts recording states and transcript text", () => {
    expect(parseMessage('{"type":"recording"}')).toEqual({ type: "recording" })
    expect(parseMessage('{"type":"transcribing"}')).toEqual({ type: "transcribing" })
    expect(parseMessage('{"type":"transcript","text":"A cabin by a lake"}'))
      .toEqual({ type: "transcript", text: "A cabin by a lake" })
    expect(parseMessage('{"type":"error","message":"No microphone"}'))
      .toEqual({ type: "error", message: "No microphone" })
  })

  test("rejects malformed helper output", () => {
    for (const line of ["not json", "null", '{}', '{"type":"transcript","text":42}', '{"type":"submit"}'])
      expect(() => parseMessage(line)).toThrow()
  })
})

describe("microphone PCM", () => {
  test("decodes signed little-endian samples without exceeding the sample range", () => {
    const bytes = Buffer.alloc(8)
    const samples = [-32768, 0, 16384, 32767]
    samples.forEach((sample, index) => bytes.writeInt16LE(sample, index * 2))
    expect([...decodePCM(bytes)]).toEqual([-1, 0, 0.5, 32767 / 32768])
  })

  test("handles empty audio and ignores an incomplete trailing sample", () => {
    expect([...decodePCM(Buffer.alloc(0))]).toEqual([])
    expect([...decodePCM(Buffer.from([0, 64, 255]))]).toEqual([0.5])
  })
})

test("helper reports missing dependencies without recording or downloading assets", async () => {
  const child = Bun.spawn([process.execPath, fileURLToPath(new URL("./helper.ts", import.meta.url))], {
    env: { ...process.env, PATH: "" },
    stdin: "pipe", stdout: "pipe", stderr: "pipe",
  })
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited,
  ])
  child.stdin.end()
  expect(code).toBe(1)
  expect(stderr).toBe("")
  expect(parseMessage(stdout.trim())).toMatchObject({ type: "error" })
  expect(stdout).not.toContain('"type":"recording"')
})

test("SIGTERM cancels asset loading without a cancel command", async () => {
  const directory = await mkdtemp(join(tmpdir(), "dictation-cancel-"))
  try {
    for (const command of ["pw-record", "unzip", "wpctl"])
      await writeFile(join(directory, command), "#!/bin/sh\nexit 1\n", { mode: 0o755 })
    const preload = join(directory, "preload.js")
    await writeFile(preload, `
      globalThis.fetch = (_url, { signal }) => new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(signal.reason), { once: true })
        process.stderr.write("downloading\\n")
      })
    `)
    const child = Bun.spawn([
      process.execPath, "--preload", preload, fileURLToPath(new URL("./helper.ts", import.meta.url)),
    ], {
      env: { ...process.env, PATH: directory, XDG_CACHE_HOME: directory },
      stdin: "pipe", stdout: "pipe", stderr: "pipe",
      signal: AbortSignal.timeout(3000),
    })
    try {
      const reader = child.stderr.getReader()
      const ready = await reader.read()
      expect(new TextDecoder().decode(ready.value)).toBe("downloading\n")
      child.kill("SIGTERM")
      const [stdout, stderr, code] = await Promise.all([
        new Response(child.stdout).text(), reader.read(), child.exited,
      ])
      reader.releaseLock()
      expect(code).toBe(0)
      expect(stdout).toBe("")
      expect(stderr.done).toBe(true)
    } finally {
      child.stdin.end()
      if (child.exitCode === null) {
        child.kill("SIGKILL")
        await child.exited
      }
    }
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
