import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0f0f0f',
        'canvas-deep': '#000000',
        'surface-card': '#181818',
        'surface-card-elevated': '#222222',
        'surface-strong': '#2a2a2a',
        primary: '#0007cd',
        'primary-active': '#0005a3',
        'primary-glow': '#1a26ff',
        ink: '#ffffff',
        body: '#a8a8a8',
        muted: '#888888',
        'muted-soft': '#666666',
        hairline: '#222222',
        'hairline-strong': '#333333',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      maxWidth: {
        content: '1200px',
      },
      spacing: {
        section: '96px',
      },
    },
  },
  plugins: [],
}
export default config
