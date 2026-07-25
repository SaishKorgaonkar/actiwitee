#!/bin/bash
# Refresh remote sources, merge with local heartbeats, write activity.json, upload to R2
set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI_DIR="${ACTIWITEE_CLI_DIR:-$(cd "$SCRIPT_DIR/.." && pwd)}"
ARTIFACT="$CLI_DIR/data/activity.json"
R2_BUCKET="${ACTIWITEE_R2_BUCKET:-portfolio-images}"
R2_KEY="${ACTIWITEE_R2_KEY:-actiwitee/activity.json}"

cd "$CLI_DIR"

node dist/cli.js collect >/tmp/actiwitee-collect.log 2>&1 || true
node dist/cli.js show > "$ARTIFACT" 2>/tmp/actiwitee-show.log

WRANGLER_DIR="$CLI_DIR/deploy/worker"
if command -v wrangler >/dev/null 2>&1 || command -v npx >/dev/null 2>&1; then
  (cd "$WRANGLER_DIR" && npx wrangler r2 object put "${R2_BUCKET}/${R2_KEY}" \
    --file "$ARTIFACT" \
    --content-type application/json \
    --remote) \
    >/tmp/actiwitee-r2.log 2>&1 || {
      echo "actiwitee-publish: R2 upload failed (see /tmp/actiwitee-r2.log)" >&2
    }
else
  echo "actiwitee-publish: wrangler not found, skipped R2 upload" >&2
fi

node -e "
  const j = require('$ARTIFACT');
  const active = j.contributions.filter((d) => d.count > 0).length;
  console.log(
    'actiwitee: score=' + j.totalScore +
    ' activeDays=' + active +
    ' sources=' + j.sources.length +
    ' -> $ARTIFACT (R2: ${R2_BUCKET}/${R2_KEY})'
  );
"
