# Ontology manifest

- Repository: `afl-fixtures`.
- Output: `docs/ontology/`.
- Source baseline: commit `025a0bcadd3a5b72d3acb2072e7344354c4ab6ab` on `skeleton-template`.
- Generation date: 2026-11-05.
- Initial working tree: clean.

Evidence inspected: [repository instructions](../../AGENTS.md), [engineering rules](../../engineering.rules.md), [root README](../../README.md), [scaffolding brief](../../doc/ticket/scafolding.md), [fixture brief](../fixture-feature.md), package/configuration files, application entry points, layout and placeholder components, shared utility, and global CSS.

Coverage includes the current browser shell, source ownership, build configuration, declared dependency roles, and separation of implemented behavior from proposed fixture work. There is no existing fixture API implementation or generated shadcn UI component to map.

Evidence gaps: browser rendering and viewport behavior were not checked; no external services were contacted; deployed infrastructure and dependency security were not audited. Package ranges are not asserted to be exact installed versions. Earlier chat verification is not treated as a newly executed check.

Generation validation: `git diff --check`; local Markdown link-target validation across the six ontology files; `git status --short` to confirm changes are restricted to this directory. Build, lint, and runtime checks are skipped because the output is documentation only. See the generation response for actual check outcomes.

Future agents should re-check source and contracts before implementation, and obtain explicit user approval before modifying documentation as required by the repository rules.
