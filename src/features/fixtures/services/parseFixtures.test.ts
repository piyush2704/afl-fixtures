import { describe, expect, it } from 'vitest'
import { apiResponse, bye, match } from '@/test/fixtures'
import { parseFixtures } from './parseFixtures'

function payload(entry: unknown) {
  return { phases: [{ rounds: [{ name: 'Round 1', matches: [entry] }] }] }
}

describe('parseFixtures', () => {
  it('flattens every phase/round in response order and retains empty rounds', () => {
    const result = parseFixtures(apiResponse())
    expect(result.fixtures.map(f => f.id)).toEqual([101, 102, 103, 104, 105])
    expect(result.roundNamesByPhase).toEqual([['Round 2', 'Round 1', 'Empty Round'], ['Finals Round 1']])
  })

  it('uses the enclosing round name rather than a match field or roundOrder', () => {
    const result = parseFixtures(payload(match({ roundName: 'Wrong round', roundOrder: 9 })))
    expect(result.fixtures[0].roundName).toBe('Round 1')
    expect(result.fixtures[0].roundOrder).toBe(9)
  })

  it('accepts bye entries without an away team, score, venue, or kickoff', () => {
    const result = parseFixtures(payload(bye))
    expect(result.fixtures).toHaveLength(1)
    expect(result.fixtures[0].status.code).toBe('BYE')
    expect(result.fixtures[0].squads.away).toBeUndefined()
    expect(result.fixtures[0].venue).toBeUndefined()
  })

  it('accepts zero scores', () => {
    expect(parseFixtures(payload(match())).fixtures[0].squads.home.score?.points).toBe(0)
  })

  it.each([
    { phases: [] },
    { phases: [{ rounds: [] }] },
    { phases: [{ rounds: [{ name: 'Empty Round', matches: [] }] }] },
  ])('accepts valid empty collections', value => {
    expect(parseFixtures(value).fixtures).toEqual([])
  })

  it.each([
    null, [], 'wrong', {}, { phases: {} }, { phases: [null] },
    { phases: [{ rounds: {} }] },
    { phases: [{ rounds: [{ name: 1, matches: [] }] }] },
    { phases: [{ rounds: [{ name: 'Round 1', matches: null }] }] },
  ])('rejects incompatible response structure: %j', value => {
    expect(() => parseFixtures(value)).toThrow()
  })

  it.each([
    match({ date: undefined }),
    match({ venue: undefined }),
    match({ squads: { home: match().squads.home } }),
    match({ date: { utcMatchStart: 'not-a-date', startDate: '', startTime: '' } }),
    match({ squads: { ...match().squads, home: { ...match().squads.home, score: undefined } } }),
    match({ squads: { ...match().squads, home: { ...match().squads.home, score: { goals: NaN, behinds: 0, points: 0 } } } }),
  ])('rejects incomplete or invalid non-bye entries rather than dropping them', entry => {
    expect(() => parseFixtures(payload(entry))).toThrow()
  })
})
