import type { Fixture, FixtureData } from '../types'

function requireObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('The fixture API returned an unexpected response.')
  }
  return value as Record<string, unknown>
}

export function parseFixtures(value: unknown): FixtureData {
  const response = requireObject(value)
  if (!Array.isArray(response.phases)) throw new Error('The fixture API returned no phases collection.')

  const roundNamesByPhase: string[][] = []
  const fixtures = response.phases.flatMap(phase => {
    const { rounds } = requireObject(phase)
    if (!Array.isArray(rounds)) throw new Error('The fixture API returned an invalid rounds collection.')
    const roundNames: string[] = []
    roundNamesByPhase.push(roundNames)
    return rounds.flatMap(round => {
      const { matches, name } = requireObject(round)
      if (!Array.isArray(matches) || typeof name !== 'string') throw new Error('The fixture API returned an invalid round.')
      roundNames.push(name)
      return matches.map(match => {
        const entry = requireObject(match)
        const status = requireObject(entry.status)
        const squads = requireObject(entry.squads)
        const home = requireObject(squads.home)
        if (typeof entry.id !== 'number' || typeof status.code !== 'string' || typeof home.name !== 'string') throw new Error('The fixture API returned an invalid match.')
        if (status.code !== 'BYE') {
          const away = requireObject(squads.away)
          const date = requireObject(entry.date)
          const venue = requireObject(entry.venue)
          if (typeof away.name !== 'string' || typeof venue.name !== 'string' || typeof date.utcMatchStart !== 'string' || !Number.isFinite(Date.parse(date.utcMatchStart))) throw new Error('The fixture API returned incomplete match details.')
          for (const team of [home, away]) {
            const score = requireObject(team.score)
            if (![score.goals, score.behinds, score.points].every(value => typeof value === 'number' && Number.isFinite(value))) throw new Error('The fixture API returned invalid scores.')
          }
        }
        return { ...entry, roundName: name } as unknown as Fixture
      })
    })
  })
  return { fixtures, roundNamesByPhase }
}
