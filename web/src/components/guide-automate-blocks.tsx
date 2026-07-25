'use client'

import { useState } from 'react'
import { CodeBlock } from './code-block'
import { PlatformToggle, type Platform } from './platform-toggle'

const MAC_CODE = `cd cli
export ACTIWITEE_R2_BUCKET=your-bucket
export ACTIWITEE_R2_KEY=actiwitee/activity.json

bash scripts/install-cron.sh

# every 5 min: agent  |  every hour: publish
# remove: bash scripts/install-cron.sh --uninstall`

const WINDOWS_CODE = `cd cli
powershell -ExecutionPolicy Bypass -File scripts/install-tasks.ps1

# every 5 min: agent.cmd  |  every hour: publish.cmd
# remove: ...install-tasks.ps1 -Uninstall`

const HINT: Record<Platform, string> = {
  mac: 'Cron installer for macOS/Linux. Machine must stay awake.',
  windows: 'Task Scheduler installer. Set R2 env vars in System Properties.',
}

export function GuideAutomateBlocks() {
  const [platform, setPlatform] = useState<Platform>('mac')

  return (
    <div className="space-y-3">
      <PlatformToggle value={platform} onChange={setPlatform} />
      <p className="text-xs text-muted">{HINT[platform]}</p>
      <CodeBlock title="terminal">
        {platform === 'mac' ? MAC_CODE : WINDOWS_CODE}
      </CodeBlock>
    </div>
  )
}
