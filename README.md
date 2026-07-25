# Actiwitee

**Unified coding activity, self-hosted.**

Actiwitee merges GitHub, competitive programming platforms, and local AI-coding sessions into one contribution heatmap — with a read-only API built for portfolios.

## Monorepo layout

```
actiwitee/
  cli/          # TypeScript CLI — collectors, agent, local API
  web/          # Next.js landing page
  deploy/       # (inside cli/) Cloudflare Worker + R2 publish
```

## Quick start

```bash
git clone https://github.com/SaishKorgaonkar/actiwitee.git
cd actiwitee
npm install
npm run build

cd cli
cp config.example.yaml config.yaml
cp .env.example .env          # add tokens
npm run collect -- --demo
npm run serve                 # http://localhost:4787
```

Or from the repo root:

```bash
npm run collect -- --demo
npm run serve
```

## CLI commands

| Command | Description |
|---------|-------------|
| `actiwitee init` | Scaffold `config.yaml` + `.env` |
| `actiwitee collect` | Fetch all configured sources |
| `actiwitee agent --once` | Sample local coding signals |
| `actiwitee show` | Print merged activity JSON |
| `actiwitee serve` | Start read-only HTTP API |

## API

When deployed, the read-only API exposes:

- `GET /health` — status check
- `GET /contributions` — GitHub-compatible contribution array
- `GET /activity` — full payload with breakdowns and local minutes

Live example: [codepulse.saish.xyz](https://codepulse.saish.xyz)

## Web

```bash
npm run dev:web    # http://localhost:3000
npm run build:web
```

## Automation

Hermes cron scripts (update paths if you moved the repo):

- `~/.hermes/scripts/actiwitee-agent.sh` — agent heartbeat every 5m
- `~/.hermes/scripts/actiwitee-publish.sh` — collect + R2 upload every 60m

See [`cli/README.md`](cli/README.md) for full configuration docs.

## License

MIT
