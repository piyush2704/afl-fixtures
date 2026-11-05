# Filter fixtures by team — first-release draft

## User and outcome

As an AFL follower, I want to filter fixtures by team name and choose from all distinct teams available in the fixture data, so I can find that team’s entries without scanning the entire schedule.

## Current behavior and evidence

[FixturePage](../../src/features/fixtures/components/FixturePage.tsx) fetches fixtures once on mount, stores FixtureData and selectedRound in local React state, derives round options, and filters by roundName without another request. [RoundFilter](../../src/features/fixtures/components/RoundFilter.tsx) is a controlled native radio list with horizontal scrolling. It has no selection state or filtering logic. “All fixtures” currently clears the round selection.

[Fixture types](../../src/features/fixtures/types.ts) expose squads.home and optional squads.away, each with id, code, and name. [parseFixtures](../../src/features/fixtures/services/parseFixtures.ts) returns all parsed entries plus round names grouped by phase. Bye entries can have only a home squad. Runtime validation checks squad names but does not validate every declared squad field, including team IDs and codes.

The [ontology](../ontology/README.md) provides navigation. The [base fixture brief](../fixture-feature.md) deferred team filtering to a later increment; this request defines that increment. The [round-filter brief](rounds-filter.md) contains historical Toggle Group descriptions; current source uses native radios and no Radix, cn, or fade. [fixtureService](../../src/features/fixtures/services/fixtureService.ts) now uses a public base URL and fixture path directly; ontology references to environment configuration predate that change.

## Confirmed requirements

- Let the user filter fixtures by team name.
- Populate the filter with all distinct teams available in the fixture data; do not hard-code a team list.
- Allow multiple teams to be selected through a visible list of labelled native checkboxes.
- Show a match when either its home or away participant is among the selected teams (OR across teams). Show each matching fixture once, including when both participants are selected.
- No selected teams means no team restriction. Do not render an “All teams” option or a “Clear teams” action. Individual checkboxes can be unchecked.
- Add one “Reset filters” action that deselects every team and selects “All fixtures”, restoring the complete parsed fixture response, including byes.
- Combine the active round and team conditions with AND. Changing a round or checking/unchecking teams preserves the other filter. “All fixtures” removes only the round restriction; “Reset filters” clears both selections.
- Bye visibility depends on the round selection: a specific round always excludes byes. With “All fixtures” selected, show all byes when no teams are selected, or only the selected teams’ byes when team selection is active. Standard games match selected teams in either home or away position.
- Define the feature in this file only. Application code remains unchanged during definition.
- Retain the preference established in preceding work for a simple, readable solution using native controls and ordinary className values rather than introducing UI dependencies.

## Proposed first-release behavior — awaiting approval

These proposals are not approved assumptions:

- Start with no teams selected. Display full team names and sort them alphabetically. The initial state and alphabetical ordering await approval; visible native checkboxes and the combined “Reset filters” action are confirmed.
- Place the team selector below the existing round row and above the fixture list. Hide it during loading/request failure, and show it after a successful response; an empty response has no team choices; the exact empty control presentation awaits approval.
- Collect team choices from both home and available away squads across the complete parsed response, including bye-only teams. Keep this option list stable when either filter changes.
- Retain the existing “All fixtures” label for the action that clears only the round filter, preserving selected teams as approved. This changes the visible meaning of “All fixtures” when a team is active; the two controls need clear round/team labels. Renaming that existing item is not approved by this draft.
- Filter locally without new network requests. Keep full response data intact and derive visible entries rather than storing another response copy.
- Keep selection state, team-option preparation, and filtering logic in FixturePage. If a separate TeamFilter component is used, make it controlled and presentational, consistent with RoundFilter. No generic filter framework or global store is proposed.
- Prefer team ID for deduplication and selection, with name as the visible label. Confirm IDs are present and consistent in the data used for implementation before relying on them; if not, resolve identity explicitly rather than silently switching to a name/code fallback. The request does not establish how conflicting IDs/names should be resolved.

## Remaining decisions

