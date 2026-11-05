import { Card, CardContent } from '@/components/ui/card'
import type { Fixture } from '../types'
import { formatKickoff } from '../utils/formatKickoff'
import { Team } from './Team'

export function FixtureCard({ fixture }: { fixture: Fixture }) {
  const bye = fixture.status.code === 'BYE'

  return (
    <Card className="w-full gap-0 overflow-hidden border-t-4 border-t-blue-800 pt-0">
      <div className="flex justify-center">
        <div className="max-w-full rounded-b-xl bg-secondary px-5 py-2 text-center text-sm font-semibold text-secondary-foreground sm:px-10">
          {bye ? 'Bye' : fixture.date && (
            <time dateTime={fixture.date.utcMatchStart}>
              {formatKickoff(fixture.date.utcMatchStart)}
            </time>
          )}
        </div>
      </div>
      <CardContent className="space-y-6 px-4 pt-6 sm:px-6">
        {bye ? (
          <div className="mx-auto max-w-48"><Team squad={fixture.squads.home} /></div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-12">
            <Team squad={fixture.squads.home} />
            {fixture.squads.away && <Team squad={fixture.squads.away} />}
          </div>
        )}
        {!bye && fixture.venue && (
          <p className="text-center text-sm text-muted-foreground">{fixture.venue.name}</p>
        )}
      </CardContent>
    </Card>
  )
}
