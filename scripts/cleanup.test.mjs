import { afterAll, beforeAll, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

let directory;
let bundle;

beforeAll(async () => {
  directory = await mkdtemp("/tmp/opencode/cleanup-test-");
  bundle = join(directory, "cleanup.mjs");
  execFileSync(process.execPath, ["build", "scripts/cleanup.mjs", "--target=bun", `--outfile=${bundle}`]);
  const repository = join(directory, "repo");
  await mkdir(repository);
  execFileSync("git", ["init", "--quiet"], { cwd: repository });
  await writeFile(join(repository, ".gitignore"), "ignored.txt\n");
  await writeFile(join(repository, "tracked.txt"), "tracked");
  execFileSync("git", ["add", "."], { cwd: repository });
  await writeFile(join(repository, "untracked file.txt"), "untracked");
  await writeFile(join(repository, "ignored.txt"), "ignored");
  await writeFile(join(repository, "binary"), Buffer.from([0, 1, 2]));
  await symlink("tracked.txt", join(repository, "link"));
});

afterAll(async () => {
  if (directory) await rm(directory, { recursive: true, force: true });
});

test("bundle lists eligible files outside the checkout without a server", () => {
  const result = spawnSync(process.execPath, [bundle, "--list"], {
    cwd: join(directory, "repo"), encoding: "utf8",
  });
  expect(result.status).toBe(0);
  expect(result.stdout.trim().split("\n")).toEqual([
    ".gitignore", "tracked.txt", "untracked file.txt",
  ]);
});

test("bundle runs from stdin like curl piped to Bun", async () => {
  const result = spawnSync(process.execPath, ["run", "-", "--help"], {
    cwd: directory, input: await readFile(bundle), encoding: "utf8",
  });
  expect(result.status).toBe(0);
  expect(result.stdout).toContain("Cleanup instructions are embedded");
});

test("bundle contains the cleanup instructions", async () => {
  expect(await readFile(bundle, "utf8")).toContain("# Cleanup");
});

test("unknown arguments fail without starting a cleanup", () => {
  const result = spawnSync(process.execPath, [bundle, "--unknown"], {
    cwd: directory, encoding: "utf8",
  });
  expect(result.status).toBe(1);
  expect(result.stderr).toContain("Unknown argument");
});
