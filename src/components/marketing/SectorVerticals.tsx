import { useRef, type RefObject } from 'react';
import { motion, useInView, type Transition } from 'motion/react';
import { SECTOR_VERTICALS, CORE_CHIPS, RESTAURANT_MODULE_CHIPS } from '../../data/content';
import { EASE_OUT_QUART } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../hooks';
import { PremiumCard, Reveal, SectionHeader, StatPair } from '../primitives';

/**
 * The diagram's geometry. The radii mirror the layout it used to be built from
 * (nested divs at inset-[16%] and inset-[36%] of a 340px square), so the
 * resting picture is unchanged — only now the rings are strokes, and a stroke
 * can be drawn.
 */
const BOX = 340;
const CENTRE = BOX / 2;
const R_OUTER = CENTRE - 0.5; // a 1px stroke sits inside the box
const R_MID = CENTRE - BOX * 0.16;
const R_CORE = CENTRE - BOX * 0.36;

/**
 * The build order is the architecture: the core is a given, the service ring
 * closes around it, the sector ring closes around that. Each layer's contents
 * — its label, its chips — land as its own ring closes. Nothing ever appears
 * inside a boundary that has not been drawn yet.
 */
const CUE = {
  midRing: { delay: 0, duration: 0.45 },
  /** The plate floods in behind the stroke, so the boundary leads and the
   *  surface follows. Invisible in light (surface-default and surface-raised
   *  are both white) but real in dark, where a disc arriving before its own
   *  ring would break the build order. */
  midPlate: { delay: 0.1, duration: 0.4 },
  midLabel: { delay: 0.26, duration: 0.28 },
  coreChips: { delay: 0.3, duration: 0.28 },
  outerRing: { delay: 0.32, duration: 0.5 },
  outerPlate: { delay: 0.42, duration: 0.4 },
  outerLabel: { delay: 0.6, duration: 0.28 },
  moduleChips: { delay: 0.64, duration: 0.28 },
};

/** 50ms — inside the 30-80ms band. Five core chips spread over 200ms. */
const CHIP_STAGGER = 0.05;
/** A group's heading arrives just ahead of its chips, as one unit. */
const HEADING_LEAD = 0.05;

type Cue = (delay: number, duration: number) => Transition;

/**
 * Concentric-circle diagram: a sector-agnostic core, a ring of core services,
 * and the restaurant vertical's own modules on the outside.
 *
 * It draws from the inside out, because that is the claim the section makes —
 * the layers are built onto the core, not assembled alongside it. The core
 * itself never animates: it is "değişmeyen çekirdek", the premise the section
 * argues from, so it is simply there, and what gets built on top of it is what
 * performs.
 */
