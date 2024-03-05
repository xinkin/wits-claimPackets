/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./Components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mikado: {
          50: "#f7f9ed",
          100: "#ecf0d1",
          200: "#dce2a6",
          300: "#cbd173",
          400: "#c1c34c",
          500: "#b4b13e",
          600: "#9a9034",
          700: "#7c6d2c",
          800: "#68592b",
          900: "#5a4b29",
          950: "#302613",
        },
        dark: "#0f0f0f",
        stroke: "#282a3a",
      },
    },
  },
  plugins: [],
};
