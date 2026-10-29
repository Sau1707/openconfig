---
name: correctness
description: Review or fix behavioral defects in LongLink. Prioritize incorrect results, broken workflows, invalid state transitions, lost or partial updates, stale state, and inconsistencies across API, SDK, Web, persistence, and background operations. Use when the user asks to find bugs, investigate unexpected behavior, diagnose regressions, verify correctness, or implement a bug fix. Do not use for general cleanup, speculative hardening, or test-only improvements.
---

# Correctness

- DO inspect for concrete behavioral defects supported by repository evidence.
- For a review, investigation, explanation, search for findings, or report, DO inspect and present findings without editing files.
- For implementation or a bug-fix request, DO complete the requested or selected fixes across affected callers and contracts, then verify them.
- DO establish intended behavior before deciding that existing behavior is incorrect.
- PREFER fixing the cause of an invalid state or result over suppressing its downstream symptoms.
- DO preserve legitimate behavior and public contracts unless changing them is necessary to correct the established defect.
- DO rank findings by practical impact, affected scope, likelihood under realistic conditions, and confidence.
- DON'T treat unusual code, missing defensive checks, stylistic preferences, or hypothetical future requirements as confirmed bugs.
- DON'T change product policy to make an ambiguous implementation appear correct.
- DON'T expand a focused fix into unrelated cleanup, dependency modernization, or architectural redesign.

### Patterns to investigate

- Check whether each layer preserves the meaning of the input, identity, scope, state, and result passed to the next layer.
- Check whether a value has multiple owners that can disagree after updates, retries, cancellation, or navigation.
- Check whether the application reports success before the required durable state or external effect exists.
- Check whether an error response leaves a completed operation that the caller may retry.
- Check whether a check and the operation relying on it can observe different state.
- Check whether a query returns the intended records under duplicates, nulls, joins, pagination, and concurrent updates.
- Check whether partial updates distinguish omitted fields from explicit empty, false, zero, or null values.
- Check whether an earlier result can overwrite newer state or appear under a different route, resource, or tenant.
- Check whether resource lifetime matches the operation that owns it, including failure and cancellation paths.
- Check whether a fallback converts an unexpected failure into a plausible but incorrect result.
- Check whether single-item, bulk, import, background, and administrative paths implement the same established business rule.
- Check whether an earlier fix corrected one manifestation while leaving equivalent paths defective.

## 0. Project conventions and scope

- DO read and follow `AGENTS.md`, including its Python Guidelines and instructions specific to affected files.
- DO inspect the working tree before editing and preserve concurrent changes.
- DO establish the requested scope and reviewed revision, including relevant uncommitted changes.
- DO inspect relevant implementation, callers, schemas, configuration, migrations, tests, and documented contracts.
- DO read complete relevant functions and surrounding control flow. DON'T conclude from isolated search hits.
- DO follow existing formatting, typing, logging, exception, async, ORM, dependency, and testing conventions.
- PREFER established project, framework, or standard-library mechanisms.
- DON'T add a library, abstraction, state owner, retry layer, or compatibility path without a concrete need.
- When the user selects listed findings, DO implement only that selection and changes necessary to complete it.
- When continued improvement is authorized, DO continue through substantive in-scope defects without repeated approval prompts or arbitrary batch sizes.
- DO ask only when an unresolved decision materially affects the intended behavior or authorized scope.
- Where possible, DO continue independent investigation while that decision is pending.

## 1. Evidence and confirmation

DO confirm a bug only when evidence establishes:

1. **Expected behavior:** A contract, business rule, invariant, or supported user workflow.
2. **Reachability:** A realistic input, state, configuration, or sequence that reaches the relevant code.
3. **Failure:** An observable result, state, or effect that violates the expected behavior.
4. **Cause:** The implementation path that produces the violation under the stated conditions.

- DO identify the source of the expected behavior: explicit user requirements, public contracts, domain rules, callers, documentation, or relevant regression history.
- DO cross-check comments and existing tests against other evidence. Either can be stale or encode the same defect.
- DON'T derive correctness solely from what the current implementation happens to do.
- DO distinguish an implementation defect from an ambiguous requirement, unsupported input, invalid caller, or environmental failure.
- DO inspect caller preconditions. An unreachable violation of a private function's precondition does not establish an application bug.
- DO inspect boundary validation before claiming that malformed input reaches an internal operation.
- DO distinguish observed behavior from conclusions established through source inspection.
- A conclusive source trace can establish a defect. When runtime, framework, database, or provider behavior is decisive, DO verify it rather than guessing.
- DO attempt to disprove each candidate using applicable validation, constraints, transaction semantics, cancellation behavior, and caller guarantees.
- DO separate confirmed defects from source-grounded leads with unresolved conditions.
- For an unresolved lead, DO identify the exact missing fact and the smallest safe check that would settle it.
- DON'T assign confirmed severity to a speculative explanation.
- DO group equivalent manifestations by root cause while preserving materially different affected paths.
- DON'T claim that passing tests, static typing, or a clean scan proves correctness.

