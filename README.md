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
