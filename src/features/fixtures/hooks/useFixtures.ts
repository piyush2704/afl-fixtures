import { useQuery } from '@tanstack/react-query'
import { fetchFixtureResponse } from '../services/fixtureService'
import { parseFixtures } from '../services/parseFixtures'

/** Fetches and caches the fixture dataset; filter selections stay local. */
export function useFixtures() {
  return useQuery({
    queryKey: ['fixtures'],
    queryFn: async ({ signal }) => {
      const response = await fetchFixtureResponse(signal)
      return parseFixtures(response)
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  })
}
