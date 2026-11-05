# AFL Fixture / Schedule Client

A React and TypeScript client for browsing AFL fixtures from the supplied challenge API. Users can view match details and combine round, team, and venue filters without requesting the fixture again.

## Run locally

Use the Node version in [`.nvmrc`](.nvmrc) (24.22.2). The package engine requires Node >=22.12.0.

```sh
nvm use
npm ci
npm run dev
```

Open the local URL printed by Vite. No `.env` file, API key, or backend setup is required. The public API base URL and `/fixture` path are defined in [`fixtureService.ts`](src/features/fixtures/services/fixtureService.ts). Internet access and the remote service's browser CORS support are required for live data and logos.

```sh
npm run build    # Type-check and create the production build in dist/
npm run lint     # Check source with Oxlint
npm run preview  # Serve the production build locally after building
```

## Challenge coverage

| Requirement | Implementation |
| --- | --- |
| List all matches from the supplied fixture endpoint | The response is flattened across every phase and round and rendered as a list, without pagination. Bye entries are represented separately. |
| Date, team names, logos, scores, and venue | Standard match cards display these details. Scores use goals.behinds (points); kickoff uses the browser's local time zone with a zone label. |
| Filter by round | Single-round selection, with “All fixtures” removing the round restriction. Round labels use their full API names, such as Round 1 and Finals Round 1. Empty rounds are retained as options. |
| Supplied team-logo source | URLs use each squad's code. A failed logo leaves the team name visible. |
| Functional components and TypeScript | UI components and the filter hook are functional and typed. The native React rendering-error boundary is the sole class component, required by React's boundary lifecycle. |
| Code organisation | Fixture components, services, types, formatting, and filtering have separate ownership paths. |
| Mobile-first design | Filters wrap or scroll within their available space; cards display one per row with responsive spacing. |
| README documentation | Setup, dependencies, behavior, architecture, trade-offs, and limitations are documented here. |
| Extra credit: team filtering | Multi-select options include distinct home and away teams from the complete dataset. |
| Extra credit: venue filtering | Multi-select options include distinct available venues from the complete dataset. |

Data sources:

