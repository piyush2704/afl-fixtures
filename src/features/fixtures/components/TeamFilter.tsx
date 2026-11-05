import { MultiSelect } from '@/components/ui/multi-select'
import type { TeamOption } from '../types'

interface TeamFilterProps {
  teams: TeamOption[]
  selectedTeamIds: number[]
  onTeamChange: (ids: number[]) => void
}

export function TeamFilter({ teams, selectedTeamIds, onTeamChange }: TeamFilterProps) {
  return (
    <MultiSelect
      id="team-filter-options"
      label="Filter by team"
      options={teams.map(team => ({ value: team.id, label: team.name }))}
      selectedValues={selectedTeamIds}
      onChange={onTeamChange}
      emptyMessage="No teams available."
    />
  )
}
