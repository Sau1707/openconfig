import { afterAll, beforeAll, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { leafFolders } from "./cleanup.mjs";

let directory;
let bundle;

beforeAll(async () => {
  directory = await mkdtemp("/tmp/opencode/cleanup-test-");
  bundle = join(directory, "cleanup.mjs");
  execFileSync(process.execPath, ["build", "scripts/cleanup.mjs", "--target=bun", `--outfile=${bundle}`]);
  const repository = join(directory, "repo");
  await mkdir(repository);
  execFileSync("git", ["init", "--quiet"], { cwd: repository });
  await writeFile(join(repository, ".gitignore"), "ignored.txt\nignored-tracked.txt\nignored-folder/\n");
  await writeFile(join(repository, "tracked.txt"), "tracked");
  execFileSync("git", ["add", "."], { cwd: repository });
  await writeFile(join(repository, "untracked file.txt"), "untracked");
  await writeFile(join(repository, "ignored.txt"), "ignored");
  await writeFile(join(repository, "ignored-tracked.txt"), "ignored tracked");
  execFileSync("git", ["add", "--force", "ignored-tracked.txt"], { cwd: repository });
  await mkdir(join(repository, "ignored-folder"));
  await writeFile(join(repository, "ignored-folder", "tracked.txt"), "ignored tracked");
  execFileSync("git", ["add", "--force", "ignored-folder"], { cwd: repository });
  for (const name of ["node_modules", ".venv", "venv", "dist", "build", "coverage", "__pycache__", ".pytest_cache"]) {
    const path = join(repository, "nested", name);
    await mkdir(path, { recursive: true });
    await writeFile(join(path, "file.txt"), "generated");
  }
  for (const name of ["bun.lock", "package-lock.json", "uv.lock", "Cargo.lock"]) {
    await writeFile(join(repository, name), "lockfile");
  }
  await mkdir(join(repository, "locks"));
  await writeFile(join(repository, "locks", "uv.lock"), "lockfile");
  execFileSync("git", ["add", "nested/dist", "bun.lock"], { cwd: repository });
  await writeFile(join(repository, "binary"), Buffer.from([0, 1, 2]));
  await symlink("tracked.txt", join(repository, "link"));
});

test("respects nested ignore rules, negations, and repository-local excludes", async () => {
  const repository = join(directory, "ignore-rules");
  await mkdir(repository);
  execFileSync("git", ["init", "--quiet"], { cwd: repository });
  await mkdir(join(repository, "source"));
  await writeFile(join(repository, "source", ".gitignore"), "*.txt\n!keep.txt\n");
  await writeFile(join(repository, "source", "skip.txt"), "ignored");
  await writeFile(join(repository, "source", "keep.txt"), "source");
  await writeFile(join(repository, ".git", "info", "exclude"), "local.txt\n");
  await writeFile(join(repository, "local.txt"), "local");
  const result = spawnSync(process.execPath, [bundle, "--list"], {
    cwd: repository, encoding: "utf8",
  });
  expect(result.status).toBe(0);
  expect(result.stdout.trim().split("\n")).toEqual([
    "source",
  ]);
});

afterAll(async () => {
  if (directory) await rm(directory, { recursive: true, force: true });
});

test("bundle lists target folders outside the checkout without a server", () => {
  const result = spawnSync(process.execPath, [bundle, "--list"], {
    cwd: join(directory, "repo"), encoding: "utf8",
  });
  expect(result.status).toBe(0);
  expect(result.stdout.trim().split("\n")).toEqual([
    ".",
  ]);
});

test("batches files only in deepest eligible folders", () => {
  expect([...leafFolders([
    "README.md", "src/index.js", "src/api/one.js", "src/api/two.js",
    "src/ui/button.js", "src/ui/widgets/item.js", "src-other/entry.js",
  ])]).toEqual([
    ["src/api", ["src/api/one.js", "src/api/two.js"]],
    ["src/ui/widgets", ["src/ui/widgets/item.js"]],
    ["src-other", ["src-other/entry.js"]],
  ]);
});

test("root-only and empty repositories have no extra batches", () => {
  expect([...leafFolders(["a.js", "b.js"])]).toEqual([[".", ["a.js", "b.js"]]]);
  expect([...leafFolders([])]).toEqual([]);
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
