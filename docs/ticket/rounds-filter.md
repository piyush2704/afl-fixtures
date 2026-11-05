# Rounds filter — feature brief

## User and outcome

An AFL follower wants to select a round at the top of the fixture screen and see its associated matches, then choose “All fixtures” to restore the unfiltered fixture list.

## Current behavior and evidence

The [ontology](../ontology/README.md) maps the current API-backed feature. [FixturePage](../../src/features/fixtures/components/FixturePage.tsx) fetches on mount, stores the full parsed fixture list plus loading/error state, and displays every entry. It has no filter controls or selection state. A rendering boundary wraps the feature content; request failures use an Alert.

[parseFixtures](../../src/features/fixtures/services/parseFixtures.ts) flattens `phases[].rounds[].matches[]` and copies each enclosing round name to `Fixture.roundName`. Empty rounds and enclosing phase identity are not retained. [Fixture types](../../src/features/fixtures/types.ts) contain `roundOrder`, which the [base fixture brief](../fixture-feature.md) identifies as match order within a round, not round identity.

The base brief requires round filtering without another request and a return to the complete list. Its historical starter description is superseded by current source. Current cards include standard matches and byes; this feature does not redefine their presentation or kickoff formatting.

## Confirmed requirements

- Add clickable round filter items below “Fixture schedule” and above the match list. Put “All fixtures” first, followed by the sorted round choices.
- Hide the filter during loading and request errors. Show it after successful loading, including empty responses; retain any available empty-round choices.
- Derive visible fixtures from the original full dataset and selected round rather than storing a filtered copy. Derive options from the full round source so selection does not remove choices.
- Offer every available round, including finals rounds when present. In the filter presentation, show regular round names as their number (for example, “Round 1” → “1”). Keep finals round names exactly as returned by the API (for example, “Finals Round 1”); do not abbreviate them. Retain original round names for data association; display labels do not change the API data.
- Selecting a round displays the matches associated with it.
- Include an additional item labelled “All fixtures”; selecting it removes the round filter and restores the complete parsed response, including existing bye entries.
- Select “All fixtures” on initial load. Allow one round at a time; selecting another replaces the previous selection.
- Keep phases in API response order and sort round names naturally within each phase, so Round 2 precedes Round 10.
- Include API rounds with zero matches. Distinguishing identical round names across phases is excluded by user decision; the inspected API response has no such duplicates.
- Make the control responsive and scroll horizontally when its items do not fit.
- Apply round filtering to already-fetched data without an additional fixture request, as specified in the base brief.
- Use the shadcn Radix [Toggle Group](https://ui.shadcn.com/docs/components/radix/toggle-group) in single-selection mode inside a new fixture-feature filter component.
- Start with a single round filter. FixturePage owns the available round options, selected round, fixture data, and filtering logic. RoundFilter only renders the filter option list from props and reports user selections through a callback; it has no local selection state and does not fetch, filter, or store fixture results.
- Define this increment only. Do not modify application code or add tests.

## Scope and dependencies

This increment covers round choices, round selection, the resulting fixture list, and responsive overflow for the filter control. Team/venue filters, changes to API transport, retry implementation, card design, score/time formatting, polling, and pagination are outside this round-filter brief.

Use the existing fixture endpoint and documented nested rounds; no new API fields, endpoints, or backend are specified. The selected UI component is shadcn’s Radix Toggle Group; adding its local UI source belongs to later implementation. No other new dependency is approved by this brief. The current flattened model discards empty rounds. Response adaptation must retain the full round list, including empty rounds, and preserve enough source grouping to apply the approved ordering. Existing roundName values associate fixtures with rounds; no separate phase-based selection identity is required. Do not invent a round ID or treat roundOrder as one.

## Confirmed component responsibilities

For this first single-filter increment, FixturePage is the state and data owner; RoundFilter is a controlled presentation component.

- **FixturePage feature content:** Own the full fetched fixture data, round-option preparation, selected-round state initialized to “All fixtures”, and actual filtering. Pass options, the selected value, and a selection-change callback to RoundFilter. Render the resulting fixture cards and retain existing loading/error handling and the feature rendering boundary.
- **RoundFilter:** Render the supplied option list using shadcn Radix Toggle Group, including approved display labels and horizontal scrolling. Reflect the selected value supplied by FixturePage and report user selections through the supplied callback. Do not maintain a separate selected-round state or perform data filtering.
- **Selection behavior:** Keep one item selected. Clicking the active item must not leave the control without a selection. Use original round names for matching and an explicit all-fixtures value to clear filtering; concrete prop names and that value’s representation remain implementation details.
- This is a single-filter increment. Do not introduce a general multi-filter state abstraction or move data/filter orchestration into RoundFilter.

## Proposals awaiting approval

These are proposals, not approved behavior or implementation assumptions:

- Keep horizontal scrolling within the control rather than widening the page.
- Provide visible selection, keyboard operation, and an accessible selected-state indication.

No unapproved assumption is adopted by this brief. Implementation must resolve the relevant open decisions before relying on these proposals.

## Open decisions

Control placement, ordering of “All fixtures”, loading/error visibility, empty-success visibility, and derived results are approved. No sticky behavior is approved. The remaining accessibility and overflow proposals above have not been separately confirmed.

## Observable acceptance criteria

The following describe the confirmed outcome; criteria depending on unresolved decisions are explicitly conditional.

1. **Filter placement and coverage:** After successful loading, the control appears below “Fixture schedule” and above the fixture list, with “All fixtures” first and clickable round items with regular round labels displayed as numbers and finals labels unchanged from the API. Every API round is available, including empty rounds. No phase-based distinction for duplicate names is required.
2. **Round selection:** Activating a round displays only fixture entries associated with the selected original round name; entries belonging to other round names are absent. Shortened regular-round display labels do not alter matching.
3. **Clear selection:** Activating “All fixtures” removes round filtering and restores every parsed entry without losing data or duplicating cards.
4. **Local filtering:** Changing the round or choosing “All fixtures” does not issue another fixture API request. FixturePage derives visible fixtures from the complete original dataset and selection without maintaining a filtered response copy.
5. **Responsive overflow:** At narrow and wide viewports, round controls remain usable. When items exceed the available space, the control scrolls horizontally, every option remains reachable, and the filter does not cause horizontal page overflow.
6. **Initial state and transitions:** FixturePage initializes selection to “All fixtures” and supplies it to RoundFilter. Only one round can be selected at a time; choosing another round replaces the previous round selection. Activating the selected item does not leave the control without a selection.
7. **Presentation preservation:** Existing match and bye cards retain their content and relative response order within the displayed selection. Existing loading, error, empty-success, and rendering-error handling remain distinct from filtered results.
8. **Round ordering:** Phases follow API response order. Within each phase, round names use natural sorting, with Round 2 before Round 10; match order remains unchanged.
9. **Component boundary:** RoundFilter uses shadcn Radix Toggle Group to render the supplied option list and report selections. FixturePage owns option preparation, selected-round state, fixture data, and filtering. The control has no duplicate selection state, request logic, or fixture-filtering logic.
10. **Control visibility:** The control is hidden during loading and request errors. It is shown after every successful load, including a response with no fixtures or rounds.
11. **Empty round:** Selecting an available round with no entries shows a clear round-specific no-results message and leaves “All fixtures” available, consistent with the base brief.

These are acceptance criteria, not invented automated tests or claims of verification. No tests, test fixtures, test infrastructure, or application implementation are created by this document.

## Trade-offs and evidence limits

Deriving options from flattened fixtures cannot expose empty rounds. Preserving the full round list supports the approved coverage but changes the response adaptation boundary. The approved coverage requires preserving that metadata; deriving choices solely from existing flattened fixtures is insufficient.

Scrolling keeps all round items accessible in limited width, with horizontal overflow approved. Natural sorting within each phase is approved; phase order remains the API response order. A read-only check of the documented API during this discussion found Round 1–Round 23 in the first phase and Finals Round 1–Finals Round 4 in the second, with no names repeated across phases. This observation does not establish future responses. Empty-round occurrence and browser interaction have not been verified for this definition. Historical counts in the base brief are not acceptance limits.
