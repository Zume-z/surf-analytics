/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  theme: {
    extend: {
      screens: {
        'hover-mod': { raw: '(hover: hover)' },
      },
      colors: {
        navy: '#111729',
        'blue-base': '#1d4ed8',
        'gray-dark': '#6d6e72',
        'gray-md': '#d1d5db',
        'gray-light': '#f3f4f6',
      },
    },
    plugins: [require('tailwindcss-no-scrollbar')],
  },
}
