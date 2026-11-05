import type { Fixture, FixtureData, Squad } from '../types'

function requireObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('The fixture API returned an unexpected response.')
  }
  return value as Record<string, unknown>
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`The fixture API returned an invalid ${field}.`)
  }
  return value
}

function requireNumber(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`The fixture API returned an invalid ${field}.`)
  }
  return value
}

function parseSquad(value: unknown): Squad {
  const squad = requireObject(value)
  const score = squad.score === undefined ? undefined : requireObject(squad.score)
  return {
    id: requireNumber(squad.id, 'team ID'),
    code: requireString(squad.code, 'team code'),
    name: requireString(squad.name, 'team name'),
    score: score && {
      goals: requireNumber(score.goals, 'goals'),
      behinds: requireNumber(score.behinds, 'behinds'),
      points: requireNumber(score.points, 'points'),
    },
  }
}

function parseMatch(value: unknown, roundName: string): Fixture {
  const match = requireObject(value)
  const status = requireObject(match.status)
  const type = requireObject(match.type)
  const squads = requireObject(match.squads)
  const home = parseSquad(squads.home)
  const away = squads.away === undefined ? undefined : parseSquad(squads.away)
  const venue = match.venue === undefined ? undefined : requireObject(match.venue)
  const date = match.date === undefined ? undefined : requireObject(match.date)
  const statusCode = requireString(status.code, 'status code')

  if (statusCode !== 'BYE' && (!away || !date || !venue || !home.score || !away.score)) {
    throw new Error('The fixture API returned incomplete match details.')
  }

  const parsedDate = date && {
    utcMatchStart: requireString(date.utcMatchStart, 'kickoff'),
    startDate: requireString(date.startDate, 'start date'),
    startTime: requireString(date.startTime, 'start time'),
  }
  if (parsedDate && !Number.isFinite(Date.parse(parsedDate.utcMatchStart))) {
    throw new Error('The fixture API returned an invalid kickoff.')
  }

  return {
    id: requireNumber(match.id, 'match ID'),
    roundName,
    roundOrder: requireNumber(match.roundOrder, 'match order'),
    status: {
      id: requireNumber(status.id, 'status ID'),
      code: statusCode,
      name: requireString(status.name, 'status name'),
      typeId: requireNumber(status.typeId, 'status type ID'),
      typeName: requireString(status.typeName, 'status type name'),
    },
    type: {
      id: requireNumber(type.id, 'match type ID'),
      name: requireString(type.name, 'match type name'),
      code: requireString(type.code, 'match type code'),
    },
    squads: { home, away },
    venue: venue && {
      id: requireNumber(venue.id, 'venue ID'),
      code: requireString(venue.code, 'venue code'),
      name: requireString(venue.name, 'venue name'),
      timeZone: requireString(venue.timeZone, 'venue time zone'),
    },
    date: parsedDate,
  }
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
      if (!Array.isArray(matches)) throw new Error('The fixture API returned an invalid round.')
      const roundName = requireString(name, 'round name')
      roundNames.push(roundName)
      return matches.map(match => parseMatch(match, roundName))
    })
  })
  return { fixtures, roundNamesByPhase }
}
