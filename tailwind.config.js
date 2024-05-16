// TW Elements is free under AGPL, with a commercial license required for specific uses. See more details: https://tw-elements.com/license/ and contact us for queries at tailwind@mdbootstrap.com

const { Linefont } = require('next/font/google');

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
      fontFamily: {
        texte: ['"Playfair Display"'],
        note: ['"BioRhyme"'],
        lien: ['"Montserrat"']
      },
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
        fadeInOut: {
          '0%, 100%': { opacity: 0 },
          '10%, 90%': { opacity: 1 }
        },
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
        fadeInOut: 'fadeInOut 6s ease-in-out',
        slideRight: "slideRight 1s ease-in",
        slideLeft: "slideLeft 1s ease-in",
      },
      typography: {
        DEFAULT: {
          css: {
            'h1, h2, h3, h4, h5, h6': {
              color: '#FF0000',
            },
            'p': {
              marginTop: '50',
              marginBottom: '1rem',
            },
            '.ql-align-center': {
              textAlign: 'center',
            },
            '.ql-align-right': {
              textAlign: 'right',
            },
            '.ql-align-left': {
              textAlign: 'left',
            },
          },
        },
      },

    }
  },
  darkMode: "class",
  plugins: [require("tw-elements/dist/plugin.cjs", '@tailwindcss/typography')],
};
