import { motion } from 'motion/react';
import { SECTORS, PROBLEMS } from '../../data/content';
import { usePrefersReducedMotion } from '../../hooks';
import { SPRING_UI } from '../../lib/motion';
import { SectionHeader, TRANSITION } from '../primitives';

/**
 * Where each problem card starts, before the grid squares it up.
 *
 * The section's whole argument is in its title: the signals are everywhere and
 * never line up. So the cards don't rise into a grid that was already true —
 * they arrive out of true, each on its own drift and tilt, and are pulled
 * square. The misalignment is the problem stated in motion; the settle is the
 * answer, and it lands before the reader has finished the first heading.
 *
 * Deliberate values, not random ones: four cards, four offsets, each a
 * different distance and direction so the grid reads as gathered from four
 * places rather than nudged by one hand. Tilts stay under 1.5° — past that a
 * card stops reading as a panel that hasn't been squared up and starts reading
 * as a novelty sticker.
 */
const OFF_GRID: { x: number; y: number; rotate: number }[] = [
  { x: -10, y: 14, rotate: -1.2 },
  { x: 8, y: 20, rotate: 0.9 },
  { x: -6, y: 10, rotate: 1.3 },
  { x: 12, y: 16, rotate: -0.8 },
];

/**
 * Section 2 — sector strip ribbon + problem-space architecture (white).
 */
export function SectorProblem() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className="bg-surface-default">
      <div className="mx-auto max-w-container pb-16 pt-20 lg:pt-28">
        {/* Sector strip */}
        <div className="mb-16 flex flex-wrap items-center gap-4 border-b border-neutral-100 px-5 pb-8 sm:px-8 lg:px-12">
          <span className="font-mono text-[13px] text-neutral-600">
            3CP, çok şubeli restoran zincirleri için inşa edildi.
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {SECTORS.map((sector) => (
              <span
                key={sector.name}
                className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1 text-sm font-medium text-neutral-900"
              >
                {sector.name}
              </span>
            ))}
          </div>
        </div>

        {/* Problem header */}
        <SectionHeader
          pill="Müşteri Deneyimi Kaosu"
          title="Müşteri geri bildirimi her yerde — ama hiçbir yerde bir arada değil."
        />

        {/* Problem grid */}
        {/* SPRING_UI, not SPRING_ENTRANCE: these cards aren't materialising,
            they're being repositioned into the grid, and 0.4s of critically
            damped travel is what "squared up" sounds like. Bounce would undo
            the point — nothing threw them, and a card that overshoots its own
            slot has not settled into it. 4 × 60ms of stagger keeps the whole
            correction inside a beat. */}
        <div className="grid grid-cols-1 gap-6 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
          {PROBLEMS.map((problem, index) => {
            const Icon = problem.icon;
            const offGrid = OFF_GRID[index % OFF_GRID.length];
            return (
              <motion.div
                key={problem.title}
                className="h-full"
                initial={reducedMotion ? false : { opacity: 0, ...offGrid }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: '0px 0px -100px 0px' }}
                transition={{ ...SPRING_UI, delay: index * 0.06 }}
              >
                <div
                  className={`h-full rounded-xl bg-neutral-50 p-6 hover:shadow-raised ${TRANSITION}`}
                >
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-raised text-neutral-900">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold text-neutral-900">{problem.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {problem.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
