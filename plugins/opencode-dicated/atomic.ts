import { randomUUID } from "node:crypto"
import { rename, rm } from "node:fs/promises"

export async function writeAtomic(destination: string, bytes: Uint8Array | ArrayBuffer) {
  const temporary = `${destination}.${randomUUID()}.partial`
  try {
    await Bun.write(temporary, bytes)
    await rename(temporary, destination)
  } finally {
    await rm(temporary, { force: true })
  }
}
