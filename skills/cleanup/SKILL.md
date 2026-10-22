---
name: cleanup
description: Review or implement structural cleanup in LongLink. Prioritize unnecessary layers, duplicated workflows, unused state, and overly complex logic. Use when the user asks to simplify, refactor, or remove unnecessary code while preserving intended behavior.
---

# Cleanup

- DO inspect for high-confidence simplifications that remove unnecessary concepts and maintenance work, not only lines of code.
- For a review, search for findings, or report, DO inspect and present candidates without editing files.
- For implementation or refactoring, DO complete the requested or selected changes across affected callers and contracts, then verify them.
- PREFER changes that remove a concept, state owner, contract, workflow step, or abstraction to changes that only shorten code.
- For meaningful simplification requests, DON'T fill reviews with collection or syntax rewrites.
- DO rank candidates by conceptual reduction, maintenance benefit, and evidence of safety, not line count.

### Patterns to investigate

- Check whether callers can use the established library's typed API instead of JSX marker parsing or forwarding classes. 
- Check whether a hook/controller and companion component always reconnect. Consider one workflow owner.
- Check whether one scope can own HTTP clients, SQL connections, transactions, tunnels, and cleanup while collaborators use those resources. 
- Check whether attempt-local state can use a component or operation lifetime instead of resets across multiple owners. Preserve retry drafts and closing effects. 
- Check whether a validated model can pass through a service without unpacking and reconstructing an equivalent model. Keep server-owned fields excluded. 
- Trace fields stored, serialized, protected, and tested but never used for application decisions. Understand retention effects before removing schema or fixture code. 
- Check whether a value always comes from another authoritative field. Check external producers before removing the transmitted field or validation. 
- Check whether a transactional obligation belongs in the operation that requires it. Preserve lock order and commit ownership.  
- Check whether route or tenant identity can be resolved once and passed explicitly to dependent queries. Preserve parallel fetching, cancellation, polling, and loading/error behavior.
- Check whether callers prove that boolean combinations encode mutually exclusive business policies. Consider explicit business modes.  
- Check whether removing a forwarding boundary clarifies operation lifetime and order. Preserve useful separation and avoid excessive nesting.  
- Check whether production needs parsers or facades with different contracts. Keep fixture conveniences in test helpers.

### 0. Project conventions

- DO read and follow `AGENTS.md`. Fix anything that is inconsistent with the repository's conventions.
- SIMPLIFY database queries, N+1 queries, eager/lazy loads, and prefetches;
- SIMPLIFY refreshes, reloads, saves, flushes, commits, and retries;
- SIMPLIFY API, network, filesystem, cache, and lookup operations;
- SIMPLIFY parsing, serialization, transformations, filtering, sorting, copying, and conversions;
- SIMPLIFY computation, construction, collection materialization, and allocations;
- SIMPLIFY validation, authorization, existence checks, defensive checks, synchronization, and transaction boundaries;
- PREFER early returns, short-circuiting, and guard clauses.
- REMOVE dead or unreachable branches;
- REMOVE unused imports, variables, constants, parameters, return values, functions, classes, modules, fixtures, helpers, factories, attributes, and exports;
- REMOVE obsolete flags, compatibility layers, configuration, CLI options, environment variables, and deprecation paths;
- REMOVE commented-out code, stale suppressions, and write-only state.
- AVOID excessive nesting and branching;
- AVOID redundant conditionals or `else` blocks;
- AVOID complex boolean logic and flag arguments;
- AVOID long functions/classes or objects with too many responsibilities;
- AVOID duplicated logic and business rules;
- AVOID unnecessary wrappers, forwarding methods, adapters, services, repositories, factories, or indirection;
- AVOID speculative generality and premature abstraction;
- AVOID primitive values used instead of domain types, recurring groups of data, long parameter lists, and unexplained values;
- AVOID methods that depend mainly on another object's data, excessive access to another object's internals, method-call chains;
- AVOID changes spread across unrelated modules, modules with unrelated reasons to change, order-dependent operations, hidden coupling;
- AVOID surprising side effects or unclear ownership and state transitions.
- PREFER explicit control flow, clear ownership, high cohesion, and low coupling.
- REMOVE unused, redundant, derivable, optional, variadic, or always-identical parameters;
- REMOVE boolean flags and overly broad configuration objects;
- REMOVE unused or unnecessarily detailed return values;
- REMOVE obsolete signatures, overloads, callbacks, hooks, or extension points;
- REMOVE unnecessarily public helpers or duplicated entry points.
- AVOID overly broad, duplicated, swallowed, or immediately re-raised exceptions;
- AVOID unnecessary `try` blocks or fallbacks;
- AVOID exceptions used unnecessarily for control flow;
- AVOID redundant assertions, `None` checks, validation, or defensive checks;
- AVOID error translations or wrappers without distinct meaning.
- REMOVE unused or duplicate dependencies;
- REMOVE direct dependencies needed only transitively;
- REMOVE deprecated, obsolete, or unmaintained libraries;
- REMOVE libraries replaceable by the standard library;
- REMOVE unnecessary dependencies for trivial functionality;
- REMOVE stale or overly restrictive version constraints;
- REMOVE outdated versions where an upgrade provides a concrete maintenance, compatibility, security, or simplification benefit.
- REMOVE duplicated cases and setup;
- REMOVE unnecessary mocks, patches, fixtures, factories, helpers, and snapshots;
- REMOVE brittle implementation-detail, ordering, or call-count assertions;
- REMOVE stale skipped/xfailed tests;
- REMOVE excessive parametrization or useful missing parametrization;
- REMOVE tests that reproduce production logic;
- REMOVE overlapping unit/integration coverage without a distinct purpose.
- REMOVE stupid or trivial tests that don't verify behavior or invariants;

## Principles

- **KISS:** Choose the simplest correct implementation.
- **DRY:** Avoid duplicated knowledge or business rules. AVOID abstractions that only remove superficial code similarity.
- **YAGNI:** Avoid features, abstractions, configuration, and extension points needed only for hypothetical future use.
- **SRP / Separation of concerns:** Keep responsibilities focused and ownership clear.
- **High cohesion / Low coupling:** Keep related behavior together and reduce unnecessary dependencies.
- **Locality of behavior:** Keep logic close to its data and domain concepts.

## Reporting candidates

- **Location:** Exact current file paths and line ranges.
- **Current design:** The workflow, state, contract, or abstraction under review.
- **Evidence of redundancy:** Consumer evidence and the unnecessary responsibility.
- **Smallest complete change:** What to remove or consolidate and which callers must change.
- **Benefit:** The concept, duplicate policy, or maintenance obligation removed.
- **Behavior and compatibility:** Preserved invariants, potential observable differences, and approval or deployment requirements.
- **Confidence and verification:** Evidence of safety, relevant existing tests, and remaining uncertainty.
