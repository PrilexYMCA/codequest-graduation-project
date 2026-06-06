/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      colors: {
        cream: {
          50: '#FDFBF6',
          100: '#FAF8F2',
          200: '#F2EEE3',
          300: '#E8E1D0',
        },
        ink: {
          900: '#1F1A14',
          700: '#3D362C',
          500: '#6B6359',
          400: '#8B847A',
          300: '#B5AEA3',
        },
        brand: {
          50: '#F5F0FF',
          100: '#EDE2FF',
          200: '#DCC9FF',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#3B0764',
        },
        success: {
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        amber: {
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(31, 26, 20, 0.04), 0 4px 12px rgba(31, 26, 20, 0.04)',
        lift: '0 4px 8px rgba(31, 26, 20, 0.06), 0 12px 32px rgba(31, 26, 20, 0.08)',
        glow: '0 0 0 4px rgba(124, 58, 237, 0.12)',
      },
      backgroundImage: {
        'grid-cream': "linear-gradient(rgba(31,26,20,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(31,26,20,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: '32px 32px',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
