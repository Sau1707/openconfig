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

## Cleanup workflow

Create `.github/workflows/cleanup.yml` in your target repository:

```yaml
name: Cleanup

on:
  schedule:
    - cron: '0 6 * * 1'
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

concurrency:
  group: cleanup-pipeline
  cancel-in-progress: false

jobs:
  cleanup:
    uses: Sau1707/openconfig/.github/workflows/cleanup.yml@main
    secrets:
      OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```