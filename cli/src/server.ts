import Fastify from 'fastify'
import type { Config } from './config/schema.js'
import { Store } from './storage/store.js'
import { aggregate, filterByYear } from './aggregate.js'

/**
 * Read-only HTTP API. Anyone self-hosting points their frontend at this.
 *   GET /activity        -> full aggregated payload (frontend-ready)
 *   GET /activity?year=  -> filter to a calendar year (or year=last)
 *   GET /health          -> liveness + source freshness
 */
export async function serve(config: Config, store: Store) {
  const app = Fastify({ logger: false })

  const allowedOrigins = config.server.cors
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
  app.addHook('onSend', async (req, reply) => {
    const origin = req.headers.origin
    if (allowedOrigins.includes('*')) {
      reply.header('Access-Control-Allow-Origin', '*')
    } else if (origin && allowedOrigins.includes(origin)) {
      reply.header('Access-Control-Allow-Origin', origin)
    }
    reply.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
  })
  app.options('*', async (_req, reply) => reply.code(204).send())

  app.get('/health', async () => {
    const sources = store.allSources()
    return {
      ok: true,
      sources: sources.map((s) => ({ key: s.key, updatedAt: s.updatedAt })),
    }
  })

  app.get('/activity', async (req) => {
    const payload = aggregate(config, store)
    const year = (req.query as { year?: string }).year
    payload.contributions = filterByYear(payload.contributions, year)
    return payload
  })

  // Lean shape identical to the existing portfolio graph ({date,count,level}).
  app.get('/contributions', async (req) => {
    const payload = aggregate(config, store)
    const year = (req.query as { year?: string }).year
    const rows = filterByYear(payload.contributions, year)
    return {
      total: rows.reduce((s, d) => s + d.count, 0),
      contributions: rows.map((d) => ({ date: d.date, count: d.count, level: d.level })),
    }
  })

  const port = config.server.port
  await app.listen({ port, host: '0.0.0.0' })
  console.log(`[serve] actiwitee API on http://localhost:${port}`)
  console.log(`        GET /activity  GET /contributions  GET /health`)
}
