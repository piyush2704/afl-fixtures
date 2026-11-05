# AFL fixture page — first release

## User and outcome

An AFL follower wants to scan upcoming and completed matches in one place, see the key match details, and narrow the list to a particular round.

## Current behavior

The repository is a React and TypeScript starter. `src/App.tsx` currently renders the Vite starter screen; fixture data and fixture-page behavior are not implemented. The existing stack is React 19, TypeScript 7, and Vite 8 (`package.json`). The project README identifies the fixture API challenge, but says the detailed API contract is still unspecified (`README.md`).

The user provided a representative response in `Pasted text.txt`. It contains `phases[].rounds[].matches[]`; each match belongs to the enclosing round. A match's home/away squads, UTC start time, venue, status, and scores are nested fields (details below). The sample contains 225 entries across 27 rounds in two phases: 207 completed matches and 18 `Bye` entries, which do not have the usual match fields. No literal `TBC` values appear in the sample. It is a completed 2019 season, so it does not establish which incomplete fields may occur in an upcoming fixture response.

## First-release scope

### In scope

- Replace the starter screen with a mobile-first fixture page.
- Fetch and display every match returned by the fixture endpoint:
  `https://0p0s8y841d.execute-api.ap-southeast-2.amazonaws.com/test/react-code-test/fixture`
- Display each match's date, both team names, both team logos, scores, and venue.
- Load team logos using the team code returned by the API:
  `https://react-code-test.s3.ap-southeast-2.amazonaws.com/logos/{code}.svg`
- Let the user filter the fixture by round, including selecting one round (for example, Round 3) and returning to all rounds.
- Display match start times in GMT, regardless of the viewer's local time zone.
- Use functional React components and TypeScript, with a clear, maintainable source organization consistent with the existing project.
- Update `README.md` with the feature, setup/run instructions, data source, and relevant user-facing behavior.
- Provide understandable loading, request-failure, and no-results states.

### Out of scope for the proposed first release

- Venue and team filters. They are listed as extra credit and are deferred to the next increment.
- Other fixture sources, match-detail pages, user accounts, or data editing.
- Introducing a component library or data-fetching library without a demonstrated need.

## Behavior and data

- The response contains competition data at the root. Flatten `phases[].rounds[].matches[]` for display, retaining each match's enclosing phase and round. Round choices come from each enclosing round's `name` (for example, `Round 3` or `Finals Round 1`), not from `match.roundOrder`, which is the match's order within that round.
- In the supplied sample, a standard match has `squads.home` and `squads.away`; each squad has `name`, `code`, and `score.goals`, `score.behinds`, and `score.points`. Venue is `venue.name`; status is `status.name`; the UTC kickoff timestamp is `date.utcMatchStart`.
- Render all standard matches when “All rounds” is selected. A round selection filters to matches in that round; changing it updates the list without another request.
- Build each logo URL from the corresponding squad `code`. A failed logo image should not hide the team's name or the match.
- Format the kickoff from `date.utcMatchStart` in GMT (UTC) regardless of viewer locale. Do not use the local `date.startDate`/`date.startTime` fields for the displayed kickoff.
- The supplied sample includes `status.name: "Bye"` entries with only a home squad and no date, away team, score, or venue. Proposed handling: represent these as a bye entry for the named team, display `Bye` instead of match details that are absent, and retain the associated round filter. Confirm this below.
- Proposed score formatting: show the AFL score as goals.behinds followed by total points, e.g. `9.10 (64)`, using the supplied `score` fields.
- On initial load, show a loading indication. If the request fails, explain that the fixture could not be loaded and provide a retry action. If the response is valid but has no matches, explain that no fixtures are available. If a selected round has no matches, show a round-specific no-results message and allow the user to return to all rounds.

## Acceptance criteria

1. **Load the fixture:** On opening the fixture page, the client requests the fixture endpoint. It extracts matches from every phase and round in the response and presents the standard matches in a list.
2. **Show match details:** Each standard match visibly includes its GMT kickoff date and time, home and away team names and logos, both scores, and venue. Scores use goals.behinds (total points), for example `9.10 (64)`. Team names remain visible if a logo cannot load.
3. **Filter by round:** The page offers an all-rounds selection and a selection for every round represented in all phases, using the response's round names. Selecting a round displays only entries assigned to that round; selecting all rounds restores every entry.
4. **Handle loading and failures:** While the initial request is pending, a loading state is visible. On request failure, a clear error state and retry action are available. Retrying issues another request.
5. **Handle empty results:** A successful response with no matches shows an empty-fixture message. A round with no matching records shows a no-results message and keeps the round selector usable.
6. **Use the provided logo source:** Each team logo request uses the provided S3 logo URL template with that squad's `code` value.
7. **Mobile-first usability:** At a narrow mobile viewport, match details and the round control remain readable and operable without horizontal page scrolling. At a wider viewport, the list remains legible and usable.
8. **Implementation constraints:** The fixture page is implemented with functional React components and TypeScript, and fixture-related code is organized into clear, appropriately named files rather than being accumulated in one oversized component.
9. **README documentation:** `README.md` explains how to install dependencies and run the app, identifies the fixture and logo endpoints, and describes the fixture list and round filter.

## Decisions and assumptions

- **Confirmed:** The required view is a list of all matches; required match details are date, team names, team logos, scores, and venue; round filtering is mandatory. Functional components, TypeScript, good code organization, mobile-first design, and good README documentation are required outcomes.
- **Confirmed:** Venue and team filters are extra credit, not mandatory requirements.
- **Confirmed:** GMT is the time zone for displayed fixture times.
- **Confirmed:** Venue and team filters are deferred to the next increment.
- **Confirmed API shape:** The supplied sample nests matches in `phases[].rounds[].matches[]`; round labels are on the enclosing round; squads are under `squads.home` and `squads.away`; team logo codes are squad `code`; kickoff is `date.utcMatchStart`; venue is `venue.name`; scores are `score.goals`, `score.behinds`, and `score.points`.
- **Proposed assumption:** Round filtering is client-side over the fetched fixture, with “All rounds” selected initially.
- **Proposed assumption:** Display a standard AFL score as goals.behinds (total points), for example `9.10 (64)`.
- **Proposed assumption:** Render API entries with `status.name: "Bye"` as bye entries with the available team and round, rather than treating them as regular match cards.
- **Proposed assumption:** The fixture endpoint can be called directly by the browser. This needs confirmation during implementation (including CORS behavior); if not, the delivery approach must be decided before adding a proxy or backend.
- **Unknown:** The supplied response is a 2019 completed season. Confirm whether the endpoint used by the app returns this same competition/season or a different current fixture; the client should follow the response rather than hard-code season labels.
- **Unknown:** Desired ordering of matches within each round. The sample has `roundOrder`, but its intended ordering/display meaning should be confirmed against the desired page behavior.
- **Proposed first-release boundary:** Deliver fixture display and round filtering. Venue and team filters are explicitly deferred to the next increment.

## Open questions

1. **Bye entries:** The sample contains bye records with no opponent, kickoff, scores, or venue. Is the proposed compact “{team} — Bye” entry acceptable, with these missing match details omitted? (Recommended default: yes, so bye information from the fixture is not silently lost.)

## Trade-offs

Keeping the first release to round filtering meets the mandatory browsing need with less interface and state complexity. Venue and team filters can be added later if the initial release calls for them. Treating loading, error, and empty responses explicitly makes endpoint failures and valid empty schedules distinguishable to users.
