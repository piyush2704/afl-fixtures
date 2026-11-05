interface RoundFilterProps {
  rounds: string[]
  selectedRound: string | null
  onRoundChange: (round: string | null) => void
}

export function RoundFilter({ rounds, selectedRound, onRoundChange }: RoundFilterProps) {
  return (
    <div className="min-w-0 overflow-x-auto p-1">
      <div role="radiogroup" aria-label="Filter fixtures by round" className="flex w-fit items-center gap-1">
        {[null, ...rounds].map(round => (
          <label key={round === null ? 'all' : `round:${round}`} className="relative shrink-0 cursor-pointer">
            <input
              type="radio"
              name="fixture-round"
              value={round === null ? 'all' : `round:${round}`}
              checked={selectedRound === round}
              onChange={() => onRoundChange(round)}
              onFocus={event => event.currentTarget.parentElement?.scrollIntoView({ block: 'nearest', inline: 'nearest' })}
              aria-label={round ?? 'All fixtures'}
              className="peer absolute inset-0 size-full cursor-pointer opacity-0"
            />
            <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium whitespace-nowrap transition-colors hover:bg-muted peer-checked:bg-accent peer-checked:text-accent-foreground peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50">
              {round === null ? 'All fixtures' : round.replace(/^Round (\d+)$/, '$1')}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
