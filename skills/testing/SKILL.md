---
name: testing
description: Review or improve LongLink tests without changing production code. Prioritize meaningful behavior, missing boundaries, misleading assertions, unnecessary mocks, duplicated coverage, and excessive test infrastructure. Use when the user asks for test cleanup, coverage improvements, test-only implementation, or a testing review or plan.
---

# Testing

- DO prefer the simplest maintainable tests that improve confidence in important behavior.
- For a review, search for findings, or plan, DO inspect and present ranked candidates without editing files.
- For implementation, cleanup, or improvement, DO complete the requested or selected test-only changes, then verify them.
- A request to implement or improve tests authorizes meaningful new cases and necessary test-local fixtures or helpers.
- DO read production code and source contracts to understand intended behavior.
- DO edit only tests and necessary test-local fixtures or helpers.
- DON'T change production code, generated contracts, dependencies, or coverage configuration to make tests pass.
- PREFER changes that remove a misleading test, unnecessary mock, duplicated obligation, or maintenance-heavy fixture over changes that only shorten syntax.
- DO rank candidates by regression risk, failure discrimination, maintenance benefit, and evidence of safety.
- DO use coverage to identify untested risk. DON'T treat coverage, test count, assertion count, or mutation score as a quality target.
- DON'T invent scenarios to fill a quota or assume every uncovered branch deserves a test.

### Patterns to investigate

- Check whether a test still passes when the named behavior is absent, incorrect, or never reached.
- Check whether a negative test rejects for the intended reason or an unrelated invalid precondition.
- Check whether assertions observe a real outcome or only a mock configured to return that outcome.
- Check whether a persistence test proves committed state or merely observes an already-mutated in-memory object.
- Check whether a timeout or cancellation test interrupts unfinished work or raises an error after the work has completed.
- Check whether fixtures hide the identity, ownership, state, or input responsible for the result.
- Check whether several tests protect different contracts despite similar setup or assertions.
- Check whether parametrization reduces duplication or creates a second program that calculates expected results.
- Check whether a fake reproduces the relevant external contract or silently omits the behavior under test.
- Check whether a high-level test repeats detailed domain rules without protecting an additional integration boundary.
- Check whether flaky behavior comes from uncontrolled state, missing synchronization, incomplete cleanup, or a production defect.
- Check whether tests depend on implementation structure that can change without changing legitimate behavior.

## 0. Project conventions and scope

- DO read and follow `AGENTS.md`, including its Python Guidelines and instructions specific to the affected tests.
- DO inspect the working tree before editing and preserve concurrent changes.
- DO inspect test commands, collection rules, fixture scopes, infrastructure requirements, and configured checks.
- DO follow existing formatting, naming, typing, async, ORM, fixture, and dependency-management conventions.
- When consulting a skill or bundled resource, DO use its actual loaded location instead of guessing another path.
- DO distinguish test code from generated files, production helpers, public contracts, and shared runtime configuration.
- DON'T move production responsibilities into test helpers or copy production implementations into tests.
- DON'T introduce production hooks, dependency upgrades, new test frameworks, or configuration changes under the label of test cleanup.
- When the user selects listed items, DO implement only that selection.
- When continued improvement is authorized, DO continue through worthwhile changes without repeated approval prompts or arbitrary batch sizes.
- DO ask only when ambiguity materially affects implementation, production changes are necessary, or a blocker requires a user decision.
- Where possible, DO continue independent work while a decision is pending.
- If a test exposes a production defect, DO report the defect and scope boundary. DON'T weaken expectations to make the defective behavior pass.

## 1. Evidence before editing

For each candidate, establish:

