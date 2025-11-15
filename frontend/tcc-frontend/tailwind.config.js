// File: tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This line tells Tailwind to scan your .jsx files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}