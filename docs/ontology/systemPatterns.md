# System patterns

[index.html](../../index.html) supplies `#root`; [main.tsx](../../src/main.tsx) imports global CSS and mounts [App](../../src/App.tsx) inside React StrictMode. App composes shared header/footer and a centered semantic main containing FixturePage.

| Boundary | Current implementation |
| --- | --- |
| Feature lifecycle and state | [FixturePage](../../src/features/fixtures/components/FixturePage.tsx) wraps private `FixturePageContent` in ErrorBoundary. Content owns FixtureData, selectedRound, loading, and error through local React state. |
| HTTP transport | [fixtureService](../../src/features/fixtures/services/fixtureService.ts), `fetchFixtureResponse(signal)` returns unknown JSON. |
| Response adaptation | [parseFixtures](../../src/features/fixtures/services/parseFixtures.ts) validates selected fields and flattens phase/round matches into Fixture records and returns [FixtureData](../../src/features/fixtures/types.ts), containing fixtures and roundNamesByPhase. |
| Rendering | [FixtureCard](../../src/features/fixtures/components/FixtureCard.tsx), [Team](../../src/features/fixtures/components/Team.tsx), and [formatKickoff](../../src/features/fixtures/utils/formatKickoff.ts). |
| Round controls | [RoundFilter](../../src/features/fixtures/components/RoundFilter.tsx), a controlled native radio list receiving round names, selected value, and a callback. |
| Shared UI | [Card](../../src/components/ui/card.tsx) and [Alert](../../src/components/ui/alert.tsx), using ordinary className strings. |
| Rendering-error fallback | [ErrorBoundary](../../src/components/errors/ErrorBoundary.tsx), a native React class boundary used inside FixturePage. |

On mount, an effect creates an AbortController, fetches the response, parses it, and updates state unless aborted. Cleanup aborts the request; obsolete success/error/finally updates are guarded. StrictMode can initiate an extra setup/cleanup cycle in development. Errors from fetching, JSON decoding, or parsing become the feature Alert; rendering errors in content descendants reach the boundary. The boundary does not replace asynchronous error handling and offers reload guidance without an in-place reset.

Parsing preserves phase/round/match traversal order and copies the enclosing round name to `roundName`. Nested flatMap/map traversal collects roundNamesByPhase before mapping matches, preserving empty rounds and phase grouping for option ordering. It does not add phase identity to individual fixtures. requireObject rejects null, arrays, and nonobjects before property access. `roundOrder` is a match-order field, not a round identifier; see the [base brief](../fixture-feature.md). A rejected entry fails parsing for the response rather than being silently omitted. Validation is partial and ends with a type assertion; not every declared Fixture field is checked.

The [local sample](../../src/features/fixtures/data/fixtures.ts) remains in source but is not imported by FixturePage or used as an API-failure fallback. No router, global store, persistence, caching, polling, or pagination is implemented. Most components are functional named exports; App has a default export, and ErrorBoundary uses React's required class lifecycle. Relative and `@/` imports coexist.

FixturePage sorts copies of each phase’s round names with numeric-aware localeCompare, concatenates phases in response order, and deduplicates names with Set. selectedRound is null for “All fixtures”; otherwise visibleFixtures is derived by exact roundName matching. Selection does not trigger fetching or mutate the original fixtures. Match order is preserved.

RoundFilter has no hooks, selection state, or filtering logic. Inputs share the fixed name fixture-round; this assumes one group on the page. Values distinguish all from round-prefixed names. Full round names remain accessible labels when regular names display as numbers. Native inputs are visually transparent over styled labels; peer classes expose checked and keyboard-focus styling. Focus scrolls the label into view. Overflow uses a native horizontal scrolling container; no ResizeObserver, fade, or scroll listeners remain.

Card concatenates base classes with the supplied className; its gap/padding defaults apply only when className is omitted. CardContent uses supplied classes in place of its default px-6. These components no longer merge conflicting Tailwind classes; callers such as FixtureCard provide explicit spacing.
