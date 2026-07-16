import { Marquee } from '../magicui/marquee';
import { MARQUEE_ROW_ONE, MARQUEE_ROW_TWO } from '../../data/content';

const LABELS = [...MARQUEE_ROW_ONE, ...MARQUEE_ROW_TWO];

/** Edge fade applied to the glyph layer only — the dark panel itself stays
 *  full-bleed, so the strip reads as an endless board rather than a fading box. */
const GLYPH_EDGE_FADE =
  'linear-gradient(to right, transparent, black 7%, black 93%, transparent)';

/**
 * Dot-matrix LED ticker at the very top of the page: near-black panel, teal-400
 * glyphs with a soft bloom, and a pixel-grid overlay painted ON TOP of the text
 * — the grid over the glyphs is what makes it read as a shop-window LED board.
 *
 * It scrolls away with the page (it is not sticky); the navbar below it is
 * `sticky`, so it pins to the viewport only once this band has scrolled out.
 * Reuses the Marquee motor, which stops and becomes horizontally scrollable
 * under reduced-motion.
 */
export function LedTicker() {
  return (
    <div
      className="relative w-full overflow-hidden border-y border-edge-subtle bg-led-bg"
      role="marquee"
      aria-label="3CP platform yetenekleri"
    >
      {/* Glyph layer. The mask lives here, not on the panel, so only the text fades. */}
      <div
        style={{ maskImage: GLYPH_EDGE_FADE, WebkitMaskImage: GLYPH_EDGE_FADE }}
      >
        <Marquee pauseOnHover className="[--duration:36s] py-3">
          {LABELS.map((label) => (
            <span key={label} className="mx-5 inline-flex items-center gap-5">
              <span
                className="font-mono text-[13px] font-medium uppercase tracking-[0.24em] text-brand-teal-dark"
                style={{ textShadow: '0 0 10px rgb(var(--color-teal-400) / 0.6)' }}
              >
                {label}
              </span>
              {/* Bead between entries — the cadence of a real ticker board. */}
              <span
                aria-hidden="true"
                className="h-[3px] w-[3px] rounded-full bg-brand-teal-dark/60"
                style={{ boxShadow: '0 0 6px rgb(var(--color-teal-400) / 0.7)' }}
              />
            </span>
          ))}
        </Marquee>
      </div>

      {/* Pixel grid, painted over the glyphs. */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-40"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(rgb(255 255 255 / 0.15) 0.5px, transparent 0.6px)',
          backgroundSize: '3px 3px',
        }}
      />

      {/* Bottom hairline: a lit edge that seats the board against the page. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-px"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to right, transparent, rgb(var(--color-teal-400) / 0.55), transparent)',
        }}
      />
    </div>
  );
}
