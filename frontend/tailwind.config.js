/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C62828',
        maroon: '#800000',
      },
      boxShadow: {
        soft: '0 10px 25px rgba(0,0,0,.07)',
      },
      borderRadius: {
        xl: '1rem'
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}
