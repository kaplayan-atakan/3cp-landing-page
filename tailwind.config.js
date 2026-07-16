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
        'surface-raised': token('--color-background-raised'),
        'surface-overlay': token('--color-background-overlay'),

        // Semantic text/border/scrim tokens — theme-aware alternatives to the
        // neutral-* scale, intended for the dark-mode component migration.
        'content-primary': token('--color-text-primary'),
        'content-secondary': token('--color-text-secondary'),
        'content-subtle': token('--color-text-subtle'),
        'content-inverse': token('--color-text-inverse'),
        'edge-default': token('--color-border-default'),
        'edge-subtle': token('--color-border-subtle'),
        blanket: token('--color-blanket'),

        // Fixed dark surface for intentionally-dark blocks (Integrations,
        // footer, terminal): identical in both themes, immune to the dark-mode
        // neutral inversion. Matches light-mode bg-neutral-900 (#172B4D).
        'surface-dark': token('--color-surface-dark-fixed'),

        'footer-deep': token('--color-deep-navy'),
        'led-bg': token('--color-led-bg'),
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
        heroDrift: {
          '0%': { transform: 'translate3d(0,0,0) scale(1)' },
          '100%': { transform: 'translate3d(0,-1.5%,0) scale(1.04)' },
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