1. **Behavior:** Identify the observable contract, invariant, or regression the test should protect.
2. **Existing protection:** Search related unit, integration, route, SDK, and Web tests.
3. **Failure discrimination:** Explain the specific incorrect behavior that should make the test fail.
4. **Real boundary:** Identify which production code and infrastructure must remain real for the assertion to mean anything.
5. **Smallest complete change:** Decide whether to strengthen, replace, simplify, consolidate, add, or remove a test.
6. **Verification:** Identify the focused checks and surviving protection needed to justify the change.

- DO read complete relevant tests, fixtures, implementation paths, and source contracts.
- DON'T derive expectations solely by copying implementation details or current output.
- DO distinguish intended behavior from an accidental behavior that happens to exist today.
- Before adding a case, DO confirm that equivalent protection is missing or inadequate.
- Before deleting a case, DO identify surviving assertions for every important invariant it protects.
- DON'T assume similar names, setup, execution paths, or covered lines prove redundancy.
- DO consider realistic faults such as removing a permission check, reversing a condition, omitting a write, dropping a field, or retrying twice.
- DO identify which assertion would detect the named fault. An assertion count is not that explanation.
- DO check whether an unrelated failure would satisfy the test before the relevant code runs.
- PREFER strengthening an existing test when the behavior remains coherent.
- When extension would mix unrelated behaviors, PREFER a separate test.
- DON'T remove a focused regression case merely because a broader test also executes the code.
- DON'T preserve a test merely because it once caught a bug if its assertions no longer protect that regression.

## 2. Test level and boundary selection

PREFER the lowest test level that establishes the required guarantee:

- **Unit:** Domain rules, calculations, parsing decisions, state transitions, and boundary cases.
- **Integration:** Database behavior, serialization, filesystems, queues, framework wiring, and external-client mappings.
- **End-to-end:** Critical user journeys and important integration failures that narrower tests cannot establish.

- DO choose the level based on the behavior, rather than a fixed ratio or desired test count.
- DON'T mock away the boundary that justifies the selected test level.
- DO retain focused integration cases for application-specific use of constraints, transactions, serialization, routing, and dependency wiring.
- DON'T retest an unmodified framework or library in isolation.
- DO test the application's configuration or use of that framework when it creates a distinct contract.
- DON'T repeat detailed business-rule matrices at every layer.
- DO distinguish a lower-level error classification from its HTTP or SDK translation. They can protect different contracts.
- DON'T move a test to a lower level if doing so removes the only protection for routing, middleware, transaction ownership, browser behavior, or serialization.
- PREFER a small number of focused high-level cases over broad scenarios with many unrelated assertions.

## 3. Structure, assertions, and failure discrimination

- DO name tests after expected behavior and relevant conditions.
- DO use AAA comments: `# Arrange`, `# Act`, `# Assert` in Python and `// Arrange`, `// Act`, `// Assert` in TypeScript.
- DO keep each test focused on one behavior. Multiple assertions can establish one behavior.
- DO keep relevant inputs and expected outcomes visible near the action.
- PREFER explicit domain values over unexplained numbers, opaque generated objects, or hidden defaults.
- DO assert exact relevant values, payload fields, stable error codes, and contractual error messages.
- DON'T assert incidental timestamps, identifiers, ordering, logs, metrics, or presentation details unless they are part of the contract.
- DO assert collection contents and cardinality according to the contract. DON'T accidentally ignore duplicates or ordering that matters.
- DO use numeric tolerances only when the domain permits approximation.
- DON'T reduce a meaningful assertion to truthiness, non-nullness, response success, or “did not raise.”
- DO assert the absence of forbidden effects when rejection, rollback, cancellation, or deduplication is the behavior.
- DO use otherwise valid requests, credentials, resources, and state so the named defect determines the outcome.
- DON'T let an authorization test pass because the object is absent.
- DON'T let a wrong-audience token test pass because the token is expired or signed incorrectly.
- DON'T let a rejected mutation test pass solely because an error was returned.
- DO keep exception assertions around the intended operation, rather than setup and unrelated calls.
- PREFER stable domain exceptions or protocol errors over broad exception classes.
- DON'T catch and suppress failures inside helpers that are meant to prove success.
- DON'T calculate expected results with the production function, its private helpers, or equivalent copied logic.
- Unless iteration or branching is itself under test, AVOID loops and conditionals in test bodies.
- DO ensure asynchronous assertions and operations are awaited so their failures reach the test runner.

