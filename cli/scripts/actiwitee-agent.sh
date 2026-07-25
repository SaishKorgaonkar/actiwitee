#!/bin/bash
# Sample local coding signals once per cron tick → appends heartbeats to store.json
set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI_DIR="${ACTIWITEE_CLI_DIR:-$(cd "$SCRIPT_DIR/.." && pwd)}"

cd "$CLI_DIR"
node dist/cli.js agent --once >/dev/null 2>&1 || {
  echo "actiwitee-agent: sampling failed" >&2
  exit 1
}
