/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'bangers': ['Bangers', 'cursive'],
        'comic': ['Comic Neue', 'cursive'],
        'impact': ['Impact', 'sans-serif'],
      },
      colors: {
        'comic-yellow': '#FFE500',
        'comic-red': '#FF2D2D',
        'comic-blue': '#00D4FF',
        'comic-dark': '#1a1a2e',
        'comic-purple': '#16213e',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-fast': 'pulse 0.5s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out infinite',
        'draw-x': 'drawX 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        drawX: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