## 4. Fixtures, factories, helpers, and mocks

- PREFER small, composable, function-scoped fixtures and builders.
- DO keep fixture data minimal and domain-oriented.
- Where practical, PREFER immutable values and fresh mutable objects.
- DO make behavior-defining fields explicit in the test.
- DON'T let a factory silently grant administrative access, create missing relationships, or normalize the invalid input under test.
- AVOID autouse fixtures that hide important identity, persistence, network, or application state.
- DO isolate environment variables, globals, caches, registries, browser storage, and dependency overrides.
- DO restore modified state during teardown even when setup, execution, or assertions fail.
- DO register cleanup as resources are acquired so partial setup does not leak them.
- DO close clients, files, sessions, servers, subprocesses, tasks, and threads owned by the test.
- PREFER existing lightweight real implementations when deterministic and inexpensive.
- DO replace external boundaries such as HTTP transport, provider APIs, delivery systems, clocks, or object storage when necessary.
- When filesystem semantics are under test, DO use a real temporary filesystem rather than mocking path operations.
- DON'T mock domain rules or internal collaborators merely to recreate the expected execution sequence.
- DON'T stub rendering or artifact generation only to assert that a function was called.
- When artifact content is the contract, DO generate and inspect the actual relevant content.
- DO keep test doubles narrow and representative of the contract actually consumed.
- Where supported, DO use interface or signature checking to catch invalid mock calls.
- DON'T create large fake frameworks or duplicate external systems for a small test.
- DO verify important fake behavior against authoritative examples or existing local contract tests when drift would invalidate the suite.
- DO use interaction assertions when the external request, emitted event, delivery count, or prohibited side effect is itself the contract.
- DON'T assert internal call counts, call order, or private method selection without a distinct behavioral guarantee.

For transaction recovery that cannot otherwise be triggered deterministically:

- You CAN use a narrowly scoped stale-read or failure seam in test code.
- DO keep actual constraints, flushes, savepoints, recovery queries, and commits real.
- DO document the seam and restore it after the test.
- DON'T construct the successful database outcome from mocked query results.

## 5. Parametrization and test data

- DO parameterize the same behavior across meaningful inputs.
- DO keep `@pytest.mark.parametrize` on one line.
- DO use separate decorators for independent dimensions when their combinations have distinct regression value.
- DO extract large case sets into clearly named constants near the relevant tests.
- For non-obvious cases, DO use `pytest.param(..., id="...")`.
- DO choose cases from domain boundaries and distinct failure mechanisms.
- DON'T combine unrelated success, validation, authorization, and infrastructure behaviors into one parameterized test.
- DON'T consolidate when cases need substantial branching, generated expectations, or elaborate fixture dispatch.
- AVOID Cartesian products whose extra combinations do not protect additional behavior.
- AVOID one-row parametrization without added clarity.
- DON'T remove superficially repetitive values when they exercise different parsing, encoding, database, or protocol boundaries.
- PREFER fixed domain inputs when they express the case clearly.
- DO seed randomness only when relevant to reproducibility. A fixed seed alone does not establish determinism or input quality.

## 6. API, authentication, authorization, and contracts

DO investigate relevant cases:

