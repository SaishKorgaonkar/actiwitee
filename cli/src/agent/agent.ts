import type { Config } from '../config/schema.js'
import { Store } from '../storage/store.js'
import { isFullHistory } from '../util.js'
import { isSignalActive } from './signals.js'

/**
 * Local session tracker. Samples all configured signals every `interval`
 * seconds; records a heartbeat (per category) whenever any signal is active.
 * Heartbeats are later rolled up into active-minutes by the aggregator.
 */
export async function runAgent(config: Config, store: Store, opts: { once?: boolean } = {}) {
  const { interval, signals } = config.agent
  if (signals.length === 0) {
    console.log('[agent] no signals configured; nothing to track.')
    return
  }

  const tick = async () => {
    const now = Math.floor(Date.now() / 1000)
    const activeCategories = new Set<string>()
    await Promise.all(
      signals.map(async (sig) => {
        if (await isSignalActive(sig)) activeCategories.add(sig.category)
      })
    )
    for (const cat of activeCategories) store.appendHeartbeat(cat, now)
    store.pruneHeartbeats(isFullHistory(config.rangeDays) ? 365 : config.rangeDays)
    const stamp = new Date().toISOString()
    if (activeCategories.size > 0) {
      console.log(`[agent] ${stamp} active: ${[...activeCategories].join(', ')}`)
    } else {
      console.log(`[agent] ${stamp} idle`)
    }
  }

  await tick()
  if (opts.once) return

  console.log(`[agent] sampling every ${interval}s. Ctrl-C to stop.`)
  const timer = setInterval(tick, interval * 1000)
  await new Promise<void>((resolve) => {
    process.on('SIGINT', () => {
      clearInterval(timer)
      console.log('\n[agent] stopped.')
      resolve()
    })
  })
}
