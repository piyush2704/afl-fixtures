# Repository ontology

This maps the implemented AFL fixture client, including API loading and client-side round filtering. Re-check current source before changing behavior; briefs include historical descriptions and future work.

| Read when | Document |
| --- | --- |
| Understanding purpose and current scope | [Product context](productContext.md) |
| Locating components and execution flow | [System patterns](systemPatterns.md) |
| Changing configuration or running checks | [Technical context](techContext.md) |
| Understanding packages and external boundaries | [Dependencies](dependencies.md) |
| Assessing coverage and evidence limitations | [Manifest](ontologyManifest.md) |

Start with [AGENTS.md](../../AGENTS.md) and [engineering rules](../../engineering.rules.md). Documentation changes require explicit user approval.

Feature history: [base fixture brief](../fixture-feature.md), [local-data increment](../ticket/feature-list.md), [API increment](../ticket/feature-list-api.md), and [round-filter brief](../ticket/rounds-filter.md). Use these for intent, and source for delivered behavior. The API brief is the newer increment but still contains proposals and stale implementation descriptions; its retry requirement is not implemented, and its application-wide boundary description differs from the current fixture-scoped boundary.

The round-filter brief still names shadcn Toggle Group; subsequent user-directed implementation uses native radio inputs. Radix, cn, and the shared utils helper have been removed. The current filter has no fade or scroll-tracking state.
