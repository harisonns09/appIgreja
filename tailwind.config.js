/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./pages/**/*.html",
    "./**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5', // indigo-600
        secondary: '#312e81', // indigo-900
      }
    },
  },
  plugins: [],
}