- Successful operations with exact relevant status codes and response fields.
- Missing, malformed, boundary-value, and semantically invalid inputs that exercise application-specific validation.
- Omitted fields versus explicit nulls, empty strings, empty collections, zero, and false where the contract distinguishes them.
- Partial updates that preserve omitted fields and correctly clear explicitly supplied values.
- Custom exception handlers and validation errors matching published error schemas.
- Authentication failures separately from authorization failures.
- Two users in one tenant and users in different tenants, using existing resources and otherwise valid credentials.
- Ownership checks for parent/child resources, attachments, connection handles, job results, and nested routes.
- Single-item and bulk operations, including mixed authorized and unauthorized items.
- Server-owned fields that must not be accepted or exposed through create, update, import, or serialization.
- Pagination boundaries, stable ordering where required, cursor scope, and duplicate or missing results.
- Rejected operations that leave no unauthorized mutation, emitted event, or queued work.
- Repeated requests and documented idempotency behavior.
- Error translation that preserves the intended domain meaning without leaking internal details.

For FastAPI tests:

- DO exercise routes through HTTP rather than calling route functions directly.
- DO assert both status code and relevant response payload.
- DO use dependency overrides for authentication, external services, and test infrastructure when those dependencies are outside the behavior being tested.
- DON'T override authentication or authorization when that mechanism is the subject of the test.
- DO remove test-added overrides after each test and restore any pre-existing mapping.
- PREFER an isolated application instance when shared application state would make overrides unsafe.
- DO exercise application lifespan when startup or shutdown behavior is required.
- DON'T assume an HTTP client's request transport automatically runs application lifespan.
- DO use clients and async fixtures compatible with the repository's installed versions and event-loop conventions.

## 7. Persistence, queries, transactions, and recovery

DO investigate relevant cases:

- Records that exist versus do not exist, including ownership and tenant scope.
- Query predicates, joins, null handling, duplicate rows, ordering, and pagination where they affect application behavior.
- Unique, foreign-key, check, and other constraints relied on by the application.
- Successful writes observed through a fresh session rather than an already-mutated ORM object.
- Rejected writes that leave intended durable state unchanged.
- Partial failure that rolls back the correct unit of work.
- Savepoint recovery that preserves prior valid work and permits the documented next operation.
- Retry or conflict recovery that returns the correct result without duplicate records or effects.
- Concurrent operations that must preserve uniqueness, quotas, one-time consumption, or other invariants.
- Cleanup after exceptions and cancellation, including connection and transaction reuse.
- Deletion and restoration behavior, including cascades or retained relationships established by the contract.
- Changes whose effects are visible only after an actual database commit.

- For important persistence behavior, PREFER a disposable production-compatible database.
- DON'T replace PostgreSQL-specific behavior with an in-memory database and claim equivalent coverage.
- DO use transactional rollback or equivalent per-test isolation appropriate to the behavior.
- DO understand whether the fixture wraps application commits in an outer transaction or savepoint.
- DON'T claim durable commit verification from data visible only through the same connection or outer transaction.
- To prove committed visibility, DO use an independent session and connection outside the test's wrapping transaction.
- When real commits are necessary, DO use disposable data or an isolated database scope with reliable cleanup.
- DO keep database isolation and concurrency semantics real when those semantics determine the result.
- DON'T share one non-concurrent session across concurrent operations to simulate separate transactions.
- DON'T assert query or flush counts unless a documented budget or behavior makes them contractual.

## 8. Time, async work, cancellation, and concurrency

DO investigate relevant cases:

- Exact expiry boundaries and just-before or just-after conditions.
- Timezone conversion and daylight-saving boundaries where the domain requires them.
- Retries after transient failure, exhaustion of the retry budget, and non-retryable errors.
- An ambiguous timeout after an operation may already have succeeded.
- Cancellation while a dependency, stream, query, or task is still in progress.
- Cleanup after cancellation, including pending tasks, resources, and durable state.
- Concurrent attempts at an operation that should succeed only once.
- Late results arriving after a newer request, cancellation, navigation, or ownership change.
- Polling that stops after completion, cancellation, unmounting, or the documented terminal state.

