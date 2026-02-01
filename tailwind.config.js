/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f2f6fb",
          100: "#e3edf7",
          200: "#c3d9ee",
          300: "#9bbfe3",
          400: "#5f96d1",
          500: "#2f6fb8",
          600: "#1f4f8f", // tom principal mais sóbrio
          700: "#183e72",
          800: "#122f55",
          900: "#0b1f39",
        },

        dark: {
          100: "#1e1e2e",
          200: "#181825",
          300: "#11111b",
          400: "#0a0a0f",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
