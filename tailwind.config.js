/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bentoli-green': '#0fa64b',
        'bentoli-navy': '#0b3a5b',
        'bentoli-muted': '#f6f8f9',
      },
    },
  },
  plugins: [],
};
