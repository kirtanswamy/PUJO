import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        alta: '#c8321f',
        haldi: '#e9a82f',
        brass: '#c9973a',
        indigo: '#14122b',
        paper: '#f4e9d3',
        ink: '#2a1a12',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Anek Bangla"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
