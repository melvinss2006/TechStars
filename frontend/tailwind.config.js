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
        space: {
          950: '#070a12',
          900: '#0b1120',
          850: '#0f172a',
          800: '#17223b',
          700: '#233354',
          600: '#334771',
        },
        habitat: {
          sleeping: '#3b82f6', // blue
          hygiene: '#06b6d4',  // cyan
          galley: '#f59e0b',   // amber
          exercise: '#ef4444', // red
          medical: '#10b981',  // emerald
          work: '#8b5cf6',     // purple
          storage: '#64748b',  // slate
          airlock: '#ec4899',  // pink / bright
          corridor: '#475569'  // dark slate
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
