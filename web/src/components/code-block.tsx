type CodeBlockProps = {
  title?: string
  children: string
}

export function CodeBlock({ title, children }: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-terminal shadow-sm">
      {title && (
        <div className="border-b border-terminal-border px-4 py-2.5">
          <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-terminal-muted">
            {title}
          </p>
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-relaxed text-terminal-text">
        <code>{children.trim()}</code>
      </pre>
    </div>
  )
}
