import { CodeBlock } from './code-block'

const sections = [
  {
    id: 'install',
    step: '01',
    title: 'Install & try the demo',
    body: 'Clone the monorepo, install dependencies, and run with synthetic data. No tokens or network required.',
    blocks: [
      {
        title: 'terminal',
        code: `git clone https://github.com/SaishKorgaonkar/actiwitee.git
cd actiwitee
npm install
npm run build
cd cli
node dist/cli.js collect --demo
node dist/cli.js serve   # http://localhost:4787`,
      },
      {
        title: 'verify',
        code: `curl localhost:4787/health
curl localhost:4787/activity | head`,
      },
    ],
  },
  {
    id: 'configure',
    step: '02',
    title: 'Configure your sources',
    body: 'Scaffold config files, then add handles and tokens. Secrets stay in .env, never in config.yaml.',
    blocks: [
      {
        title: 'terminal',
        code: `node dist/cli.js init
# edits config.yaml + .env`,
      },
      {
        title: 'config.yaml (excerpt)',
        code: `sources:
  github:
    - id: personal
      username: your-handle
      tokenEnv: ACTIWITEE_GITHUB_PERSONAL_TOKEN
      includePrivate: true
  leetcode: [{ username: your-lc-handle }]
  codeforces: [{ username: your-cf-handle }]

weights: { github: 1, leetcode: 3, codeforces: 3, local: 1 }
levels: { mode: percentile }`,
      },
      {
        title: '.env',
        code: `ACTIWITEE_GITHUB_PERSONAL_TOKEN=ghp_...
ACTIWITEE_GITHUB_WORK_TOKEN=ghp_...`,
      },
    ],
    note: 'GitHub PATs need read:user scope for private contribution counts. Without a token, only public activity is fetched.',
  },
  {
    id: 'agent',
    step: '03',
    title: 'Track local coding sessions',
    body: 'The agent samples process, app-focus, and session-log signals on an interval. Local minutes appear on the heatmap separately from commit counts.',
    blocks: [
      {
        title: 'config.yaml (agent)',
        code: `agent:
  interval: 180
  signals:
    - { id: cursor, type: app-focus, match: "Cursor", category: editor }
    - { id: claude-code, type: session-log, path: "~/.claude/projects", category: ai-cli }
    - { id: ollama, type: process, match: "ollama|llama-server", category: local-model }`,
      },
      {
        title: 'terminal',
        code: `node dist/cli.js agent          # continuous
node dist/cli.js agent --once   # single sample`,
      },
    ],
    note: 'Best on your Mac: app-focus detects Cursor and VS Code when frontmost. Linux supports process and session-log signals. Windows can collect remote sources and deploy the API; local IDE tracking and the cron installer are not supported yet.',
  },
  {
    id: 'deploy',
    step: '04',
    title: 'Deploy the read-only API',
    body: 'Publish merged activity.json to Cloudflare R2 and serve it from a Worker. Your portfolio reads the JSON, no backend on your site.',
    blocks: [
      {
        title: 'publish locally',
        code: `node dist/cli.js collect
node dist/cli.js show > data/activity.json
# upload to R2 (see cli/deploy/worker/README.md)`,
      },
      {
        title: 'deploy worker',
        code: `cd cli/deploy/worker
npm install
cp wrangler.toml.example wrangler.toml
npx wrangler login
npm run deploy
# attach custom domain, e.g. activity.yourdomain.com`,
      },
    ],
    note: 'Routes: GET /health, GET /contributions, GET /activity. CORS is configured in config.yaml for your portfolio origin.',
  },
  {
    id: 'portfolio',
    step: '05',
    title: 'Wire your portfolio',
    body: 'Point any frontend at the API. The contributions shape matches GitHub-style heatmap components.',
    blocks: [
      {
        title: '.env (portfolio)',
        code: `NEXT_PUBLIC_ACTIWITEE_API_URL=https://activity.yourdomain.com`,
      },
      {
        title: 'fetch',
        code: `const res = await fetch(\`\${API_URL}/activity\`)
const { contributions } = await res.json()
// [{ date, count, level, localMinutes?, breakdown? }]`,
      },
    ],
    note: 'Use /contributions for lean {date,count,level} rows. Use /activity for per-source breakdowns and local minutes in tooltips.',
  },
  {
    id: 'automate',
    step: '06',
    title: 'Automate collection & publish',
    body: 'Install cron jobs with one script. Agent runs every 5 minutes; collect + R2 upload runs hourly. Your Mac must be awake for jobs to fire.',
    blocks: [
      {
        title: 'install cron (macOS / Linux)',
        code: `cd cli
# optional: set R2 target before install
export ACTIWITEE_R2_BUCKET=your-bucket
export ACTIWITEE_R2_KEY=actiwitee/activity.json

bash scripts/install-cron.sh
crontab -l | grep actiwitee`,
      },
      {
        title: 'what gets installed',
        code: `# every 5 min: local heartbeats
scripts/actiwitee-agent.sh

# every hour: collect, merge, upload to R2
scripts/actiwitee-publish.sh

# logs
/tmp/actiwitee-agent.log
/tmp/actiwitee-publish.log

# remove
bash scripts/install-cron.sh --uninstall`,
      },
    ],
    note: 'macOS and Linux only for install-cron.sh. On Windows, use Task Scheduler with the same node dist/cli.js commands. Your Mac must be awake for cron jobs to run.',
  },
]

export function Guide() {
  return (
    <section id="guide" className="py-section">
      <div className="mx-auto max-w-content px-6">
        <div className="max-w-2xl">
          <h2 className="text-[32px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
            Self-host in six steps
          </h2>
          <p className="mt-4 text-base leading-relaxed text-body">
            From zero to a live portfolio heatmap. Copy the commands, edit config.yaml for your
            handles, deploy the Worker, and point your site at the API.
          </p>
          <p className="mt-4 rounded-xl border border-hairline bg-surface-card px-4 py-3 text-sm leading-relaxed text-body">
            <span className="font-medium text-ink">Runs everywhere.</span> GitHub, competitive
            programming, and the read-only API work on macOS, Linux, and Windows.{' '}
            <span className="font-medium text-ink">Local session tracking and cron automation</span>{' '}
            are built for your Mac (Linux works too). Windows users can still collect remote activity
            and publish to Cloudflare.
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {sections.map((s) => (
            <article key={s.id} id={s.id} className="scroll-mt-24">
              <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
                <div className="lg:w-72 lg:shrink-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Step {s.step}
                  </span>
                  <h3 className="mt-2 text-xl font-medium text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{s.body}</p>
                  {s.note && (
                    <p className="mt-4 rounded-lg bg-surface-card px-3 py-2 text-xs leading-relaxed text-muted">
                      {s.note}
                    </p>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  {s.blocks.map((b) => (
                    <CodeBlock key={b.title} title={b.title}>
                      {b.code}
                    </CodeBlock>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