- DO use async tests when asynchronous behavior or async verification requires them.
- DON'T convert simple synchronous tests to async without a reason.
- When needed, DO control wall-clock behavior through existing mechanisms.
- DO construct time-sensitive credentials and inputs from one explicit reference timestamp.
- DON'T use aging import-time tokens or fixed future expiration dates.
- DO distinguish wall-clock control from monotonic deadlines used for timeouts.
- DON'T freeze or advance clocks in a way that prevents the cancellation mechanism under test from working.
- For concurrency, DO use events, barriers, controlled futures, or equivalent synchronization.
- DO prove that the relevant operations overlap at the intended point.
- DON'T use arbitrary sleeps to create a race or wait for completion.
- When interruption is the invariant, DO exercise real timeout cancellation of unfinished work.
- DON'T simulate that behavior by raising a timeout error after the handler finishes.
- DO use bounded waits for diagnostics and await or join all owned work during cleanup.
- DON'T treat a repeatedly passing race test as proof that the intended interleaving occurred.

## 9. External clients, SDKs, files, and artifacts

DO investigate relevant cases:

- Correct external HTTP method, path, headers, query parameters, and request body.
- Successful response parsing and application-specific serialization.
- Empty, malformed, truncated, or unexpected provider responses where the client has defined behavior.
- Mapping provider status codes and errors into the intended SDK or domain contract.
- Credential handling and sensitive values excluded from URLs, logs, and errors where required.
- Request cancellation, timeouts, retry eligibility, retry limits, and idempotency.
- File content, encoding, filenames, metadata, and cleanup that consumers actually depend on.
- Streaming behavior, partial reads or writes, and early termination where supported.
- Generated documents, exports, or archives containing the intended records and excluding forbidden content.
- Import/export compatibility using independently specified examples where the contract requires it.

- PREFER replacing HTTP transport while keeping the real client, request construction, and response parsing.
- DO use disposable local servers when real protocol behavior is necessary.
- Disposable local PostgreSQL, Ceph, and local HTTP servers are valid integration infrastructure.
- DON'T contact live providers, production, or uncontrolled external services in CI.
- DON'T mock both sides of a mapping and claim the mapping was verified.
- DON'T treat round-trip success as sufficient evidence of external compatibility. Both directions can share the same mistake.
- DO inspect the actual artifact when generation is the behavior, rather than asserting that generation was requested.

## 10. Web behavior and critical user journeys

DO investigate relevant cases:

- Initial loading, empty, success, and actionable error states.
- User input that changes the submitted request and resulting visible state.
- Validation errors that preserve relevant input and allow correction.
- Submission in progress, repeated submission, success, failure, and retry.
- Draft preservation or reset when closing and reopening, according to the intended lifetime.
- Navigation or tenant changes while earlier requests remain in flight.
- Out-of-order responses that must not replace newer data.
- Optimistic updates that reconcile on success or recover after failure.
- Polling, subscriptions, and listeners that stop when their owner is gone.
- Authentication or authorization failures that produce the intended user-visible behavior.
- Critical keyboard, focus, and form interactions where they affect supported usage.
- A small number of complete journeys connecting the UI to real application boundaries.

- DO interact through rendered controls and user-visible behavior.
- PREFER semantic roles, labels, and stable public interfaces over CSS structure or component internals.
- DON'T assert private component state, internal hook calls, or framework cache implementation details.
- DO use the real relevant component and state ownership when testing their interaction.
- DO control transport responses and timing without replacing the application behavior being verified.
- DO use condition-based, bounded asynchronous assertions.
- DON'T use fixed browser delays or force interactions that bypass the behavior under test.
- DO isolate cookies, storage, caches, routers, and application state between tests.
- DON'T replace ordinary behavioral assertions with broad DOM snapshots.
- Retain focused snapshots or visual checks only when the rendered structure or appearance is an intended contract.

## 11. Domain boundaries, properties, and state transitions

DO investigate relevant ideas rather than adding every case mechanically:

