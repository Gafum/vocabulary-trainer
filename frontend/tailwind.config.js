/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm300: '300px',
      sm500: '520px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    container: {
      screens: {
        lg: '1024px',
        xl: '1280px',
        '2xl': '1496px',
        '3xl': '1640px',
      },
    },
    extend: {
      colors: {
        primaryGrey: '#3d3d3d',
        primaryRed: '#dc2626',
        primaryGreen: '#16a34a',
        primaryBlue: '#2563eb',
        primaryYellow: '#ca8a04',
      },
      dropShadow: {
        md: '0 0 3px #666',
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.container': {
          padding: '0 10px 40px',
          margin: '0 auto',
          '@media (min-width: 640px)': { padding: '0 24px 50px' },
          '@media (min-width: 1024px)': { padding: '0 32px 60px' },
        }
      });
    }
  ],
};
