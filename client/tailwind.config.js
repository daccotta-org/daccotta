/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily:
    {
      "body":["Poppins", "sans-serif"],
      "heading":["Montserrat", "sans-serif"]
    }
  },
  daisyui: {
    themes: [
      {
         Ashu: {

        "primary": "#fcd34d",

        "secondary": "#e11d48",

        "accent": "#00ffff",

        "neutral": "#000",

        "base-100": "#000",

        "info": "#0000ff",

        "success": "#00ff00",

        "warning": "#00ff00",

        "error": "#ff0000",
                },
                },
              ],
            },
    plugins: [require('daisyui')],
        }

