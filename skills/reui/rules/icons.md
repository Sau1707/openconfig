# Icons

- Use `lucide-react` only; set `"iconLibrary": "lucide"` in `components.json` before installing ReUI items.
- Replace other icon imports in examples with equivalent Lucide components. Don't install ReUI's paid icon set.
- Inside `Button`, use `data-icon="inline-start"` before the label or `data-icon="inline-end"` after it. Let the component size its icons.
- Pass icons as components, not string keys. Mark decorative icons `aria-hidden="true"` and give icon-only controls an accessible label describing their action.
