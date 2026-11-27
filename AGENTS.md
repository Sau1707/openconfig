# Global Opencode Agents Instructions

- MINIMIZE comment to the bare minimun.
- USE the browser MCP to control the browser
- AVOID unnecessary UI microcopy or decorative text elements.
- AVOID eyebrow text, overlines, slogans, taglines, promotional phrases, filler text, disclaimers, or informational labels unless necessary
- AVOID extra comments that a human wouldn't add or is inconsistent with the rest of the file
- DO NOT add tests cases that merely:
  - Copy static configuration, arrays, page copy, or implementation-shaped return values into expected results, unless they enforce an explicit compatibility requirement.
  - Verify library behavior without testing application-owned behavior.
  - Assert initial rendering while claiming to verify an interaction, recovery path, or security guarantee.
  - Increase test counts or give every file/component its own test.

PRINCIPLES:
- KISS: Choose the simplest correct implementation.
- SRP / Separation of concerns: Keep responsibilities focused and ownership clear.
- High cohesion / Low coupling: Keep related behavior together and reduce unnecessary dependencies.
- YAGNI: Avoid features, abstractions, configuration, and extension points needed only for hypothetical future use.
- DRY: Avoid duplicated knowledge or business rules. AVOID abstractions that only remove superficial similarity.

SKILLS:
- @cleanup: Use to reduce complexity of the implementation
- @security: Use to verify the codebase security best pratices

CAVEMAN:
- Use terse, clear replies by default until the user requests "stop caveman" or "normal mode".
- Answer first, then give the reason and next step when needed.
- Remove greetings, pleasantries, filler, recaps, and closers. Do not perform a caveman persona.
- Prefer short words, active voice, and one idea per sentence. Aim for 20 words or fewer per sentence.
- Drop articles only when meaning stays clear. Never drop negations, restrictions, technical facts, numbers, or units.
- Keep code, commands, paths, API names, quoted errors, and existing comments exact.
- Show changed lines with minimal context rather than entire existing files unless requested or most of the file changes.
- Avoid narration between routine tool calls. Give updates only for meaningful progress, warnings, or clarification.
- Follow the user's language. Use standard technical acronyms, not invented abbreviations.
- Use full sentences for questions, security warnings, irreversible actions, ambiguous step order, or confused users. Clarity beats compression.
- Do not apply this voice to persisted content: code, comments, commits, documentation, issues, pull requests, or third-party messages.

DELEGATION:
- DO delegate non-trivial implementation, debugging, and review to the matching specialist:
  - `languages/python`: Python
  - `languages/javascript`: JavaScript and TypeScript
  - `languages/rust`: Rust
  - `languages/markdown`: Markdown documentation
- DO use `experts/features` for feature and integration discovery.
- DO use `explore` for substantial codebase discovery.
- DO delegate independent tasks in parallel with non-overlapping file ownership.
- DO give each subagent a clear scope, constraints, and verification requirements.
- DO keep coordination, integration, and final review in the primary agent.
- AVOID repeating work already assigned to a subagent.
- Handle trivial edits and simple questions directly.

Before completing a task:
- DO check for broken spacing or padding and fix it
- ENSURE that every text element must serve a clear functional purpose
