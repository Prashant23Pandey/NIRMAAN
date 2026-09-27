/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#176B5B',
          50: '#F0F7F5',
          100: '#DCECE7',
          200: '#B8DAD0',
          300: '#8AC1B3',
          400: '#53A392',
          500: '#176B5B',
          600: '#13584B',
          700: '#10463C',
          800: '#0E3730',
          900: '#0B2C27',
          dark: '#0e4238',
        },
        secondary: {
          DEFAULT: '#F4B942',
          light: '#FDEEC9',
          dark: '#D99818',
        },
        sand: {
          DEFAULT: '#F7F5EF',
          50: '#FCFBF8',
          100: '#F7F5EF',
          200: '#EFECE1',
          300: '#DFD9C5',
        },
        charcoal: {
          DEFAULT: '#17211F',
          muted: '#4B5553',
          light: '#7B8884',
        },
        success: {
          DEFAULT: '#2E8B57',
          light: '#EAF7EE',
        },
        danger: {
          DEFAULT: '#D64545',
          light: '#FDF0F0',
        },
        amber: {
          warning: '#E68A00',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Rozha One', 'Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        'card': '18px',
        'badge': '10px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(23, 107, 91, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'elevated': '0 12px 32px -4px rgba(23, 107, 91, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'passport': '0 16px 40px -8px rgba(23, 107, 91, 0.2), 0 6px 16px -2px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
