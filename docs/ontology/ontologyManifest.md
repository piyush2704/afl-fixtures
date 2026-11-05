# Ontology manifest

- Repository: `afl-fixtures`; output: `docs/ontology/`.
- Source baseline: `91c1f24ef9a28101e70e6e1bf5701b6eb396d3fe` on `round-filter`, plus the current uncommitted working tree; the commit alone does not contain the round filter.
- Refresh date: 2026-11-05.
- Initial working tree: existing ontology edits, application/configuration/dependency edits and deletions, an untracked round-filter brief/component, and an untracked .env. This refresh preserves all non-ontology work and does not read .env values.

Evidence: [repository instructions](../../AGENTS.md), [engineering rules](../../engineering.rules.md), [root README](../../README.md), [scaffolding brief](../../doc/ticket/scafolding.md), [base fixture brief](../fixture-feature.md), [local-data ticket](../ticket/feature-list.md), [API ticket](../ticket/feature-list-api.md), [round-filter brief](../ticket/rounds-filter.md), package/build configuration, entry points, feature components/types/services/formatter, shared UI, and error boundary.

Coverage now includes API transport, partial response validation and flattening, local request state and cancellation, fixture/bye presentation, logo fallback, browser-local kickoff formatting, and the fixture-scoped rendering boundary. Coverage also includes native controlled round selection, natural option sorting, empty-round metadata, FixtureData, and removal of Radix/cn wrappers. Existing technical configuration guidance is retained.

Documentation conflicts are recorded rather than propagated as delivered behavior: older placeholder/local-source descriptions are stale; GMT in older briefs differs from current browser-local formatting; the API ticket requires retry but no retry action exists; its application-wide boundary criterion differs from current fixture-only placement. The round-filter brief’s Toggle Group requirement has been superseded by user-directed native radios in current source. The filter uses a fixed fixture-round name and has no fade. Round names retain phase grouping and empty rounds, while fixtures do not retain enclosing phase identity. No ticket or application source was changed by this refresh.

Evidence gaps: no live API, CORS, rendered counts, viewport, keyboard, failure simulation, or timezone behavior was checked. Historical sample counts in briefs are not asserted as newly verified live counts. Earlier session checks exercised a native-filter version before later simplifications; those are not fresh verification of the current tree. Runtime validation covers only selected fields before a type assertion. No infrastructure or dependency-security audit was performed; declared package ranges are not exact installed-version claims.

Refresh checks: `git diff --check`, local Markdown link-target validation across all six ontology files, and `git status --short` for change scope. Outcomes are reported in the refresh response. Build, lint, and runtime checks were skipped because only documentation changed; earlier implementation checks are not new refresh evidence.

Future agents must re-check current source and contracts and obtain explicit approval before documentation changes, as required by repository rules.
