import { MultiSelect } from '@/components/ui/multi-select'
import type { VenueOption } from '../types'

interface VenueFilterProps {
  venues: VenueOption[]
  selectedVenueIds: number[]
  onVenueChange: (ids: number[]) => void
}

export function VenueFilter({ venues, selectedVenueIds, onVenueChange }: VenueFilterProps) {
  return (
    <MultiSelect
      id="venue-filter-options"
      label="Filter by venue"
      options={venues.map(venue => ({ value: venue.id, label: venue.name }))}
      selectedValues={selectedVenueIds}
      onChange={onVenueChange}
      emptyMessage="No venues available."
    />
  )
}
