/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Tech-savvy neon colors
        'neon-blue': '#00d4ff',
        'neon-purple': '#8b5cf6',
        'neon-pink': '#ec4899',
        'accent-green': '#00ff88',
        'accent-orange': '#ff6b35',
        
        // Dark theme colors
        'dark-bg': '#0a0a0f',
        'darker-bg': '#050508',
        'card-bg': 'rgba(15, 15, 25, 0.8)',
        
        // Legacy colors for compatibility
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#667eea',
          600: '#5a6fd8',
          700: '#4c63d2',
          800: '#3f51b5',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#764ba2',
          600: '#6a4190',
          700: '#5b3a7a',
          800: '#4c2f64',
          900: '#3d254e',
        },
        accent: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f093fb',
          500: '#e085e8',
          600: '#d61f69',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        'gradient-tech': 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 50%, #ec4899 100%)',
        'gradient-neon': 'linear-gradient(45deg, #00d4ff, #8b5cf6, #ec4899, #00ff88)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'neon-glow': 'neonGlow 2s ease-in-out infinite',
        'text-glow': 'textGlow 3s ease-in-out infinite',
        'float-sql': 'floatSQL 20s linear infinite',
        'background-pulse': 'backgroundPulse 8s ease-in-out infinite',
        'gradient-shift': 'gradientShift 4s ease-in-out infinite',
        'scanline': 'scanline 3s linear infinite',
        'spin': 'spin 1s linear infinite',
        'sqlGlow': 'sqlGlow 3s ease-in-out infinite',
        'gridMove': 'gridMove 20s linear infinite',
        'circuitPulse': 'circuitPulse 15s ease-in-out infinite',
        'dataStream': 'dataStream 10s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        neonGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 15px #00d4ff, 0 0 20px #00d4ff'
          },
          '50%': { 
            boxShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff, 0 0 40px #00d4ff'
          }
        },
        textGlow: {
          '0%, 100%': { 
            textShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 15px #00d4ff'
          },
          '50%': { 
            textShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff'
          }
        },
        floatSQL: {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-20px) rotate(1deg)' },
          '50%': { transform: 'translateY(-10px) rotate(-1deg)' },
          '75%': { transform: 'translateY(-30px) rotate(0.5deg)' },
          '100%': { transform: 'translateY(0px) rotate(0deg)' }
        },
        backgroundPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' }
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        spin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' }
        },
        sqlGlow: {
          '0%, 100%': { textShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '50%': { textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)' }
        },
        gridMove: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(80px, 80px)' }
        },
        circuitPulse: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' }
        },
        dataStream: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' }
        }
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(0, 212, 255, 0.1)',
        'neon-lg': '0 0 30px rgba(0, 212, 255, 0.4), 0 0 60px rgba(0, 212, 255, 0.2)',
        'neon-xl': '0 0 40px rgba(0, 212, 255, 0.5), 0 0 80px rgba(0, 212, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
