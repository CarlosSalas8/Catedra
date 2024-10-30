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
        customBlue3: '#D5FCFC',
        customBlue4: '#2B7EBF',
        customWhite: '#F7F9F9',
        customC2: '#c2e6fd',
        home: '#FFD98D',
        customgreen: '#8EF3A4',
        customgray: '#E3E3E3'
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif']
      },
      zIndex: {
        '60': '60', // Agrega un nuevo valor para z-index
      },
    },
  },
  plugins: [],
}
