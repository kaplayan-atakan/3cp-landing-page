/** @type {import('tailwindcss').Config} */

/** Binds a Tailwind colour to an RGB-channel CSS variable, preserving /opacity modifiers. */
const token = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Every colour resolves through src/styles/tokens.css. Components never
      // carry raw hex — see the design language's token architecture (§11).
      colors: {
        'brand-teal': token('--color-background-brand-bold'),
        'brand-teal-hovered': token('--color-background-brand-hovered'),
        'brand-teal-dark': token('--color-teal-400'),

        // Merge-extends the default neutral palette; only the shades the design
        // language defines are overridden, the rest stay Tailwind's defaults.
        neutral: {
          50: token('--color-neutral-50'),
          100: token('--color-neutral-100'),
          200: token('--color-neutral-200'),
          400: token('--color-neutral-400'),
          600: token('--color-neutral-600'),
          800: token('--color-neutral-800'),
          900: token('--color-neutral-900'),
        },

        success: token('--color-background-success'),
        'success-fg': token('--color-text-success'),
        warning: token('--color-background-warning'),
        'warning-fg': token('--color-text-warning'),
        danger: token('--color-background-danger'),
        'danger-fg': token('--color-text-danger'),
        information: token('--color-background-information'),
        'information-fg': token('--color-text-information'),

        'surface-default': token('--color-background-default'),
        'surface-sunken': token('--color-background-sunken'),
        'footer-deep': token('--color-deep-navy'),
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display Variable"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        smooth: 'var(--motion-easing-standard)',
      },
      transitionDuration: {
        DEFAULT: 'var(--motion-duration-slow)',
        fast: 'var(--motion-duration-fast)',
        medium: 'var(--motion-duration-medium)',
      },
      boxShadow: {
        raised: 'var(--elevation-raised)',
        overlay: 'var(--elevation-overlay)',
        pill: 'var(--elevation-pill)',
      },
      maxWidth: {
        container: '1440px',
      },
      // Drives src/components/magicui/marquee.tsx. --gap and --duration are set
      // by the component; the keyframes only consume them.
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
      },
      animation: {
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
      },
    },
  },
  plugins: [],
};
