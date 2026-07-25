import type { HandleSource } from '../config/schema.js'
import type { CollectResult, Collector } from './types.js'
import type { Buckets } from '../storage/store.js'
import { isoDate } from '../util.js'

/**
 * CodeChef has no official API. We scrape the heatmap JSON embedded in the
 * profile page. This is best-effort and may break when CodeChef changes markup —
 * failures are non-fatal (source is simply skipped).
 */
export class CodeChefCollector implements Collector {
  type = 'codechef'
  constructor(private sources: HandleSource[]) {}

  async collect(): Promise<CollectResult[]> {
    const out: CollectResult[] = []
    for (const src of this.sources) {
      out.push({
        key: `codechef:${src.id ?? src.username}`,
        type: this.type,
        buckets: await this.scrape(src.username),
      })
    }
    return out
  }

  private async scrape(username: string): Promise<Buckets> {
    const res = await fetch(`https://www.codechef.com/users/${username}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 actiwitee' },
    })
    if (!res.ok) throw new Error(`CodeChef ${res.status} for ${username}`)
    const html = await res.text()
    // CodeChef embeds: var userDailySubmissionsStats = [ {date:"YYYY-MM-DD", value:N, ...}, ... ]
    const m = html.match(/userDailySubmissionsStats\s*=\s*(\[[\s\S]*?\]);/)
    if (!m) return {}
    const buckets: Buckets = {}
    try {
      const arr = JSON.parse(m[1])
      for (const entry of arr) {
        const value = Number(entry.value ?? 0)
        if (!entry.date || value <= 0) continue
        // CodeChef emits unpadded dates like "2025-2-22"; normalize to YYYY-MM-DD.
        const parsed = new Date(entry.date)
        const date = Number.isNaN(parsed.getTime()) ? entry.date : isoDate(parsed)
        buckets[date] = (buckets[date] ?? 0) + value
      }
    } catch {
      return {}
    }
    return buckets
  }
}
