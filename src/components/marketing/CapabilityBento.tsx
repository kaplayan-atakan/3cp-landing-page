import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { CORE_MODULES } from '../../data/content';
import { usePrefersReducedMotion } from '../../hooks';
import { SPRING_ENTRANCE } from '../../lib/motion';
import { GrainOverlay, SectionHeader, TiltCard } from '../primitives';

/** Per-card parallax travel in px — deliberately inside the ±8–14px band so
 * the drift reads as a magazine-collage depth cue, never as movement that
 * competes with reading. */
const BENTO_PARALLAX_PX = 12;

/**
 * How much narrower than its cell each module starts.
 *
 * The section's subject is the platform's structure — four modules that
 * together make one thing — so the cards don't arrive as four finished
 * objects. Each opens from its left edge into the cell it occupies, which
 * means the two-column modules visibly travel further than the one-column
 * ones: the reveal measures each module's footprint in the grid, and the 6%
 * it grows through is the gutter closing. The modules widen until they meet,
 * and the platform is assembled rather than delivered whole.
 *
 * scaleX rather than a clip-path, despite clip being the cheaper material:
 * PremiumCard's elevation paints outside its box, and a clip resting at
 * `inset(0 0 0 0)` would sever that shadow — and TiltCard's 5° hover lift —
 * for the life of the page. The horizontal squeeze scaleX costs instead is
 * spent almost entirely inside the fade, since SPRING_ENTRANCE covers most of
 * the distance in the first third, so the type is square before it is legible.
 */
const MODULE_GAP_SCALE = 0.94;

/**
 * Scroll-scrubbed drift for one bento cell. Even-indexed cards travel
 * +12px→-12px across the grid's viewport pass, odd-indexed cards mirror it,
 * so neighbouring cards shear apart by at most ~24px at the section's edges
 * and converge to 0 offset mid-view (where people actually read).
 *
 * The parallax sits on this outer motion.div; TiltCard's pointer tilt/glow
 * stays on its own inner transform, so the two never fight. Transform-only,
 * reversible, and inert under prefers-reduced-motion (cards rest at 0).
 */
function BentoParallaxCell({
  progress,
  index,
  disabled,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  disabled: boolean;
  children: ReactNode;
}) {
  const from = index % 2 === 0 ? BENTO_PARALLAX_PX : -BENTO_PARALLAX_PX;
  const y = useTransform(progress, [0, 0.5, 1], [from, 0, -from]);
  return (
    <motion.div className="h-full" style={disabled ? undefined : { y }}>
      {children}
    </motion.div>
  );
}

/**
 * Section 2 — the platform's four core modules (IAM, the customer record,
 * anonymous surveys, and RAG classification). Laid out as a bento: the two
 * `wide` modules span two columns each, so both rows fill.
 */
export function CapabilityBento() {
  const reducedMotion = usePrefersReducedMotion();

  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section id="platform" className="relative scroll-mt-24 overflow-hidden bg-surface-sunken">
      <GrainOverlay />
      <div className="relative z-10 mx-auto max-w-container py-20">
        <SectionHeader
          pill="Çekirdek Platform"
          title="Platformun dört çekirdek modülü"
        />

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 px-5 sm:px-8 lg:grid-cols-3 lg:px-12"
        >
          {CORE_MODULES.map((module, index) => {
            const Icon = module.icon;
            return (
              <motion.div
                key={module.title}
                className={module.wide ? 'lg:col-span-2' : 'lg:col-span-1'}
                // The card opens from the edge it is anchored to in the grid,
                // not from its middle — a module grows into its span.
                style={{ transformOrigin: 'left' }}
                initial={reducedMotion ? false : { opacity: 0, scaleX: MODULE_GAP_SCALE }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true, margin: '0px 0px -100px 0px' }}
                transition={{ ...SPRING_ENTRANCE, delay: index * 0.07 }}
              >
                {/* Three layers, three jobs, three elements: this one installs
                    the card once, the parallax scrubs on scroll, the tilt
                    tracks the pointer. Stacked rather than merged so none of
                    them has to know about the others' transforms. */}
                <BentoParallaxCell
                  progress={scrollYProgress}
                  index={index}
                  disabled={reducedMotion}
                >
                  {/* TiltCard = PremiumCard + opt-in pointer tilt/glow; other
                      PremiumCard call sites are untouched. */}
                  <TiltCard
                    cornerLabel={String(index + 1).padStart(2, '0')}
                    className="flex h-full flex-col"
                  >
                    <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-brand-teal">
                      <Icon size={20} aria-hidden="true" />
                    </span>

                    <h3 className="text-lg font-semibold text-neutral-900">{module.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                      {module.description}
                    </p>

                    <ul className="mt-4 flex flex-col gap-2 border-t border-neutral-100 pt-4">
                      {module.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2 text-sm text-neutral-600">
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal"
                            aria-hidden="true"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </TiltCard>
                </BentoParallaxCell>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
