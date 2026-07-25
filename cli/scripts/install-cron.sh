#!/usr/bin/env bash
# Install or remove actiwitee cron jobs (agent every 5m, publish every hour).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
AGENT="$SCRIPT_DIR/actiwitee-agent.sh"
PUBLISH="$SCRIPT_DIR/actiwitee-publish.sh"
BEGIN="# --- actiwitee cron begin ---"
END="# --- actiwitee cron end ---"

usage() {
  cat <<EOF
Usage: $(basename "$0") [--uninstall]

Installs user crontab entries:
  */5 * * * *  actiwitee-agent.sh   (local heartbeats)
  0   * * * *  actiwitee-publish.sh (collect + R2 upload)

Optional env (for publish script):
  ACTIWITEE_CLI_DIR     path to cli/ (auto-detected)
  ACTIWITEE_R2_BUCKET   R2 bucket name (default: portfolio-images)
  ACTIWITEE_R2_KEY      object key (default: actiwitee/activity.json)

Logs: /tmp/actiwitee-agent.log, /tmp/actiwitee-publish.log
EOF
}

strip_actiwitee_cron() {
  crontab -l 2>/dev/null | awk "
    /^# --- actiwitee cron begin ---/ { skip=1; next }
    /^# --- actiwitee cron end ---/ { skip=0; next }
    skip { next }
    { print }
  " || true
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

if [[ "${1:-}" == "--uninstall" ]]; then
  tmp="$(mktemp)"
  strip_actiwitee_cron > "$tmp"
  if [[ -s "$tmp" ]]; then
    crontab "$tmp"
  else
    crontab -r 2>/dev/null || true
  fi
  rm -f "$tmp"
  echo "Removed actiwitee cron jobs."
  exit 0
fi

if [[ ! -f "$CLI_DIR/dist/cli.js" ]]; then
  echo "error: $CLI_DIR/dist/cli.js not found. Run: npm run build (from repo root)" >&2
  exit 1
fi

chmod +x "$AGENT" "$PUBLISH"

R2_BUCKET="${ACTIWITEE_R2_BUCKET:-portfolio-images}"
R2_KEY="${ACTIWITEE_R2_KEY:-actiwitee/activity.json}"

tmp="$(mktemp)"
strip_actiwitee_cron > "$tmp"
cat >> "$tmp" <<EOF
$BEGIN
*/5 * * * * ACTIWITEE_CLI_DIR=$CLI_DIR $AGENT >> /tmp/actiwitee-agent.log 2>&1
0 * * * * ACTIWITEE_CLI_DIR=$CLI_DIR ACTIWITEE_R2_BUCKET=$R2_BUCKET ACTIWITEE_R2_KEY=$R2_KEY $PUBLISH >> /tmp/actiwitee-publish.log 2>&1
$END
EOF

crontab "$tmp"
rm -f "$tmp"

echo "Installed actiwitee cron jobs:"
echo "  agent   every 5 min  → $AGENT"
echo "  publish every hour   → $PUBLISH"
echo ""
echo "Verify: crontab -l | grep actiwitee"
echo "Remove:  bash scripts/install-cron.sh --uninstall"
echo ""
echo "Set R2 target before install (or re-run install-cron after exporting):"
echo "  export ACTIWITEE_R2_BUCKET=your-bucket"
echo "  export ACTIWITEE_R2_KEY=actiwitee/activity.json"
echo ""
echo "Installed with R2_BUCKET=$R2_BUCKET R2_KEY=$R2_KEY"
