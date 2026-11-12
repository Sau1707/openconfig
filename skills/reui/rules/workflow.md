# Workflow: find -> install -> read API -> adapt

Use the shadcn CLI for discovery and installation, official docs for APIs, and installed examples for composition. Reuse the design rather than redesigning it.

## When to reach for ReUI vs plain shadcn

- A full page or section: plan its regions with [compose.md](./compose.md), then find matching blocks or examples.
- A data table with sorting, filtering, pagination or virtualization: `data-grid`, never a hand-rolled `<table>`.
- A drag-and-drop board: `kanban`.
- Column filters, a date range, a tree or a stepper: the matching ReUI component.
- A single generic control shadcn already has (Button, Dialog, Select): plain shadcn.

## 1. Find

Search the configured registry from the project root:

```bash
npx shadcn@latest search @reui -q "<intent or component>"
```

Read descriptions and official previews before choosing. Confirm exact item names through search or docs; don't infer names from a category. Share official preview links when available.

Components and `c-*` examples are free; blocks need Pro or Ultimate. Prefer free components and examples when the user lacks a suitable license. Use `lucide-react` for icons.

## 2. Install

```bash
npx shadcn@latest add @reui/<confirmed-name> --yes
```

The CLI reads `components.json`, installs the correct base+style variant, resolves dependencies, and rewrites aliases. Don't pass a base/style or overwrite existing files without authorization. See [cli.md](./cli.md).

## 3. Read the API

- Use https://reui.io/llms.txt to find official API docs for the project's base (Base UI or Radix).
- Read the installed component's exports and types. Find a relevant `c-*` example through CLI search or docs, install it when needed, and read its wiring.
- Verify unfamiliar props, variants and import paths against those sources before using them. Share the relevant API documentation link with the user.

## 4. Adapt

1. Read the added files and preserve their composition.
2. Replace demo data and stubbed actions with real, typed data and behavior; see [adapting.md](./adapting.md).
3. Use `lucide-react` for icon imports; see [icons.md](./icons.md).
4. Use the active theme's semantic tokens; see [color.md](./color.md).
5. Check hierarchy, density, responsive behavior, and empty/loading/error states; see [layout.md](./layout.md) and [motion.md](./motion.md).
6. Pass the local gates in [quality.md](./quality.md), review [anti-patterns.md](./anti-patterns.md), then typecheck and lint.

## If no single block fits

Compose from components and worked `c-*` examples. Search for each required component, read its API, and adapt the closest example. Don't force an unrelated block into the page or invent an API.
