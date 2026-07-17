import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { CORE_MODULES } from '../../data/content';
import { usePrefersReducedMotion } from '../../hooks';
import { GrainOverlay, Reveal, SectionHeader, TiltCard } from '../primitives';

/** Per-card parallax travel in px — deliberately inside the ±8–14px band so
 * the drift reads as a magazine-collage depth cue, never as movement that
 * competes with reading. */
const BENTO_PARALLAX_PX = 12;

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
          number="02"
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
              <Reveal
                key={module.title}
                delay={index * 0.05}
                className={module.wide ? 'lg:col-span-2' : 'lg:col-span-1'}
              >
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
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
