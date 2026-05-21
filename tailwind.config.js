/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          600: '#1351b4',
          700: '#0f3f8c',
          800: '#0a2d6b',
        },
      },
    },
  },
  plugins: [],
}
