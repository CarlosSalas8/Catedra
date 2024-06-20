/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        customOrange: '#FFAB02',
        customPeach: '#FFD19B',
        customBlue: '#044170',
        customBlue2: '#0D4B82',
        customWhite: '#F7F9F9',
        customC2: '#c2e6fd',
        home: '#FFD98D'
      },
    },
  },
  plugins: [],
  fontFamily: {
    'montserrat': ['Montserrat', 'sans-serif'],
  },
}

