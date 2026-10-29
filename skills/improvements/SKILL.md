---
name: improvements
description: Review or implement useful product improvements in LongLink. Prioritize valuable missing capabilities, incomplete workflows, repeated manual work, and natural extensions of the product. Use when the user asks what features to add, how to improve the product, what to build next, or to implement selected product improvements. Do not use for general cleanup, ordinary bug fixes, security audits, performance tuning, or test-only improvements.
---

# Improvements

- DO inspect for useful new capabilities that fit LongLink's purpose and supported workflows.
- For a review, exploration, search for opportunities, or plan, DO inspect and present ranked candidates without editing files.
- For implementation, DO complete the requested or selected improvements across affected product surfaces, then verify them.
- PREFER features that enable a meaningful task, remove recurring manual work, or complete a valuable workflow.
- DO explain who benefits, what they can do today, what changes, and why the difference matters.
- DO distinguish repository evidence, observed user needs, and assumptions about demand.
- DON'T equate a missing feature with a worthwhile feature.
- DON'T equate easy implementation with high product value.
- DON'T limit discovery to TODO comments or partially implemented code.
- DON'T invent user requests, usage figures, customer complaints, competitive pressure, or business impact.
- DO rank opportunities by user value, product fit, confidence, implementation scope, and ongoing cost.
- DON'T invent recommendations to fill a quota.

### Patterns to investigate

- Check whether users can start a workflow but cannot complete its natural next step inside the product.
- Check whether users repeatedly recreate, re-enter, copy, organize, compare, or export the same information.
- Check whether a useful existing capability is unavailable through the interface its intended users rely on.
- Check whether users must assemble several existing operations into a recurring manual procedure.
- Check whether a result becomes significantly more useful when it can be saved, reused, inspected, compared, or acted on.
- Check whether long-running work would benefit from additional control, visibility, or recovery capabilities.
- Check whether users need a preview or explanation before making a consequential choice.
- Check whether related product objects could support a valuable adjacent task.
- Check whether an existing workaround reveals a missing first-class capability.
- Check whether a small, complete feature could deliver most of the benefit of a much larger proposal.

## 0. Project conventions and scope

- DO read and follow `AGENTS.md`, including instructions specific to affected files.
- DO inspect repository structure, product documentation, supported interfaces, domain models, and relevant tests.
- DO inspect the working tree before editing and preserve concurrent changes.
- DO follow existing design, API, SDK, authorization, persistence, configuration, and testing conventions.
- DO establish the requested area, product goals, constraints, and implementation authority.
- A request to find or recommend improvements authorizes discovery and reporting.
- A request to implement selected improvements authorizes the necessary implementation and verification within that scope.
- When the user explicitly delegates feature selection, DO choose within the stated goals and constraints and explain the choice.
- DON'T treat a discovery request as authorization to implement an unselected feature.
- DON'T expand a selected feature into unrelated redesign or infrastructure work.
- DO ask only when an unresolved decision materially affects the feature's behavior, value, compatibility, or authorized scope.
- Where possible, DO continue independent investigation while a decision is pending.

## 1. Understand the product before proposing features

DO establish enough context to understand:

- The product's purpose and the tasks it helps users accomplish.
- Relevant users, roles, tenants, and operating contexts.
- Existing objects, relationships, operations, and lifecycle states.
- How users enter, perform, complete, revisit, and recover a workflow.
- Which capabilities exist in the API, SDK, Web, CLI, workers, or administrative tools.
- Which capabilities are intentionally restricted, deferred, experimental, or unsupported.
- Where information enters the product and where results go afterward.
- Existing constraints involving data volume, external services, deployment, permissions, or maintenance.
- Current user requests, feedback, roadmap decisions, and usage evidence when available and authorized.

- DO trace representative workflows through actual interfaces and implementation.
- DO inspect routes, navigation, commands, configuration, feature flags, documentation, and tests before declaring a capability missing.
- DO distinguish an absent capability from an existing capability that is difficult to discover or use.
- DO distinguish an intentional product boundary from an accidental omission.
- DO treat tests and fixtures as evidence of supported behavior, not evidence of customer demand.
- DON'T infer popularity from the number of callers, routes, models, or tests.
- DON'T assume every API operation needs a corresponding UI, or every UI action needs a public API.
- DON'T assume the current architecture defines the limit of worthwhile product ideas.

## 2. Evidence before recommending

For each worthwhile candidate, establish:

