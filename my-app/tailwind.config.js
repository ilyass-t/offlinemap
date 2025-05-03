/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,tsx,ts,jsx}',
   
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary:'#030014'
      }
    },
  },
  plugins: [],
};
