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
        canvas: '#ffffff',
        'canvas-deep': '#f5f5f7',
        'surface-card': '#f5f5f7',
        'surface-card-elevated': '#ebebed',
        'surface-strong': '#d2d2d7',
        primary: '#000000',
        'primary-active': '#1d1d1f',
        'primary-glow': '#1d1d1f',
        'on-primary': '#ffffff',
        ink: '#1d1d1f',
        body: '#6e6e73',
        muted: '#86868b',
        'muted-soft': '#aeaeb2',
        hairline: '#d2d2d7',
        'hairline-strong': '#c7c7cc',
        terminal: '#1d1d1f',
        'terminal-pane': '#2c2c2e',
        'terminal-border': '#3a3a3c',
        'terminal-text': '#f5f5f7',
        'terminal-muted': '#86868b',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
        comic: ['"Comic Sans MS"', '"Comic Sans"', 'cursive'],
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
