import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1D9E75',
          dark: '#0F6E56',
          light: '#E1F5EE',
        },
      },
      maxWidth: { mobile: '480px' },
      screens: { mobile: '480px' },
    },
  },
  plugins: [],
} satisfies Config
