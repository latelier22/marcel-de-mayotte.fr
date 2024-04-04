// TW Elements is free under AGPL, with a commercial license required for specific uses. See more details: https://tw-elements.com/license/ and contact us for queries at tailwind@mdbootstrap.com
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
    // Or if using `src` directory:
    // "./src/**/*.{js,ts,jsx,tsx}",
    // "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFFAF0',
          100: '#FFF5E1',
          200: '#f3e2bc',
          300: '#FFD700',
          400: '#FFCA6A',
          500: '#f7cb14',
          600: '#e4b40c',
          700: '#bf9006',
          800: '#bd8509',
          900: '#976503',
        },
      },
      keyframes: () => ({
        slideRight: {
          "0%": { opacity: 0, marginLeft: "-600px" },
          "100%": { opacity: 1, marginLeft: "0" },
        },
        slideLeft: {
          "0%": { opacity: 0, marginRight: "-600px" },
          "100%": { opacity: 1, marginRight: "0" },
        },
      }),
      animation: {
        slideRight: "slideRight 1s ease-in",
        slideLeft: "slideLeft 1s ease-in",
      },
    },
  },
  darkMode: "class",
  plugins: [require("tw-elements/dist/plugin.cjs")],
};
