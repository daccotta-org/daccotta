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
                   
        "primary": "#414345",

        "secondary": "#000000",
        
        "accent": "#e11d48",

        "neutral": "#FAF9F6",

        "base-100": "#000",

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

