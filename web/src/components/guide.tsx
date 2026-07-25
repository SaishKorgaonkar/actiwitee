import { CodeBlock } from './code-block'
import { GuideAgentBlocks } from './guide-agent-blocks'
import { GuideAutomateBlocks } from './guide-automate-blocks'

const sections = [
  {
    id: 'install',
    step: '01',
    title: 'Install & try the demo',
    body: 'Clone, build, run with synthetic data. No tokens required.',
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
    body: 'Scaffold config, add handles and tokens. Secrets go in .env only.',
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
  },
  {
    id: 'agent',
    step: '03',
    title: 'Track local coding sessions',
    body: 'Sample IDE, terminal, and AI CLI activity. Local minutes stay separate from commit counts.',
  },
  {
    id: 'deploy',
    step: '04',
    title: 'Deploy the read-only API',
    body: 'Publish activity.json to R2 and serve from a Worker.',
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
npm run deploy`,
      },
    ],
  },
  {
    id: 'portfolio',
    step: '05',
    title: 'Wire your portfolio',
    body: 'Point your site at the API. Same shape as GitHub-style heatmaps.',
    blocks: [
      {
        title: '.env (portfolio)',
        code: `NEXT_PUBLIC_ACTIWITEE_API_URL=https://activity.yourdomain.com`,
      },
      {
        title: 'fetch',
        code: `const res = await fetch(\`\${API_URL}/activity\`)
const { contributions } = await res.json()`,
      },
    ],
  },
  {
    id: 'automate',
    step: '06',
    title: 'Automate collection & publish',
    body: 'Pick Mac or Windows below. Agent every 5 min, publish every hour.',
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
            From zero to a live portfolio heatmap. Edit config.yaml, deploy the Worker, point your
            site at the API.
          </p>
          <p className="mt-3 text-sm text-muted">
            GitHub, CP platforms, and the API work on all OSes. Local agent + automation tabs are
            Mac or Windows specific.
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
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  {s.id === 'agent' ? (
                    <GuideAgentBlocks />
                  ) : s.id === 'automate' ? (
                    <GuideAutomateBlocks />
                  ) : (
                    s.blocks?.map((b) => (
                      <CodeBlock key={b.title} title={b.title}>
                        {b.code}
                      </CodeBlock>
                    ))
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
