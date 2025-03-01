/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ["Manrope", "serif"],
        noticia: ["Noticia Text", "serif"],
        quicksand: ["Quicksand", "sans-serif"],
        lato: ["Lato", "sans-serif"],
      },
    },
   
  },
  daisyui: {
    themes: ["light", "dark", "cupcake","night","acid"],
  },
  plugins: [
    require('daisyui'),
  ],
}