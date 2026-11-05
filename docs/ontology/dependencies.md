# Dependencies and integration boundaries

| Direction | Purpose and source evidence |
| --- | --- |
| Browser → React DOM → components | [main.tsx](../../src/main.tsx) mounts App; [FixturePage](../../src/features/fixtures/components/FixturePage.tsx) owns request state. |
| Fixture feature → configured HTTP API | [fixtureService](../../src/features/fixtures/services/fixtureService.ts) appends `/fixture` to `VITE_API_BASE_URL`, passes an AbortSignal, rejects missing configuration and non-OK HTTP responses, and decodes JSON. |
| JSON response → fixture records | [parseFixtures](../../src/features/fixtures/services/parseFixtures.ts) traverses phases/rounds/matches, attaches round names, and rejects incompatible data. |
| Team component → S3 images | [Team](../../src/features/fixtures/components/Team.tsx) builds `https://react-code-test.s3.ap-southeast-2.amazonaws.com/logos/{encoded code}.svg`; failed images fall back to text. |
| UI → native controls, styling, and icons | [RoundFilter](../../src/features/fixtures/components/RoundFilter.tsx) uses native radios and Tailwind classes; Card and Alert use ordinary className strings. FixturePage uses Lucide LoaderCircle. |
| Vite → React/Tailwind plugins | [vite.config.ts](../../vite.config.ts) configures transformation, styling, and the source alias. |
| Global CSS → package styles | [index.css](../../src/index.css) imports Tailwind, tw-animate-css, and shadcn CSS. |

The [API ticket](../ticket/feature-list-api.md) documents the supplied AWS API Gateway endpoint; runtime selection comes from configuration, not a hard-coded host. Browser requests require the configured service to permit cross-origin access. No proxy or backend is configured in Vite. Live service behavior and CORS were not checked during this refresh.

[package.json](../../package.json) still declares class-variance-authority, but inspected application source does not import it. radix-ui and cn have been removed from direct dependencies and the current lockfile; Toggle/ToggleGroup wrappers and src/lib/utils.ts have been deleted. shadcn and animation CSS are dev dependencies whose assets are used at build time. There is no data-fetching library or error-boundary dependency.

No database, authentication, server application, or persistence usage was found in inspected application source. This is not an infrastructure audit.