- Empty, singleton, and multiple-item inputs.
- Minimum, maximum, and just-outside permitted values.
- Missing versus null versus default values.
- Duplicate, equivalent, and conflicting inputs.
- Ordering, stable ties, and pagination continuity where specified.
- Precision, rounding, numeric overflow, and unit conversion where relevant.
- Unicode, escaping, and encoding boundaries handled by application code.
- Valid and invalid state transitions, repeated transitions, and terminal states.
- Conservation or consistency rules across related records.
- Repeated application of an operation that should be idempotent.
- Independent operations that should produce equivalent outcomes in either order.
- Normalization that should stop changing an already-normalized value.
- Serialization that preserves the supported information and rejects invalid representations.
- Sequences such as create, update, retry, cancel, delete, and restore when behavior depends on history.

When property-based or stateful testing is appropriate:

- DO state the property and the domain in which it is valid.
- DO use existing repository tooling. DON'T add a dependency under this skill's test-only scope.
- DO generate valid domain inputs directly where practical.
- DON'T filter away nearly all inputs or permit a property to pass without meaningful executions.
- DO combine useful properties with independent expected examples when a shared mistake could satisfy the property.
- DON'T assume commutativity, associativity, round-trip identity, or idempotence when the domain does not promise it.
- DO keep a reference model simpler and independently justified.
- DON'T copy the production algorithm into a reference model.
- DO distinguish a wrong property from a genuine production failure before changing expectations.
- DO retain meaningful minimized counterexamples using the repository's conventions.

## 12. Cleanup and removal

DO inspect for:

- Tests that execute no relevant assertion or only restate fixture configuration.
- Tests whose subject is fully mocked.
- Private-method tests duplicated by stronger public behavior.
- Repeated business-rule matrices at higher levels without an additional boundary guarantee.
- Factories and helpers used once that obscure simple domain setup.
- Boolean-heavy fixtures, scenario dispatchers, and test subclasses that create unnecessary concepts.
- Shared mutable fixtures and hidden order dependencies.
- Broad snapshots containing incidental state.
- Unused imports, fixtures, mocks, patches, factories, constants, and assertion helpers.
- Obsolete compatibility cases, stale skipped tests, and outdated expected failures.
- Repeated setup that can be simplified without hiding the case-defining facts.
- Parametrization whose branching is harder to understand than separate tests.

- Before removal, DO map important assertions to surviving protection.
- DON'T delete useful boundary cases merely because they look repetitive.
- DON'T remove a test solely because it is slow or flaky.
- DO determine whether a flaky test reflects test infrastructure, uncontrolled state, or a production race.
- DON'T hide failures by adding retries, increasing sleeps, broadening accepted outcomes, or introducing skips.
- DO preserve useful historical regression evidence when simplifying its implementation.
- PREFER local duplication over an abstraction that makes readers reconstruct the test's meaning.
- DO compare setup complexity, assertion clarity, runtime cost, and diagnostic quality, not only line or test counts.

## 13. Implementation and verification loop

DO follow this sequence:

1. Inspect current changes, repository instructions, test commands, collection rules, and infrastructure requirements. Track completed candidates.
2. Establish a baseline at the start of implementation. You CAN reuse a recent successful baseline only when it applies to the current working tree. Run from the repository root:

   ```bash
   make test  # API, SDK, and Web
   ```

3. Allow sufficient command time for builds and disposable infrastructure. Distinguish test failures, collection errors, command timeouts, and unavailable infrastructure. Record which suites actually ran.
4. Prioritize high-risk missing boundaries and high-confidence simplifications. Apply a coherent group of changes without an arbitrary batch size.
5. Run focused affected tests and applicable formatting, linting, and type checks. Distinguish configured checks from explicit checks that include otherwise excluded test files.
6. Review the diff for unnecessary mocks, helpers, branching, snapshots, hidden state, and repeated setup. Confirm failure discrimination and surviving protection.
7. Continue through substantive candidates within the authorized scope. Repeat broader checks when new changes, failures, or unresolved concerns justify them.
8. Before completion, run root `make test` on the final changes and review `git diff --check`.
9. Stop when remaining candidates are speculative, low-value, duplicative, out of scope, or blocked. Report material remaining gaps.

