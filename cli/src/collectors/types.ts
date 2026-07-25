import type { Buckets } from '../storage/store.js'

export interface CollectResult {
  /** stable key, e.g. "github:personal" */
  key: string
  type: string
  buckets: Buckets
}

export interface Collector {
  type: string
  /** Returns one CollectResult per configured account/handle. */
  collect(rangeDays: number): Promise<CollectResult[]>
}

/** Merge helper: add a count into a date bucket. */
export function addTo(buckets: Buckets, date: string, count: number) {
  buckets[date] = (buckets[date] ?? 0) + count
}
