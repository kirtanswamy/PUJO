import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        alta: '#e8d8c4',
        haldi: '#c9a84c',
        brass: '#b08d57',
        indigo: '#264653',
        paper: '#f5f0e8',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Anek Bangla"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
