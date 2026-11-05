import { useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { Alert } from '@/components/ui/alert'
import { ErrorBoundary } from '@/components/errors/ErrorBoundary'
import { fetchFixtureResponse } from '../services/fixtureService'
import { parseFixtures } from '../services/parseFixtures'
import type { Fixture } from '../types'
import { FixtureCard } from './FixtureCard'

export function FixturePage() {
  return <ErrorBoundary><FixturePageContent /></ErrorBoundary>
}

function FixturePageContent() {
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const controller = new AbortController()

    async function loadFixtures() {
      try {
        const response = await fetchFixtureResponse(controller.signal)
        const data = parseFixtures(response)
        if (!controller.signal.aborted) setFixtures(data)
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

  return <section aria-labelledby="fixture-heading" className="space-y-6">
    <h2 id="fixture-heading" className="text-lg font-medium">Fixture schedule</h2>
    {loading ? <div role="status" className="flex justify-center py-12"><LoaderCircle aria-hidden="true" className="size-8 animate-spin text-blue-800 motion-reduce:animate-none" /><span className="sr-only">Loading fixtures</span></div> : error ? <Alert><h3 className="font-semibold">Unable to load fixtures</h3><p className="mt-2 text-sm">{error}</p></Alert> : fixtures.length ? <ul className="mx-auto flex w-full flex-col gap-5">{fixtures.map(fixture => <li key={fixture.id}><FixtureCard fixture={fixture} /></li>)}</ul> : <p className="text-muted-foreground">No fixtures available.</p>}
  </section>
}
