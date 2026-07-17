import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { STEPS, type Step } from '../../data/content';
import { asset } from '../../asset';
import { usePrefersReducedMotion } from '../../hooks';
import { Reveal, SectionHeader } from '../primitives';
import { StepAnalysisMockup } from './StepAnalysisMockup';
import { StepDashboardMockup } from './StepDashboardMockup';

/**
 * Tailwind's `lg`. Below it the zig-zag stacks into one column, so the centre
 * gutter — and with it the beam — does not exist. There is nothing to be
 * caused by, so the steps fall back to the page's plain reveal.
 */
const DESKTOP_QUERY = '(min-width: 1024px)';

/** Matches the rail's `inset-y-2`. */
const RAIL_INSET_PX = 8;

/**
 * Beam travel, in rail px, over which a step resolves: it starts as the beam
 * closes on the step's node and finishes just past it. Sized in pixels of beam
 * travel rather than in progress units so a step resolves over the same
 * physical distance no matter how tall the section renders.
 */
const RESOLVE_LEAD_PX = 200;
const RESOLVE_SETTLE_PX = 40;

/**
 * The node's own band is deliberately tight. A wide one would make the light
 * a fade that happens to finish near the beam; 36px of travel makes it an
 * arrival.
 */
const NODE_LEAD_PX = 26;
const NODE_SETTLE_PX = 10;

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const handler = () => setMatches(list.matches);
    handler();
    list.addEventListener('change', handler);
    return () => list.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

interface RailGeometry {
  /** The beam's full travel, in px. */
  height: number;
  /** Each step's node, in px from the rail's top. */
  nodes: number[];
}

/**
 * Section 3 — how it works / the core value pipeline.
 *
 * The section is a SEQUENCE (01 → 02 → 03), and the beam running down the
 * zig-zag's centre gutter is that sequence made visible. So the beam is not
 * decoration alongside the steps: it is what resolves them. One `useScroll`
 * progress drives the fill, the nodes, and each step's opacity, and every
 * threshold is derived from the measured px position of that step's node on
 * the rail — so "the beam reached step 02" and "step 02 resolved" are one
 * value read twice, not two effects that happen to coincide.
 *
 * Scrub (rather than a one-shot reveal) is right here because the reader sets
 * the pace: scrolling back up runs the pipeline backwards, which is the honest
 * behaviour for a diagram of a pipeline.
 */
