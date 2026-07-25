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
      <div className="relative overflow-hidden rounded-2xl bg-terminal p-1 shadow-sm ring-1 ring-terminal-border sm:p-1.5">
        <div className="flex items-center gap-1.5 border-b border-terminal-border px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden />
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5">
          {panes.map((pane) => (
            <div
              key={pane.title}
              className="rounded-lg bg-terminal-pane p-4 font-mono text-[13px] leading-relaxed ring-1 ring-terminal-border"
            >
              <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-terminal-muted">
                {pane.title}
              </p>
              {pane.lines.map((line, i) => (
                <p key={i} className={line ? 'text-terminal-text' : 'h-4'}>
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
