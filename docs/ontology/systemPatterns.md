# System patterns

Execution flows from [index.html](../../index.html), which provides `#root`, to [main.tsx](../../src/main.tsx). The latter imports global CSS and mounts `App` inside React `StrictMode`.

[App.tsx](../../src/App.tsx) composes `AppHeader`, a semantic `main` containing `FixturePage`, and `AppFooter`. Its flex column has `min-h-svh`; main uses `flex-1`. Header and main use a centered `max-w-6xl` container with base padding and larger `sm` padding. Footer retains a top border and vertical padding.

| Boundary | Current implementation |
| --- | --- |
| Shared layout | [AppHeader](../../src/components/layout/AppHeader.tsx), [AppFooter](../../src/components/layout/AppFooter.tsx) |
| Fixture feature | [FixturePage](../../src/features/fixtures/components/FixturePage.tsx), a static placeholder |
| Shared utilities | [utils.ts](../../src/lib/utils.ts), re-exports `cn` |
| Global styling | [index.css](../../src/index.css), Tailwind imports, semantic color tokens, base styles and dark-class token overrides |

Components are functional TSX modules with named exports, except the default `App` export. Current imports in application code use relative paths; aliases are configured for generated UI code.

[components.json](../../components.json) targets `src/components/ui` for shadcn primitives, but that directory has no generated components in this baseline. Feature API clients, hooks, types, and formatters are future structure, not existing modules. The configured global hooks alias is a generator target; it does not establish implemented hooks.

There is no router, application state store, persistence, API client, or error/loading flow in the current rendered feature. `src/App.css` and starter assets remain in the repository but are not imported by the current shell.
