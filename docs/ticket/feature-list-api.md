# Fixture list from API — first release draft

## User and outcome

As an AFL follower, I want to see all fixtures available from the API so I can browse the complete schedule and results instead of a fixed local sample.

## Current behavior and evidence

[FixturePage](../../src/features/fixtures/components/FixturePage.tsx) imports ten local records and renders the existing [FixtureCard](../../src/features/fixtures/components/FixtureCard.tsx). Cards support standard matches and byes. [Team](../../src/features/fixtures/components/Team.tsx) uses remote logos with a team-name fallback. [formatKickoff](../../src/features/fixtures/utils/formatKickoff.ts) formats UTC timestamps in the browser's local time zone with a short zone label.

The [base fixture brief](../fixture-feature.md) documents the supplied endpoint and sample response. Its GMT decision and starter description predate the current implementation. This increment preserves the browser-local display and existing card presentation.

## Confirmed decisions

- Replace the fixed local fixture source with all fixtures returned by the supplied API, loading the full response at once without pagination or infinite loading.
- Load on page mount with `useEffect(..., [])`. Cancel or ignore obsolete requests during cleanup. Strict Mode may perform an extra setup/cleanup cycle in development; this must not duplicate the rendered records.
- Use a shadcn Alert with a user-triggered Retry action for API failures, including network/HTTP errors, invalid JSON, and incompatible response shape.
- Create a native React ErrorBoundary for unexpected rendering errors, displaying a readable fallback instead of a blank page. React's native boundary API requires a class component; this is an explicitly approved exception to the functional-component requirement and avoids another dependency. Other components remain functional.
- Catch asynchronous fetch errors explicitly and route them to the API Alert. The rendering boundary does not replace request error handling or guarantee recovery from every browser, event-handler, or asynchronous error.

This approval updates the feature brief; application implementation remains a separate step.

## Proposed first-release scope

- Request `https://0p0s8y841d.execute-api.ap-southeast-2.amazonaws.com/test/react-code-test/fixture` when the fixture page opens.
- Traverse every `phases[].rounds[].matches[]` collection, retaining the enclosing round name required by the current view model. Preserve response phase, round, and match order.
- Show every returned entry, including byes, using the existing cards. Remove the ten-record limit and avoid silently substituting local sample data on failure.
- Show an accessible loading indication, a shadcn Alert with user-triggered retry for API errors, and a distinct empty-success state.
- Keep one centered card per row, home team left and away team right, local kickoff time with zone label at the top, scores and venue, and the existing logo fallback. Bye cards retain the available team and Bye label without fabricated match details.
- Keep filters, automatic polling, pagination, caching across visits, and new dependencies outside this increment.

The decisions above are approved; remaining scope details are carried forward as proposals. This document does not approve a new backend, proxy, or authentication mechanism.

## Contract and integration boundaries

The known sample nests matches under phases and rounds. A standard match has squads, scores, date, and venue; bye records omit opponent, kickoff, score, and venue. The supplied historical sample contains 225 entries: 207 completed matches and 18 byes. These counts are an example, not a production limit or hard-coded assertion.

The live response and browser CORS behavior have not been verified for this draft. Implementation should confirm them before relying on the sample shape. HTTP failure, invalid JSON, or an incompatible response must not be presented as a valid empty schedule. If direct browser access is blocked, report that finding before changing the architecture.

Keep fetching/response adaptation within the fixture feature and retain the existing card boundary. Use the supplied team codes with the existing S3 logo template. Browser-local zone labels may be abbreviations or GMT offsets, depending on the browser and locale.

Only the historical completed/bye sample is evidenced. Handling other statuses, missing non-bye teams, or unscheduled kickoff times needs a representative response and a clarified display decision; do not invent TBC rules or silently drop such entries.

## Draft observable acceptance criteria

1. **Remote source:** Opening the page initiates loading from the documented endpoint. No local sample fixtures are displayed as live API results.
2. **Completeness:** After a valid response, every entry across every returned phase and round is rendered exactly once, without a ten-entry cap. If the supplied historical response is used for validation, the result is 225 cards including 18 byes.
3. **Presentation preservation:** Standard cards retain date/time, both team names/logos, scores, and venue, with home left and away right. Kickoff is converted from `utcMatchStart` to browser-local date/time with a zone label. Bye cards show the available team and Bye label.
4. **Loading:** While the initial request is pending, the page exposes a loading indication instead of claiming there are no fixtures.
5. **Failure and retry:** Network/HTTP failure, invalid JSON, or incompatible response shape produces a persistent shadcn Alert with an understandable failure message and a keyboard-operable Retry action. Activating Retry initiates another attempt; a successful attempt replaces the error with the returned list.
6. **Empty response:** A valid response containing no fixture entries shows “No fixtures available.” This state is distinguishable from loading and failure.
7. **Logo independence:** An image failure leaves the team name visible and does not turn a successful fixture load into a page error.
8. **Responsive/accessibility preservation:** From 320 px through larger viewports, cards remain one per row without clipping, overlap, or horizontal page scrolling. Loading/error text and the retry control are accessible, and retry works with a keyboard.
9. **Unexpected rendering errors:** A native React ErrorBoundary wraps the application tree. If a descendant throws while rendering, it shows a readable fallback instead of a blank screen. The boundary uses the approved class-component exception; ordinary API failures remain in the fixture Alert. No new error-boundary dependency is added.
10. **Scope and lifecycle:** Leaving the page does not allow an obsolete request to overwrite a later page load. No filters, automatic polling, new API endpoints, or new dependencies are introduced.

## Proposed validation steps

- Inspect the successful browser response and confirm the documented nesting and any additional statuses. Compare the rendered count and IDs against the entries in that response, including finals and byes.
- Inspect browser network activity to verify the fixture endpoint is used and local sample data is not substituted.
- Manually validate a pending request, network/HTTP failure, invalid payload, successful retry, and valid empty response using browser request controls or temporary local debugging inputs. Do not commit debugging modifications.
- Check local kickoff rendering in two browser time zones, including a timestamp that crosses a date boundary; check that the zone label is present.
- Exercise a failed logo and verify the existing name fallback.
- Temporarily trigger a descendant rendering error and confirm the native boundary shows its fallback. Separately trigger a rejected fixture request and confirm it shows the fixture Alert rather than the boundary fallback. Remove all temporary debugging changes.
- Verify that Effect cleanup prevents aborted or obsolete requests from updating the list, including the development Strict Mode setup/cleanup cycle.
- Check keyboard retry operation and resize from 320 px through mobile, tablet, and desktop widths with the full response loaded.
- Run existing `npm run build`, `npm run lint`, and `git diff --check` after implementation. Record actual outcomes; no new test cases or testing dependencies are authorized here.

No implementation or runtime validation has been performed as part of drafting this document.

## Most consequential question

Should this increment remain an **all-fixtures list including byes, with round filtering deferred**? Proposed default: yes, preserve the current list behavior and add only API loading, error/retry, and empty states. The broader base brief requires round filtering eventually, but including it here would expand the increment.

## Trade-offs and unresolved evidence

Displaying the complete response gives users all available records but increases page length. Network access and CORS become runtime dependencies; the previous local sample did not validate either. Unknown live statuses or missing fields may require a follow-up decision before implementation can satisfy completeness without misleading presentation.
