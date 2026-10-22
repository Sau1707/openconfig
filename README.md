# Openconfig

personal [opencode](https://opencode.ai/) configuration

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

## Automated cleanup

Requires Bun, Git, and an authenticated OpenCode V2 installation. Run from the
repository you want to clean up:

```sh
curl -fsSL https://raw.githubusercontent.com/Sau1707/openconfig/main/dist/cleanup.mjs | bun run -
```

The single-file bundle includes the client and cleanup instructions; no checkout,
dependency installation, or installed cleanup skill is required. The URL works
once the bundle is published to `main`.

To inspect before running, download the executable instead:

```sh
curl -fsSL https://raw.githubusercontent.com/Sau1707/openconfig/main/dist/cleanup.mjs -o /tmp/cleanup.mjs
bun /tmp/cleanup.mjs --list
bun /tmp/cleanup.mjs
```

Connects to the authenticated shared local OpenCode server, starting it if needed.
Reviews non-ignored text files sequentially and automatically applies high-priority,
high-confidence cleanup changes with session-local permission approval. Review
your working-tree changes afterward. `--list` only lists files; `--help` shows usage.

To develop and rebuild the bundle:

```sh
bun install
bun run cleanup
bun run build
bun test
```
