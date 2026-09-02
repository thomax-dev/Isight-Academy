/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sem: {
          green: {
            bg: '#ECFDF5',
            darkBg: 'rgba(6, 78, 59, 0.4)',
            border: '#10B981',
            darkBorder: '#059669',
            text: '#065F46',
            darkText: '#A7F3D0',
          },
          yellow: {
            bg: '#FFFBEB',
            darkBg: 'rgba(120, 53, 15, 0.4)',
            border: '#F59E0B',
            darkBorder: '#D97706',
            text: '#92400E',
            darkText: '#FDE68A',
          },
          red: {
            bg: '#FEF2F2',
            darkBg: 'rgba(127, 29, 29, 0.4)',
            border: '#EF4444',
            darkBorder: '#DC2626',
            text: '#991B1B',
            darkText: '#FECACA',
          },
          orange: {
            bg: '#FFF7ED',
            darkBg: 'rgba(124, 45, 18, 0.4)',
            border: '#F97316',
            darkBorder: '#EA580C',
            text: '#9A3412',
            darkText: '#FED7AA',
          },
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 20px -3px rgba(16, 185, 129, 0.4)',
        'glow-yellow': '0 0 20px -3px rgba(245, 158, 11, 0.45)',
        'glow-red': '0 0 20px -3px rgba(239, 68, 68, 0.45)',
        'glow-blue': '0 0 20px -3px rgba(59, 130, 246, 0.5)',
      }
    },
  },
  plugins: [],
}
