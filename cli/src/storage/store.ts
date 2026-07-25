import fs from 'node:fs'
import path from 'node:path'

/**
 * Daily buckets keyed by ISO date (YYYY-MM-DD) -> raw count for a single source.
 */
export type Buckets = Record<string, number>

export interface SourceRecord {
  /** e.g. "github:personal", "leetcode:default", "local:local-model" */
  key: string
  type: string
  updatedAt: string
  buckets: Buckets
}

interface StoreShape {
  version: 1
  sources: Record<string, SourceRecord>
  /** Raw heartbeat epoch-seconds from the local agent, per category. */
  heartbeats: Record<string, number[]>
}

const EMPTY: StoreShape = { version: 1, sources: {}, heartbeats: {} }

/**
 * Minimal, dependency-free JSON store. Abstracted so it can be swapped for
 * SQLite later without touching collectors/aggregator.
 */
export class Store {
  private file: string
  private data: StoreShape

  constructor(dir = path.join(process.cwd(), 'data')) {
    fs.mkdirSync(dir, { recursive: true })
    this.file = path.join(dir, 'store.json')
    this.data = this.read()
  }

  private read(): StoreShape {
    if (!fs.existsSync(this.file)) return structuredClone(EMPTY)
    try {
      const parsed = JSON.parse(fs.readFileSync(this.file, 'utf8'))
      return { ...structuredClone(EMPTY), ...parsed }
    } catch {
      return structuredClone(EMPTY)
    }
  }

  private flush() {
    fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2))
  }

  upsertSource(rec: Omit<SourceRecord, 'updatedAt'>) {
    this.data.sources[rec.key] = { ...rec, updatedAt: new Date().toISOString() }
    this.flush()
  }

  allSources(): SourceRecord[] {
    return Object.values(this.data.sources)
  }

  appendHeartbeat(category: string, epochSec: number) {
    ;(this.data.heartbeats[category] ??= []).push(epochSec)
    this.flush()
  }

  /** Drop heartbeat timestamps older than `retainDays` (keeps store.json bounded). */
  pruneHeartbeats(retainDays: number) {
    const cutoff = Math.floor(Date.now() / 1000) - retainDays * 86400
    let changed = false
    for (const cat of Object.keys(this.data.heartbeats)) {
      const kept = this.data.heartbeats[cat].filter((t) => t >= cutoff)
      if (kept.length !== this.data.heartbeats[cat].length) changed = true
      if (kept.length === 0) {
        delete this.data.heartbeats[cat]
        changed = true
      } else {
        this.data.heartbeats[cat] = kept
      }
    }
    if (changed) this.flush()
  }

  heartbeats(): Record<string, number[]> {
    return this.data.heartbeats
  }
}
