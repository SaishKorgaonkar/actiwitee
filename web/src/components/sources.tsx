const sources = [
  { name: 'GitHub', detail: 'Multi-account, private repos via PAT' },
  { name: 'LeetCode', detail: 'Submission calendar sync' },
  { name: 'Codeforces', detail: 'Contest & practice activity' },
  { name: 'CodeChef', detail: 'Practice streaks' },
  { name: 'Local agent', detail: 'Cursor, VS Code, Claude Code, Hermes, terminal' },
  { name: 'Demo', detail: 'Sample data for development' },
]

export function Sources() {
  return (
    <section id="sources" className="border-y border-hairline py-section">
      <div className="mx-auto max-w-content px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <h2 className="text-[32px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
              Plug in your sources
            </h2>
            <p className="mt-4 text-base leading-relaxed text-body">
              Add handles and tokens in config.yaml. Run collect. Actiwitee normalizes dates,
              deduplicates, and merges into one timeline.
            </p>
          </div>

          <div className="grid flex-1 gap-3 sm:grid-cols-2">
            {sources.map((s) => (
              <div
                key={s.name}
                className="flex items-start gap-3 rounded-lg bg-surface-card px-4 py-3"
              >
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-ink" />
                <div>
                  <p className="text-sm font-medium text-ink">{s.name}</p>
                  <p className="text-xs text-muted">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
