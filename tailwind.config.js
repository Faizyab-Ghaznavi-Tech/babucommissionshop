/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        date: {
          50: '#fbf8f2',
          100: '#f5eddf',
          200: '#e9dcc6',
          300: '#c6ab83',
          400: '#836344',
          500: '#6f4d32',
          600: '#5a3a24',
          700: '#4a2e1e',
          800: '#3a2118',
          900: '#2b1913',
          950: '#1c100c',
        },
        palm: {
          50: '#f2f5f0',
          100: '#e3eadf',
          200: '#cad7c2',
          300: '#a6b89a',
          400: '#748b68',
          500: '#526d48',
          600: '#26382b',
          700: '#1e2f23',
          800: '#18251c',
          900: '#111b14',
          950: '#0b120d',
        },
        sand: {
          50: '#fdfcf9',
          100: '#faf6ee',
          200: '#f3e9d3',
          300: '#ead7b0',
          400: '#dcbd84',
          500: '#c88b32',
          600: '#b87524',
          700: '#96591a',
          800: '#754317',
          900: '#583214',
          950: '#3f2818',
        },
        cream: '#f7f1e5',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
