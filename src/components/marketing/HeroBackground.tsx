import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks';
import { GrainOverlay } from '../primitives';

/**
 * GPU-free hero background. Token-bound radial gradients over a near-white base,
 * plus a barely-there inline SVG grain (no network request). An optional very
 * slow drift animates only transform/opacity and stops under reduced-motion.
 * Replaces the former WebGL shader stack (removed with the `shaders` dependency).
 *
 * On top of the gradient wash sits a hand-written SVG "beam" layer: three
 * hairline diagonal strokes in token teal, kept far right of the headline and
 * at very low opacity so they read as light, not decoration. The layer reuses
 * the existing heroDrift keyframes in alternate-reverse at a different period,
 * so it drifts against the gradient for a faint parallax shimmer — no new
 * keyframes, no new packages. Static under reduced motion.
 *
 * A scroll-scrubbed depth response wraps both layers: as the page scrolls
 * through the hero's height the wash drifts up 60px and fades to 35% opacity,
 * so the background recedes behind the content instead of sliding out with it.
 * The scrub sits on a single wrapper (heroDrift keyframes untouched inside),
 * uses transform/opacity only, is fully reversible, and is inert under
 * prefers-reduced-motion (wrapper rests at y 0 / opacity 1). The revealed
 * strip at the bottom stays on-tone: the static outer div keeps bg-neutral-50.
 */
export function HeroBackground() {
  const reducedMotion = usePrefersReducedMotion();

  const backgroundRef = useRef<HTMLDivElement>(null);
  // 0 while the hero sits at the top of the page, 1 once its bottom edge
  // reaches the top of the viewport — i.e. the scrub spans the hero's height.
  const { scrollYProgress } = useScroll({
    target: backgroundRef,
    offset: ['start start', 'end start'],
  });
  const washY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const washOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);

  return (
    <div
      ref={backgroundRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-neutral-50"
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0"
        style={reducedMotion ? undefined : { y: washY, opacity: washOpacity }}
      >
        <div
          className={`absolute inset-0 ${reducedMotion ? '' : 'motion-safe:animate-[heroDrift_28s_ease-in-out_infinite_alternate]'}`}
          style={{
            backgroundImage:
              'radial-gradient(1200px 600px at 72% 18%, rgb(var(--color-teal-700) / 0.12), transparent 60%),' +
              'radial-gradient(900px 520px at 18% 88%, rgb(var(--color-teal-700) / 0.07), transparent 60%)',
          }}
        />

        {/* Beam layer — counter-drifts very slowly against the gradient wash. */}
        <div
          className={`absolute inset-0 ${reducedMotion ? '' : 'motion-safe:animate-[heroDrift_36s_ease-in-out_infinite_alternate-reverse]'}`}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1440 800"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            <defs>
              <linearGradient id="hero-beam" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="rgb(var(--color-teal-700))" stopOpacity="0" />
                <stop offset="0.5" stopColor="rgb(var(--color-teal-700))" stopOpacity="0.32" />
                <stop offset="1" stopColor="rgb(var(--color-teal-700))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g opacity="0.4">
              <line x1="820" y1="-80" x2="1520" y2="620" stroke="url(#hero-beam)" strokeWidth="1.5" />
              <line x1="980" y1="-120" x2="1680" y2="580" stroke="url(#hero-beam)" strokeWidth="1" />
              <line x1="1120" y1="-60" x2="1760" y2="580" stroke="url(#hero-beam)" strokeWidth="1" />
            </g>
          </svg>
        </div>
      </motion.div>

      {/* Grain stays outside the scrubbed wrapper: it is the section's paper
          texture, so it must keep covering the full area at full strength. */}
      <GrainOverlay className="opacity-[0.03]" />
    </div>
  );
}
