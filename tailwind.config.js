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
          50: '#faf7f2',
          100: '#f3ece0',
          200: '#e6d6bf',
          300: '#d4b88f',
          400: '#c2975a',
          500: '#a87b3e',
          600: '#8a6232',
          700: '#6f4d2b',
          800: '#5a3f28',
          900: '#4a3525',
          950: '#2a1c12',
        },
        palm: {
          50: '#f5f8f4',
          100: '#e8f0e6',
          200: '#cfe0cb',
          300: '#a9c4a3',
          400: '#7ba074',
          500: '#5a8052',
          600: '#45663e',
          700: '#385334',
          800: '#2f432d',
          900: '#283928',
          950: '#162016',
        },
        sand: {
          50: '#fdfcf9',
          100: '#faf6ee',
          200: '#f3e9d3',
          300: '#ead7b0',
          400: '#dcbd84',
          500: '#cea45e',
          600: '#bf8c4a',
          700: '#a0703f',
          800: '#835938',
          900: '#6d4a33',
          950: '#3f2818',
        },
        cream: '#faf7f0',
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
