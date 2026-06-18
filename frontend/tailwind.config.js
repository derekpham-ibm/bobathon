/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ibm-blue': {
          50: '#e8f4ff',
          100: '#d0e8ff',
          200: '#a8d8ff',
          300: '#78c0ff',
          400: '#4aa0ff',
          500: '#0f62fe',
          600: '#0043ce',
          700: '#002d9c',
          800: '#001d6c',
          900: '#001141',
        },
      },
    },
  },
  plugins: [],
}

// Made with Bob
