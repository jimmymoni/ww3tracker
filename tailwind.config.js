/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        // Legacy font aliases for backwards compatibility
        'bangers': ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        'comic': ['Inter', 'system-ui', 'sans-serif'],
        'impact': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // War room palette - red accent only
        'war-red': '#cc1a1a',
        'war-red-hover': '#e02020',
        'war-red-muted': 'rgba(204,26,26,0.15)',
        'war-amber': '#f59e0b',
        'war-green': '#22c55e',
        // Legacy aliases for compatibility
        'comic-yellow': '#FFE500',
        'comic-red': '#cc1a1a',
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
