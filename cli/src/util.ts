import os from 'node:os'
import path from 'node:path'

/** Expand a leading ~ to the user's home directory. */
export function expandHome(p: string): string {
  if (p === '~') return os.homedir()
  if (p.startsWith('~/')) return path.join(os.homedir(), p.slice(2))
  return p
}

/** YYYY-MM-DD in local time. */
export function isoDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** `rangeDays <= 0` means no cutoff — use all stored/collected history. */
export function isFullHistory(rangeDays: number): boolean {
  return rangeDays <= 0
}

export function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

/** Simple linear-interpolated quantile over a sorted ascending array. */
export function quantile(sortedAsc: number[], q: number): number {
  if (sortedAsc.length === 0) return 0
  const pos = (sortedAsc.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  const next = sortedAsc[base + 1]
  if (next !== undefined) return sortedAsc[base] + rest * (next - sortedAsc[base])
  return sortedAsc[base]
}
