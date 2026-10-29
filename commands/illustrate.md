---
description: Generate an image in the reference's white-on-black sketch style
---

Generate an image of: $ARGUMENTS

Use the configured `image_generate` tool. Pass `reference.webp`, located alongside this command's `illustrate.md`, in `images` as the style reference. Resolve the path from the command's directory, not the working directory. If the reference is unavailable, ask for it.

Match its monochrome white-on-black scratchboard aesthetic: delicate, slightly irregular hand-drawn lines, fine crosshatching, sparse white highlights, subtle grain, deep black negative space, and intricate etched detail. Avoid color, solid white fills, glossy 3D rendering, and photorealism. Borrow the rendering style and contrast, not the city skyline, bridge, or composition, unless the requested subject calls for them.

Save the generated image in the current project root with a descriptive filename, without overwriting existing files, and return its path.
