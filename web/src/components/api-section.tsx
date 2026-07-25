const endpoints = [
  {
    method: 'GET',
    path: '/health',
    description: 'Liveness check and per-source freshness timestamps.',
    example: '{ "ok": true, "sources": { "github:personal": "2026-07-25T..." } }',
  },
  {
    method: 'GET',
    path: '/contributions?year=2026',
    description: 'Lean heatmap rows, GitHub-compatible {date, count, level} shape.',
    example: '{ "total": 622, "contributions": [{ "date": "2026-07-25", "count": 3, "level": 2 }] }',
  },
  {
    method: 'GET',
    path: '/activity',
    description: 'Full payload with scores, local minutes, and per-source breakdown per day.',
    example: '{ "contributions": [{ "date": "...", "count": 3, "level": 2, "localMinutes": 76, "breakdown": { "github": 2, "local": 76 } }] }',
  },
]

export function ApiSection() {
  return (
    <section id="api" className="border-y border-hairline py-section">
      <div className="mx-auto max-w-content px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <h2 className="text-[32px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
              Read-only JSON API
            </h2>
            <p className="mt-4 text-base leading-relaxed text-body">
              Three routes, no auth required. Host on Cloudflare Workers + R2 and call from any
              frontend with one env var.
            </p>
            <a
              href="https://codepulse.saish.xyz/health"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex text-sm font-medium text-ink underline-offset-4 hover:underline"
            >
              Live example → codepulse.saish.xyz
            </a>
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            {endpoints.map((e) => (
              <div key={e.path} className="rounded-xl bg-surface-card p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-md bg-terminal px-2 py-0.5 font-mono text-xs font-medium text-terminal-text">
                    {e.method}
                  </span>
                  <code className="font-mono text-sm text-ink">{e.path}</code>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-body">{e.description}</p>
                <pre className="mt-3 overflow-x-auto rounded-xl bg-terminal px-3.5 py-2.5 font-mono text-[12px] leading-relaxed text-terminal-text ring-1 ring-terminal-border">
                  {e.example}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
