# Product context

The intended product lets AFL followers browse fixtures and filter by round. Required match details and future scope are described in the [fixture brief](../fixture-feature.md). These are requirements, not implemented capabilities.

The implemented app is a shell: the header says “AFL Fixtures,” the main region contains “Fixture schedule” and “Fixtures will appear here,” and the footer has no text. See [App](../../src/App.tsx), [header](../../src/components/layout/AppHeader.tsx), [placeholder](../../src/features/fixtures/components/FixturePage.tsx), and [footer](../../src/components/layout/AppFooter.tsx).

The [scaffolding brief](../../doc/ticket/scafolding.md) defines functional TypeScript components, shared layout ownership, shadcn configuration, and a mobile baseline of 320 px that adapts to wider viewports. Source uses responsive spacing and a flexible full-height shell; actual browser resizing has not been validated during ontology generation.

There is currently no fixture retrieval, match display, filtering, or bye handling in the source. Do not describe proposed fixture behavior as delivered. The root [README](../../README.md) supplies challenge context but its starter/setup descriptions should be checked against current source and package configuration.
