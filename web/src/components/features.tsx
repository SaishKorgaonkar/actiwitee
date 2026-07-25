const features = [
  {
    title: 'Multi-source aggregation',
    description:
      'Pull from GitHub (multi-account), LeetCode, Codeforces, CodeChef, and more. Weighted merge with percentile-based heatmap levels.',
  },
  {
    title: 'Local session tracking',
    description:
      'A lightweight agent samples AI CLI, IDE, and terminal activity. Local minutes show up on the graph without inflating commit counts.',
  },
  {
    title: 'Portfolio-ready API',
    description:
      'Serve a read-only JSON API from Cloudflare Workers + R2. Drop the heatmap into any site with one env var.',
  },
  {
    title: 'Config-driven',
    description:
      'One YAML file for sources, weights, CORS, and agent signals. No database, just JSON on disk.',
  },
  {
    title: 'Full history',
    description:
      'GitHub history back to account creation. Scrollable graph with rich per-day tooltips: contributions, local time, and source breakdown.',
  },
  {
    title: 'Automate with cron',
    description:
      'Collect on a schedule, publish to R2, and run the agent every few minutes. Set it once and forget it.',
  },
]

export function Features() {
  return (
    <section id="product" className="py-section">
      <div className="mx-auto max-w-content px-6">
        <div className="max-w-2xl">
          <h2 className="text-[32px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
            Built for developers who code everywhere
          </h2>
          <p className="mt-4 text-base leading-relaxed text-body">
            Actiwitee is the self-hostable backend behind unified coding activity, from open source
            commits to contest submissions to late-night AI pair sessions.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl bg-surface-card p-6 transition-colors hover:bg-surface-card-elevated"
            >
              <h3 className="text-lg font-medium text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
