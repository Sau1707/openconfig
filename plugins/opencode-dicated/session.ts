export type Status = "idle" | "loading" | "recording" | "transcribing"
export type Message =
  | { type: "recording" }
  | { type: "transcribing" }
  | { type: "transcript"; text: string }
  | { type: "error"; message: string }

export function parseMessage(line: string): Message {
  const value = JSON.parse(line)
  if (value?.type === "recording" || value?.type === "transcribing") return value
  if (value?.type === "transcript" && typeof value.text === "string") return value
  if (value?.type === "error" && typeof value.message === "string") return value
  throw new Error("Invalid dictation helper response")
}

export function decodePCM(bytes: Buffer) {
  // Adapted from Uncode (Apache-2.0).
  return Float32Array.from(
    { length: Math.floor(bytes.length / 2) },
    (_, index) => bytes.readInt16LE(index * 2) / 32768,
  )
}