## 2. Diagnosis and reproduction

- DO translate the reported symptom into a specific expected-versus-actual comparison.
- DO capture relevant inputs, initial state, operation sequence, configuration, and observed result.
- DO distinguish the first incorrect state from later exceptions, failed requests, or misleading UI output.
- DO trace the affected operation end to end before choosing where to fix it.
- DO form plausible competing explanations and identify observations that distinguish them.
- PREFER checks that eliminate an explanation over checks that merely agree with several explanations.
- DO investigate recent changes when relevant, without assuming that the newest change caused the failure.
- DO use history to understand why a condition, workaround, or compatibility branch exists before changing it.
- PREFER a small local reproduction using realistic domain data and the real relevant boundary.
- When reducing a reproduction, DO preserve the same failure. A smaller input that causes a different rejection or exception is not equivalent evidence.
- DO keep valid comparison cases that differ only in the condition being investigated.
- DO record meaningful negative results so rejected explanations are not repeatedly investigated.
- DON'T change several independent factors at once and then infer which one fixed the problem.
- DON'T treat correlation, disappearance after restart, or one successful rerun as proof of the cause.
- DO account for instrumentation that changes scheduling, timing, caching, or resource use.
- DO keep failure injection and diagnostic writes in disposable environments unless the user has authorized another scope.
- DON'T expose real credentials or sensitive user data in reproductions or reports.

## 3. Business rules and state transitions

DO investigate relevant cases:

- Successful operations that produce the wrong result or omit a required effect.
- Allowed states that have no valid path to completion, cancellation, retry, or recovery.
- Transitions accepted from the wrong prior state.
- Required prerequisites checked in one entry point but omitted in another.
- Repeated operations that apply a transition or effect more times than intended.
- Terminal states that can be accidentally reopened or overwritten.
- Approval or confirmation applied to parameters different from those originally validated.
- Derived status that disagrees with authoritative records.
- Multiple flags that permit contradictory combinations or select the wrong business policy.
- Deletion, restoration, import, or rollback that revives stale state or relationships.
- Partial completion that leaves the next legitimate operation unable to proceed.
- Bulk operations whose failure or partial-success behavior contradicts the established contract.

DO identify the invariant and its authoritative owner. DON'T invent a new workflow, transition, or policy merely because it would be easier to implement.

## 4. Values, types, transformations, and collections

DO investigate relevant cases:

- Omitted values versus explicit null, empty strings, empty collections, zero, and false.
- Truthiness checks that replace a legitimate value with a default.
- Partial updates that unintentionally clear fields or retain fields explicitly requested for removal.
- Numeric precision, rounding, overflow, underflow, non-finite values, and unit conversion where the domain permits them.
- Integer division, truncation, string-to-number conversion, and cross-language numeric differences.
- Enum, identifier, date, and boolean representations that change meaning across boundaries.
- Unicode, escaping, normalization, encoding, or case conversion that loses significant information.
- Filtering or deduplication that removes distinct domain records.
- Sorting and tie handling that change contractual order or pagination stability.
- Mutable defaults, shallow copies, shared references, or in-place operations that modify another object's state.
- Iterators, generators, streams, or cursors consumed earlier than expected.
- Serialization that omits required values, adds inappropriate defaults, or reconstructs an inequivalent model.

DO validate assumptions about the domain. DON'T assume that sorting, deduplication, normalization, or conversion is harmless.

## 5. Database queries, persistence, and transactions

DO investigate relevant cases:

- Filters applied to the wrong field, relationship, tenant, parent, status, or lifecycle state.
- Joins that exclude valid rows or multiply results.
- Null handling, empty sets, and aggregate behavior that differ from application assumptions.
- Pagination applied before filtering, deduplication, or ordering required by the contract.
- Offset or cursor behavior that skips or duplicates records under supported changes.
- A missing row incorrectly treated as a duplicate, permission failure, or successful no-op.
- ORM identity-map state that disagrees with the database after another operation.
- Updates that overwrite fields changed by another transaction.
- Required writes that are flushed but never committed by the operation responsible for durability.
- A transaction committed too early, leaving later failure unable to roll back the required unit of work.
- Recovery after a constraint failure that continues with an unusable session or invalid transaction state.
- Savepoint handling that discards valid prior work or preserves work intended to be rejected.
- Cascades, soft deletion, restoration, and relationship updates that produce inconsistent records.
- Application assumptions that are not enforced under the database's actual isolation and constraint behavior.