1. **User and task:** Who would use it and what they are trying to accomplish.
2. **Current capability:** What the product supports today.
3. **Gap or opportunity:** What remains difficult, repetitive, unsupported, or unnecessarily external.
4. **Proposed capability:** The concrete behavior the feature would add.
5. **Benefit:** How the user's task changes in a meaningful way.
6. **Product fit:** Why the capability belongs in LongLink.
7. **Feasibility:** The main integration points, constraints, dependencies, and uncertainties.
8. **Smallest useful version:** A complete initial scope with clear acceptance criteria.

- DO cite exact repository evidence for claims about current behavior.
- DO identify whether the need comes from explicit user input, available feedback, observed workflows, or inference.
- DO label inferred demand and benefits as hypotheses.
- Repository evidence can establish that a feature is missing or feasible. It does not establish that users want it.
- DO consider whether existing functionality, documentation, configuration, or a smaller interaction change already solves the problem.
- DO explain why a new capability is preferable when those alternatives are insufficient.
- DON'T recommend a feature only because competitors have it or the underlying library supports it.
- DON'T require an unfinished implementation to justify a new idea. A well-supported adjacent capability can be valuable.
- If the proposal only restores established expected behavior, DO classify it as a correctness issue.
- If the proposal only changes internal structure, tests, security controls, or execution efficiency, DO identify the appropriate maintenance task.

## 3. Feature ideas to investigate

Use these categories to investigate the actual product. Each idea still needs a concrete user task, evidence, and a worthwhile benefit.

### A. Complete existing workflows

- Check whether users can create an object but lack a useful way to duplicate, organize, archive, restore, or reuse it.
- Check whether results can be produced but cannot be saved, revisited, exported, or used in the next relevant operation.
- Check whether a workflow ends by requiring a manual database edit, script, or unsupported administrative action.
- Check whether related operations could become one coherent task with fewer handoffs.
- Check whether users can perform an operation but cannot inspect its outcome or determine what to do next.
- Check whether the product supports the initial task but omits a recurring follow-up task.

DON'T add every possible lifecycle operation automatically. Establish which ones support a real workflow.

### B. Reduce repeated setup and manual work

- Investigate reusable templates, presets, saved inputs, or named configurations for recurring tasks.
- Investigate duplication from an existing object when users otherwise reconstruct similar objects manually.
- Investigate remembered preferences when repeated choices are stable and belong to a clear user or workspace scope.
- Investigate batch actions when users repeatedly apply the same operation to multiple items.
- Investigate import or copy flows when the same information is repeatedly entered from an established source.
- Investigate repeat-last-operation or reusable workflows when inputs and effects can be made explicit.

DO distinguish useful reuse from a general workflow engine or configuration system that the problem does not require.

### C. Find, organize, and revisit information

- Investigate search, filtering, sorting, or grouping when existing information becomes difficult to locate.
- Investigate saved views when users repeatedly reconstruct the same meaningful selection.
- Investigate favorites, pinned items, or recent activity when they provide a shorter route to recurring work.
- Investigate labels or collections when users need a domain-relevant organization that existing relationships do not provide.
- Investigate stable links to results or views when users need to revisit a specific context.
- Investigate clearer distinctions between active, completed, archived, and failed work when those distinctions support different actions.

DO establish the actual information-retrieval problem. DON'T add several overlapping organization systems.

### D. Inspect, compare, and understand

- Investigate previews or dry runs when users need to understand an operation before committing to it.
- Investigate change summaries when the important question is what differs between two states.
- Investigate comparisons between relevant results, configurations, versions, or environments.
- Investigate explanations of derived status, validation outcomes, or execution results when the underlying facts already exist.
- Investigate history when users need to understand how an object reached its current state.
- Investigate dependency or relationship views when users otherwise reconstruct those relationships manually.

DO identify what decision the additional information enables. More visible data is not automatically more useful.

### E. Control long-running or repeated work

- Investigate progress and status views when users cannot reasonably remain in one synchronous interaction.
- Investigate cancellation when users need to stop work that is no longer useful.
- Investigate retry or resume capabilities when users currently restart substantial work from the beginning.
- Investigate scheduling when the same task is performed repeatedly at predictable times.
- Investigate completion notifications when users otherwise poll or repeatedly return to check.
- Investigate retained run results when users need to inspect or compare previous executions.

DO include the execution, ownership, persistence, failure, and resource implications. A scheduling control is not a complete scheduling feature.

### F. Connect existing product surfaces

- Investigate a useful API capability that intended Web users cannot access without scripting.
- Investigate an SDK or CLI operation missing from an otherwise supported automation workflow.
- Investigate links between related screens when users repeatedly search for the next object manually.
- Investigate handoffs where users copy identifiers, connection details, or result metadata between product surfaces.
- Investigate consistent ways to move a result into an existing downstream operation.
- Investigate import/export compatibility with tools already present in the supported workflow.

