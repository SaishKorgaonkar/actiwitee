import type { CollectResult, Collector } from './types.js'
import type { Buckets } from '../storage/store.js'
import { isoDate, isFullHistory } from '../util.js'

/**
 * Deterministic synthetic source so actiwitee runs end-to-end with zero tokens
 * or network. Enabled via `actiwitee collect --demo`. Great for trying the API
 * and wiring a frontend before you add real credentials.
 */
export class DemoCollector implements Collector {
  type = 'demo'

  async collect(rangeDays: number): Promise<CollectResult[]> {
    const days = isFullHistory(rangeDays) ? 371 : rangeDays
    const buckets: Buckets = {}
    const today = new Date()
    for (let i = 0; i < days; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      // pseudo-random but stable: weekday bias + weekly wave
      const seed = (d.getFullYear() * 372 + (d.getMonth() + 1) * 31 + d.getDate()) % 97
      const weekday = d.getDay()
      const base = weekday === 0 || weekday === 6 ? 1 : 4
      const val = Math.max(0, Math.round(base + (seed % 7) - 2))
      if (val > 0) buckets[isoDate(d)] = val
    }
    return [{ key: 'demo:sample', type: this.type, buckets }]
  }
}
