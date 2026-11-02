import { expect, test } from "bun:test"
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { writeAtomic } from "./atomic.ts"

test("publishes and replaces assets from both download and extraction buffers", async () => {
  const directory = await mkdtemp(join(tmpdir(), "dictation-assets-"))
  try {
    const destination = join(directory, "asset")
    await writeAtomic(destination, new Uint8Array([1, 2]))
    expect(await readFile(destination)).toEqual(Buffer.from([1, 2]))
    await writeAtomic(destination, new Uint8Array([3, 4]).buffer)
    expect(await readFile(destination)).toEqual(Buffer.from([3, 4]))
    expect(await readdir(directory)).toEqual(["asset"])
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test("removes the temporary file when publication fails", async () => {
  const directory = await mkdtemp(join(tmpdir(), "dictation-assets-"))
  try {
    const destination = join(directory, "asset")
    await mkdir(destination)
    await expect(writeAtomic(destination, new Uint8Array([1]))).rejects.toThrow()
    expect(await readdir(directory)).toEqual(["asset"])
    expect(await readdir(destination)).toEqual([])
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test("does not leave partial assets when writing fails", async () => {
  const directory = await mkdtemp(join(tmpdir(), "dictation-assets-"))
  try {
    await writeFile(join(directory, "parent"), "original")
    await expect(writeAtomic(join(directory, "parent", "asset"), new Uint8Array([1])))
      .rejects.toThrow()
    expect(await readdir(directory)).toEqual(["parent"])
    expect(await readFile(join(directory, "parent"), "utf8")).toBe("original")
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
