/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vigovia-purple': '#4A148C',
        'vigovia-blue': '#5B9FED',
        'vigovia-gradient-start': '#5B9FED',
        'vigovia-gradient-end': '#9C7FE8',
      },
    },
  },
  plugins: [],
}