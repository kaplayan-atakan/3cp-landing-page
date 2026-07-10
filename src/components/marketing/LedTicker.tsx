import { Marquee } from '../magicui/marquee';
import { MARQUEE_ROW_ONE, MARQUEE_ROW_TWO } from '../../data/content';

const LABELS = [...MARQUEE_ROW_ONE, ...MARQUEE_ROW_TWO];

/**
 * Dot-matrix LED ticker at the very top of the page. Near-black base, teal-400
 * glyphs with a faint bloom, and a CSS pixel-grid mask overlay that gives the
 * shop-window LED look. Scrolls with the page (not sticky). Reuses the Marquee
 * motor, which stops and becomes horizontally scrollable under reduced-motion.
 */
export function LedTicker() {
  return (
    <div
      className="relative w-full overflow-hidden bg-led-bg"
      role="marquee"
      aria-label="3CP platform yetenekleri"
    >
      {/* Pixel-grid mask — the single detail that reads as a real LED panel. */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-40"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(rgb(255 255 255 / 0.15) 0.5px, transparent 0.6px)',
          backgroundSize: '3px 3px',
        }}
      />
      {/* Edge fade so the strip reads as endless. */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        aria-hidden="true"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          background: 'transparent',
        }}
      />
      <Marquee pauseOnHover className="[--duration:32s] py-2.5">
        {LABELS.map((label) => (
          <span
            key={label}
            className="mx-6 font-mono text-[13px] font-medium uppercase tracking-[0.22em] text-brand-teal-dark"
            style={{ textShadow: '0 0 8px rgb(var(--color-teal-400) / 0.55)' }}
          >
            {label}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
