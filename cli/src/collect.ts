import type { Config } from './config/schema.js'
import { Store } from './storage/store.js'
import type { Collector } from './collectors/types.js'
import { GithubCollector } from './collectors/github.js'
import { LeetCodeCollector } from './collectors/leetcode.js'
import { CodeforcesCollector } from './collectors/codeforces.js'
import { CodeChefCollector } from './collectors/codechef.js'
import { DemoCollector } from './collectors/demo.js'

export function buildCollectors(config: Config, demo: boolean): Collector[] {
  if (demo) return [new DemoCollector()]
  const c: Collector[] = []
  const s = config.sources
  if (s.github.length) c.push(new GithubCollector(s.github))
  if (s.leetcode.length) c.push(new LeetCodeCollector(s.leetcode))
  if (s.codeforces.length) c.push(new CodeforcesCollector(s.codeforces))
  if (s.codechef.length) c.push(new CodeChefCollector(s.codechef))
  return c
}

/**
 * Run every configured collector, persisting results. Individual source
 * failures are logged but never abort the whole run (resilient to one flaky
 * API/scrape).
 */
export async function runCollect(
  config: Config,
  store: Store,
  opts: { demo?: boolean } = {}
) {
  const collectors = buildCollectors(config, opts.demo ?? false)
  if (collectors.length === 0) {
    console.log('[collect] no sources configured. Edit config.yaml or use --demo.')
    return
  }
  for (const collector of collectors) {
    try {
      const results = await collector.collect(config.rangeDays)
      for (const r of results) {
        const total = Object.values(r.buckets).reduce((a, b) => a + b, 0)
        store.upsertSource({ key: r.key, type: r.type, buckets: r.buckets })
        console.log(`[collect] ${r.key}: ${total} contributions over ${Object.keys(r.buckets).length} days`)
      }
    } catch (err) {
      console.error(`[collect] ${collector.type} FAILED: ${(err as Error).message}`)
    }
  }
}