- DON'T describe focused or partial results as a full baseline or final suite pass.
- DON'T repeatedly run full suites after trivial edits when focused checks suffice.
- When baseline failures exist, DO establish whether affected failures are pre-existing, introduced, or unresolved.
- DON'T infer that every final failure is pre-existing from a baseline that did not execute the relevant path.
- If infrastructure is unavailable, DO continue useful inspection and independent checks, then report the exact verification gap.
- DO rerun a test in isolation or with relevant neighbors when investigating order dependence.
- DO use bounded repetition when investigating a specific flaky failure. DON'T call a test deterministic merely because several retries passed.
- DO inspect the final changed-file list to confirm the task remains test-only.

### Coverage interpretation

- DO report measured totals and whether each suite emits coverage.
- DO compare only compatible revisions, commands, instrumentation, and collection scopes.
- DO identify concurrent changes that prevent attribution.
- DO distinguish line, branch, and other reported coverage measures.
- DO investigate installed-versus-local imports, subprocesses, workers, source maps, and instrumentation when executed code appears uncovered.
- DON'T change coverage settings, exclusions, source roots, or thresholds to hide a discrepancy.
- DON'T infer behavioral protection from executed lines alone.
- DON'T claim a coverage gain without comparable measurements.
- When coverage is unavailable, DO state that and explain the concrete behavior newly protected.

## Principles

- **Behavior first:** Protect observable contracts and important invariants.
- **Failure discrimination:** Make the intended regression cause the failure.
- **Independent expectations:** Avoid sharing the implementation's reasoning in the oracle.
- **Real boundaries:** Keep the mechanism that establishes the guarantee real.
- **Local clarity:** Make the important arrangement, action, and outcome easy to understand together.
- **Determinism:** Control relevant state, time, and scheduling.
- **Isolation:** Tests must not depend on execution order or leak resources and authority.
- **Minimal infrastructure:** Use the smallest fixture, helper, or double that supports the behavior.
- **Distinct coverage:** Retain overlapping tests only when they protect different guarantees.
- **Honest verification:** Separate observed results from assumptions, blocked checks, and recommendations.

## Reporting candidates

For review-only requests, DO return a numbered list of worthwhile options. Unless the user requests a count, DON'T impose one.

For each candidate, include:

- **Location:** Exact current test paths and line ranges. For missing coverage, include the relevant production location and proposed test destination.
- **Current design:** The test, fixture, mock, helper, or coverage gap under review.
- **Behavior at risk:** The concrete regression or invariant that matters.
- **Evidence:** Existing protection, missing assertions, unnecessary responsibility, or reasons the test can pass incorrectly.
- **Smallest complete change:** What to strengthen, replace, simplify, add, consolidate, or remove, including affected fixture users.
- **Benefit:** The behavior protected, misleading signal removed, or maintenance obligation reduced.
- **Safety:** Important protection retained and checks required before removal or replacement.
- **Confidence and verification:** High, Medium, or Low confidence, supporting evidence, relevant checks, and remaining uncertainty.

DON'T propose production contract changes as test cleanup.

After implementation, DO summarize:

- Substantive tests removed, simplified, replaced, added, or strengthened.
- Newly protected behaviors and corrected failure discrimination.
- Important protection retained after consolidation or deletion.
- Commands and suites actually run, with results and relevant baseline failures.
- Comparable coverage figures where available.
- Production defects, infrastructure blockers, and incomplete verification.
- Only substantive remaining opportunities.

When continued work is already authorized, DON'T end with another approval request. DON'T claim that no testing risks remain.