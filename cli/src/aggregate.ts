import type { Config } from './config/schema.js'
import { Store, type SourceRecord } from './storage/store.js'
import { daysAgo, isoDate, isFullHistory, quantile } from './util.js'

export interface DayActivity {
  date: string
  /** Remote event counts (GitHub commits, CP submissions). Excludes local time. */
  count: number
  level: number
  /** raw weighted score before level bucketing */
  score: number
  /** per-source-type breakdown; `local` is always active minutes */
  breakdown: Record<string, number>
  /** Total local coding minutes for this day (same as breakdown.local when set). */
  localMinutes?: number
}

export interface ActivityPayload {
  generatedAt: string
  rangeDays: number
  totalScore: number
  sources: { key: string; type: string; updatedAt: string; total: number }[]
  contributions: DayActivity[]
}

/** Convert stored heartbeats into per-day active-minute buckets. */
function heartbeatsToMinutes(
  heartbeats: Record<string, number[]>,
  intervalSec: number,
  maxGapSec: number
): Record<string, number> {
  const perDay: Record<string, number> = {}
  for (const times of Object.values(heartbeats)) {
    const sorted = [...times].sort((a, b) => a - b)
    let prev: number | null = null
    for (const t of sorted) {
      // each heartbeat represents up to one interval of activity, capped at maxGap
      const span = prev === null ? intervalSec : Math.min(t - prev, maxGapSec)
      const day = isoDate(new Date(t * 1000))
      perDay[day] = (perDay[day] ?? 0) + span / 60
      prev = t
    }
  }
  return perDay
}

function weightFor(type: string, w: Config['weights']): number {
  switch (type) {
    case 'github':
      return w.github
    case 'leetcode':
      return w.leetcode
    case 'codeforces':
      return w.codeforces
    case 'codechef':
      return w.codechef
    default:
      return 1
  }
}

/**
 * Merge all stored sources + local heartbeats into a unified, level-bucketed
 * activity payload the frontend can render directly.
 */
export function aggregate(config: Config, store: Store): ActivityPayload {
  const sources = store.allSources()
  const w = config.weights
  const days = new Map<string, DayActivity>()

  const ensure = (date: string): DayActivity => {
    let d = days.get(date)
    if (!d) {
      d = { date, count: 0, level: 0, score: 0, breakdown: {} }
      days.set(date, d)
    }
    return d
  }

  // 1) API/collector sources
  for (const src of sources) {
    const weight = weightFor(src.type, w)
    for (const [date, count] of Object.entries(src.buckets)) {
      const d = ensure(date)
      d.count += count
      d.score += count * weight
      d.breakdown[src.type] = (d.breakdown[src.type] ?? 0) + count
    }
  }

  // 2) local session minutes -> weighted per 30 min
  const minutes = heartbeatsToMinutes(
    store.heartbeats(),
    config.agent.interval,
    config.agent.minSessionGap
  )
  for (const [date, mins] of Object.entries(minutes)) {
    if (mins < 0.5) continue
    const d = ensure(date)
    const rounded = Math.round(mins)
    d.breakdown.local = (d.breakdown.local ?? 0) + rounded
    d.localMinutes = (d.localMinutes ?? 0) + rounded
    // Local time affects heatmap level via score only — not mixed into `count`.
    d.score += (mins / 30) * w.local
  }

  let contributions = [...days.values()]
  if (!isFullHistory(config.rangeDays)) {
    const cutoff = isoDate(daysAgo(config.rangeDays))
    contributions = contributions.filter((d) => d.date >= cutoff)
  }
  contributions.sort((a, b) => a.date.localeCompare(b.date))
  assignLevels(contributions, config)

  const totalScore = contributions.reduce((s, d) => s + d.score, 0)
  return {
    generatedAt: new Date().toISOString(),
    rangeDays: config.rangeDays,
    totalScore: Math.round(totalScore),
    sources: sources.map((s: SourceRecord) => ({
      key: s.key,
      type: s.type,
      updatedAt: s.updatedAt,
      total: Object.values(s.buckets).reduce((a, b) => a + b, 0),
    })),
    contributions,
  }
}

function assignLevels(days: DayActivity[], config: Config) {
  const { mode, thresholds } = config.levels
  if (mode === 'fixed') {
    for (const d of days) d.level = bucketFixed(d.score, thresholds)
    return
  }
  // percentile: use non-zero scores to derive adaptive cut points
  const nonzero = days.filter((d) => d.score > 0).map((d) => d.score).sort((a, b) => a - b)
  if (nonzero.length === 0) return
  const cuts = [
    quantile(nonzero, 0.25),
    quantile(nonzero, 0.5),
    quantile(nonzero, 0.75),
    quantile(nonzero, 0.9),
  ]
  for (const d of days) {
    if (d.score <= 0) d.level = 0
    else if (d.score <= cuts[0]) d.level = 1
    else if (d.score <= cuts[1]) d.level = 2
    else if (d.score <= cuts[2]) d.level = 3
    else d.level = 4
  }
}

function bucketFixed(score: number, t: number[]): number {
  if (score <= 0) return 0
  if (score < t[0]) return 1
  if (score < t[1]) return 2
  if (score < t[2]) return 3
  return 4
}

/** Optional calendar-year filter (`last` keeps the full rangeDays window). */
export function filterByYear<T extends { date: string }>(
  rows: T[],
  year: string | undefined
): T[] {
  if (!year || year === 'last') return rows
  return rows.filter((d) => d.date.startsWith(year))
}
