import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'
import { configSchema, type Config } from './schema.js'

export const CONFIG_CANDIDATES = ['config.yaml', 'config.yml']

export function findConfigPath(cwd = process.cwd()): string | null {
  for (const name of CONFIG_CANDIDATES) {
    const p = path.join(cwd, name)
    if (fs.existsSync(p)) return p
  }
  return null
}

export function loadConfig(explicitPath?: string): Config {
  const p = explicitPath ?? findConfigPath()
  if (!p || !fs.existsSync(p)) {
    throw new Error(
      'No config found. Run `actiwitee init` to create config.yaml, then edit it.'
    )
  }
  const raw = YAML.parse(fs.readFileSync(p, 'utf8')) ?? {}
  const parsed = configSchema.safeParse(raw)
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`Invalid config at ${p}:\n${issues}`)
  }
  return parsed.data
}
