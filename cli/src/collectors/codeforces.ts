import type { HandleSource } from '../config/schema.js'
import { addTo, type CollectResult, type Collector } from './types.js'
import type { Buckets } from '../storage/store.js'
import { isoDate } from '../util.js'

/**
 * Codeforces via the official REST API (user.status). Buckets each submission by
 * its local day. Counts accepted + attempted submissions as activity.
 */
export class CodeforcesCollector implements Collector {
  type = 'codeforces'
  constructor(private sources: HandleSource[]) {}

  async collect(): Promise<CollectResult[]> {
    const out: CollectResult[] = []
    for (const src of this.sources) {
      out.push({
        key: `codeforces:${src.id ?? src.username}`,
        type: this.type,
        buckets: await this.fetchStatus(src.username),
      })
    }
    return out
  }

  private async fetchStatus(handle: string): Promise<Buckets> {
    const res = await fetch(
      `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}`
    )
    if (!res.ok) throw new Error(`Codeforces ${res.status} for ${handle}`)
    const json: any = await res.json()
    if (json.status !== 'OK') throw new Error(`Codeforces API: ${json.comment}`)
    const buckets: Buckets = {}
    for (const sub of json.result ?? []) {
      const d = new Date(sub.creationTimeSeconds * 1000)
      addTo(buckets, isoDate(d), 1)
    }
    return buckets
  }
}
