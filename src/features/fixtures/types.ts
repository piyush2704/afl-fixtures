export interface Squad {
  code: string
  name: string
  id: number
  score?: { goals: number; behinds: number; points: number }
}

export interface Fixture {
  id: number
  roundName: string
  roundOrder: number
  status: { code: string; name: string; id: number; typeId: number; typeName: string }
  type: { id: number; name: string; code: string }
  squads: { home: Squad; away?: Squad }
  date?: { utcMatchStart: string; startDate: string; startTime: string }
  venue?: { id: number; code: string; name: string; timeZone: string }
}
