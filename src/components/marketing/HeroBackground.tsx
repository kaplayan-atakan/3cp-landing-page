import { usePrefersReducedMotion } from '../../hooks';
import { GrainOverlay } from '../primitives';

/**
 * GPU-free hero background. Token-bound radial gradients over a near-white base,
 * plus a barely-there inline SVG grain (no network request). An optional very
 * slow drift animates only transform/opacity and stops under reduced-motion.
 * Replaces the former WebGL shader stack (removed with the `shaders` dependency).
 */
export function HeroBackground() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-neutral-50"
      aria-hidden="true"
    >
      <div
        className={`absolute inset-0 ${reducedMotion ? '' : 'motion-safe:animate-[heroDrift_28s_ease-in-out_infinite_alternate]'}`}
        style={{
          backgroundImage:
            'radial-gradient(1200px 600px at 72% 18%, rgb(var(--color-teal-700) / 0.12), transparent 60%),' +
            'radial-gradient(900px 520px at 18% 88%, rgb(var(--color-teal-700) / 0.07), transparent 60%)',
        }}
      />
      <GrainOverlay className="opacity-[0.03]" />
    </div>
  );
}
