import type { Fixture, FixtureData, Squad } from '../features/fixtures/types'

export const alpha: Squad = { id: 1, code: 'ALPHA', name: 'Alpha', score: { goals: 0, behinds: 0, points: 0 } }
export const beta: Squad = { id: 2, code: 'BETA', name: 'Beta', score: { goals: 1, behinds: 1, points: 7 } }
export const gamma: Squad = { id: 3, code: 'GAMMA', name: 'Gamma', score: { goals: 2, behinds: 1, points: 13 } }
export const east = { id: 10, code: 'EAST', name: 'East Ground', timeZone: 'UTC' }
export const west = { id: 20, code: 'WEST', name: 'West Ground', timeZone: 'UTC' }

export function match(overrides: Partial<Fixture> = {}): Fixture {
  return {
    id: 101,
    roundName: 'Round 2',
    roundOrder: 1,
    status: { id: 1, code: 'COMP', name: 'Complete', typeId: 1, typeName: 'Complete' },
    type: { id: 1, code: 'REG', name: 'Regular Season' },
    squads: { home: alpha, away: beta },
    date: { utcMatchStart: '2020-01-02T12:00:00Z', startDate: '2020-01-02', startTime: '12:00:00' },
    venue: east,
    ...overrides,
  }
}

export const bye = match({
  id: 104,
  roundName: 'Round 1',
  status: { id: 2, code: 'BYE', name: 'Bye', typeId: 2, typeName: 'Unscheduled' },
  squads: { home: { id: alpha.id, code: alpha.code, name: alpha.name } },
  venue: undefined,
  date: undefined,
})

export function fixtureData(): FixtureData {
  return {
    fixtures: [
      match(),
      match({ id: 102, roundName: 'Round 1', squads: { home: gamma, away: alpha }, venue: west }),
      match({ id: 103, roundName: 'Round 1', squads: { home: beta, away: gamma } }),
      bye,
      match({ id: 105, roundName: 'Finals Round 1', squads: { home: gamma, away: beta }, venue: west }),
    ],
    roundNamesByPhase: [['Round 2', 'Round 1', 'Empty Round'], ['Finals Round 1']],
  }
}

export function apiResponse() {
  const data = fixtureData()
  return {
    phases: data.roundNamesByPhase.map(names => ({
      rounds: names.map(name => ({ name, matches: data.fixtures.filter(fixture => fixture.roundName === name) })),
    })),
  }
}
