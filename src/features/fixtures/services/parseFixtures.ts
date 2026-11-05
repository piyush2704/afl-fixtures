import type { Fixture } from '../types'

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('The fixture API returned an unexpected response.')
  }
  return value as Record<string, unknown>
}

export function parseFixtures(value: unknown): Fixture[] {
  const response = object(value)
  if (!Array.isArray(response.phases)) throw new Error('The fixture API returned no phases collection.')

  return response.phases.flatMap(phase => {
    const { rounds } = object(phase)
    if (!Array.isArray(rounds)) throw new Error('The fixture API returned an invalid rounds collection.')
    return rounds.flatMap(round => {
      const { matches, name } = object(round)
      if (!Array.isArray(matches) || typeof name !== 'string') throw new Error('The fixture API returned an invalid round.')
      return matches.map(match => {
        const entry = object(match)
        const status = object(entry.status)
        const squads = object(entry.squads)
        const home = object(squads.home)
        if (typeof entry.id !== 'number' || typeof status.code !== 'string' || typeof home.name !== 'string') throw new Error('The fixture API returned an invalid match.')
        if (status.code !== 'BYE') {
          const away = object(squads.away)
          const date = object(entry.date)
          const venue = object(entry.venue)
          if (typeof away.name !== 'string' || typeof venue.name !== 'string' || typeof date.utcMatchStart !== 'string' || !Number.isFinite(Date.parse(date.utcMatchStart))) throw new Error('The fixture API returned incomplete match details.')
          for (const team of [home, away]) {
            const score = object(team.score)
            if (![score.goals, score.behinds, score.points].every(v => typeof v === 'number' && Number.isFinite(v))) throw new Error('The fixture API returned invalid scores.')
          }
        }
        return { ...entry, roundName: name } as unknown as Fixture
      })
    })
  })
}
