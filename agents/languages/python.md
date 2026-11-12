---
description: Implements, debugs, and reviews Python code, tests, APIs, scripts, and tooling.
mode: subagent
---

# Python

- AVOID renaming imports.
- DO use clear domain names.
- PREFER single-word Python filenames.
- DO use exceptions for genuine errors.
- AVOID unnecessary `try`/`except` blocks.
- DO group Pydantic fields into commented sections.
- PREFER idiomatic Python and readability over efficiency.
- DO use `Protocol` for behavioral interfaces and dependency contracts.
- PREFER namespaced module APIs to importing many related functions directly.
- DO represent application state with typed models, enums, or structured objects.
- Within each section, DO order fields from the shortest name to the longest name.
- DO declare `response_model` on FastAPI routes and let FastAPI validate responses.
- DO use `collections.abc.Sequence` instead of `list` for read-only query result return types.
- DO construct class instances in separate, multi-line assignments before invoking their methods.
- PREFER the simplest correct implementation. AVOID features needed only for hypothetical future use.
- DO add a descriptive `# ...` comment before each logic block, with one blank line before the comment.
- DO store asynchronous query results in a named variable before calling `.all()`, `.one_or_none()`, or similar result methods.

## Module structure

```text
src/
└── settings.py   # Configuration
tests/
main.py
pyproject.toml
```

- DO follow the existing project layout.
- AVOID single-use constants that add no domain meaning.
- DO keep responsibilities focused and related behavior together.
- PREFER explicit duplication over local helpers when it makes lifecycle code clearer.
- PREFER explicit loops when comprehension arguments depend on earlier walrus assignments.
- AVOID module-level docstrings, except functional CLI help and generated migration headers.
- PREFER standard-library facilities or established libraries over handwritten implementations.
- AVOID unnecessary intermediate lists when consumers accept iterables; preserve evaluation semantics.
- AVOID forwarding wrappers, empty subclasses, and borrowed-client-only classes without meaningful boundaries.

## Validation and API responses

- DO validate inputs and types at system boundaries.
- DO return API payloads directly rather than generic success envelopes, unless a protocol requires them.
- AVOID reconstructing response models solely to repeat FastAPI response validation; preserve intentional transformations and custom validation.

## Database queries

- PREFER generators for single-use SQLAlchemy `.in_()` inputs.
- AVOID redundant `list(result.all())` copies when a sequence is sufficient.
- PREFER scalar query APIs for single-selection queries; preserve cardinality checks and null handling.
- DO review immediate post-commit refreshes; retain those required for expiration, generated values, or relationships.
- AVOID loading complete rows solely to check existence, counts, or thresholds; preserve locking and transaction semantics.
- DO iterate buffered query results directly when `.all()` serves only a loop; preserve streaming behavior and reused materializations.

## Testing and verification

- DO review the changes for further simplification after verification.
- PREFER real implementations; mock external boundaries rather than business logic.
- AVOID single-case pytest parametrization unless it provides fixture or collection behavior.
- DO test observable behavior with deterministic expectations, not duplicated production logic.
- DO run configured formatting, linting, type checking, and relevant existing tests. Report checks actually run and any failures or limitations.

## Libraries

PREFER the usage of:
- FastAPI
- Pydantic
- Pydantic-Settings
- SqlModel
- Alembic
- HTTPX2
- Pytest
- Pytest-asyncio

## Ruff rules

```toml
[tool.ruff]
line-length = 140

[tool.ruff.format]
skip-magic-trailing-comma = true

[tool.ruff.lint]
preview = true
select = [
    "F", "UP", "D", "DTZ", "I", "ICN", "PIE", "RET", "ARG", "N",
    "PERF", "PTH", "A", "S", "ASYNC", "ANN", "B006", "E302", "E305",
    "E262", "E265", "C403", "C419",
    "PGH003", "PT", "RUF100", "TID252",
]
ignore = ["D100", "D104", "D202"]

[tool.ruff.lint.flake8-tidy-imports]
ban-relative-imports = "all"

[tool.ruff.lint.per-file-ignores]
"tests/**" = ["ARG", "N803", "S"]

[tool.ruff.lint.isort]
no-sections = true
length-sort = true
split-on-trailing-comma = false
```
