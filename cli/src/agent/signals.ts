import { execFile } from 'node:child_process'
import fs from 'node:fs'
import { promisify } from 'node:util'
import type { Signal } from '../config/schema.js'
import { expandHome } from '../util.js'

const pexec = promisify(execFile)

/**
 * Evaluate whether a single signal is currently "active". Cross-platform-ish:
 * process + session-log work anywhere; app-focus is best-effort (macOS via
 * AppleScript, otherwise treated as inactive).
 */
export async function isSignalActive(sig: Signal): Promise<boolean> {
  try {
    switch (sig.type) {
      case 'process':
        return await matchProcess(sig.match ?? '')
      case 'app-focus':
        return await matchFocusedApp(sig.match ?? '')
      case 'session-log':
        return matchRecentLog(sig.path ?? '', 600)
      default:
        return false
    }
  } catch {
    return false
  }
}

async function matchProcess(pattern: string): Promise<boolean> {
  if (!pattern) return false
  const { stdout } = await pexec('ps', ['-Ao', 'comm=,args='])
  const re = new RegExp(pattern, 'i')
  return stdout.split('\n').some((line) => re.test(line))
}

async function matchFocusedApp(pattern: string): Promise<boolean> {
  if (!pattern) return false
  if (process.platform !== 'darwin') return false
  const script =
    'tell application "System Events" to get name of first application process whose frontmost is true'
  const { stdout } = await pexec('osascript', ['-e', script])
  return new RegExp(pattern, 'i').test(stdout.trim())
}

/** True if any file under `path` was modified within `withinSec`. */
function matchRecentLog(rawPath: string, withinSec: number): boolean {
  const p = expandHome(rawPath)
  if (!p || !fs.existsSync(p)) return false
  const cutoff = Date.now() - withinSec * 1000
  const stat = fs.statSync(p)
  if (stat.isFile()) return stat.mtimeMs >= cutoff
  // shallow-scan a directory tree (2 levels) for a recently touched file
  const stack = [{ dir: p, depth: 0 }]
  while (stack.length) {
    const { dir, depth } = stack.pop()!
    let entries: fs.Dirent[]
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      continue
    }
    for (const e of entries) {
      const full = `${dir}/${e.name}`
      if (e.isFile()) {
        try {
          if (fs.statSync(full).mtimeMs >= cutoff) return true
        } catch {
          /* ignore */
        }
      } else if (e.isDirectory() && depth < 2) {
        stack.push({ dir: full, depth: depth + 1 })
      }
    }
  }
  return false
}
