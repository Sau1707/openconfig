import { execFile } from "node:child_process"
import { promisify } from "node:util"

const exec = promisify(execFile)

async function command(args: string[]) {
  const { stdout } = await exec("wpctl", args, { timeout: 1000, env: { ...process.env, LC_ALL: "C" } })
  return stdout
}

export async function muteOutput(run = command) {
  const info = await run(["inspect", "@DEFAULT_AUDIO_SINK@"])
  const id = /^id\s+(\d+),/m.exec(info)?.[1]
  if (!id) throw new Error("Could not identify the default audio output")
  const volume = await run(["get-volume", id])
  if (!/^Volume:\s+[\d.]+(?:\s+\[MUTED\])?\s*$/.test(volume))
    throw new Error("Could not read the audio output mute state")
  if (volume.includes("[MUTED]")) return async () => {}
  const restore = async () => { await run(["set-mute", id, "0"]) }
  try {
    await run(["set-mute", id, "1"])
  } catch (error) {
    await restore()
    throw error
  }
  return restore
}
