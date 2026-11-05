import { fixtures } from '../data/fixtures'
import { FixtureCard } from './FixtureCard'

export function FixturePage() {
  return <section aria-labelledby="fixture-heading" className="space-y-6">
    <h2 id="fixture-heading" className="text-lg font-medium">Fixture schedule</h2>
    {fixtures.length ? <ul className="mx-auto flex w-full flex-col gap-5">{fixtures.map(fixture => <li key={fixture.id}><FixtureCard fixture={fixture} /></li>)}</ul> : <p className="text-muted-foreground">No fixtures available.</p>}
  </section>
}
