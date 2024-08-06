/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    
    fontFamily:
    {
      "body":["Poppins", "sans-serif"],
      "heading":["Montserrat", "sans-serif"]
    }
  },
  daisyui: {
   
    themes: ["light", "dark", "retro", "cyberpunk", "valentine", "aqua",
      {
         "Ashu": {
          "primary": "#5C4B99",
        //"primary": "#D20062",
        //"primary": "#D03D33",

        "secondary": "#002379",

        "accent": "#e11d48",

        "neutral": "#0000",

        "base-100": "#fff",

        "info": "#425583",

        "success": "#091CC8",

        "warning": "#00ff00",

        "error": "#ff0000",
                },
                },
              ],
            },
    plugins: [require('daisyui')],
        }

