# Technical context

[package.json](../../package.json) declares React/React DOM `^19.3.1`, TypeScript `~7.0.2`, Vite `^8.3.6`, Oxlint `^1.90.0`, and Tailwind/Vite plugin `^4.3.4`. These are declared ranges; [package-lock.json](../../package-lock.json) records resolved packages. [.nvmrc](../../.nvmrc) selects Node 24.22.2; the package engine permits Node >=22.12.0.

[Vite configuration](../../vite.config.ts) enables React and Tailwind plugins and resolves `@` to `src`. [Root TypeScript configuration](../../tsconfig.json) references app and tooling projects. [App config](../../tsconfig.app.json) uses bundler resolution, no emit, React JSX, and `@/*` paths without `baseUrl`. [Tooling config](../../tsconfig.node.json) covers Vite with NodeNext resolution. Preserve compatibility with the installed TypeScript version when changing aliases.

[components.json](../../components.json) sets `new-york`, neutral base, CSS variables, TSX, no React Server Components, and the Lucide icon library. [index.css](../../src/index.css) imports Tailwind, animation CSS, and `shadcn/tailwind.css`; its theme maps CSS variables to Tailwind tokens. Dark tokens exist but there is no theme toggle in the shell. The utils alias has been removed from components.json along with the shared cn helper; do not assume generated components can import it. The current round control uses native HTML radios, not Radix or shadcn Toggle Group.

Documented commands from [package.json](../../package.json):

- `npm run dev`: Vite development server.
- `npm run build`: `tsc -b && vite build`.
- `npm run lint`: Oxlint.
- `npm run preview`: preview the production build.

## Fixture configuration and contract

[fixtureService](../../src/features/fixtures/services/fixtureService.ts) requires a nonblank `VITE_API_BASE_URL`, trims trailing slashes, and appends `/fixture`. [vite-env.d.ts](../../src/vite-env.d.ts) declares the variable. Vite exposes `VITE_` configuration to the browser bundle; it must not contain secrets. Local `.env` values were not inspected or copied into this ontology.

[Fixture types](../../src/features/fixtures/types.ts) describe squads, scores, status, round metadata, and optional date/venue/away squad. [parseFixtures](../../src/features/fixtures/services/parseFixtures.ts) expects `phases[].rounds[].matches[]` and round names. Non-bye entries require both team names, venue name, parseable UTC kickoff, and finite numeric scores. Bye entries bypass those non-bye checks. Upcoming entries without scores or scheduling details are therefore not generally supported; the [API ticket](../ticket/feature-list-api.md) identifies this evidence gap. Parsing is not exhaustive validation of the TypeScript interface. Its named FixtureData return type contains fixtures: Fixture[] and roundNamesByPhase: string[][]; the page uses the same type for fetched data state. Round names are collected independently of match presence.

No test script or test suite is present in the inspected source/configuration. This documentation refresh did not run build, lint, dev server, or browser checks. Validation is limited to documentation whitespace, local link targets, and change scope; see the manifest.
