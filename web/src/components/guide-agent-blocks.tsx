'use client'

import { useState } from 'react'
import { CodeBlock } from './code-block'
import { PlatformToggle, type Platform } from './platform-toggle'

const AGENT_CONFIG: Record<Platform, string> = {
  mac: `agent:
  interval: 180
  signals:
    - { id: cursor, type: app-focus, match: "Cursor", category: editor }
    - { id: claude-code, type: session-log, path: "~/.claude/projects", category: ai-cli }
    - { id: ollama, type: process, match: "ollama|llama-server", category: local-model }`,
  windows: `agent:
  interval: 180
  signals:
    - { id: claude-code, type: session-log, path: "~/.claude/projects", category: ai-cli }`,
}

const HINT: Record<Platform, string> = {
  mac: 'Mac/Linux: IDE focus, process, and session-log signals.',
  windows: 'Windows: session-log only. Skip app-focus and process.',
}

export function GuideAgentBlocks() {
  const [platform, setPlatform] = useState<Platform>('mac')

  return (
    <div className="space-y-3">
      <PlatformToggle value={platform} onChange={setPlatform} />
      <p className="text-xs text-muted">{HINT[platform]}</p>
      <CodeBlock title="config.yaml (agent)">{AGENT_CONFIG[platform]}</CodeBlock>
      <CodeBlock title="terminal">{`node dist/cli.js agent          # continuous
node dist/cli.js agent --once   # single sample`}</CodeBlock>
    </div>
  )
}
