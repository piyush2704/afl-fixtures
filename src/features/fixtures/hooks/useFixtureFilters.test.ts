import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { alpha, beta, east, fixtureData, gamma, match, west } from '@/test/fixtures'
import { useFixtureFilters } from './useFixtureFilters'

function setup() {
  return renderHook(() => useFixtureFilters(fixtureData()))
}

describe('useFixtureFilters', () => {
  it('starts unrestricted and includes every entry in response order, including byes', () => {
    const { result } = setup()
    expect(result.current.selectedRound).toBeNull()
    expect(result.current.selectedTeamIds).toEqual([])
    expect(result.current.selectedVenueIds).toEqual([])
    expect(result.current.visibleFixtures.map(f => f.id)).toEqual([101, 102, 103, 104, 105])
  })

  it('preserves round response order, empty rounds and finals, removing duplicate names', () => {
    const data = fixtureData()
    data.roundNamesByPhase[1].push('Round 1')
    const { result } = renderHook(() => useFixtureFilters(data))
    expect(result.current.rounds).toEqual(['Round 2', 'Round 1', 'Empty Round', 'Finals Round 1'])
  })

  it('collects distinct alphabetical options from both squad positions and all available venues', () => {
    const { result } = setup()
    expect(result.current.teams).toEqual([
      { id: 1, name: 'Alpha' }, { id: 2, name: 'Beta' }, { id: 3, name: 'Gamma' },
    ])
    expect(result.current.venues).toEqual([{ id: 10, name: 'East Ground' }, { id: 20, name: 'West Ground' }])
  })

  it('includes teams found only away or in bye entries in the available options', () => {
    const data = fixtureData()
    data.fixtures = [match({ squads: { home: beta, away: gamma } }), data.fixtures[3]]
    const { result } = renderHook(() => useFixtureFilters(data))
    expect(result.current.teams.map(t => t.id)).toEqual([1, 2, 3])
  })

  it.each([
    { round: 'Round 1', ids: [102, 103] },
    { round: 'Round 2', ids: [101] },
    { round: 'Finals Round 1', ids: [105] },
    { round: 'Empty Round', ids: [] },
  ])('filters $round, excluding byes', ({ round, ids }) => {
    const { result } = setup()
    act(() => result.current.selectRound(round))
    expect(result.current.visibleFixtures.map(f => f.id)).toEqual(ids)
  })

  it('matches selected teams at home, away and in byes under All fixtures', () => {
    const { result } = setup()
    act(() => result.current.selectTeams([alpha.id]))
    expect(result.current.visibleFixtures.map(f => f.id)).toEqual([101, 102, 104])
  })

  it('uses OR across teams without duplicating a match with two selected participants', () => {
    const { result } = setup()
    act(() => result.current.selectTeams([beta.id, gamma.id]))
    expect(result.current.visibleFixtures.map(f => f.id)).toEqual([101, 102, 103, 105])
  })

  it('uses OR across venues and excludes entries without venues', () => {
    const { result } = setup()
    act(() => result.current.selectVenues([west.id]))
    expect(result.current.visibleFixtures.map(f => f.id)).toEqual([102, 105])
    act(() => result.current.selectVenues([east.id, west.id]))
    expect(result.current.visibleFixtures.map(f => f.id)).toEqual([101, 102, 103, 105])
  })

  it('combines round, team and venue with AND and preserves the other selections', () => {
    const { result } = setup()
    act(() => {
      result.current.selectTeams([gamma.id])
      result.current.selectVenues([west.id])
      result.current.selectRound('Round 1')
    })
    expect(result.current.visibleFixtures.map(f => f.id)).toEqual([102])
    expect(result.current.selectedTeamIds).toEqual([3])
    expect(result.current.selectedVenueIds).toEqual([20])
    act(() => result.current.selectRound(null))
    expect(result.current.visibleFixtures.map(f => f.id)).toEqual([102, 105])
    expect(result.current.selectedTeamIds).toEqual([3])
    expect(result.current.selectedVenueIds).toEqual([20])
  })

  it('returns no matches for incompatible selections without removing options', () => {
    const { result } = setup()
    const teams = result.current.teams
    const venues = result.current.venues
    act(() => {
      result.current.selectRound('Round 1')
      result.current.selectTeams([alpha.id])
      result.current.selectVenues([east.id])
    })
    expect(result.current.visibleFixtures).toEqual([])
    expect(result.current.teams).toEqual(teams)
    expect(result.current.venues).toEqual(venues)
  })

  it('clearing teams preserves a specific round and does not restore its byes', () => {
    const { result } = setup()
    act(() => {
      result.current.selectRound('Round 1')
      result.current.selectTeams([alpha.id])
    })
    act(() => result.current.selectTeams([]))
    expect(result.current.selectedRound).toBe('Round 1')
    expect(result.current.visibleFixtures.map(f => f.id)).toEqual([102, 103])
  })

  it('clearing the round restores selected-team byes unless a venue restriction is active', () => {
    const { result } = setup()
    act(() => {
      result.current.selectTeams([alpha.id])
      result.current.selectRound('Round 1')
    })
    expect(result.current.visibleFixtures.map(f => f.id)).toEqual([102])
    act(() => result.current.selectRound(null))
    expect(result.current.visibleFixtures.map(f => f.id)).toEqual([101, 102, 104])
    act(() => result.current.selectVenues([east.id]))
    expect(result.current.visibleFixtures.map(f => f.id)).toEqual([101])
    act(() => result.current.selectVenues([]))
    expect(result.current.visibleFixtures.map(f => f.id)).toEqual([101, 102, 104])
  })

  it('reset clears every restriction and restores the complete data including byes', () => {
    const { result } = setup()
    act(() => {
      result.current.selectRound('Round 1')
      result.current.selectTeams([alpha.id])
      result.current.selectVenues([west.id])
    })
    act(() => result.current.resetFilters())
    expect(result.current.selectedRound).toBeNull()
    expect(result.current.selectedTeamIds).toEqual([])
    expect(result.current.selectedVenueIds).toEqual([])
    expect(result.current.visibleFixtures.map(f => f.id)).toEqual([101, 102, 103, 104, 105])
  })

  it('refreshes options and results while preserving selections when data changes', () => {
    const { result, rerender } = renderHook(data => useFixtureFilters(data), { initialProps: fixtureData() })
    act(() => {
      result.current.selectRound('Round 1')
      result.current.selectTeams([alpha.id])
      result.current.selectVenues([west.id])
    })
    const updated = fixtureData()
    updated.fixtures = [match({ id: 200, roundName: 'Round 1', venue: west })]
    rerender(updated)
    expect(result.current.visibleFixtures.map(f => f.id)).toEqual([200])
    expect(result.current.selectedRound).toBe('Round 1')
    expect(result.current.selectedTeamIds).toEqual([1])
    expect(result.current.selectedVenueIds).toEqual([20])
    expect(result.current.teams.map(t => t.id)).toEqual([1, 2])
    expect(result.current.venues.map(v => v.id)).toEqual([20])
    rerender({ fixtures: [], roundNamesByPhase: [] })
    expect(result.current.visibleFixtures).toEqual([])
    expect(result.current.selectedTeamIds).toEqual([1])
    expect(result.current.selectedVenueIds).toEqual([20])
    expect(result.current.selectedRound).toBe('Round 1')
  })

  it('handles empty data and does not mutate the supplied data when selecting filters', () => {
    const data = fixtureData()
    const original = structuredClone(data)
    const { result } = renderHook(() => useFixtureFilters(data))
    act(() => result.current.selectTeams([1]))
    expect(data).toEqual(original)
    const empty = renderHook(() => useFixtureFilters({ fixtures: [], roundNamesByPhase: [] }))
    expect(empty.result.current.teams).toEqual([])
    expect(empty.result.current.venues).toEqual([])
    expect(empty.result.current.rounds).toEqual([])
    expect(empty.result.current.visibleFixtures).toEqual([])
  })
})
