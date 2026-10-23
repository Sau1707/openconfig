# Openconfig

Personal [opencode](https://opencode.ai/) configuration

<br />

## Install

```sh
git clone https://github.com/Sau1707/openconfig.git ~/.config/opencode
```

If the directory already exists, back it up first, then clone:

```sh
mv ~/.config/opencode ~/.config/opencode.backup-$(date +%Y%m%d-%H%M%S)
git clone https://github.com/Sau1707/openconfig.git ~/.config/opencode
```

<br />

## Verify and update

```sh
opencode debug config
git -C ~/.config/opencode pull --ff-only
```

<br />

## Automated cleanup

Requires Bun, Git, and an authenticated OpenCode V2 installation. Run in the
repository:

```sh
curl -fsSL https://raw.githubusercontent.com/Sau1707/openconfig/main/dist/cleanup.mjs | bun run -
```

Runs one sequential session per deepest folder containing eligible text files.
Ancestor folders and their direct files are not scheduled separately. Git-ignored
files, dependencies, virtual environments, build output, caches, and lockfiles
are skipped. Use `--list` to preview target folders without making changes.

Each run creates `cleanup.json` with the target folder tree. Leaf values are
`false` for pending/failed folders and `true` for successfully completed folders.
Progress is saved after each folder and resets on the next run. `--list` does
not create or update this file.
