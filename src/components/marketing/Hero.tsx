import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { HERO_STATS } from '../../data/content';
import { usePrefersReducedMotion } from '../../hooks';
import { EASE_OUT_QUART, EASE_OUT_QUINT, SPRING_ENTRANCE } from '../../lib/motion';
import { NumberTicker } from '../magicui/number-ticker';
import { TextRollButton, TRANSITION } from '../primitives';
import { HeroBackground } from './HeroBackground';
import { ProductMockup } from './ProductMockup';

/**
 * The hero's one rehearsed sequence, in seconds from mount.
 *
 * Nothing here is scroll-triggered. The hero is above the fold, so the page's
 * `whileInView` reveal would fire at load anyway — but at whatever moment an
 * observer happens to resolve, which is the right behaviour for a section the
 * reader travels to and the wrong one for the composition every visitor opens
 * on. This is a first-load performance, so it runs from mount.
 *
 * The order is the headline's own sentence. The label sets the context, the
 * sentence is laid down, and on the beat it names the panel — "…tek kontrol
 * panelinde toplanır" — the panel seats, as the object the sentence just
 * promised. Supporting copy follows it down the column, and the scope figures
 * accumulate last: the claim is consolidation, so the sequence resolves with
 * everything having arrived in one place.
 */
const CUE = {
  eyebrow: 0,
  headline: 0.1,
  panel: 0.62,
  subhead: 0.7,
  actions: 0.8,
  trust: 0.9,
  stats: 1,
} as const;

/**
 * The headline is revealed by a top-down clip rather than a fade.
 *
 * Two reasons, in order of importance. It degrades the right way: an opacity
 * entrance opens a window in which the page's central claim exists but cannot
 * be read, while a clip that never runs leaves the sentence simply sitting
 * there. And it is the cheapest material available — Motion composites
 * `inset()` off the main thread, which is why their own guidance reaches for it
 * over properties that repaint.
 *
 * Word-by-word is the obvious move here, and is precisely why it isn't this:
 * the headline is one claim, not eight, so it is laid down in a single pass —
 * the way a headline is set.
 */
const HEADLINE_CLIPPED = 'inset(0% 0% 100% 0%)';
const HEADLINE_OPEN = 'inset(0% 0% 0% 0%)';

/** The scope figures' resting type — shared by the placeholder and the live
 *  ticker that replaces it, so the swap moves nothing. */
const STAT_FIGURE = 'font-mono text-3xl font-bold text-neutral-900 sm:text-4xl';

/** Mirrors NumberTicker's own tr-TR formatting, so the placeholder and the
 *  ticker carry one identical accessible name and one identical start frame. */
const FIGURE_FORMAT = new Intl.NumberFormat('tr-TR');

/**
 * Section 1 — hero: ambient CSS background, the headline block, an HTML/CSS
 * product panel (right half on desktop, stacks below the H1 on mobile), and a
 * scope counter row.
 */
