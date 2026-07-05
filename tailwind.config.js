/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FBF0EA',
        ink: '#3B2A2C',
        inkSoft: '#8A7472',
        primary: '#B23A55',
        primaryDeep: '#8E2A42',
        coral: '#E98C7B',
        lavender: '#B7A6D9',
        lavenderSoft: '#EFE9F7',
        locked: '#D9CFCB',
        success: '#7BA98A',
        border: '#F0DFD8',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
