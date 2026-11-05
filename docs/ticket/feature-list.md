# Fixture list with local data — first release draft

## User and outcome

As an AFL follower, I want to see all fixtures listed on the page so I can scan when and where teams play and see their scores.

## Current behavior and evidence

[FixturePage](../../src/features/fixtures/components/FixturePage.tsx) currently shows a heading and placeholder text. [App](../../src/App.tsx) renders it within the existing header/main/footer shell. No match list or fixture data source is implemented.

The [base fixture brief](../fixture-feature.md) defines the broader fixture feature, including API integration and round filtering. This ticket delivers a smaller increment using hard-coded local data. Its older description of the Vite starter is superseded by the current source cited above.

The supplied API sample is described in the base brief as `phases[].rounds[].matches[]`. Standard matches contain `date.utcMatchStart`, `squads.home` and `squads.away` with name/code/score, and `venue.name`. The sample includes 207 completed matches and 18 bye records. It has no examples of upcoming matches with unknown scheduling or opponents. Do not invent additional API fields or treat every entry as a played match.

## Confirmed scope

- Replace the main-content placeholder with a list of all standard matches in the selected local dataset.
- Use hard-coded data for this increment; connect the fixture API later.
- Carry forward date/time in GMT, home/away team names and logos, both scores, and venue from the base brief.
- Use the existing React/TypeScript, shadcn/Tailwind foundation and feature-oriented ownership paths.
- Design for 320 px mobile width first and retain usability as the viewport expands.

## Proposed release boundary

The following proposals need the user's answers below; they are not approved decisions:

- Use the previously supplied completed 2019 season response as the local dataset, preserving its match IDs and enclosing round information. This avoids inventing match records and keeps the later API transition grounded in the known response.
- Show every standard match in one scrollable page, grouped under the API's round names in phase/round response order; preserve match order within each round. No pagination or round filter in this increment.
- Defer bye presentation as an improvement. Exclude `status.code: "BYE"` entries from the standard match list and match count.
- Use the existing logo URL template from the base brief, substituting each squad's code. Fixture records remain local, while logo images may require network access.
- Format scores as goals.behinds (total points), for example `9.10 (64)`, as proposed in the base brief.

## Behavior and data boundaries

Keep the local dataset separate from rendering components under `src/features/fixtures/`. Retain enough source information to identify each standard match, round, both squads, UTC kickoff, score, and venue. Do not introduce an API client or fabricate an API contract for local data.

Render the displayed date and time from `date.utcMatchStart` in GMT, with an explicit GMT label. Do not label the venue-local `startDate`/`startTime` values as GMT. Keep home/away identity and each score associated with the correct team.

Team names remain readable when an image cannot load. A missing or failed logo must not remove the match or show a misleading opponent. Numeric zero is a valid score value.

Since the fixture data is synchronous and local, API loading, request-error, and retry states are outside this increment. A local dataset with no standard matches should show a clear empty-list message.

## Observable acceptance criteria

Criteria relying on the release-boundary proposals remain draft until those proposals are approved.

1. **List completeness:** Opening the fixture page displays each standard match in the approved local dataset exactly once. No standard match is omitted because it belongs to a different round or phase. If the full supplied sample is chosen, 207 matches are displayed.
2. **Required details:** Each match displays its GMT kickoff date/time, home and away team names, team logos when available, each team's score, and venue. Home/away identity and score association are unambiguous.
3. **GMT consistency:** The same match displays the same GMT date/time when the browser's local time zone changes. The visible time is labelled GMT.
4. **Organization (proposed):** Round headings use the dataset's round names, including finals names. Round and match order follow the source response. The first release shows all standard matches without a round-selection control or pagination.
5. **Scores (proposed):** Each score displays the supplied goals, behinds, and total points as `goals.behinds (points)`. A value of zero is rendered rather than treated as missing.
6. **Logo resilience:** A failed logo request leaves the team name and other match details visible and the layout usable. Logo URLs use the squad code and the base brief's documented template, unless local assets are selected below.
7. **Empty local dataset:** If the local dataset contains no standard matches, the list region displays a clear empty message instead of blank content or a runtime error.
8. **Mobile-first usability:** Starting at 320 px and widening through mobile, tablet, and desktop sizes, match details remain readable without clipped content, overlap, or horizontal page scrolling. The existing header and footer remain usable around the list.
9. **Accessible structure:** The fixture region has a heading and semantic list/group structure. Team names, scores, and dates are available as text; logos are not the only way to identify teams. Heading levels follow the existing page heading hierarchy.
10. **Local source boundary:** All fixture records are supplied locally; viewing the page makes no fixture API request. Dataset and rendering modules remain separate within the fixture feature. No unrelated dependencies are introduced.
11. **Scope preservation:** Round/team/venue filters, API request states, and bye rendering are absent from this increment if the proposed boundary is approved. Existing application shell behavior is preserved.

## Consequential open questions

1. **Dataset size:** Should local data contain the full supplied 2019 season or a representative subset? **Proposed default:** full supplied response, displaying its 207 standard matches and excluding 18 bye records from the standard list.
2. **Round navigation:** Does this ticket include round filtering, or only the all-fixtures list? **Proposed default:** list only, grouped by round; filtering remains a later increment. This deliberately narrows the broader base brief.
3. **Logo source:** May this local-data increment load logos from the documented S3 URL, or must it work without external image requests? **Proposed default:** use the existing remote logo source and keep team text visible if images fail.

## Exclusions and trade-offs

API integration, asynchronous request handling, filters, match detail pages, bye display, documentation changes outside this file, and new dependencies are excluded from the proposed scope. A full local season gives realistic list size and round coverage, but does not validate the endpoint, CORS, or network error behavior. Remote logos preserve the documented source while making images dependent on connectivity.