DO justify each surface. DON'T require feature parity everywhere without a user need.

### G. Support coordination and handoffs

- Investigate sharing a relevant object, result, or saved view when work routinely passes between people.
- Investigate annotations or contextual notes when users currently keep essential explanations outside the product.
- Investigate ownership or assignment when responsibility for the next action is unclear.
- Investigate notifications tied to specific actionable events.
- Investigate activity history when users need to understand changes made by collaborators.
- Investigate controlled reuse across a workspace when the same configuration or artifact is repeatedly recreated.

DO account for permissions, tenant boundaries, sensitive content, notification volume, and ongoing support. DON'T invent a new role model without an established need.

### H. Improve task completion and recovery

- Investigate draft saving when users perform substantial work before submission.
- Investigate undo or reversible actions when the domain can support them meaningfully.
- Investigate actionable error details that help users correct input or configuration themselves.
- Investigate contextual examples when users must understand a non-obvious domain format.
- Investigate keyboard or direct-action workflows for frequent operations.
- Investigate a clearer first successful task when the product requires substantial setup before users obtain value.

DO connect the improvement to successful task completion. Avoid purely cosmetic changes presented as major product features.

### I. Add a natural adjacent capability

- Identify what users commonly do immediately before or after an existing supported task.
- Check whether the product already holds information that could make that adjacent task substantially easier.
- Investigate whether combining existing domain objects enables a valuable new operation.
- Investigate whether an external workaround could become a focused, supported capability.
- Consider capabilities serving an explicitly stated product goal even when they require new implementation.
- Compare a focused extension with the cost and complexity of turning the product into a broader platform.

DO explain why the extension belongs in LongLink and what makes it useful as a complete initial feature.

## 4. Prioritization

DO compare candidates using:

- **Task value:** Whether the feature enables an important outcome or removes meaningful effort.
- **Reach:** Which users or workflows benefit, with measured reach only when data exists.
- **Frequency:** Whether the problem occurs repeatedly or only under unusual conditions.
- **Product fit:** How directly the capability supports established goals and domain concepts.
- **Evidence:** Confidence in the problem, expected benefit, and implementation feasibility.
- **Scope:** The smallest complete implementation and affected product surfaces.
- **Ongoing cost:** Maintenance, infrastructure, support, permissions, storage, and lifecycle obligations.
- **Dependencies:** Whether value depends on other unfinished capabilities.
- **Alternatives:** Whether a smaller change produces a similar benefit.

- PREFER useful completion of an important workflow over a collection of disconnected additions.
- PREFER features that remain useful without several speculative follow-up projects.
- DON'T rank solely by implementation ease, novelty, number of touched files, or visual prominence.
- DON'T fabricate adoption percentages, revenue impact, time savings, or precise delivery estimates.
- When evidence is limited, DO use qualitative priorities and state the uncertainty.
- If numerical scoring is requested, DO explain its inputs and assumptions. DON'T manufacture numbers to complete a formula.
- DO distinguish a feature ready for implementation from an idea needing validation.
- DON'T reject a strategically useful feature solely because it is larger. Explain its scope and the evidence needed to justify it.

## 5. Shape the smallest useful feature

For a recommended feature, define:

- The user, triggering situation, and intended outcome.
- A concrete before-and-after workflow.
- The entry point and primary interaction.
- Required inputs, outputs, persistence, and state transitions.
- Applicable ownership, permission, and tenant rules.
- Loading, empty, success, failure, cancellation, and retry behavior where relevant.
- The API, SDK, Web, worker, or administrative surfaces actually needed.
- Compatibility, migration, deployment, and operational implications.
- Acceptance criteria observable by the user or consuming system.
- Deliberate scope boundaries and possible later extensions.

- DO describe a complete useful outcome rather than isolated backend or UI tasks.
- DO distinguish necessary behavior from optional polish.
- DO identify technical unknowns that could substantially increase scope.
- PREFER a smaller feature with a coherent workflow over an incomplete version of a larger feature.
- DON'T create a generic framework, plugin system, policy language, or workflow engine for one concrete use case.
- DON'T introduce settings when a sensible established behavior solves the problem.
- DON'T promise future extensibility as the main benefit of the first implementation.

## 6. Validation and success criteria

- DO define what would make the feature worthwhile before implementation.
- PREFER task-based criteria such as completing a previously unsupported task, reducing repeated setup, or avoiding a documented workaround.
- DO distinguish functional acceptance from actual adoption or product impact.
- A passing test proves behavior under its conditions, not user demand.
- A prototype can clarify feasibility or interaction. It does not establish that the feature should ship.
- DO use available user feedback, issue history, usage evidence, or representative workflow examples when authorized.
- If the main uncertainty is demand, DO identify the smallest useful question or observation that would reduce it.
- If the main uncertainty is technical, DO identify a bounded feasibility check.
- DON'T require a large research exercise for a small, well-supported improvement.
- DON'T add analytics, external services, surveys, or user outreach automatically.
- DON'T treat feature usage, clicks, or time spent as success when the goal is to finish work efficiently.

