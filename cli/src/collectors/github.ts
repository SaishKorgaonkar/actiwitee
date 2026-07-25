import type { GithubSource } from '../config/schema.js'
import { addTo, type CollectResult, type Collector } from './types.js'
import type { Buckets } from '../storage/store.js'
import { daysAgo, isFullHistory } from '../util.js'

/** GitHub GraphQL returns at most ~1 year per contributionsCollection query. */
const CHUNK_DAYS = 364

/**
 * GitHub contributions via the GraphQL API. With a read-only PAT this INCLUDES
 * the account's private contributions (contributionsCollection respects the
 * authenticated user's visibility). Falls back to the public jogruber API when
 * no token is supplied.
 *
 * When `rangeDays <= 0`, fetches from account creation to today in year-sized
 * chunks (full history).
 */
export class GithubCollector implements Collector {
  type = 'github'
  constructor(private sources: GithubSource[]) {}

  async collect(rangeDays: number): Promise<CollectResult[]> {
    const out: CollectResult[] = []
    for (const src of this.sources) {
      const token = src.tokenEnv ? process.env[src.tokenEnv] : undefined
      const buckets = token
        ? await this.viaGraphQL(src.username, token, rangeDays)
        : await this.viaPublic(src.username, rangeDays)
      out.push({ key: `github:${src.id}`, type: this.type, buckets })
    }
    return out
  }

  private async viaGraphQL(
    username: string,
    token: string,
    rangeDays: number
  ): Promise<Buckets> {
    const end = new Date()
    const createdAt = await this.fetchCreatedAt(username, token)
    let start = isFullHistory(rangeDays) ? createdAt : daysAgo(rangeDays)
    if (start < createdAt) start = createdAt

    const buckets: Buckets = {}
    let cursor = new Date(start)

    while (cursor <= end) {
      const chunkEnd = new Date(cursor)
      chunkEnd.setDate(chunkEnd.getDate() + CHUNK_DAYS)
      if (chunkEnd > end) chunkEnd.setTime(end.getTime())

      await this.fetchGraphQLChunk(username, token, cursor, chunkEnd, buckets)

      cursor = new Date(chunkEnd)
      cursor.setDate(cursor.getDate() + 1)
      if (cursor <= end) await sleep(150)
    }

    return buckets
  }

  private async fetchCreatedAt(username: string, token: string): Promise<Date> {
    const query = `query($login:String!) { user(login:$login) { createdAt } }`
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'actiwitee',
      },
      body: JSON.stringify({ query, variables: { login: username } }),
    })
    if (!res.ok) return new Date('2013-01-01')
    const json: any = await res.json()
    const raw = json.data?.user?.createdAt
    return raw ? new Date(raw) : new Date('2013-01-01')
  }

  private async fetchGraphQLChunk(
    username: string,
    token: string,
    from: Date,
    to: Date,
    buckets: Buckets
  ): Promise<void> {
    const query = `
      query($login:String!, $from:DateTime!, $to:DateTime!) {
        user(login:$login) {
          contributionsCollection(from:$from, to:$to) {
            contributionCalendar {
              weeks { contributionDays { date contributionCount } }
            }
          }
        }
      }`
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'actiwitee',
      },
      body: JSON.stringify({
        query,
        variables: { login: username, from: from.toISOString(), to: to.toISOString() },
      }),
    })
    if (!res.ok) {
      throw new Error(`GitHub GraphQL ${res.status} for ${username}: ${await res.text()}`)
    }
    const json: any = await res.json()
    if (json.errors) {
      throw new Error(`GitHub GraphQL error for ${username}: ${JSON.stringify(json.errors)}`)
    }
    const weeks =
      json.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? []
    for (const w of weeks) {
      for (const d of w.contributionDays) {
        if (d.contributionCount > 0) addTo(buckets, d.date, d.contributionCount)
      }
    }
  }

  private async viaPublic(username: string, rangeDays: number): Promise<Buckets> {
    const buckets: Buckets = {}
    const nowYear = new Date().getFullYear()
    const startYear = isFullHistory(rangeDays) ? 2013 : nowYear - 1

    for (let y = startYear; y <= nowYear; y++) {
      const param = !isFullHistory(rangeDays) && y === nowYear ? 'last' : String(y)
      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}?y=${param}`
      )
      if (!res.ok) continue
      const json: any = await res.json()
      for (const c of json.contributions ?? []) {
        if (c.count > 0) buckets[c.date] = c.count
      }
      if (y < nowYear) await sleep(100)
    }
    return buckets
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
