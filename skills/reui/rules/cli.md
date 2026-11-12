# CLI: public registry setup and non-interactive install

## Registry setup (one-time, per project)

Free items (the ReUI components and all `c-*` examples) need only the plain string registry in `components.json`:

```json
{ "registries": { "@reui": "https://reui.io/r/{style}/{name}.json" } }
```

## Installing

Use the project's package runner (check `packageManager`):

```bash
npx shadcn@latest add @reui/<name> --yes      # npm
pnpm dlx shadcn@latest add @reui/<name> --yes  # pnpm
bunx --bun shadcn@latest add @reui/<name> --yes # bun
```

`--yes` skips confirmation prompts. The CLI auto-detects the package manager from the lockfile (there is no `--package-manager` flag). It also resolves the correct base+style variant from `components.json`, so do not pass a style.

`<name>` must be a free component or `c-*` example confirmed by CLI search or official docs. The `@reui/` prefix is for ReUI items only:

- The shadcn/ui components ReUI builds on (`button`, `dialog`, `select`, `card`, ...) are not ReUI items. Install them from shadcn by bare name: `npx shadcn@latest add button --yes`.
- `badge` and `alert` exist in both registries: `@reui/badge` and `@reui/alert` are ReUI's components, bare `badge` and `alert` are shadcn's.
- In an item's `registryDependencies`, a `@reui/<name>` entry is a ReUI item and a bare name is a shadcn/ui item. `add` installs both, so you never add them by hand.

## Handling prompts and conflicts

- **Always pass `--yes`** so the CLI does not block on confirmation prompts.
- **Do NOT pass `--overwrite` by default.** If the CLI reports an existing file, read the output and resolve deliberately: install under a different name, adjust the path, or ask the user. Only use `--overwrite` when the user explicitly wants to replace a file.
- **Preview first when touching an existing project**: `npx shadcn@latest add @reui/<name> --dry-run` shows what would change; `--diff <file>` shows a specific file's diff. Use these before overwriting.
- Run from the **project root** so `components.json` is found.

## Install errors

If an install requires authentication or payment, stop and confirm that the item and registry URL are public. Choose a free component or example instead of configuring credentials or suggesting an upgrade.

If an install 404s, read the CLI's error message and confirm the item name through `npx shadcn@latest search @reui -q "<name>"` or official docs; don't fabricate a replacement command.
