/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        surface: '#161616',
        elevated: '#1F1F1F',
        primary: '#FF6B2B',
        'primary-dark': '#C44E16',
        foreground: '#FFFFFF',
        secondary: '#A1A1A1',
        muted: '#525252',
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#F59E0B',
        border: '#2A2A2A',
        'border-light': '#383838',
      },
      spacing: {
        13: '52px',
        15: '60px',
        18: '72px',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '18px',
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '16px' }],
      },
    },
  },
  plugins: [],
};