export function Cta() {
  return (
    <section id="get-started" className="relative overflow-hidden py-section">
      <div className="spotlight-glow-subtle pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-content px-6">
        <div className="rounded-xl bg-surface-card p-8 text-center sm:p-12 lg:p-16">
          <h2 className="text-[32px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
            Ready to unify your coding activity?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-body">
            Open source and self-hostable. Star the repo, follow the guide above, and wire the
            heatmap into your portfolio in an afternoon.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://github.com/SaishKorgaonkar/actiwitee"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-md bg-primary px-[18px] text-sm font-medium text-on-primary"
            >
              Get started on GitHub
            </a>
            <a
              href="https://saish.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-md bg-surface-card-elevated px-[18px] text-sm font-medium text-ink"
            >
              See live demo
            </a>
            <a
              href="#install"
              className="inline-flex h-10 items-center rounded-md bg-surface-card-elevated px-[18px] text-sm font-medium text-ink"
            >
              Jump to setup
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
