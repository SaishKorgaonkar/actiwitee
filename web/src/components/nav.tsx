'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

const links = [
  { href: '#product', label: 'Product' },
  { href: '#sources', label: 'Sources' },
  { href: '#api', label: 'API' },
  { href: '#guide', label: 'Guide' },
  { href: 'https://github.com/SaishKorgaonkar/actiwitee', label: 'GitHub', external: true },
]

const SCROLL_END = 140

export function Nav() {
  const { scrollY } = useScroll()

  const top = useTransform(scrollY, [0, SCROLL_END], [0, 16])
  const sideInset = useTransform(scrollY, [0, SCROLL_END], [0, 16])
  const maxWidth = useTransform(scrollY, [0, SCROLL_END], [2000, 896])
  const borderRadius = useTransform(scrollY, [0, SCROLL_END], [0, 9999])
  const paddingX = useTransform(scrollY, [0, SCROLL_END], [24, 20])
  const paddingY = useTransform(scrollY, [0, SCROLL_END], [0, 10])
  const blur = useTransform(scrollY, [0, SCROLL_END], [8, 16])

  const background = useTransform(
    scrollY,
    [0, SCROLL_END],
    ['rgba(255, 255, 255, 0.88)', 'rgba(255, 255, 255, 0.94)']
  )
  const border = useTransform(
    scrollY,
    [0, SCROLL_END],
    ['1px solid transparent', '1px solid rgba(210, 210, 215, 0.95)']
  )

  const backdropFilter = useTransform(blur, (b) => `blur(${b}px)`)
  const boxShadow = useTransform(scrollY, [0, SCROLL_END], [
    '0 1px 0 0 rgba(210, 210, 215, 0.95)',
    '0 4px 24px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.04)',
  ])

  return (
    <motion.header
      className="pointer-events-none fixed inset-x-0 z-50 flex justify-center"
      style={{ top, paddingLeft: sideInset, paddingRight: sideInset }}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
    >
      <motion.div
        className="pointer-events-auto flex w-full min-h-16 items-center gap-3 md:gap-4"
        style={{
          maxWidth,
          borderRadius,
          paddingLeft: paddingX,
          paddingRight: paddingX,
          paddingTop: paddingY,
          paddingBottom: paddingY,
          background,
          border,
          backdropFilter,
          WebkitBackdropFilter: backdropFilter,
          boxShadow,
        }}
      >
        <Link
          href="/"
          className="font-comic shrink-0 text-sm font-bold uppercase tracking-tight text-black md:text-base"
        >
          Actiwitee
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 md:flex lg:gap-8">
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

        <div className="ml-auto flex shrink-0 items-center gap-3">
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
            className="inline-flex h-10 items-center rounded-md bg-primary px-[18px] text-sm font-medium text-on-primary"
          >
            Get started
          </a>
        </div>
      </motion.div>
    </motion.header>
  )
}