- DO distinguish in-memory mutation, flush visibility, transaction visibility, and committed durability.
- DO identify commit ownership before moving transaction boundaries.
- DON'T assume that wrapping code in a transaction makes a multi-step invariant atomic.
- DON'T change lock order or isolation without understanding affected operations.
- To verify committed outcomes, DO use an independent session and connection outside any wrapping test transaction.
- DO determine whether a fix prevents future corruption, repairs existing data, or requires a separate migration.
- DON'T silently rewrite historical data or introduce a destructive repair operation.

## 6. Concurrency, async execution, and resource lifetime

DO investigate relevant cases:

- Check-then-act sequences that can observe stale state.
- Concurrent creates, updates, deletes, reservations, or one-time consumption.
- Lost updates, duplicate effects, and conflicting ownership changes.
- Shared mutable state reused across requests, tenants, tasks, or operation attempts.
- A client, connection, transaction, stream, tunnel, or temporary resource closed while another operation still uses it.
- Resources acquired successfully but leaked when later acquisition fails.
- Background work that outlives the state or resource it depends on.
- Exceptions or cancellation that bypass cleanup.
- Cleanup that masks the original failure or corrupts a reusable resource.
- Awaited and unawaited tasks whose completion or failure determines the reported result.
- Concurrent operations that require independent sessions or connections but accidentally share one.
- Locks or transactions held across operations that can wait indefinitely or require the same resource elsewhere.

- DO identify the owner and lifetime of each relevant resource.
- DO verify actual overlap when reproducing a race.
- PREFER controlled events, barriers, and suspended operations over arbitrary sleeps.
- DON'T treat serial execution as evidence that a concurrent invariant holds.
- DO distinguish a genuinely required ordering guarantee from incidental implementation order.

## 7. Time, retries, idempotency, and distributed effects

DO investigate relevant cases:

- Expiry checks immediately before, at, and after the relevant boundary.
- Timezone conversion, daylight-saving transitions, and inconsistent naive or aware timestamps.
- Wall-clock changes affecting elapsed-time calculations or deadlines.
- Rounding, truncation, or serialization that changes timestamp precision.
- Retry logic that repeats a non-idempotent operation after an ambiguous result.
- A timeout returned after the database or remote service has already completed the operation.
- Idempotency keys reused across different actors, resources, or request parameters.
- Retry state that retains an earlier result, error, transaction, or partially consumed input.
- Cancellation incorrectly interpreted as a retryable failure.
- Delayed, duplicated, or reordered messages applied to the wrong current state.
- A database change and external effect that can disagree after partial failure.
- Recovery that repeats an already-completed effect or loses required unfinished work.

DO distinguish definite failure, definite success, and unknown outcome. DON'T claim exactly-once behavior from a local retry loop or database transaction alone.

## 8. API, SDK, and cross-layer contracts

DO investigate relevant cases:

- A valid request accepted by one layer but misinterpreted by another.
- Defaults, optionality, field names, enum values, or null handling that disagree across API, SDK, and Web.
- Server-owned fields overwritten when reconstructing or forwarding a validated model.
- Required response data omitted or transformed into an incorrect representation.
- Success codes returned for incomplete or failed operations.
- Error codes or exception types translated into a different domain meaning.
- An SDK retrying errors that callers must handle directly.
- Pagination or streaming adapters that lose items, duplicate work, or fail to terminate.
- Different entry points enforcing inconsistent established business rules.
- Route, tenant, parent, or resource identity resolved from inconsistent sources.
- An operation using a resource identifier from an earlier request or scope.
- Compatibility assumptions that fail for supported persisted records or client versions.

- DO trace actual consumers before changing a contract.
- DO distinguish a generated schema mismatch from a production implementation mismatch.
- DON'T edit generated contracts or loosen validation merely to hide the disagreement.
- DO update affected producers and consumers when a correction requires coordinated changes.
- If the intended contract is unresolved, DO identify the specific decision instead of silently selecting one side.

## 9. Web state, caching, and user workflows

DO investigate relevant cases:

- An older response overwriting data from a newer request.
- Results displayed under the wrong route, tenant, selected resource, or account.
- Cache keys that omit a value affecting the result.
- Mutations that leave related views, counts, or detail records stale.
- Optimistic state that fails to reconcile with the server or restore after rejection.
- Initial loading, background refresh, empty data, and errors incorrectly treated as the same state.
- Form defaults or resets overwriting user edits after asynchronous loading.
- Retry flows that discard the user's draft or resubmit stale input.
- Closing and reopening a component preserving or resetting the wrong attempt-local state.
- Duplicate submission caused by asynchronous state updates or multiple event paths.
- Effects, subscriptions, polling, or listeners attached to an outdated owner.
- Unmounting or navigation that cancels required cleanup or permits irrelevant work to update visible state.
- Error recovery that leaves controls disabled, progress stuck, or a legitimate next action unavailable.
- Client-side success shown before the operation's actual contractual completion.

DO follow state from its authoritative source to what the user observes. DON'T infer correctness from component state alone when persistence or an external effect is part of the workflow.

## 10. Files, streams, imports, exports, and external systems

DO investigate relevant cases:

- Partial reads or writes treated as complete.
- Empty, truncated, malformed, or unexpected external responses mapped to plausible success.
- Encoding, newline, delimiter, or escaping differences that change exported or imported values.
- Temporary files or staged artifacts exposed before completion.
- File replacement that leaves an incomplete artifact after interruption.
- Paths or filenames referring to a different resource than the operation intended.
- Streams, generators, or response bodies closed before consumers finish reading.
- Imports that accept records but silently discard required fields or relationships.
- Exports that contain the wrong scope, omit valid records, or use stale data.
- External request construction that uses the wrong method, endpoint, parameters, credentials, or content type.
- Cleanup after cancellation or provider failure that deletes valid prior output.
- Application assumptions that exceed the actual guarantees of the provider or transport.

PREFER realistic local fixtures and transport-level substitutes. DON'T mock the transformation or state change whose correctness is being investigated.

## 11. Errors, fallbacks, configuration, and lifecycle

DO investigate relevant cases:

- Broad exceptions that turn unexpected failures into empty results, success, or misleading domain errors.
- Exceptions caught at a layer that cannot restore the required state.
- Failure responses emitted after an irreversible effect has already occurred.
- Cleanup exceptions replacing the useful cause of failure.
- Assertions used for required runtime behavior that may be disabled.
- Missing configuration silently selecting an unintended operating mode.
- Parsing errors, empty values, or precedence rules that select the wrong configuration.
- Cached configuration that changes without updating dependent state.
- Startup that advertises readiness before required initialization is complete.
- Shutdown that loses required work or leaves resources active.
- Recovery paths that assume initialization completed when it only partially succeeded.
- Compatibility fallbacks that silently lose data or change operation semantics.

DO preserve useful exception context and the intended public error contract. DON'T add broad catches, defaults, retries, or silent fallbacks merely to make a failing path appear successful.

## 12. Remediation

- DO state the root cause and the invariant the fix must restore before changing code.
- PREFER enforcing the invariant at the authoritative owner or boundary.
- DO correct the layer that creates invalid state when the evidence supports that ownership.
- DON'T add downstream checks everywhere instead of correcting the cause.
- DO preserve legitimate fallback, recovery, and cleanup behavior.
- DO update affected callers, schemas, serialization, state transitions, and configuration when necessary for a complete correction.
- DO inspect related implementations for the same root cause.
- DO keep unrelated findings separate from the selected fix.
- DON'T weaken validation, swallow errors, remove constraints, or bypass authorization to restore a superficially successful result.
- DON'T introduce a second state owner or duplicate business rule without necessity.
- DO remove temporary diagnostic edits before completion unless a focused diagnostic improvement is part of the requested fix.
- DO identify deployment order, migration, cache invalidation, or data repair needed for the corrected code to take effect.

DON'T silently decide ambiguous product behavior, data retention, conflict resolution, recovery policy, public compatibility, or irreversible data repair.

When such a decision is necessary, DO prepare the concrete alternatives and explain the exact unresolved choice. Continue independent work. DON'T request additional approval for routine work already authorized.

## 13. Verification and implementation loop

DO follow this sequence:

1. Inspect repository instructions, current changes, affected contracts, and relevant test infrastructure.
2. Establish an applicable baseline before implementation. Reuse a recent result only when it applies to the current working tree and affected paths.
3. Reproduce the failure or establish a complete source-based explanation. Record remaining runtime uncertainty.
4. Identify the smallest complete correction and affected consumers.
5. Implement the authorized fix and relevant verification within repository and user rules.
6. Run focused checks for the original failure, corresponding legitimate behavior, and directly affected boundaries.
7. Review the diff for alternate manifestations, unintended contract changes, partial fixes, and unrelated edits.
8. Run applicable broader suites, formatting, linting, typing, and repository-required checks.
9. Confirm the final working tree preserves concurrent edits and contains no temporary diagnostics or accidental generated output.
10. Report the result, evidence, verification, and material remaining work.

For meaningful LongLink implementation, DO use root `make test` for full API, SDK, and Web verification, subject to current repository instructions. DO review `git diff --check` before completion.

### Regression checks

- DO follow repository and user rules for adding or changing tests. This skill does not override explicit test-authorization requirements.
- When authorized, PREFER a focused regression case that fails for the original defect and succeeds after the correction.
- DO use otherwise valid inputs and state so the intended defect determines the result.
- DO verify the relevant returned result, durable state, and required or forbidden effects.
- DON'T let an error response alone prove rollback or absence of mutation.
- DON'T mock away transactions, cancellation, parsing, or state ownership when they determine the defect.
- DO use controlled concurrency and real interruption when timing is essential.
- DO cover corresponding legitimate behavior and important adjacent boundaries.
- DON'T reproduce the production implementation in expected results.
- DON'T add broad suites, low-value cases, or dependencies merely to increase coverage.

### Honest verification

- DO distinguish reproduction failures, assertion failures, collection errors, command timeouts, and unavailable infrastructure.
- DO state which suites and checks actually ran.
- DON'T describe focused checks as a full-suite pass.
- If a check is blocked, DO identify the missing capability and the remaining uncertainty.
- DON'T repeatedly rerun broad suites without a new change, failure, or unresolved concern.
- DON'T claim that a fix is verified when the decisive behavior was not checked.
- If evidence remains insufficient, DO report an unresolved diagnosis instead of presenting a speculative patch as a completed fix.

## Principles

- **Contract first:** Establish what must hold before deciding what to change.
- **Causal reasoning:** Connect the initial conditions, defective operation, and observable failure.
- **Explicit invariants:** State the relationship that must remain true across the workflow.
- **Clear ownership:** Keep authoritative state and resource lifetime identifiable.
- **Atomic transitions:** Protect invariants against concurrency, retries, and partial completion.
- **Minimal complete fix:** Correct the cause across affected paths without unrelated redesign.
- **Independent verification:** Check outcomes without copying the implementation's assumptions.
- **Compatibility awareness:** Preserve supported consumers, persisted state, and deployment behavior.
- **Evidence over intuition:** Separate observed facts, source-established conclusions, and unresolved hypotheses.
- **Proportionate investigation:** Follow worthwhile leads within scope without inventing findings or pursuing speculative work indefinitely.

## Reporting findings

For review-only requests, DO return a numbered list of worthwhile findings. Unless the user requests a count, DON'T impose one.

For each confirmed defect or implemented fix, report:

- **Location:** Exact current file paths and line ranges, with the relevant revision when needed.
- **Expected behavior:** The established contract, invariant, or supported workflow.
- **Trigger and preconditions:** The input, state, configuration, timing, or sequence required.
- **Actual behavior:** The incorrect result, state, error, or effect.
- **Root cause:** The implementation path that produces the violation and why applicable controls do not prevent it.
- **Practical impact:** Affected users, records, operations, durability, recoverability, and realistic frequency.
- **Priority and confidence:** A rationale based on demonstrated consequences and evidence.
- **Smallest complete change:** The correction, affected callers, and related manifestations.
- **Behavior and compatibility:** Legitimate behavior preserved and any necessary observable differences.
- **Verification:** Reproduction, source evidence, tests and commands actually run, results, and remaining gaps.
- **Operational follow-up:** Required deployment coordination, migration, data repair, cache invalidation, or recovery work.

DO present confirmed defects and completed fixes first, ordered by practical impact.

DO keep unresolved leads separate, with the exact missing fact and next discriminating check. Mention rejected explanations only when they materially explain the conclusion.

DO summarize reviewed paths, important exclusions, and blocked verification. If no high-confidence defect is found, DO state that directly.

After implementation, DO explain what changed, why it fixes the cause, how it was verified, and any material limitations. When continued work is already authorized, DON'T end with another approval request.

DON'T invent bugs to fill a report or claim that no correctness risks remain.