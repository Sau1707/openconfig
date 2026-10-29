import { describe, expect, test } from "bun:test"
import { decodePCM, parseMessage } from "./session.ts"
import { fileURLToPath } from "node:url"

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