export function HowItWorks() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const [rail, setRail] = useState<RailGeometry>({ height: 0, nodes: [] });

  // 0 when the steps block enters the lower viewport, 1 as its end passes the
  // middle. Over that range the beam's tip is very nearly stationary on screen
  // (it drifts from ~80vh to ~50vh), so it reads as a resolution front the
  // content rises through rather than as a bar that grows.
  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ['start 0.8', 'end 0.5'],
  });

  useLayoutEffect(() => {
    const container = stepsRef.current;
    if (!container) return;

    const measure = () => {
      const height = container.offsetHeight - RAIL_INSET_PX * 2;
      const rows = rowRefs.current;
      if (height <= 0 || rows.length !== STEPS.length) return;

      const nodes: number[] = [];
      for (const row of rows) {
        if (!row) return;
        // offsetTop resolves against the container: it is the rail's
        // `relative` positioning ancestor, so this is already rail-space.
        nodes.push(row.offsetTop + row.offsetHeight / 2 - RAIL_INSET_PX);
      }

      setRail((prev) =>
        prev.height === height && nodes.every((n, i) => prev.nodes[i] === n)
          ? prev
          : { height, nodes },
      );
    };

    measure();
    // Step 01's screenshot is lazy and unsized, so the rail's geometry is not
    // final until it lands. Observing beats measuring once and hoping: if the
    // nodes are wrong the causality silently degrades back into coincidence.
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const measured = rail.height > 0 && rail.nodes.length === STEPS.length;
  const beamDriven = isDesktop && !reducedMotion && measured;

  return (
    <section
      id="nasil-calisir"
      className="scroll-mt-24 border-t border-neutral-100 bg-surface-default"
    >
      <div className="mx-auto max-w-container py-20">
        <SectionHeader
          pill="Otomasyon Akışı"
          title="Üç adımda ham veriden stratejik içgörüye"
        />

        <div
          ref={stepsRef}
          className="relative mt-4 flex flex-col gap-16 px-5 sm:px-8 lg:mt-12 lg:gap-24 lg:px-12"
        >
          {/* The beam: a faint rail with a teal fill, in the centre gutter of
              the zig-zag so it reads as the pipeline joining the three steps. */}
          <div
            className="pointer-events-none absolute inset-y-2 left-1/2 hidden w-px -translate-x-1/2 lg:block"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-neutral-100" />
            {/* The gradient runs to full teal at the bottom, which — under an
                origin-top scaleY — is always the leading edge. The light is at
                the front and the trail is what it has already burned, so the
                exact moment the edge meets a node is unambiguous. */}
            <motion.div
              className="absolute inset-0 origin-top bg-gradient-to-b from-brand-teal/60 via-brand-teal/80 to-brand-teal"
              style={{ scaleY: beamDriven ? scrollYProgress : 1 }}
            />
            {rail.nodes.map((nodePx, index) =>
              beamDriven ? (
                <BeamNode
                  key={STEPS[index].number}
                  progress={scrollYProgress}
                  nodePx={nodePx}
                  railHeight={rail.height}
                />
              ) : (
                <ArrivedNode key={STEPS[index].number} nodePx={nodePx} />
              ),
            )}
          </div>

          {STEPS.map((step, index) => {
            const body = <StepBody step={step} imageFirst={index % 2 === 0} />;
            return (
              <div
                key={step.number}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
              >
                {beamDriven ? (
                  <BeamStep
                    progress={scrollYProgress}
                    nodePx={rail.nodes[index]}
                    railHeight={rail.height}
                  >
                    {body}
                  </BeamStep>
                ) : (
                  <Reveal>{body}</Reveal>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-16 px-5 text-center text-lg font-medium text-neutral-900 sm:px-8 lg:px-12">
          Yorumları elle okumak yerine, sadece harekete geçmeniz gerekeni görürsünüz.
        </p>
      </div>
    </section>
  );
}

/**
 * A step resolved by the beam rather than by its own arrival in the viewport.
 *
 * Opacity only, and deliberately: the two mockups already carry their own
 * scroll-scrubbed vertical parallax, so a second vertical gesture here would
 * fight them — and the beam is this section's choreography. The step is what
 * the beam reveals, not a performer in its own right.
 */
function BeamStep({
  progress,
  nodePx,
  railHeight,
  children,
}: {
  progress: MotionValue<number>;
  nodePx: number;
  railHeight: number;
  children: ReactNode;
}) {
  const opacity = useTransform(
    progress,
    [
      (nodePx - RESOLVE_LEAD_PX) / railHeight,
      (nodePx + RESOLVE_SETTLE_PX) / railHeight,
    ],
    [0, 1],
  );

  return <motion.div style={{ opacity }}>{children}</motion.div>;
}

/** The waypoint itself — present before the beam gets there, so the beam has
 * something visible to arrive AT. */
function NodeRing({ nodePx }: { nodePx: number }) {
  return (
    <span
      className="absolute left-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-200 bg-surface-default"
      style={{ top: nodePx }}
    />
  );
}

/** The node's teal core, lit by the beam landing on it. */
function BeamNode({
  progress,
  nodePx,
  railHeight,
}: {
  progress: MotionValue<number>;
  nodePx: number;
  railHeight: number;
}) {
  const arrival = useTransform(
    progress,
    [(nodePx - NODE_LEAD_PX) / railHeight, (nodePx + NODE_SETTLE_PX) / railHeight],
    [0, 1],
  );
  const scale = useTransform(arrival, [0, 1], [0.5, 1]);

  return (
    <>
      <NodeRing nodePx={nodePx} />
      <motion.span
        className="absolute left-1/2 h-[5px] w-[5px] rounded-full bg-brand-teal"
        style={{ top: nodePx, x: '-50%', y: '-50%', opacity: arrival, scale }}
      />
    </>
  );
}

/** A node at rest, lit. The state reduced-motion resolves to — the beam renders
 * complete, so every node has by definition been reached — and the fallback if
 * the rail is ever unmeasurable. */
function ArrivedNode({ nodePx }: { nodePx: number }) {
  return (
    <>
      <NodeRing nodePx={nodePx} />
      <span
        className="absolute left-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-teal"
        style={{ top: nodePx }}
      />
    </>
  );
}

/** The step's content, identical whichever way it is revealed. */
function StepBody({ step, imageFirst }: { step: Step; imageFirst: boolean }) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      {/* Screenshot or honest HTML/CSS mockup */}
      <div className={imageFirst ? 'lg:order-1' : 'lg:order-2'}>
        {step.mockup === 'analysis' ? (
          <StepAnalysisMockup />
        ) : step.mockup === 'dashboard' ? (
          <StepDashboardMockup />
        ) : (
          step.image && (
            <img
              src={asset(step.image)}
              alt={step.imageAlt ?? ''}
              loading="lazy"
              className={
                step.portrait
                  ? 'mx-auto max-h-[600px] w-auto rounded-[2rem] shadow-overlay'
                  : 'w-full rounded-2xl border border-neutral-200 shadow-overlay'
              }
            />
          )
        )}
      </div>

      {/* Copy */}
      <div className={imageFirst ? 'lg:order-2' : 'lg:order-1'}>
        <span className="font-mono text-4xl font-bold text-brand-teal">{step.number}</span>
        <h3 className="mt-3 text-xl font-semibold text-neutral-900 sm:text-2xl">
          {step.title}
        </h3>
        <p className="mt-3 max-w-[520px] text-base leading-relaxed text-neutral-600">
          {step.description}
        </p>
      </div>
    </div>
  );
}