- [Fixture endpoint](https://0p0s8y841d.execute-api.ap-southeast-2.amazonaws.com/test/react-code-test/fixture).
- Team-logo template: `https://react-code-test.s3.ap-southeast-2.amazonaws.com/logos/{code}.svg`.

## Filter behavior

Team and venue dropdowns appear above the round controls, with **Reset filters** aligned to the right. Both support multiple selections. Their options come from the full parsed response and remain available when other filters narrow the results. Team and venue names are sorted alphabetically and deduplicated by ID.

Selections within a filter use OR; different filters use AND. For example, selecting Carlton and Richmond, MCG, and Round 1 shows Round 1 games at MCG involving either team. A match appears once even if both participants are selected. No selected teams or venues means no restriction for that filter.

Changing one filter preserves the others. “All fixtures” removes only the round restriction. **Reset filters** clears team and venue selections and returns the round to “All fixtures”, restoring the complete dataset. There are no separate “All teams” or “Clear teams” controls.

Bye entries have special rules because they may lack an opponent, venue, date, and score:

- A specific round selection excludes byes.
- With “All fixtures” selected and no venue restriction, byes are visible; active team selections restrict them to those teams.
- An active venue filter excludes entries without a matching venue, including the current response's byes.

Loading, request errors, an empty successful response, and a filter combination with no matches have distinct presentation. Filters appear after a successful load and remain usable when a combination has no results. API failures currently have no Retry button.

## Dependencies

Declared packages and ranges are in [`package.json`](package.json); [`package-lock.json`](package-lock.json) records resolved versions.

| Package | Role |
| --- | --- |
| React 19 and React DOM | Components, hooks, state, and browser rendering. |
| TypeScript 7 and React/Node typings | Static checking of application and tooling code. |
| Vite 8 and its React plugin | Development server and production build. |
| Tailwind CSS 4 and its Vite plugin | Utility classes, responsive layout, and theme tokens. |
| Oxlint | Source linting. |
| shadcn and tw-animate-css | Existing UI scaffolding/configuration and imported CSS assets. |
| class-variance-authority | Retained from scaffolding; currently unused by application source. |

The custom filters use HTML controls and CSS rather than a UI runtime library. Radix UI, cn, and lucide-react were removed. Fetching currently uses the browser fetch API; TanStack Query is not installed or implemented.

## Organisation and custom hook

```text
src/
  components/
    errors/                 Rendering-error boundary
    layout/                 Header and footer
    ui/                     Card, Alert, and reusable MultiSelect
  features/fixtures/
    components/             Fixture page/cards, teams, and filter adapters
    hooks/useFixtureFilters.ts
    services/               HTTP request and response parsing
    types.ts                Fixture data and filter-option types
    utils/formatKickoff.ts   Browser-local kickoff formatting
```

[`FixturePage`](src/features/fixtures/components/FixturePage.tsx) fetches and stores the complete parsed response and handles loading and request errors. [`parseFixtures`](src/features/fixtures/services/parseFixtures.ts) traverses `phases[].rounds[].matches[]`, attaches each match's enclosing round name, and returns `FixtureData`: the flat fixture list and round names grouped by phase, including empty rounds.

[`useFixtureFilters`](src/features/fixtures/hooks/useFixtureFilters.ts) owns round, team, and venue selection state. It prepares distinct options, derives the visible fixture list, and exposes `selectRound`, `selectTeams`, `selectVenues`, and `resetFilters`. Keeping these rules together avoids growing the page component whenever a filter is added. The full fixture response is preserved; filtered copies are not stored in state.

The hook uses three useState values, which are sufficient for the current filters. It does not fetch data, persist selections across unmounts, or require a global store. Data updates preserve the current selections rather than automatically clearing them.

[`MultiSelect`](src/components/ui/multi-select.tsx) is shared by the team and venue adapters. The caller owns selected values; only open/closed panel state is local. It uses a button with expanded-state information, labelled native checkboxes, keyboard focus, outside-click dismissal, Escape dismissal with focus return, and a scrollable panel. The round filter uses native radio inputs.

## Trade-offs and assumptions

- **Ordering:** Phases, round options, and matches preserve API response order. We assume the API supplies them in the intended display order and do not sort them in the client. A live response check found Round 1–Round 23 followed by Finals Round 1–Finals Round 4 in order; this is an observation, not a guaranteed API contract. Team and venue options are still sorted alphabetically.
- **Team and venue identity:** Options assume stable IDs with consistent names. The parser does not validate every field in the TypeScript model, so incompatible identity data remains a limitation. No fallback identity rule is invented.
- **Response support:** The parser targets the supplied completed-match and bye structure. Non-bye entries currently require scores, a venue, both teams, and a parseable kickoff. Upcoming or unscheduled matches missing these fields are not generally supported. A rejected entry fails the response rather than being silently dropped.
- **Client-side filtering:** Fetching the complete response makes filtering immediate and avoids extra API calls, but renders the full list without pagination or virtualisation.
- **Local time:** Kickoff formatting follows the viewer's browser time zone. Older feature documentation mentions GMT, but the current implementation preserves browser-local formatting.
- **Rendering failures:** React's native error boundary needs a class component; the boundary wraps fixture content so the surrounding application layout remains visible on a rendering failure.

## Verification and follow-up

Build, lint, and whitespace checks passed for the current implementation before this README update. Browser checks during development exercised filter combinations, reset, dropdown dismissal and keyboard use, and 320 px layouts. These are manual checks, not an automated test suite or a claim that every failure state or browser has been verified.

Unit tests, further failure/empty-response coverage, and evaluating TanStack Query are planned follow-up work. They are not implemented yet. The local sample data remains in the repository but is not used as an API-failure fallback. Feature briefs and the repository ontology provide additional context, but some describe earlier increments; re-check current source before relying on their implementation descriptions.

## Agent skills

This repository includes four project skills, written in the open Agent Skills format, for an incremental process from feature definition through implementation and review. The shared instructions are in [`.agents/skills/`](.agents/skills/); [`.claude/skills/`](.claude/skills/) exposes the same skills to Claude Code through links to those `SKILL.md` files. This keeps one copy of each workflow for both tools. Each skill also has an `agents/openai.yaml` metadata file for Codex; Claude Code uses the shared `SKILL.md` and does not need that file.

| Skill | Use it when | What it does |
| --- | --- | --- |
| [`define-feature`](.agents/skills/define-feature/SKILL.md) | A new feature needs a clear scope before implementation. | Produces a concise brief with the user outcome, behavior, decisions and assumptions, trade-offs, open questions, and verifiable acceptance criteria. |
| [`build-feature`](.agents/skills/build-feature/SKILL.md) | A feature brief has been agreed and is ready to implement. | Delivers one bounded increment, follows repository patterns, and verifies the work against acceptance criteria. |
| [`review-change`](.agents/skills/review-change/SKILL.md) | A specific diff or implemented increment needs review. | Checks for evidence-backed correctness, security, reliability, complexity, and verification issues; reports findings without changing the reviewed code. |
| [`generate-repository-ontology`](.agents/skills/generate-repository-ontology/SKILL.md) | Documentation mapping the current codebase needs to be generated or refreshed. | Creates concise, source-backed technical context and navigation to help future contributors understand and safely change the project. |

### Install and use the skills

For this project, clone the repository and open the checkout in the coding tool. No separate package or global skill installation is required:

```sh
git clone <repository-url>
cd afl-fixtures
```

Codex discovers project skills from `.agents/skills/<skill-name>/SKILL.md`. Claude Code discovers project skills from `.claude/skills/<skill-name>/SKILL.md`; this repository provides links there to the shared skill instructions. If your checkout or platform does not preserve those links, copy the skill directories from `.agents/skills/` into `.claude/skills/` for Claude Code. Keep the folder names and `SKILL.md` files intact.

Invoke a skill explicitly when you want a particular workflow:

```text
Codex:       Use $define-feature to scope fixture filtering.
Claude Code: /define-feature
```

Replace `define-feature` with `build-feature`, `review-change`, or `generate-repository-ontology` as appropriate. Claude Code can also select a skill automatically when your request matches its description. Check that the skill appears in the tool's skill list if it is not detected; in Claude Code, use `/skills` to inspect available skills. The instructions themselves are portable, but automatic discovery and invocation syntax depend on the coding tool.

For Claude Code, project-level skills are loaded from `.claude/skills/` in the repository. To install a skill for your own use across projects instead, copy its directory under `~/.claude/skills/`. For Codex, the corresponding project and user skill locations are `.agents/skills/` and `~/.agents/skills/`.
