/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        noir: {
          950: '#050507',
          900: '#09090d',
          850: '#0f0f15',
          800: '#14141d',
          700: '#1d1d29',
          600: '#2c2c3c',
          500: '#404054',
          400: '#676780',
          300: '#9595ad',
          200: '#c5c5d6',
          100: '#ededf5',
        },
        evidence: {
          gold: '#f59e0b',
          amber: '#d97706',
          crimson: '#dc2626',
          emerald: '#059669',
          cyan: '#0891b2',
        }
      },
      fontFamily: {
        sans: ['Tajawal', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Courier New', 'monospace'],
        display: ['Cinzel', 'Tajawal', 'serif'],
      },
      boxShadow: {
        'noir-card': '0 4px 20px -2px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
        'evidence-glow': '0 0 15px -3px rgba(245, 158, 11, 0.25)',
        'alert-glow': '0 0 15px -3px rgba(220, 38, 38, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'typewriter': 'typewriter 0.8s steps(20) infinite alternate',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
