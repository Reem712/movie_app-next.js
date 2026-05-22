/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%,100%': { transform: 'translateX(0)'   },
          '20%':      { transform: 'translateX(-6px)' },
          '40%':      { transform: 'translateX(6px)'  },
          '60%':      { transform: 'translateX(-3px)' },
          '80%':      { transform: 'translateX(3px)'  },
        },
        shine: {
          '0%':       { left: '-100%' },
          '60%,100%': { left: '160%'  },
        },
      },
      animation: {
        shake: 'shake 0.42s ease',
        shine: 'shine 2.6s infinite',
      },
    },
  },
  plugins: [],
};