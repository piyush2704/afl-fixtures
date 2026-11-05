import { useState } from 'react'
import type { Squad } from '../types'

export function Team({ squad }: { squad: Squad }) {
  const [failed, setFailed] = useState(false)
  const showLogo = Boolean(squad.code) && !failed

  return <div className="flex min-w-0 flex-col items-center gap-3 text-center">
    <div className="flex h-20 w-full items-center justify-center sm:h-24">
      {showLogo ? <img className="h-full max-w-full object-contain" src={`https://react-code-test.s3.ap-southeast-2.amazonaws.com/logos/${encodeURIComponent(squad.code)}.svg`} alt="" onError={() => setFailed(true)} /> : <span className="flex min-h-16 items-center justify-center rounded-lg bg-muted px-2 text-sm font-semibold [overflow-wrap:anywhere]">{squad.name}</span>}
    </div>
    {showLogo && <p className="text-sm font-semibold [overflow-wrap:anywhere] sm:text-base">{squad.name}</p>}
    {squad.score && <p className="text-sm font-medium tabular-nums sm:text-base" aria-label={`${squad.name}: ${squad.score.goals} goals, ${squad.score.behinds} behinds, ${squad.score.points} points`}>{squad.score.goals}.{squad.score.behinds} ({squad.score.points})</p>}
  </div>
}
