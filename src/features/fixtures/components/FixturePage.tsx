import { Alert } from '@/components/ui/alert'
import { ErrorBoundary } from '@/components/errors/ErrorBoundary'
import { useFixtureFilters } from '../hooks/useFixtureFilters'
import { useFixtures } from '../hooks/useFixtures'
import type { FixtureData } from '../types'
import { FixtureCard } from './FixtureCard'
import { RoundFilter } from './RoundFilter'
import { TeamFilter } from './TeamFilter'
import { VenueFilter } from './VenueFilter'

const emptyFixtureData: FixtureData = { fixtures: [], roundNamesByPhase: [] }

export function FixturePage() {
  return <ErrorBoundary><FixturePageContent /></ErrorBoundary>
}

function FixturePageContent() {
  const { data = emptyFixtureData, isPending, isError, error } = useFixtures()
  const {
    rounds, teams, venues, selectedRound, selectedTeamIds, selectedVenueIds, visibleFixtures,
    selectRound, selectTeams, selectVenues, resetFilters,
  } = useFixtureFilters(data)
  const selectedTeamNames = teams.filter(team => selectedTeamIds.includes(team.id)).map(team => team.name)
  const selectedVenueNames = venues.filter(venue => selectedVenueIds.includes(venue.id)).map(venue => venue.name)
  const emptyMessage = data.fixtures.length === 0
    ? 'No fixtures available.'
    : `No fixtures available${selectedTeamNames.length ? ` for ${selectedTeamNames.join(', ')}` : ''}${selectedVenueNames.length ? ` at ${selectedVenueNames.join(', ')}` : ''}${selectedRound !== null ? ` in ${selectedRound}` : ''}.`

  return <section aria-labelledby="fixture-heading" className="space-y-6">
    <h2 id="fixture-heading" className="text-lg font-medium">Fixture schedule</h2>
    {isPending ? (
      <div role="status" className="flex justify-center py-12"><span aria-hidden="true" className="size-8 animate-spin rounded-full border-4 border-blue-800 border-t-transparent motion-reduce:animate-none" /><span className="sr-only">Loading fixtures</span></div>
    ) : isError ? (
      <Alert><h3 className="font-semibold">Unable to load fixtures</h3><p className="mt-2 text-sm">{error instanceof Error ? error.message : 'Unable to load fixtures.'}</p></Alert>
    ) : (
      <>
        <div className="space-y-3">
          <div className="flex justify-end">
            <button type="button" onClick={resetFilters} className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2">
              Reset filters
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <TeamFilter teams={teams} selectedTeamIds={selectedTeamIds} onTeamChange={selectTeams} />
            <VenueFilter venues={venues} selectedVenueIds={selectedVenueIds} onVenueChange={selectVenues} />
          </div>
        </div>
        <RoundFilter rounds={rounds} selectedRound={selectedRound} onRoundChange={selectRound} />
        {visibleFixtures.length ? (
          <ul className="mx-auto flex w-full flex-col gap-5">
            {visibleFixtures.map(fixture => <li key={fixture.id}><FixtureCard fixture={fixture} /></li>)}
          </ul>
        ) : (
          <p role="status" className="text-muted-foreground">
            {emptyMessage}
          </p>
        )}
      </>
    )}
  </section>
}
