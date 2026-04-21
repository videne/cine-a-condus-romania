/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: '#F5F1E8',
        ink: '#1A1915',
        muted: '#6B6558',
        rule: '#D9D2C2',
        accent: '#8B2323',
      },
      maxWidth: {
        'prose-wide': '72ch',
      },
    },
  },
  plugins: [],
}
