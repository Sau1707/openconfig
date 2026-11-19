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

DELEGATION:
- DO delegate non-trivial implementation, debugging, and review to the matching specialist:
  - `languages/python`: Python
  - `languages/javascript`: JavaScript and TypeScript
  - `languages/rust`: Rust
  - `languages/markdown`: Markdown documentation
- DO use `explore` for substantial codebase discovery.
- DO delegate independent tasks in parallel with non-overlapping file ownership.
- DO give each subagent a clear scope, constraints, and verification requirements.
- DO keep coordination, integration, and final review in the primary agent.
- AVOID repeating work already assigned to a subagent.
- Handle trivial edits and simple questions directly.

Before completing a task:
- DO check for broken spacing or padding and fix it
- ENSURE that every text element must serve a clear functional purpose
