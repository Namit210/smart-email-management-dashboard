/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Lato', 'system-ui', '-apple-system', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        lato: ['Lato', 'sans-serif']
      },
      fontSize: {
        'xs': ['0.8125rem', { lineHeight: '1.25rem' }],   // 13px
        'sm': ['0.9375rem', { lineHeight: '1.4rem' }],    // 15px
        'base': ['1rem', { lineHeight: '1.5rem' }],       // 16px
        'lg': ['1.125rem', { lineHeight: '1.6rem' }],     // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],     // 20px
      },
      colors: {
        google: {
          bg: '#f6f8fc',
          surface: '#ffffff',
          surfaceVariant: '#eaf1fb',
          hover: '#f0f4f9',
          border: '#e0e2ec',
          borderSubtle: '#eaedf1',
          text: '#1f1f1f',
          textSecondary: '#444746',
          textMuted: '#747775',
          blue: '#0b57d0',
          blueBg: '#d3e3fd',
          blueDark: '#041e49',
          blueFab: '#c2e7ff',
          amber: '#b06000',
          amberBg: '#ffe7d6',
          green: '#1e8e3e',
          greenBg: '#c4eed0',
          red: '#b3261e',
          redBg: '#f9dedc',
          purple: '#6750a4',
          purpleBg: '#e8def8'
        }
      }
    },
  },
  plugins: [],
}
