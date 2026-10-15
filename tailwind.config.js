/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'rgb(var(--paper) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        sauce: 'rgb(var(--sauce) / <alpha-value>)',
        taxi: 'rgb(var(--taxi) / <alpha-value>)',
        grade: 'rgb(var(--grade) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        rise: { from: { opacity: '0', transform: 'translateY(12px) scale(.98)' }, to: { opacity: '1', transform: 'none' } },
        blink: { '50%': { opacity: '.35' } },
      },
      animation: {
        rise: 'rise .45s cubic-bezier(.2,.8,.2,1) both',
        blink: 'blink 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
