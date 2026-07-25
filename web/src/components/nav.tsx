import Link from 'next/link'

const links = [
  { href: '#product', label: 'Product' },
  { href: '#sources', label: 'Sources' },
  { href: '#docs', label: 'Docs' },
  { href: 'https://github.com/SaishKorgaonkar/actiwitee', label: 'GitHub', external: true },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-6">
        <Link href="/" className="text-sm font-medium tracking-tight text-primary">
          Actiwitee
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) =>
            l.external ? (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-body transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-body transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/SaishKorgaonkar/actiwitee"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm font-medium text-body sm:inline hover:text-ink"
          >
            Star on GitHub
          </a>
          <a
            href="#get-started"
            className="inline-flex h-10 items-center rounded-md bg-primary px-[18px] text-sm font-medium text-ink"
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  )
}
