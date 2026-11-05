# AFL Fixture / Schedule Client

This repository is the **AFL Fixture / Schedule Client** challenge: build a React web client that helps people browse the Australian Football League (AFL) fixture using the Fixture API supplied with the challenge. The work demonstrates React development and the reasoning used to choose between multiple valid solutions.

The intended product is a clear, usable way to view AFL fixture information supplied by the API. The challenge includes mandatory requirements and optional extra-credit criteria. Their detailed acceptance criteria and the API contract will be added here when available; until then, specific fixture features and API fields are intentionally unspecified. Component libraries such as Shadcn and data-fetching libraries such as TanStack Query are permitted, but are optional choices. For an example of an AFL fixture, see [AFL Fixture](https://www.afl.com.au/fixture).

## Current stack

- React 19 and React DOM
- TypeScript 7
- Vite 8
- Oxlint
- Node.js 24.22.2 (the version specified in `.nvmrc`)

The current app is a starter. Fixture API integration and challenge functionality are not yet implemented.

## Run locally

Install the dependencies and start the Vite development server:

```sh
nvm use
npm install
npm run dev
```

Useful project commands:

```sh
npm run build    # Type-check and build the app
npm run lint     # Check source with Oxlint
npm run preview  # Preview the production build locally
```

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

## Project notes

As the project grows, this README will be updated with selected libraries and dependencies, setup details, and any changes to the skills. As features are delivered incrementally, it will also describe the implemented architecture, the trade-offs behind decisions, and evidence-based opportunities for improvement.
