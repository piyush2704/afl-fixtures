# Dependencies and integration boundaries

| Direction | Purpose and source evidence |
| --- | --- |
| Browser → React DOM → React components | [main.tsx](../../src/main.tsx) mounts the component tree; [App](../../src/App.tsx) composes the shell. |
| Vite → React/Tailwind plugins | [vite.config.ts](../../vite.config.ts) configures transformation and styling. Build failures propagate through the package build command. |
| Global CSS → Tailwind, tw-animate-css, shadcn CSS | [index.css](../../src/index.css) imports package styles; package availability is required during the build. |
| Shared helper → cn package | [utils.ts](../../src/lib/utils.ts) re-exports `cn`; the current shell does not use the helper. |
| shadcn configuration → future generated UI source | [components.json](../../components.json) records paths and theme. No generated UI primitive is currently rendered. |

[package.json](../../package.json) also declares class-variance-authority, Lucide React, and Radix UI. They are installed UI foundations; the inspected shell does not import them. The shadcn package and animation CSS are declared as dev dependencies; global CSS imports their assets at build time.

The [fixture brief](../fixture-feature.md) describes an AWS API Gateway fixture endpoint and S3 logo URLs. Neither is called by the current application. Response validation, CORS, request failures, retry behavior, and logo failure handling have no implemented runtime behavior yet. This generation did not contact either service or validate their contracts.

No environment variables, database, server application, authentication, or persistence usage was found in the inspected application source. This is a source-scope observation rather than an infrastructure audit.