## 7. Implementation

- DO implement only the requested, selected, or explicitly delegated capability.
- DO confirm the intended behavior and acceptance criteria from available context before editing.
- DO inspect existing implementation patterns and reuse suitable project mechanisms.
- DO complete necessary data, service, API, SDK, UI, and background-work changes for the selected scope.
- DON'T leave disconnected controls, unused endpoints, placeholder behavior, or an implementation that cannot complete the promised workflow.
- DO preserve existing legitimate behavior and supported contracts.
- DO include required validation, authorization, tenant isolation, and resource lifecycle behavior.
- DO account for existing records and sensible defaults when adding persisted state.
- DO identify migrations, deployment ordering, external configuration, or user actions needed to activate the feature.
- DON'T introduce a new dependency or service without examining existing alternatives and its ongoing obligations.
- DO follow repository and user rules for test changes.
- DO keep unrelated cleanup and other feature ideas outside the implementation.

When a material product policy remains unresolved, DO prepare the concrete choice and explain its effect. Continue independent work. DON'T request additional approval for decisions already established or delegated.

## 8. Verification

- DO establish an applicable baseline before meaningful implementation.
- DO verify the feature through the interface its intended user or consumer will use.
- DO exercise the primary successful workflow and relevant empty, invalid, failure, retry, and cancellation paths.
- DO verify persistence and side effects when they are part of the capability.
- DO check applicable ownership, permissions, and tenant boundaries.
- DO confirm that the feature remains useful with representative existing data.
- DO verify directly affected existing workflows for regressions.
- DO run focused tests first, followed by applicable broader checks.
- For meaningful LongLink changes, DO use root `make test` for full API, SDK, and Web verification, subject to current repository instructions.
- DO run applicable formatting, linting, typing, and `git diff --check`.
- DO distinguish checks actually run from recommended or blocked checks.
- DON'T claim a feature is complete when essential integration, configuration, migration, or verification remains unfinished.

## Principles

- **User outcome:** Start with a task worth improving.
- **Evidence before enthusiasm:** Separate facts from assumptions about value.
- **Product fit:** Extend the product's purpose coherently.
- **Complete workflows:** Deliver an outcome users can actually reach.
- **Small useful scope:** Keep the initial feature bounded without removing its essential value.
- **Explicit trade-offs:** Include maintenance and operational costs.
- **Reuse with judgment:** Existing code can reduce effort but does not justify a feature.
- **Measurable acceptance:** Define observable behavior and a credible success signal.
- **Selective ambition:** Permit valuable new capabilities without turning every idea into a platform.
- **Honest uncertainty:** Recommend validation when the important facts are missing.

## Reporting opportunities

For discovery or review requests, DO return a numbered list ordered by expected value and confidence. Unless the user requests a count, DON'T impose one.

For each worthwhile opportunity, include:

- **Feature:** A concrete capability rather than a vague theme.
- **User and task:** Who benefits and what they are trying to accomplish.
- **Current workflow:** What the product supports and the relevant limitation or workaround.
- **Evidence:** Exact current file paths and line ranges, plus authorized feedback or documentation where available.
- **Proposed behavior:** A concise before-and-after example.
- **Benefit:** The new outcome, avoided work, or improved decision the feature enables.
- **Product fit:** Why it belongs in LongLink.
- **Smallest useful version:** Required behavior, integration points, and explicit scope boundaries.
- **Cost and risk:** Data, permissions, services, migrations, operations, maintenance, and important unknowns.
- **Acceptance and success:** How to verify correct implementation and assess whether the capability is useful.
- **Priority and confidence:** A reasoned ranking, separating known facts from inferred demand or benefit.
- **Next step:** Ready to implement, needs a specific decision, or needs a bounded validation step.

For proposed new files, DO distinguish suggested destinations from existing evidence. DON'T invent current paths or line numbers.

DO combine overlapping ideas into coherent features. DON'T present several implementation tasks as separate product opportunities.

If no well-supported feature opportunity emerges, DO say so and identify the product context or evidence that would make further discovery useful.

After implementation, DO report what users can now accomplish, the completed scope, verification results, required rollout steps, and material limitations.

DON'T claim adoption or business impact before it has been observed. When continued implementation is already authorized, DON'T end with another approval request.