export function Hero() {
  const reducedMotion = usePrefersReducedMotion();

  /**
   * Each NumberTicker starts itself the moment it intersects the viewport,
   * which on a desktop-height hero is mount — the count would be most of the
   * way over before the row it lives in had arrived. Mounting the tickers on
   * the closing beat is how they're handed the sequence's cue without reaching
   * into the shared ticker that several other sections depend on. Below the
   * fold nothing changes: a mounted ticker still waits for its own observer, so
   * a phone gets its count on scroll, exactly as before.
   */
  const [countersCued, setCountersCued] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setCountersCued(true);
      return;
    }
    const id = window.setTimeout(() => setCountersCued(true), CUE.stats * 1000);
    return () => window.clearTimeout(id);
  }, [reducedMotion]);

  return (
    <section id="top" className="relative overflow-hidden bg-neutral-50">
      <HeroBackground />

      {/* Top padding only has to clear breathing room now, not the navbar: the
          header is `sticky`, so it occupies real flow space above this section. */}
      <div className="relative z-20 mx-auto w-full max-w-container px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:px-12 lg:pt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="max-w-[640px]">
            <motion.p
              className="mb-1 font-mono text-[13px] tracking-wider text-neutral-600"
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: CUE.eyebrow, ease: EASE_OUT_QUART }}
            >
              Restoran zincirleri için merkezi müşteri kontrol paneli
            </motion.p>

            {/* `py-3` is load-bearing, not spacing: at `leading-[1.1]` Playfair
                paints ~8px outside the block box at the top of the clamp — the
                line's own content area lands exactly on the box edge — so a clip
                resting flush against that box would shave the ascenders and the
                Ç cedilla permanently. 12px leaves the measured overflow ~4px of
                room instead of zero, so the headline survives a font swap or a
                change to the type scale. The 12px is handed back by the
                eyebrow's `mb-1` and the subhead's `mt-1`: the column's rhythm
                stays at the 16px it was. */}
            <motion.div
              className="py-3"
              initial={reducedMotion ? false : { clipPath: HEADLINE_CLIPPED, y: 12 }}
              animate={{ clipPath: HEADLINE_OPEN, y: 0 }}
              transition={{ duration: 0.6, delay: CUE.headline, ease: EASE_OUT_QUINT }}
            >
              <h1 className="text-[clamp(1.75rem,6vw,3.8rem)] font-serif font-semibold leading-[1.1] tracking-[-0.03em] text-neutral-900">
                Çok şubeli müşteri operasyonunuz{' '}
                <span className="text-brand-teal">tek kontrol panelinde toplanır.</span>
              </h1>
            </motion.div>

            <motion.p
              className="mt-1 text-[17px] leading-relaxed text-neutral-600"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.36, delay: CUE.subhead, ease: EASE_OUT_QUART }}
            >
              3CP; anket, yorum, şikayet ve çağrı verinizi her şubeden tek bir merkezde toplar,
              yapay zekayla otomatik sınıflandırır ve ekibinize yalnızca aksiyon alınması gerekeni
              gösterir. Markalar ve şubeler arasında tek yetki modeli, tek denetim izi.
            </motion.p>

            {/* The pair arrives as one block: it is one decision with two
                answers, and staggering it would cascade a choice, not a list. */}
            <motion.div
              className="mt-8 flex flex-col gap-4 sm:flex-row"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.36, delay: CUE.actions, ease: EASE_OUT_QUART }}
            >
              <TextRollButton label="Demo İste" href="#demo" className="py-2.5 pl-6 pr-2 text-sm" />
              <a
                href="#nasil-calisir"
                className={`inline-flex items-center justify-center rounded-full border border-neutral-200 bg-surface-default px-6 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 ${TRANSITION}`}
              >
                Nasıl Çalışır?
              </a>
            </motion.div>

            <motion.p
              className="mt-6 font-mono text-[13px] text-neutral-600"
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, delay: CUE.trust, ease: EASE_OUT_QUART }}
            >
              Kurumsal Güvenlik · KVKK Uyumlu · Altyapı Bağımsız
            </motion.p>
          </div>

          {/* The panel seats as the sentence names it. SPRING_ENTRANCE carries
              no bounce — nothing threw this, it was placed, and overshoot would
              be the panel drawing attention to its own arrival. The scrub
              ProductMockup runs on itself lives on its own element, so the two
              transforms compose instead of fighting over one. */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...SPRING_ENTRANCE, delay: CUE.panel }}
          >
            <ProductMockup />
          </motion.div>
        </div>

        {/* Scope counters, not traction metrics — see HERO_STATS in content.ts. */}
        <motion.dl
          className="mt-14 grid max-w-[760px] grid-cols-2 gap-6 border-t border-neutral-200 pt-8 sm:grid-cols-3 lg:mt-16"
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: CUE.stats, ease: EASE_OUT_QUART }}
        >
          {HERO_STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                {countersCued ? (
                  // The sequence, not the ticker's own observer, decides when
                  // these count: on a desktop-height hero the row is already on
                  // screen, and the default trigger line sits below it.
                  <NumberTicker
                    value={stat.value}
                    className={STAT_FIGURE}
                    viewportMargin="0px"
                  />
                ) : (
                  <span
                    className={`inline-block tabular-nums ${STAT_FIGURE}`}
                    // The destination, never the intermediate frames — the same
                    // name the ticker will carry, so the swap is silent to AT.
                    aria-label={FIGURE_FORMAT.format(stat.value)}
                  >
                    {FIGURE_FORMAT.format(0)}
                  </span>
                )}
                {/* The label is already announced by the sr-only <dt>; hiding
                    this visible copy stops screen readers hearing it twice. */}
                <span
                  className="mt-2 block text-xs leading-snug text-neutral-600"
                  aria-hidden="true"
                >
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