Multi-team OR matching, visible native checkboxes, and a combined “Reset filters” action are approved. Individual selection changes preserve the other filter. No selected teams means no team restriction; there is no “All teams” option or “Clear teams” action. Byes appear only under “All fixtures” and respect active team selection.

Initial selection, control placement, alphabetical ordering, team identity, exact loading/empty control behavior, and full-response choice stability remain proposals. The requirement for all distinct teams is confirmed; the proposed implementation derives those choices from the complete response, including both squad positions and bye-only teams. Do not silently narrow that scope based on the displayed results.

## Scope and boundaries

The proposed increment adds team selection and its interaction with the existing round filter. No venue filter, search-as-you-type, team logos in controls, URL persistence, saved preferences, new endpoint, polling, pagination, request retry, card redesign, or kickoff/score changes are included in the proposed first release.

Required data already appears in the squad model. No new API field or backend is specified. Validate the selected identity rule against the actual response before implementation. Preserve existing request cancellation, rendering boundary, card order and presentation, and round-option coverage, including empty rounds.

## Observable acceptance criteria

Criteria depending on proposed behavior remain draft until approved. These are observable outcomes, not invented automated tests or evidence of execution.

1. **Distinct choices:** After a successful load, every distinct team in the approved source scope appears once in the control, using its full name. Teams repeated across matches or in both squad positions do not create duplicate choices. Deduplication follows the approved identity rule.
2. **Team results:** Selecting teams displays standard games where either participant is one of the selected teams; unrelated entries are absent. With “All fixtures” selected, include the selected teams’ bye entries. With a specific round selected, exclude every bye entry. Every matching fixture is displayed once and retains its original response order.
3. **Selection mode and reset:** Multiple teams can remain selected simultaneously. “Reset filters” unchecks every team and selects “All fixtures”, restoring the complete response including byes. No “All teams” option or “Clear teams” action is rendered. Unchecking the last team removes only the team restriction; a selected specific round continues to exclude byes. Initial selection remains a proposal.
4. **Combined filters:** Selecting teams and a round displays only entries matching both conditions. Changing a round preserves selected teams; changing teams preserves the selected round. Selecting “All fixtures” preserves selected teams. “Reset filters” clears both conditions.
5. **Stable choices:** Under the full-response proposal, every available team remains selectable after round or team changes, including when the selected combination produces no entries.
6. **No extra requests:** Changing or clearing the team selection operates on already-fetched data and does not initiate another fixture request or mutate the stored full dataset.
7. **Empty results and recovery:** A valid response with no entries remains distinguishable from an active filter combination with no matches. A no-match combination shows a clear message describing the active team/round context and keeps controls available so users can change or clear selection.
8. **Usability:** Each team uses a labelled native checkbox, and every selected team is visibly identifiable. The control has an accessible team-filter label, can be used with a keyboard, and fits at the existing 320 px mobile baseline and wider viewports without horizontal page overflow. Exact overflow behavior follows the chosen control.
9. **Existing behavior:** Round filtering, regular/finals labels, empty-round options, match/bye cards, logo fallback, loading/request-error states, cancellation, and the fixture rendering boundary remain operational. The approved bye-filtering decision governs which bye entries appear, not their card rendering.
10. **Loading and empty response:** Team-control visibility and the successful-empty option list follow the approved state proposal; unavailable data must not be presented as a successful no-match selection.

## Trade-offs and evidence limits

The approved visible checkbox list exposes choices directly but uses more vertical space. OR matching allows users to follow several teams without requiring those teams to play each other. A match with two selected participants is still shown once. Responsive layout details remain to be finalized.

Keeping all team options visible makes choices predictable but permits empty round/team combinations. AND behavior supports precise browsing. “All fixtures” removes only the round restriction, whereas “Reset filters” clears every selection. Excluding byes for a specific round is an intentional change from current round-only behavior. ID-based identity avoids treating different teams with equal names as one, but current runtime parsing does not establish ID validity.

This draft is based on current source and repository documents. No live API inspection, runtime verification, build, lint, or tests were performed for feature definition. Only documentation whitespace and local-link checks are intended here. No application implementation, new tests, or ontology updates are authorized by creating this brief.
