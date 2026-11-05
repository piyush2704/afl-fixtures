# Technical context

[package.json](../../package.json) declares React/React DOM `^19.3.1`, TypeScript `~7.0.2`, Vite `^8.3.6`, Oxlint `^1.90.0`, and Tailwind/Vite plugin `^4.3.4`. These are declared ranges; [package-lock.json](../../package-lock.json) records resolved packages. [.nvmrc](../../.nvmrc) selects Node 24.22.2; the package engine permits Node >=22.12.0.

[Vite configuration](../../vite.config.ts) enables React and Tailwind plugins and resolves `@` to `src`. [Root TypeScript configuration](../../tsconfig.json) references app and tooling projects. [App config](../../tsconfig.app.json) uses bundler resolution, no emit, React JSX, and `@/*` paths without `baseUrl`. [Tooling config](../../tsconfig.node.json) covers Vite with NodeNext resolution. Preserve compatibility with the installed TypeScript version when changing aliases.

[components.json](../../components.json) sets `new-york`, neutral base, CSS variables, TSX, no React Server Components, and the Lucide icon library. [index.css](../../src/index.css) imports Tailwind, animation CSS, and `shadcn/tailwind.css`; its theme maps CSS variables to Tailwind tokens. Dark tokens exist but there is no theme toggle in the shell.

Documented commands from [package.json](../../package.json):

- `npm run dev`: Vite development server.
- `npm run build`: `tsc -b && vite build`.
- `npm run lint`: Oxlint.
- `npm run preview`: preview the production build.

No test script or test suite is present in the inspected source/configuration. Ontology generation did not run build, lint, dev server, or browser checks; it changes documentation only.