function ConcentricDiagram({
  containerRef,
  play,
  reducedMotion,
  cue,
}: {
  containerRef: RefObject<HTMLDivElement>;
  play: boolean;
  reducedMotion: boolean;
  cue: Cue;
}) {
  const fade = (spec: { delay: number; duration: number }) => ({
    initial: reducedMotion ? false : { opacity: 0 },
    animate: { opacity: play ? 1 : 0 },
    transition: cue(spec.delay, spec.duration),
  });

  return (
    <div ref={containerRef} className="relative mx-auto aspect-square w-full max-w-[340px]">
      <svg
        viewBox={`0 0 ${BOX} ${BOX}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <motion.circle
          cx={CENTRE}
          cy={CENTRE}
          r={R_OUTER}
          className="fill-surface-default"
          {...fade(CUE.outerPlate)}
        />
        <motion.circle
          cx={CENTRE}
          cy={CENTRE}
          r={R_MID}
          className="fill-neutral-50"
          {...fade(CUE.midPlate)}
        />
        <circle cx={CENTRE} cy={CENTRE} r={R_CORE} className="fill-brand-teal" />

        {/* Rings trace from 12 o'clock, clockwise. A <circle>'s equivalent path
            starts at 3 o'clock, so the group is rotated a quarter turn back. */}
        <g
          transform={`rotate(-90 ${CENTRE} ${CENTRE})`}
          fill="none"
          strokeWidth={1}
          className="stroke-neutral-200"
        >
          <motion.circle
            cx={CENTRE}
            cy={CENTRE}
            r={R_MID}
            initial={reducedMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: play ? 1 : 0 }}
            transition={cue(CUE.midRing.delay, CUE.midRing.duration)}
          />
          <motion.circle
            cx={CENTRE}
            cy={CENTRE}
            r={R_OUTER}
            initial={reducedMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: play ? 1 : 0 }}
            transition={cue(CUE.outerRing.delay, CUE.outerRing.duration)}
          />
        </g>
      </svg>

      {/* Labels stay HTML: they wrap, and SVG text does not. */}
      <div className="absolute inset-0 flex items-start justify-center pt-6">
        <motion.span
          className="text-xs font-medium uppercase tracking-wide text-neutral-600"
          {...fade(CUE.outerLabel)}
        >
          Sektörel Modüller
        </motion.span>
      </div>
      <div className="absolute inset-[16%] flex items-start justify-center pt-5">
        <motion.span
          className="text-xs font-medium uppercase tracking-wide text-neutral-600"
          {...fade(CUE.midLabel)}
        >
          Çekirdek Servisler
        </motion.span>
      </div>
      <div className="absolute inset-[36%] flex items-center justify-center p-4 text-center">
        {/* content-inverse: light'ta beyaz, dark'ta koyu navy — teal-400 zeminde
            beyaz metin ~2.7:1'e düşerdi. */}
        <span className="text-sm font-semibold leading-tight text-content-inverse">
          3CP Evrensel Çekirdek
        </span>
      </div>
    </div>
  );
}

/**
 * A layer's contents. They appear because the ring that defines the layer has
 * just closed — which is also the only reason they exist in the architecture.
 * They settle in place rather than rising into it: the layer produced them, it
 * did not deliver them from somewhere else.
 */
function LayerChips({
  heading,
  chips,
  tone,
  play,
  reducedMotion,
  cue,
  at,
}: {
  heading: string;
  chips: string[];
  tone: 'core' | 'module';
  play: boolean;
  reducedMotion: boolean;
  cue: Cue;
  at: { delay: number; duration: number };
}) {
  const isCore = tone === 'core';

  return (
    <div>
      <motion.p
        className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-600"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: play ? 1 : 0 }}
        transition={cue(at.delay - HEADING_LEAD, at.duration)}
      >
        {heading}
      </motion.p>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, index) => (
          <motion.span
            key={chip}
            className={
              isCore
                ? // transition-colors rather than the shared transition-all:
                  // this element also carries motion-driven opacity/transform,
                  // and a CSS transition on those would fight every frame
                  // motion writes.
                  'inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-surface-default px-3 py-2 text-sm font-medium text-neutral-900 transition-colors duration-medium ease-smooth hover:border-brand-teal'
                : 'inline-flex items-center gap-2 rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-600'
            }
            initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: play ? 1 : 0, scale: play ? 1 : 0.94 }}
            transition={cue(at.delay + index * CHIP_STAGGER, at.duration)}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isCore ? 'bg-brand-teal' : 'bg-neutral-200'}`}
              aria-hidden="true"
            />
            {chip}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/**
 * Section 4 — the restaurant vertical, carried by a sector-agnostic core.
 * SECTOR_VERTICALS holds a single live entry (Restoran Zincirleri); this
 * section makes no promise about any other sector.
 */
export function SectorVerticals() {
  const sector = SECTOR_VERTICALS[0];
  const Icon = sector.icon;
  const reducedMotion = usePrefersReducedMotion();

  // The diagram is the trigger, not the block around it: stacked, that block is
  // ~700px tall, and a trigger on its top edge would run the whole build with
  // the diagram still below the fold.
  const diagramRef = useRef<HTMLDivElement>(null);
  const inView = useInView(diagramRef, { once: true, margin: '0px 0px -100px 0px' });
  const play = inView || reducedMotion;

  // One trigger drives the rings and the chips together, so a chip's timing can
  // be stated as "when its ring closes" instead of "when the chip happens to
  // scroll into view" — which, once the layout stacks, is a different moment
  // entirely, and would make the causality a coincidence again.
  const cue: Cue = (delay, duration) =>
    reducedMotion ? { duration: 0 } : { duration, delay, ease: EASE_OUT_QUART };

  return (
    <section className="border-t border-neutral-100 bg-surface-sunken">
      <div className="mx-auto max-w-container py-20">
        <SectionHeader
          pill="Restoran Zincirleri"
          title="Restoran zincirleri için uçtan uca müşteri operasyonu"
        />

        <div className="px-5 sm:px-8 lg:px-12">
          <Reveal>
            <PremiumCard className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-brand-teal">
                <Icon size={20} aria-hidden="true" />
              </span>

              <div className="flex-1">
                <h3 className="text-base font-semibold text-neutral-900">{sector.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {sector.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 border-t border-neutral-100 pt-4 sm:w-[300px] sm:shrink-0 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                {sector.stats.map((stat) => (
                  <StatPair key={stat.label} value={stat.value} label={stat.label} />
                ))}
              </div>
            </PremiumCard>
          </Reveal>
        </div>

        {/* The core stays sector-agnostic; the restaurant vertical adds its own
            modules on top. No Reveal on this block: the diagram's build IS its
            entrance, and a fade-and-rise over the top of it would be a second
            one, running the section's one idea twice at once. */}
        <div className="mx-5 mt-12 rounded-xl border border-neutral-200 bg-surface-raised p-8 sm:mx-8 lg:mx-12">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
            <ConcentricDiagram
              containerRef={diagramRef}
              play={play}
              reducedMotion={reducedMotion}
              cue={cue}
            />

            <div>
              {/* The caption is prose, so it keeps the page's plain reveal —
                  prose rising into place is the honest default for prose. The
                  chips below it are not prose; they belong to the diagram. */}
              <Reveal>
                <h3 className="text-xl font-semibold text-neutral-900">
                  Sektöre özel modüller, sektör-agnostik çekirdek üzerine kurulur
                </h3>
                <p className="mt-2 max-w-[560px] text-sm leading-relaxed text-neutral-600">
                  Çok-kiracılık, kişi kartı, dinamik yetki ve entegrasyon çatısı sektörden
                  bağımsız aynı çekirdekte çalışır. Restoran zincirlerine özel ihtiyaçlar bu
                  çekirdek üzerine bileşen eklenerek karşılanır.
                </p>
              </Reveal>

              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                <LayerChips
                  heading="Değişmeyen çekirdek"
                  chips={CORE_CHIPS}
                  tone="core"
                  play={play}
                  reducedMotion={reducedMotion}
                  cue={cue}
                  at={CUE.coreChips}
                />
                <LayerChips
                  heading="Sektöre özel — Restoran Zincirleri"
                  chips={RESTAURANT_MODULE_CHIPS}
                  tone="module"
                  play={play}
                  reducedMotion={reducedMotion}
                  cue={cue}
                  at={CUE.moduleChips}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
