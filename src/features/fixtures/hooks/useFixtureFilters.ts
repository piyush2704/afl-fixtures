import { useState } from 'react'
import type { FixtureData, TeamOption, VenueOption } from '../types'

/**
 * Owns round, team, and venue selections and derives options and visible fixtures.
 * The caller fetches and stores the complete parsed data; this hook does not
 * fetch, mutate the input, or persist selection across unmounts.
 * Selection survives re-renders and data updates without being reset.
 *
 * @param data - Complete parsed fixtures and round names grouped by phase.
 * Empty data is supported while the caller is loading.
 * @returns `rounds`: unique round names, naturally sorted within API phase order;
 * `selectedRound`: the original round name, or null for "All fixtures";
 * `teams`: distinct teams from the complete data, alphabetically sorted;
 * `selectedTeamIds`: selected IDs, or an empty list for no team restriction;
 * `venues`: distinct venues from the complete data, alphabetically sorted;
 * `selectedVenueIds`: selected IDs, or an empty list for no venue restriction;
 * `visibleFixtures`: matching entries in response order; byes are included only
 * with "All fixtures", no active venue restriction, and matching selected teams;
 * `selectRound`: selects an available original round name, or null to clear it;
 * `selectTeams`: replaces selected team IDs, preserving other filters;
 * `selectVenues`: replaces selected venue IDs, preserving other filters;
 * `resetFilters`: clears teams/venues and returns selection to "All fixtures".
 * An unavailable round name produces no matches; it is not validated or cleared.
 *
 * @example
 * const { rounds, selectedRound, visibleFixtures, selectRound } = useFixtureFilters(data)
 * // Pass rounds, selectedRound, and selectRound to RoundFilter.
 * // Render visibleFixtures; keep loading and error handling in the page.
 */
export function useFixtureFilters(data: FixtureData) {
  const [selectedRound, selectRound] = useState<string | null>(null)
  const [selectedTeamIds, selectTeams] = useState<number[]>([])
  const [selectedVenueIds, selectVenues] = useState<number[]>([])

  const rounds = [...new Set(data.roundNamesByPhase.flatMap(names =>
    [...names].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  ))]
  const teamsById = new Map<number, TeamOption>()
  const venuesById = new Map<number, VenueOption>()
  for (const fixture of data.fixtures) {
    if (fixture.venue) {
      venuesById.set(fixture.venue.id, { id: fixture.venue.id, name: fixture.venue.name })
    }
    for (const team of [fixture.squads.home, fixture.squads.away]) {
      if (team) teamsById.set(team.id, { id: team.id, name: team.name })
    }
  }
  const teams = [...teamsById.values()].sort((a, b) => a.name.localeCompare(b.name))
  const venues = [...venuesById.values()].sort((a, b) => a.name.localeCompare(b.name))

  const visibleFixtures = data.fixtures.filter(fixture => {
    if (selectedRound !== null) {
      if (fixture.roundName !== selectedRound || fixture.status.code === 'BYE') return false
    }
    if (selectedVenueIds.length > 0) {
      if (!fixture.venue || !selectedVenueIds.includes(fixture.venue.id)) return false
    }
    if (selectedTeamIds.length === 0) return true
    return selectedTeamIds.includes(fixture.squads.home.id) ||
      (fixture.squads.away !== undefined && selectedTeamIds.includes(fixture.squads.away.id))
  })

  function resetFilters() {
    selectRound(null)
    selectTeams([])
    selectVenues([])
  }

  return {
    rounds, teams, venues, selectedRound, selectedTeamIds, selectedVenueIds,
    visibleFixtures, selectRound, selectTeams, selectVenues, resetFilters,
  }
}
