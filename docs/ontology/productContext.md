# Product context

The client helps AFL followers browse match schedules and results. The [base brief](../fixture-feature.md) describes the broader product; the [local-data ticket](../ticket/feature-list.md) and newer [API ticket](../ticket/feature-list-api.md) describe incremental delivery.

Implemented behavior in [FixturePage](../../src/features/fixtures/components/FixturePage.tsx) loads the configured API on mount and renders all parsed entries as a semantic list. Loading, request-error, and successful-empty states are distinct. There is no retry action. A round filter appears below “Fixture schedule” after successful loading, including empty responses; it is hidden during loading and request errors.

[FixtureCard](../../src/features/fixtures/components/FixtureCard.tsx) displays a standard match with home team left, away team right, kickoff, scores, and venue. Entries with status code `BYE` show the home team and Bye label. [Team](../../src/features/fixtures/components/Team.tsx) displays scores as goals.behinds (points) and preserves the team name if its logo fails. [formatKickoff](../../src/features/fixtures/utils/formatKickoff.ts) uses browser-local date/time and a zone label, rather than the GMT behavior in older briefs; this matches the preservation intent of the newer API ticket.

[App](../../src/App.tsx) retains the header/main/footer shell. Fixture rendering errors are contained within the fixture feature, preserving surrounding layout. Responsive classes support one card per row and narrow-screen layouts; viewport behavior was not verified during this refresh.

[RoundFilter](../../src/features/fixtures/components/RoundFilter.tsx) presents “All fixtures” first and allows a single round selection. Regular labels are numbers; finals retain their full API names. Native radio inputs support keyboard selection and horizontal scrolling, without an edge fade. Empty rounds remain selectable and show a round-specific no-results message. Team/venue filters remain deferred. The [root README](../../README.md) still describes a starter and is not an accurate implementation inventory.
