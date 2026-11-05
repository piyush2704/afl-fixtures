---
name: build-feature
description: Implement one bounded feature increment from an agreed brief, reusing repository patterns and verifying its acceptance criteria. Use for feature implementation, not feature definition or code review.
---

# Build Feature

Implement one authorized feature increment from an agreed brief. Keep changes traceable to its acceptance criteria and preserve unrelated behavior and work.

## Workflow

1. Read the feature brief and identify the acceptance criteria for this increment. If no brief is agreed, or consequential scope or behavior is unclear, clarify before editing. Do not treat an agent proposal as approval.
2. Read `AGENTS.md` and applicable engineering rules. Use repository ontology for orientation when available; verify claims against current source, contracts, tests, and package scripts. Inspect existing working-tree changes and preserve unrelated work.
3. Propose the smallest useful implementation, noting expected behavior, affected code areas, consequential assumptions or trade-offs, and verification approach. Keep planning proportional; a small change does not need a separate plan file.
4. Implement within the authorized scope, following existing patterns and dependencies. Avoid unrelated refactoring or unnecessary dependencies; do not silently change agreed behavior.
5. Add or update meaningful tests when warranted, using the repository's existing test approach. Run appropriate checks with the project's actual tooling and report only checks actually run, their outcomes, and any incomplete verification.
6. Identify ontology documents that may be affected. Refresh them only when explicitly requested.
7. Report delivered behavior, changed files, checks and outcomes, and remaining work or verification gaps.

## Boundaries

Do not commit, push, or deploy without authorization. Follow existing authorization rules without adding duplicate approval gates.
