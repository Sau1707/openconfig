# Icons (ReUI delta over shadcn)

Use the project's configured `iconLibrary`, put `data-icon="inline-start"` on an icon before the label inside `Button` (`data-icon="inline-end"` on one after it), put no sizing classes on icons inside components, and pass icons as components, not string keys. ReUI adds the following.

## Portable icons (library-agnostic)

ReUI components, examples, and blocks are authored to be icon-library-agnostic. The shadcn CLI installs each item's icons in the library named by `iconLibrary` in `components.json` - you swap nothing. When `iconLibrary` is not set, the CLI falls back to `lucide`, so the icons arrive as `lucide-react` imports. If that is not the project's library, set `iconLibrary` before installing, or change the **import source and component name** to your library, keeping the same icon-name semantics (each key below is an `iconLibrary` value):

- `lucide` -> `lucide-react`
- `tabler` -> `@tabler/icons-react`
- `phosphor` -> `@phosphor-icons/react`
- `remixicon` -> `@remixicon/react`
- `hugeicons` -> icons from `@hugeicons/core-free-icons`, rendered through `HugeiconsIcon` from `@hugeicons/react`

Don't assume `lucide-react`: read `iconLibrary` from `components.json`, and when it is unset, check which icon package the project already uses.

## Keep icons purposeful

Icons support the hierarchy, they don't replace it: keep them small, matched to the surrounding density, and decorative ones `aria-hidden="true"` (an icon-only control still needs an accessible label on the control). Don't add ornamental icons that do no job.

## Motion Icons (the `@reui/icons/...` set)

ReUI ships its own icon set in 4 styles (outline, solid, duotone, filled). Every icon installs from the default path; some also have a real hover animation (motion/react) on the animated path:

```bash
npx shadcn@latest add @reui/icons/default/<style>/<name> --yes    # static, every icon
npx shadcn@latest add @reui/icons/animated/<style>/<name> --yes   # only when a real animation is documented
```

The animated path answers for every icon, but for an icon without a real animation it installs the same static drawing. Confirm animation support in official docs or the installed source rather than inferring it from the path.

Motion Icons need an Ultimate license to install (`REUI_LICENSE_KEY`, see [cli.md](./cli.md)). On a free or Pro account, use the project's own `iconLibrary`. On Ultimate, a Motion Icon on the primary action is the 1 hover flourish (see [motion.md](./motion.md)).

Finding icons:

- Use CLI registry search or official icon docs to confirm current names and install commands.
- Inspect official previews before trusting a name, especially legacy names; share available preview links with the user.
- Confirm a real hover animation before choosing the animated variant.
- Label icon-only buttons by their action, not merely the icon's appearance.

The `icon-stack` component composes multiple icons into a stacked display.
