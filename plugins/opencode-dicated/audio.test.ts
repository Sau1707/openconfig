import { expect, test } from "bun:test"
import { muteOutput } from "./audio.ts"

function output(muted = false) {
  const calls: string[][] = []
  return {
    calls,
    run: async (args: string[]) => {
      calls.push(args)
      if (args[0] === "inspect") return "id 42, type PipeWire:Interface:Node\n"
      if (args[0] === "get-volume") return `Volume: 0.75${muted ? " [MUTED]" : ""}\n`
      return ""
    },
  }
}

test("mutes the original output and restores it without changing volume", async () => {
  const { calls, run } = output()
  const restore = await muteOutput(run)
  expect(calls).toEqual([
    ["inspect", "@DEFAULT_AUDIO_SINK@"],
    ["get-volume", "42"],
    ["set-mute", "42", "1"],
  ])
  await restore()
  expect(calls.at(-1)).toEqual(["set-mute", "42", "0"])
})

test("leaves an already muted output muted", async () => {
  const { calls, run } = output(true)
  await (await muteOutput(run))()
  expect(calls.map((args) => args[0])).toEqual(["inspect", "get-volume"])
})

test("does not change output state when inspection fails", async () => {
  const calls: string[][] = []
  await expect(muteOutput(async (args) => { calls.push(args); return "invalid" })).rejects.toThrow("identify")
  expect(calls).toHaveLength(1)
})

test("does not mute when the current mute state cannot be read", async () => {
  const { calls, run } = output()
  await expect(muteOutput(async (args) => args[0] === "get-volume" ? "invalid" : run(args)))
    .rejects.toThrow("mute state")
  expect(calls).toHaveLength(1)
})

test("attempts restoration if the mute command fails", async () => {
  const { calls, run } = output()
  await expect(muteOutput(async (args) => {
    if (args[0] === "set-mute" && args[2] === "1") throw new Error("Mute failed")
    return run(args)
  })).rejects.toThrow("Mute failed")
  expect(calls.at(-1)).toEqual(["set-mute", "42", "0"])
})
