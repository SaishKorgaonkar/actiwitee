# Actiwitee

**Unified coding activity, self-hosted.**

Actiwitee merges GitHub, competitive programming platforms, and local AI-coding sessions into one contribution heatmap — with a read-only API built for portfolios.

## What it does

- **Collect** activity from GitHub, LeetCode, Codeforces, CodeChef, and more
- **Track** local sessions via a lightweight agent (Cursor, VS Code, Claude Code, Hermes, terminal)
- **Merge** everything into weighted, percentile-based heatmap levels
- **Serve** a JSON API from Cloudflare Workers + R2
- **Embed** on any site — see [saish.xyz](https://saish.xyz) for a live demo

## Quick start

```bash
git clone https://github.com/SaishKorgaonkar/activity.git
cd activity
cp config.example.yaml config.yaml   # add your handles & tokens
npm install && npm run build
actiwitee collect
actiwitee serve
```

## API

When deployed, the read-only API exposes:

- `GET /health` — status check
- `GET /contributions` — GitHub-compatible contribution array
- `GET /activity` — full payload with breakdowns and local minutes

Live example: [codepulse.saish.xyz](https://codepulse.saish.xyz)

## Stack

- TypeScript CLI + collectors
- JSON store (no database)
- Cloudflare Worker + R2 for hosted API
- Next.js landing page (this repo)

## License

MIT
