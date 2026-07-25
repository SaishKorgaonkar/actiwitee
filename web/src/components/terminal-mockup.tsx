const panes = [
  {
    title: 'config.yaml',
    lines: [
      'sources:',
      '  github: [personal, work]',
      '  leetcode: [saish_korgaonkar]',
      '  codeforces: [saish_k]',
      'agent:',
      '  signals: [cursor, hermes-cli]',
    ],
  },
  {
    title: '$ actiwitee collect',
    lines: [
      'github:personal  459 contrib',
      'leetcode           15 contrib',
      'codeforces          6 contrib',
      'codechef          141 contrib',
      '→ store.json updated',
    ],
  },
  {
    title: '$ curl /contributions',
    lines: [
      '{',
      '  "total": 622,',
      '  "contributions": [',
      '    { "date": "2026-07-25",',
      '      "level": 2, "localMinutes": 76 }',
      '  ]',
      '}',
    ],
  },
  {
    title: '$ actiwitee agent --once',
    lines: [
      '[agent] active: ai-cli, terminal',
      '→ 76 min local today',
      '→ heartbeat stored',
      '',
      'Hermes cron · every 5m',
    ],
  },
]

export function TerminalMockup() {
  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <div className="spotlight-glow pointer-events-none absolute inset-0 -top-24" aria-hidden />
      <div className="relative rounded-xl bg-canvas-deep p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {panes.map((pane) => (
            <div
              key={pane.title}
              className="rounded-lg bg-surface-card p-5 font-mono text-[13px] leading-relaxed"
            >
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
                {pane.title}
              </p>
              {pane.lines.map((line, i) => (
                <p key={i} className={line ? 'text-body' : 'h-4'}>
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
