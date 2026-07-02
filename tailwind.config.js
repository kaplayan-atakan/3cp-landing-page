/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-teal': '#0D7A6F',
        'brand-teal-dark': '#1FAF9E',
        // Merge-extends the default neutral palette; only these shades are overridden
        // with the 3CP design tokens, the rest (300/400/500/700/800) stay default.
        neutral: {
          50: '#F7F8F9',
          100: '#EBECF0',
          200: '#DFE1E6',
          600: '#5E6C84',
          900: '#172B4D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Geist Sans', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.25,0.1,0.25,1)',
      },
      transitionDuration: {
        DEFAULT: '500ms',
      },
      boxShadow: {
        raised: '0 1px 1px rgba(9,30,66,0.25), 0 0 1px rgba(9,30,66,0.31)',
        overlay: '0 4px 8px -2px rgba(9,30,66,0.25), 0 0 1px rgba(9,30,66,0.31)',
        pill: '0 2px 8px rgba(0,0,0,0.04)',
      },
      maxWidth: {
        container: '1440px',
      },
    },
  },
  plugins: [],
};
