import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Actiwitee | unified coding activity, self-hosted',
  description:
    'Merge GitHub, competitive programming, and local AI-coding sessions into one contribution heatmap. Self-hostable, config-driven, portfolio-ready API.',
  openGraph: {
    title: 'Actiwitee | unified coding activity, self-hosted',
    description:
      'One heatmap for GitHub, CP platforms, and local AI-coding sessions. Self-host the CLI, deploy a read-only API, wire your portfolio.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans`}>{children}</body>
    </html>
  )
}
