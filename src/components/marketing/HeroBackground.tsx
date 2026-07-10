import { usePrefersReducedMotion } from '../../hooks';

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
      {/* Inline SVG grain as a data-URI — no external fetch. */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
