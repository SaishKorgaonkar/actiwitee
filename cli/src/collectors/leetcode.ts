import type { HandleSource } from '../config/schema.js'
import type { CollectResult, Collector } from './types.js'
import type { Buckets } from '../storage/store.js'
import { isoDate } from '../util.js'

/**
 * LeetCode via its public GraphQL endpoint. submissionCalendar is a JSON map of
 * epoch-seconds (UTC day start) -> submission count. No auth needed for public
 * profiles.
 */
export class LeetCodeCollector implements Collector {
  type = 'leetcode'
  constructor(private sources: HandleSource[]) {}

  async collect(): Promise<CollectResult[]> {
    const out: CollectResult[] = []
    for (const src of this.sources) {
      out.push({
        key: `leetcode:${src.id ?? src.username}`,
        type: this.type,
        buckets: await this.fetchCalendar(src.username),
      })
    }
    return out
  }

  private async fetchCalendar(username: string): Promise<Buckets> {
    const query = `
      query($username:String!) {
        matchedUser(username:$username) {
          userCalendar { submissionCalendar }
        }
      }`
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 actiwitee',
        Referer: `https://leetcode.com/${username}/`,
      },
      body: JSON.stringify({ query, variables: { username } }),
    })
    if (!res.ok) throw new Error(`LeetCode ${res.status} for ${username}`)
    const json: any = await res.json()
    const raw = json.data?.matchedUser?.userCalendar?.submissionCalendar
    if (!raw) return {}
    const cal: Record<string, number> = JSON.parse(raw)
    const buckets: Buckets = {}
    for (const [epoch, count] of Object.entries(cal)) {
      const d = new Date(Number(epoch) * 1000)
      buckets[isoDate(d)] = (buckets[isoDate(d)] ?? 0) + Number(count)
    }
    return buckets
  }
}
