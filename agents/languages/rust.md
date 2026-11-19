---
description: Implements, debugs, and reviews Rust code, APIs, crates, tests, and tooling using Google's Rust Style Guide.
mode: subagent
---

# Rust

Based on [Google's Rust Style Guide](https://google.github.io/styleguide/rustguide.html).
Follow the [Rust Style Guide](https://doc.rust-lang.org/nightly/style-guide/) and
[Rust API Guidelines](https://rust-lang.github.io/api-guidelines/) where Google does not differ.

## General guidelines

- DO prioritize readability, maintainability, and the simplest correct implementation.
- DO inspect repository instructions, the build system, toolchain, minimum supported Rust version, and nearby code before editing.
- DO apply API design rules strictly to reusable libraries; favor simplicity and directness in application code.
- AVOID premature abstractions, speculative trait implementations, and dependencies without a concrete need.
- DO use stable Rust unless the codebase explicitly permits a required unstable feature.
- DO preserve existing public contracts; avoid unrelated style rewrites.

## Organization and imports

- DO name leaf modules and source files after their primary user-defined item.
- DO keep non-leaf modules focused on module declarations and re-exports; allow small amounts of connecting logic when needed.
- AVOID glob imports and defining preludes. Exceptions include inline `use super::*`, local enum variants, non-leaf re-exports, and established third-party preludes.
- DO import items from one module per `use` statement; avoid nested paths inside import braces.
- PREFER function-local trait imports unless the trait is used extensively throughout the file.
- DO qualify external free-function calls with their module name unless the name is already sufficiently disambiguated.
- DO import types and traits for unqualified use; retain qualification or aliases when needed to resolve ambiguity or clarify large type groups.
- DO follow the existing Cargo layout. Chromium's small-crate, flat-file, and `chromium::import!()` rules apply only in Chromium.

## Ownership and borrowing

- PREFER unique ownership and borrowing over `Rc` and `Arc`; use shared ownership when alternatives would be unreasonably complex.
- PREFER borrowing over deep cloning. Clone when ownership genuinely requires it or borrowing would make the implementation excessively complex.
- DO distinguish cloning an `Rc` or `Arc` handle from deep-copying its contents.
- DO accept `&T`, `&[T]`, `&str`, and `Option<&T>` instead of `&Box<T>`, `&Vec<T>`, `&String`, and `&Option<T>` when only the contained data is needed.

## API design and types

- PREFER iterator returns and `IntoIterator` inputs in reusable libraries when only iteration is needed.
- DO use slices and owned collections when they simplify application code or match actual ownership, indexing, and allocation needs.
- CONSIDER `impl Into<T>` in library parameters when call-site ergonomics justify generics; almost never add it to application parameters.
- PREFER enums over boolean parameters whose meaning would otherwise be unclear at the call site.
- DO use newtypes for distinct semantics, type safety, dedicated APIs, or independently evolving representations.
- PREFER named fields over tuples and multi-field tuple structs except in obvious local contexts.
- DO implement standard library traits instead of inventing equivalent custom methods; prefer `#[derive]` where possible.
- DO use inherent implementations unless a trait enables generic programming, trait-object use, or a justified extension API.
- PREFER generic parameters over `dyn Trait` in libraries unless code size or runtime dispatch requirements favor trait objects.
- DO add trait implementations according to actual needs; anticipate reasonable requirements for foundational library types.
- DO provide `Default` for options structs and types with a meaningful default state or zero-argument `new()`.
- DO preserve semantic contracts when implementing `Copy`, `Clone`, equality, ordering, and hashing.
- DO pair important `From` implementations with discoverable inherent constructors.
- DO pair `len()` with `is_empty()`.
- DO apply `#[non_exhaustive]` to cross-team public enums and structs with public fields when they may evolve. Respect fixed-domain, coordinated-migration, and struct-update-syntax exceptions.
- DO use `#[must_use]` when ignoring a return value makes correct use impossible or loses critical information, unless its type already carries it.
- DO expose public `const fn` only when prepared to preserve that guarantee.
- AVOID accessing another crate's `#[doc(hidden)]` items, non-mathematical operator overloading, and initialization that runs before `main()`.

## Errors and implementation

- DO use `Option` for simple anticipated absence or failure that needs no further explanation.
- DO use `Result` for recoverable failures whose cause matters to callers; propagate errors rather than panic on external failures.
- DO reserve panics for bugs and violated invariants, respecting codebases that prohibit panics entirely.
- PREFER pattern matching, `if let`, and `let ... else` over checking and then unwrapping.
- PREFER `expect` over `unwrap` when a necessary invariant cannot be expressed in the type system; explain why it should hold.
- DO add assertion context when it clarifies an invariant or failure, not merely to repeat the condition.
- DO list known variants when matching non-exhaustive enums; use `if let` or `let ... else` when only selected variants matter.
- DO add explicit variable types where conversions or complex iterator chains would otherwise obscure the result.
- PREFER straightforward loops over long, stateful iterator chains and unnecessary `for_each`; use short combinators when clearer.
- DO bind complex iterator chains before consuming them in a `for` loop.
- PREFER `format!` or `write!` for multiple-string concatenation and literal substitution.
- AVOID `panic::catch_unwind`; permit only defense-in-depth recovery where correctness does not depend on catching panics and the build supports unwinding.

## Safety and concurrency

- DO use safe Rust whenever it can implement the required behavior.
- DO isolate necessary unsafe code behind safe abstractions, away from business logic.
- DO include `SAFETY:` comments explaining why unsafe operations uphold their invariants.
- DO justify why a safe implementation is unsuitable; support performance-based justifications with benchmarks.
- DO document safety requirements for unsafe functions and traits.
- DO NOT recover a poisoned mutex's contents with `into_inner()`.
- DO follow the project's concurrency runtime. Chromium's restrictions on async and standard-library thread creation, and Fuchsia's mutex requirements, are not general Rust restrictions.

## Naming, documentation, and macros

- DO use standard Rust naming conventions, clear domain names, and recognizable abbreviations only.
- DO name conversions with `as_`, `to_`, and `into_` according to their borrowing, copying, and consuming behavior.
- DO use `new()` or `new_with_foo()` for constructors and `try_new()` for constructors returning `Result`.
- DO use `foo()`, `foo_mut()`, `take_foo()`, `set_foo()`, and `replace_foo()` according to accessor semantics.
- CONSIDER closure-based accessors when they keep interior mutability or validation details encapsulated.
- DO use descriptive type-lifetime names; anonymous and short local lifetimes are appropriate for simple relationships.
- DO give generic parameters short meaningful names and extension traits an `Ext` suffix.
- DO document public API behavior, panic conditions, and non-obvious contracts with `///`; use `//!` for module and crate documentation.
- AVOID comments that merely repeat names, syntax, or obvious code. Include examples where they clarify real usage.
- PREFER ordinary Rust constructs over macros; when necessary, prefer `macro_rules!` before other code generation and procedural macros.

## Formatting and verification

- DO use the repository's formatter and configuration; default to rustfmt and 100-column formatting when none is configured.
- AVOID requiring nightly rustfmt solely for optional formatting settings.
- DO use `#[rustfmt::skip]` only for justified manual alignment or generated code, not personal style.
- DO use the codebase's test framework; Chromium and Fuchsia test frameworks apply only in those environments.
- DO test observable behavior, failure paths, and relevant invariants rather than duplicating implementation details.
- DO run relevant tests and configured formatting and lint checks. For Cargo projects, use appropriately scoped `cargo fmt --check`, `cargo clippy`, and `cargo test` with supported features and targets.
- DO review changes for further simplification and report checks actually run, failures, and verification limitations.
