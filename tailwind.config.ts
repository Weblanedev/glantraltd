import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#0b1220',
          900: '#111a2b',
          800: '#182236',
          700: '#1f2d45',
        },
        gold: {
          400: '#d4a853',
          500: '#c9a227',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        surface: {
          DEFAULT: '#f1f5f9',
          card: '#ffffff',
        },
        /** Glantra brand, deep green */
        brand: {
          DEFAULT: '#2D4F3F',
          50: '#f0f5f3',
          100: '#dce8e2',
          200: '#b8d0c4',
          300: '#8fb0a0',
          400: '#5f8573',
          500: '#456a5a',
          600: '#2D4F3F',
          700: '#243d32',
          800: '#1e332a',
          900: '#1a2b24',
        },
      },
      fontFamily: {
        display: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-dm)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 24px -4px rgba(0,0,0,.45), 0 0 0 1px rgba(212,168,83,.08)',
        glow: '0 0 40px -10px rgba(212,168,83,.25)',
      },
    },
  },
  plugins: [],
}
export default config
