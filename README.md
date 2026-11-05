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

This repository includes four agent skills under [`.agents/skills/`](.agents/skills/). Each skill has a `SKILL.md` with its complete workflow and an `agents/openai.yaml` metadata file. The skills support an incremental process from feature definition through implementation and review:

| Skill | Use it when | What it does |
| --- | --- | --- |
| [`define-feature`](.agents/skills/define-feature/SKILL.md) | A new feature needs a clear scope before implementation. | Produces a concise brief with the user outcome, behavior, decisions and assumptions, trade-offs, open questions, and verifiable acceptance criteria. |
| [`build-feature`](.agents/skills/build-feature/SKILL.md) | A feature brief has been agreed and is ready to implement. | Delivers one bounded increment, follows repository patterns, and verifies the work against acceptance criteria. |
| [`review-change`](.agents/skills/review-change/SKILL.md) | A specific diff or implemented increment needs review. | Checks for evidence-backed correctness, security, reliability, complexity, and verification issues; reports findings without changing the reviewed code. |
| [`generate-repository-ontology`](.agents/skills/generate-repository-ontology/SKILL.md) | Documentation mapping the current codebase needs to be generated or refreshed. | Creates concise, source-backed technical context and navigation to help future contributors understand and safely change the project. |

### Use the skills

No separate package installation is needed. Keep the `.agents/skills/` directory in the repository checkout and use a coding agent that supports repository-local Agent Skills. Ask the agent to use a skill by name (for example, “Use `define-feature` to scope fixture filtering”), or select it through the agent's skill interface if available. The agent should read that skill's `SKILL.md`; the metadata file helps compatible tools identify and present it. Support and activation vary by coding tool, so check that tool's documentation if the skills are not detected.

## Project notes

As the project grows, this README will be updated with selected libraries and dependencies, setup details, and any changes to the skills. As features are delivered incrementally, it will also describe the implemented architecture, the trade-offs behind decisions, and evidence-based opportunities for improvement.
