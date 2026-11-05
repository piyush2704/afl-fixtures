import { useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { Alert } from '@/components/ui/alert'
import { ErrorBoundary } from '@/components/errors/ErrorBoundary'
import { fetchFixtureResponse } from '../services/fixtureService'
import { parseFixtures } from '../services/parseFixtures'
import type { FixtureData } from '../types'
import { FixtureCard } from './FixtureCard'
import { RoundFilter } from './RoundFilter'

export function FixturePage() {
  return <ErrorBoundary><FixturePageContent /></ErrorBoundary>
}

function FixturePageContent() {
  const [data, setData] = useState<FixtureData>({ fixtures: [], roundNamesByPhase: [] })
  const [selectedRound, setSelectedRound] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const controller = new AbortController()

    async function loadFixtures() {
      try {
        const response = await fetchFixtureResponse(controller.signal)
        const data = parseFixtures(response)
        if (!controller.signal.aborted) setData(data)
      } catch (failure) {
        if (!controller.signal.aborted) {
          setError(failure instanceof Error ? failure.message : 'Unable to load fixtures.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadFixtures()
    return () => controller.abort()
  }, [])

  const rounds = [...new Set(data.roundNamesByPhase.flatMap(names =>
    [...names].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  ))]
  const visibleFixtures = selectedRound === null
    ? data.fixtures
    : data.fixtures.filter(fixture => fixture.roundName === selectedRound)

  return <section aria-labelledby="fixture-heading" className="space-y-6">
    <h2 id="fixture-heading" className="text-lg font-medium">Fixture schedule</h2>
    {loading ? (
      <div role="status" className="flex justify-center py-12"><LoaderCircle aria-hidden="true" className="size-8 animate-spin text-blue-800 motion-reduce:animate-none" /><span className="sr-only">Loading fixtures</span></div>
    ) : error ? (
      <Alert><h3 className="font-semibold">Unable to load fixtures</h3><p className="mt-2 text-sm">{error}</p></Alert>
    ) : (
      <>
        <RoundFilter rounds={rounds} selectedRound={selectedRound} onRoundChange={setSelectedRound} />
        {visibleFixtures.length ? (
          <ul className="mx-auto flex w-full flex-col gap-5">
            {visibleFixtures.map(fixture => <li key={fixture.id}><FixtureCard fixture={fixture} /></li>)}
          </ul>
        ) : (
          <p role="status" className="text-muted-foreground">
            {selectedRound === null ? 'No fixtures available.' : `No fixtures available for ${selectedRound}.`}
          </p>
        )}
      </>
    )}
  </section>
}
