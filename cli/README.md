# Actiwitee CLI

Self-hostable coding-activity aggregator. It merges everywhere you code into one
contribution heatmap and serves it over a small read-only API that any frontend
can render.

Sources supported today:
- GitHub — multiple accounts, private contributions included (via read-only PAT)
- LeetCode — public submission calendar
- Codeforces — official submissions API
- CodeChef — best-effort profile scrape
- Local AI-coding sessions — a config-driven signal tracker (Ollama, LM Studio,
  llama.cpp, MLX, Cursor/VSCode, Claude Code, Hermes/pi CLI, terminals, ...)

Everything is optional and config-driven. Nothing is hardcoded to one user.

## Quick start

```bash
npm install
npm run build            # or use `npm run dev -- <cmd>` to run from TS

# scaffold config
node dist/cli.js init    # writes config.yaml + .env from examples

# try it with zero tokens / zero network
node dist/cli.js collect --demo
node dist/cli.js serve   # -> http://localhost:4787
```

Then:

```bash
curl localhost:4787/health
curl "localhost:4787/contributions?year=2026"   # {date,count,level} rows
curl localhost:4787/activity                     # full payload + per-source breakdown
```

## Configuration

Copy `config.example.yaml` -> `config.yaml` and `.env.example` -> `.env`.

Secrets NEVER go in `config.yaml`. Put tokens in `.env` and reference them from
config via `tokenEnv:`.

### GitHub (multi-account, private-aware)

Create a **read-only** PAT per account:
- Classic: scope `read:user` (this is what exposes private contribution counts).
- Fine-grained: read-only, no repo write.

```yaml
sources:
  github:
    - id: personal
      username: your-personal-handle
      tokenEnv: ACTIWITEE_GITHUB_PERSONAL_TOKEN
    - id: work
      username: your-work-handle
      tokenEnv: ACTIWITEE_GITHUB_WORK_TOKEN
```

Without a token a GitHub source falls back to public-only counts.

### Competitive programming

```yaml
  leetcode:   [{ username: your-lc-handle }]
  codeforces: [{ username: your-cf-handle }]
  codechef:   [{ username: your-cc-handle }]
```

### Local AI-coding session tracking

The `agent` samples every `interval` seconds. Each **signal** answers "am I
coding right now?" via one of three detectors:

- `process`   — regex over running processes (ollama, llama-server, mlx_lm, ...)
- `app-focus` — the frontmost macOS app matches a regex (Cursor, Code, iTerm2, ...)
- `session-log` — a file/dir was modified recently (Claude Code, Hermes/pi CLI)

Add a signal for every tool you use — nothing is a blocker:

```yaml
agent:
  interval: 180
  signals:
    - { id: ollama, type: process, match: "ollama|llama-server|mlx_lm", category: local-model }
    - { id: cursor, type: app-focus, match: "Cursor", category: editor }
    - { id: claude-code, type: session-log, path: "~/.claude/projects", category: ai-cli }
```

Heartbeats roll up into active-minutes/day and feed the same heatmap, weighted
per 30 minutes.

### Scoring & levels

```yaml
weights: { github: 1, leetcode: 3, codeforces: 3, codechef: 3, local: 1 }
levels:  { mode: percentile }   # adaptive 0-4 buckets; or mode: fixed + thresholds
```

## Running it for real

Two long-running pieces:

1. `actiwitee agent`   — the local tracker (must run on your machine).
2. `actiwitee collect` — refresh remote sources periodically (cron/systemd/Hermes cron).
3. `actiwitee serve`   — the API your frontend reads.

A typical loop: `agent` runs every 5 minutes; `collect` + publish runs hourly.
`serve` is optional for local dev — production uses R2 + the Cloudflare Worker.

### Cron automation

From `cli/` after `npm run build`:

```bash
export ACTIWITEE_R2_BUCKET=your-bucket
export ACTIWITEE_R2_KEY=actiwitee/activity.json
bash scripts/install-cron.sh
```

This installs:
- `scripts/actiwitee-agent.sh` every 5 min (local heartbeats)
- `scripts/actiwitee-publish.sh` every hour (collect + merge + R2 upload)

Logs: `/tmp/actiwitee-agent.log`, `/tmp/actiwitee-publish.log`  
Remove: `bash scripts/install-cron.sh --uninstall`

```bash
node dist/cli.js show > activity.json   # static artifact for CDN hosting
```

## API

| Endpoint          | Purpose                                                        |
|-------------------|----------------------------------------------------------------|
| `GET /health`     | liveness + per-source freshness                                |
| `GET /contributions[?year=YYYY]` | lean `{date,count,level}[]` — matches the portfolio graph shape |
| `GET /activity[?year=YYYY]`      | full payload: score, per-source breakdown, sources meta |

## Frontend wiring (saish.xyz)

The existing `github-contributions-client.tsx` renders `{date,count,level}[]`.
Point it at the hosted codepulse Worker API:

```
NEXT_PUBLIC_ACTIWITEE_API_URL=https://codepulse.saish.xyz
# legacy alias still supported: NEXT_PUBLIC_CODEPULSE_API_URL
# fetch(`${API_URL}/contributions?year=${year}`)  ->  json.contributions
```

`/contributions` returns the identical shape. Use `/activity` for per-source breakdown tooltips.

## Hosted API (Cloudflare Worker)

Local Mac publishes merged data to R2 hourly; a Cloudflare Worker serves it:

```bash
cd deploy/worker && npm install && cp wrangler.toml.example wrangler.toml
npx wrangler login && npm run deploy
# Attach custom domain: codepulse.saish.xyz
```

See [`deploy/worker/README.md`](deploy/worker/README.md).

## License

MIT
