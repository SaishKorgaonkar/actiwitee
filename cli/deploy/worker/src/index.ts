export interface Env {
  ASSETS: R2Bucket
  ALLOWED_ORIGINS: string
}

const ACTIVITY_KEY = 'codepulse/activity.json'

interface ActivityPayload {
  generatedAt: string
  rangeDays: number
  totalScore: number
  sources: { key: string; type: string; updatedAt: string; total: number }[]
  contributions: {
    date: string
    count: number
    level: number
    score?: number
    breakdown?: Record<string, number>
  }[]
}

function corsHeaders(origin: string | null, env: Env): Record<string, string> {
  const allowed = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  if (allowed.includes('*')) {
    headers['Access-Control-Allow-Origin'] = '*'
  } else if (origin && allowed.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }
  return headers
}

function filterByYear<T extends { date: string }>(rows: T[], year: string | null): T[] {
  if (!year || year === 'last') return rows
  return rows.filter((d) => d.date.startsWith(year))
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const cors = corsHeaders(request.headers.get('Origin'), env)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    if (request.method !== 'GET') {
      return Response.json({ error: 'method not allowed' }, { status: 405, headers: cors })
    }

    const obj = await env.ASSETS.get(ACTIVITY_KEY)
    if (!obj) {
      return Response.json(
        { error: 'activity not published yet — run actiwitee publish locally' },
        { status: 503, headers: { ...cors, 'Content-Type': 'application/json' } }
      )
    }

    const payload = (await obj.json()) as ActivityPayload
    const year = url.searchParams.get('year')

    if (url.pathname === '/health') {
      return Response.json(
        {
          ok: true,
          generatedAt: payload.generatedAt,
          sources: payload.sources?.map((s) => ({ key: s.key, updatedAt: s.updatedAt })),
        },
        { headers: { ...cors, 'Content-Type': 'application/json' } }
      )
    }

    if (url.pathname === '/activity') {
      const contributions = filterByYear(payload.contributions ?? [], year)
      return Response.json(
        { ...payload, contributions },
        { headers: { ...cors, 'Content-Type': 'application/json' } }
      )
    }

    if (url.pathname === '/contributions') {
      const rows = filterByYear(payload.contributions ?? [], year)
      return Response.json(
        {
          total: rows.reduce((s, d) => s + d.count, 0),
          contributions: rows.map((d) => ({ date: d.date, count: d.count, level: d.level })),
        },
        { headers: { ...cors, 'Content-Type': 'application/json' } }
      )
    }

    return Response.json({ error: 'not found' }, { status: 404, headers: cors })
  },
}
