// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}', // Add your components folder for purging unused styles
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
