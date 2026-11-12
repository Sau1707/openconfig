# ReUI registry structure

Use ReUI's shadcn-compatible registry for free components and `c-*` examples. **Examples are built FROM components** - reuse them, don't rebuild. Icons come from `lucide-react`, not the registry.

- **component** - one of the ReUI components with a real API (`data-grid`, `kanban`, `filters`, `date-selector`, `tree`, ...). Install directly (`@reui/data-grid`) or let it come in as a dependency of an example. Read its official API docs and installed types.
- **example** - a free `c-*` single-pattern use-case of a component (`c-kanban-1`, `c-data-grid-3`). Install one and read it to copy real composition. Find examples through CLI search or official docs.

## The @reui registry

ReUI items install through the shadcn CLI as `npx shadcn@latest add @reui/<name> --yes`, with `<name>` confirmed by CLI search or official docs. The CLI reads the `@reui` registry from the project's `components.json`. Free items need only the plain string form:

```json
{ "registries": { "@reui": "https://reui.io/r/{style}/{name}.json" } }
```

## ReUI items vs shadcn/ui components

- **Free ReUI items** (components and `c-*` examples) install as `@reui/<name>`.
- **shadcn/ui components** that ReUI builds on (`button`, `dialog`, `select`, `card`, ...) are not ReUI items. They install from shadcn by bare name: `npx shadcn@latest add button --yes`.
- **`badge` and `alert` exist in both registries.** `@reui/badge` and `@reui/alert` are ReUI's components (the extra variants in [components.md](./components.md)); bare `badge` and `alert` are shadcn's.
- **In an item's `registryDependencies`**, a `@reui/<name>` entry is a ReUI item and a bare name is a shadcn/ui item. `add` installs both for you.

## Know your base: base or radix

ReUI ships every item in two builds - `base` (Base UI) and `radix` (Radix UI) - with mirrored names. The CLI installs the build matching your project automatically, but **you must write code against the right base's API**. Detect it from `components.json` -> `style`: the segment before the first `-` is the base (`base-nova` -> Base UI, `radix-nova` -> Radix UI). The installed files and `c-*` examples are already in your base - read them and adapt on that base. See [components.md](./components.md) for the API deltas.

Choose official docs and previews for the same base as the project; don't copy another base's API without checking the installed types.

## Component API index

The canonical index of component API docs is **https://reui.io/llms.txt**. Use it to find the appropriate documentation, then confirm the API against the project's installed files.
