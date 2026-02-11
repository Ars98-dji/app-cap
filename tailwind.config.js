/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#326761",
        "primary-dark": "#264f4a",
        "primary-hover": "#28524d",
        "background-light": "#f9fbfa",
        "background-dark": "#151d1c",
        "surface-light": "#ffffff",
        "surface-dark": "#1e2827",
        "border-light": "#ebf0ef",
        "border-dark": "#2d3b39",
        "text-main": "#121717",
        "text-secondary": "#63837f",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "sans": ["Inter", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
