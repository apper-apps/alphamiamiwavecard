/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        miami: {
          pink: '#FF6B9D',
          turquoise: '#4ECDC4',
          yellow: '#FFE66D',
          surface: '#2A2D3A',
          background: '#1A1D29',
          mint: '#95E1D3',
          coral: '#FF8A80',
          purple: '#B39DDB'
        }
      },
      fontFamily: {
        'righteous': ['Righteous', 'cursive'],
        'jakarta': ['Plus Jakarta Sans', 'sans-serif']
      },
      animation: {
        'wave': 'wave 2s linear infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'pulse-neon': {
          'from': { boxShadow: '0 0 20px #FF6B9D' },
          'to': { boxShadow: '0 0 30px #FF6B9D, 0 0 40px #4ECDC4' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          'from': { textShadow: '0 0 20px #FF6B9D' },
          'to': { textShadow: '0 0 30px #FF6B9D, 0 0 40px #4ECDC4' }
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}