const steps = [
  {
    cmd: 'git clone https://github.com/SaishKorgaonkar/actiwitee.git',
    label: 'Clone the repo',
  },
  {
    cmd: 'cp config.example.yaml config.yaml',
    label: 'Configure sources',
  },
  {
    cmd: 'actiwitee collect && actiwitee serve',
    label: 'Collect & serve locally',
  },
  {
    cmd: 'actiwitee agent --once',
    label: 'Track local sessions',
  },
]

export function Cta() {
  return (
    <section id="get-started" className="relative overflow-hidden py-section">
      <div className="spotlight-glow-subtle pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-content px-6">
        <div className="rounded-xl bg-surface-card p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            <h2 id="docs" className="text-[32px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
              Self-host in minutes
            </h2>
            <p className="mt-4 text-base leading-relaxed text-body">
              Actiwitee ships as a CLI with optional Cloudflare Worker deployment. Point your
              portfolio at the API and you&apos;re live.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <code className="flex-1 rounded-lg bg-canvas-deep px-4 py-3 font-mono text-[13px] text-body">
                  {s.cmd}
                </code>
                <span className="text-sm text-muted sm:w-40">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="https://github.com/SaishKorgaonkar/actiwitee"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-md bg-primary px-[18px] text-sm font-medium text-ink"
            >
              Get started on GitHub
            </a>
            <a
              href="https://saish.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-md bg-surface-card-elevated px-[18px] text-sm font-medium text-ink"
            >
              See it on saish.xyz
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
