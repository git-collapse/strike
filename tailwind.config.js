/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Fira Sans', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
      },
      colors: {
        bg: {
          base: '#000000',
          surface: '#111111',
          hover: '#18181b',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a1a1aa',
        },
        accent: {
          primary: '#3b82f6',
          glow: 'rgba(59, 130, 246, 0.2)',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.1)',
          overclock: 'rgba(59, 130, 246, 0.5)',
        }
      },
      animation: {
        'glitch': 'glitch 6s infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 5s infinite',
      },
      keyframes: {
        glitch: {
          '0%, 94%, 100%': { transform: 'skew(0deg)', color: '#a1a1aa' },
          '95%': { transform: 'skew(-10deg)', color: '#3b82f6', textShadow: '2px 0 red, -2px 0 blue' },
          '96%': { transform: 'skew(10deg)', color: '#ffffff', textShadow: '-2px 0 red, 2px 0 blue' },
          '97%': { transform: 'skew(0deg)', color: '#3b82f6' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(0.98)' },
        }
      }
    },
  },
  plugins: [],
}
