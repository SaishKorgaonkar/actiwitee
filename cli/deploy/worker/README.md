# codepulse API Worker

Read-only Cloudflare Worker that serves the merged activity payload from R2.

Local Mac publishes `data/activity.json` to R2 every hour via `codepulse-publish.sh`.
This Worker exposes it as a live HTTP API for saish.xyz.

## Setup

```bash
cd deploy/worker
npm install
cp wrangler.toml.example wrangler.toml
# Edit wrangler.toml — set account_id if needed
npx wrangler login
npm run deploy
```

## First deploy: workers.dev prompt

Cloudflare requires **one** public URL before a Worker can go live. You have two options:

### Option A — Custom domain (recommended for you)

If `saish.xyz` is on Cloudflare, `wrangler.toml` already includes:

```toml
[[routes]]
pattern = "codepulse.saish.xyz"
custom_domain = true
```

Deploy directly — **say "no" to workers.dev** if you only want the custom domain:

```bash
npm run deploy
```

Cloudflare auto-creates the DNS record for `codepulse.saish.xyz`.

### Option B — workers.dev (quick test URL)

If custom domain deploy fails, re-run and answer **yes** when asked to register a workers.dev subdomain. This is a one-time setup (pick any name, e.g. `saish-korgaonkar`).

You'll get: `https://codepulse-api.saish-korgaonkar.workers.dev`

Use that as `NEXT_PUBLIC_CODEPULSE_API_URL` until the custom domain is wired.

Or register manually: https://dash.cloudflare.com → Workers → subdomain onboarding

## Attach custom domain (if using Option B first)

Cloudflare dashboard → Workers → codepulse-api → Triggers → Custom Domains:

```
codepulse.saish.xyz
```

## Routes

| Route | Response |
|-------|----------|
| `GET /health` | Liveness + source freshness |
| `GET /contributions?year=2026` | `{ total, contributions: [{date,count,level}] }` |
| `GET /activity?year=2026` | Full payload with per-source breakdown |

## Local test (before domain)

After publish script uploads to R2:

```bash
curl "$(npx wrangler dev --show-url 2>/dev/null)/contributions?year=2026"
```

Or against production once deployed:

```bash
curl https://codepulse.saish.xyz/contributions?year=2026
curl https://codepulse.saish.xyz/health
```

## Publish pipeline

On your Mac (Hermes cron, hourly):

1. `collect` — refresh GitHub / LeetCode / Codeforces / CodeChef
2. `show` — merge with local heartbeats → `data/activity.json`
3. `wrangler r2 object put portfolio-images/codepulse/activity.json`

See `~/.hermes/scripts/codepulse-publish.sh`.
