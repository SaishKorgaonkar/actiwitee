import { TerminalMockup } from './terminal-mockup'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-section pb-16 sm:pb-24">
      <div className="mx-auto max-w-content px-6 text-center">
        <span className="mb-6 inline-block rounded-full bg-surface-card-elevated px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.88px] text-ink">
          Self-hosted · Open source
        </span>
        <h1 className="mx-auto max-w-4xl text-[36px] font-medium leading-[1.05] tracking-[-0.02em] text-ink sm:text-[56px] lg:text-[72px] lg:tracking-[-2.16px]">
          Everywhere you code,
          <br />
          one contribution graph
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-body sm:text-lg">
          Actiwitee merges GitHub, competitive programming, and local AI-coding sessions into a
          single heatmap and read-only API — built for portfolios that reflect how you actually
          work.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#get-started"
            className="inline-flex h-10 items-center rounded-md bg-primary px-[18px] text-sm font-medium text-ink"
          >
            Get started
          </a>
          <a
            href="https://github.com/SaishKorgaonkar/activity"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center rounded-md bg-surface-card-elevated px-[18px] text-sm font-medium text-ink"
          >
            View on GitHub
          </a>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-content px-6 sm:mt-20">
        <TerminalMockup />
      </div>
    </section>
  )
}
