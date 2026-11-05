---
name: generate-repository-ontology
description: Generate or refresh concise, source-backed repository documentation that helps agents understand and safely modify a codebase.
---

# Generate Repository Ontology

Use this skill to explain, plan, generate, or update a repository ontology: concise technical documentation that maps the current system and points future agents to authoritative sources.

## Resolve scope before writing

- Identify the source repository root and requested output directory before writing. Honor explicit paths; otherwise use `docs/ontology/`. If the repository cannot be determined, ask before writing.
- Read the repository's `AGENTS.md` and applicable engineering rules before handling the request. Apply repository-specific guidance only to its owning repository.
- Honor the requested mode: explain and plan are read-only; generate creates documentation; update edits existing documentation. Do not write in read-only modes.
- Modify ontology documentation only. For updates, inspect the existing ontology and refresh only affected sections, preserving useful current guidance.

The default output set is:

- `README.md`: navigation and when to read each file.
- `productContext.md`: purpose, users, and evidence for business behaviour.
- `systemPatterns.md`: components, entry points, flows, boundaries, and implementation patterns.
- `techContext.md`: stack, contracts, configuration, build, and verification anchors.
- `dependencies.md`: integration direction, purpose, and evidence about failure behaviour.
- `ontologyManifest.md`: source baseline, coverage, assumptions, and evidence gaps.

Use these filenames in the resolved ontology output directory. Create only files needed for the requested scope; do not add supporting files unless they solve a concrete need.

## Build from current evidence

Inspect relevant source, contracts, tests, configuration, and project documentation. Use an existing ontology as navigation and supplemental context, then verify claims against current source and contracts.

Document only what the evidence supports. Map relevant components, entry points, data flows, dependencies, implementation patterns, and documented verification commands. Link claims to source paths and, where useful, symbols. Mark unknowns or unverified details plainly. Never invent APIs, database ownership, configuration, test outcomes, or other contracts; never present proposed architecture as implemented.

Keep the documentation concise and useful for safe changes. Prefer the repository's existing format; avoid duplicating source material or adding speculative structure. Before writing, ensure the selected output is inside the resolved repository or is an explicitly requested destination.

## Report evidence

For generation or updates, summarize the files changed and the evidence used. Report exact checks run and their outcomes; state skipped checks with a reason. Do not imply a command ran if it did not. For later implementation work, treat this ontology as supplemental context and re-check current source and contracts before changing behaviour.
