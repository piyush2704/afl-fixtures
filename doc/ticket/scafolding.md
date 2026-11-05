# Application shell and repository scaffolding

## User and outcome

The developer needs a clean application foundation for the AFL fixture client so that later feature increments can add fixture behavior without rebuilding the page shell or reorganizing the codebase.

## Current state

The repository is a React 19, TypeScript 7, and Vite 8 starter. `src/App.tsx` renders the Vite starter demo, `src/main.tsx` mounts `App`, and `src/index.css` contains the starter styles. The repository has no Tailwind CSS or shadcn/ui setup in `package.json`. The existing [README.md](../../README.md) says shadcn is permitted but optional.

## Desired outcome

Replace the starter demo with a responsive application shell containing a header, main content region, and footer. Establish the agreed feature-oriented folder structure and configure shadcn/ui for this existing Vite React TypeScript application.

## Proposed first increment scope

### In scope

- Create functional TypeScript React components for the shared application header and footer.
- Render a semantic page shell with `<header>`, `<main>`, and `<footer>` landmarks; keep the main area as the content slot for fixture work.
- Remove the visible Vite starter demo from the app entry point.
- Organize shared layout components separately from fixture-specific code and shadcn-generated UI primitives.
- Initialize shadcn/ui using the official Vite setup for an existing project. Configure Tailwind CSS, the Vite Tailwind plugin, component aliases, `components.json`, and the shared utility path required by the selected setup.
- Add only dependencies and shadcn components needed by the chosen shell. Record dependency changes in `package.json` and `package-lock.json`.
- Keep the repository's existing `npm` scripts usable.

### Proposed folder layout

```text
src/
├── App.tsx
├── main.tsx
├── index.css
├── components/
│   ├── layout/
│   │   ├── AppHeader.tsx
│   │   └── AppFooter.tsx
│   └── ui/                  # shadcn/ui component source
├── features/
│   └── fixtures/
│       └── components/      # fixture page/list components as they are added
└── lib/
    └── utils.ts             # shared shadcn utility, such as cn
```

Fixture-specific API clients, hooks, formatters, and types should be added under `src/features/fixtures/` when fixture behavior is implemented. Keep hooks and utilities in a common folder only if they are genuinely reused outside the fixture feature. Avoid empty placeholder files solely to make directories appear in Git.

### Out of scope

- Fetching or rendering fixture API data, round filters, scores, or team logos.
- Venue/team filters and bye presentation.
- Adding a router or additional libraries without a later requirement.
- Changing unrelated README or repository documentation as part of the implementation.

## Behavior and implementation notes

- The header and footer appear around the main content region on the fixture page.
- The shell uses a mobile-first layout, allows the main region to grow between the header and footer, and avoids horizontal overflow on narrow screens.
- shadcn/ui components are source files maintained in the repository. Tailwind CSS and Vite integration are part of initializing the current project; `components.json` aliases must match the actual source directories.
- The official shadcn Vite guide describes setup for an existing project, including Tailwind, the Vite plugin, TypeScript aliases, and the initialization CLI. The selected shadcn style and base color should be settled before initialization because the current configuration guide says the style cannot be changed after initialization. [Vite installation guide](https://ui.shadcn.com/docs/installation/vite), [components.json reference](https://ui.shadcn.com/docs/components-json), [shadcn component model](https://ui.shadcn.com/docs/new).

## Decisions and assumptions

- **Confirmed:** Use shadcn/ui for the project UI components.
- **Confirmed:** The code organization should follow the prior recommendation: shared layout and shadcn components live under `src/components/`; fixture-specific code lives under `src/features/fixtures/`; shared shadcn helpers live under `src/lib/`.
- **Confirmed:** This increment establishes the shell and a neutral main-content placeholder/slot only; fixture loading and match-list behavior remain a separate increment.
- **Confirmed:** The header displays the text title “AFL Fixtures” with no navigation. The footer is minimal and has no extra links or unapproved branding.
- **Confirmed:** Initialize shadcn/ui with the `new-york` style, neutral base color, and CSS variables.
- **Proposed assumption:** Use Tailwind CSS v4 with `@tailwindcss/vite`, following the current official Vite setup for an existing Vite project.

## Acceptance criteria

1. **Application shell:** Running the app renders a page with one header, one main content region, and one footer; the Vite starter demonstration is no longer shown.
2. **Component boundaries:** Header and footer are separate functional `.tsx` components under `src/components/layout/`, imported by the app shell. The header displays “AFL Fixtures” and has no navigation; the footer has no extra links or unapproved branding.
3. **Content slot:** The main region provides a clear component boundary for future fixture UI without implementing fixture fetching, fixture records, round filtering, scores, or logos in this increment.
4. **Folder organization:** Shared layout components, shadcn UI components, fixture-specific code, and shared utilities have the agreed ownership paths described above. Fixture hooks and formatters are not placed in global common folders unless shared by another feature.
5. **shadcn setup:** The project is initialized for shadcn/ui with TypeScript enabled, `new-york` style, neutral base color, and CSS variables; `components.json` aliases resolve to the actual component and utility directories; Tailwind is loaded through the configured Vite plugin.
6. **Dependencies:** All packages required by the selected shadcn setup are declared in the package manifest and lockfile. No unrelated UI or data-fetching libraries are introduced.
7. **Mobile-first responsive layout:** Starting at a 320 px viewport and increasing through mobile, tablet, and desktop widths, the header, main content slot, and footer remain readable and usable, with no clipped content, overlap, or horizontal page scrolling. The main region can grow so the footer follows the content rather than overlapping it.
8. **Accessibility:** The shell uses semantic landmarks and a sensible heading hierarchy. Any header navigation or footer links are keyboard-operable and have accessible names.
9. **Project commands:** `npm run dev`, `npm run build`, and `npm run lint` continue to work after scaffolding.

## Trade-offs

A small shared shell gives future fixture work a stable place to render while keeping API and match behavior out of this setup increment. Feature-oriented folders keep fixture-only logic together; shared folders remain reserved for components and helpers that multiple parts of the app use.
