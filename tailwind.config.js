/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        plum:  { DEFAULT: '#4A0E7A', deep: '#2C094A', ink: '#1A0530' },
        orchid:{ DEFAULT: '#A855D8', light: '#D070ED', glow: '#C77DFF' },
        lilac: { DEFAULT: '#E6C7F5', mist: '#F7EDF9', pale: '#FCEFFA' },
        cream:  '#FAEBE2',
        smoke:  '#B7A6C4',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"Jost"', 'system-ui', 'sans-serif'],
        micro:   ['"Jost"', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: { soft: 'cubic-bezier(.22,.68,.16,1)' },
      keyframes: {
        fadeUp:  { '0%': { opacity: 0, transform: 'translateY(14px)' }, '100%': { opacity: 1, transform: 'none' } },
        flicker: { '0%,100%': { opacity: .85, transform: 'scale(1)' }, '45%': { opacity: 1, transform: 'scale(1.06)' }, '70%': { opacity: .9, transform: 'scale(.98)' } },
        marquee: { to: { transform: 'translateX(-50%)' } },
      },
      animation: {
        fadeUp:  'fadeUp .7s cubic-bezier(.22,.68,.16,1) forwards',
        flicker: 'flicker 3.2s ease-in-out infinite',
        marquee: 'marquee 34s linear infinite',
      },
    },
  },
  plugins: [],
};
