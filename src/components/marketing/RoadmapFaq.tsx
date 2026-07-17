import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PHASES, FAQ } from '../../data/content';
import { PremiumCard, Reveal, SectionHeader } from '../primitives';

/**
 * FAQ disclosure that opens smoothly instead of the native <details> snap.
 *
 * Uses the CSS grid-template-rows 0fr→1fr technique (the standard way to
 * animate height:auto) on an accessible button + region pair: the trigger is a
 * real <button> inside a heading with aria-expanded/aria-controls, so keyboard
 * and screen-reader behaviour matches — or improves on — native <details>.
 *
 * Being a CSS transition rather than a Motion animation is what makes it
 * reduced-motion-safe for free: the global kill-switch in index.css collapses
 * `transition-duration` to 0.01ms, so the panel snaps open and shut. (Motion
 * writes inline styles frame by frame and ignores that rule — which is why the
 * scroll reveals need their own JS gate and this does not.)
 *
 * Spatial consistency (Apple §7): open and close are the same path walked in
 * both directions — the same property, between the same two values, over the
 * same 300ms, on the same curve, with the chevron rotating through the same arc.
 * §7 also suggests inverting the bézier for the return leg, which is
 * deliberately *not* done: the inverse of an ease-out is an ease-in, the token
 * set ships no ease-in on purpose, and a closing panel that creeps before it
 * moves is the exact sluggishness the ease-out-only vocabulary exists to
 * prevent. Identical curve both ways is the house reading of "mirrored".
 *
 * `invisible` when collapsed is load-bearing, not cosmetic: a zero-height
 * overflow-hidden box is still read aloud (that is precisely how .sr-only
 * works), so without it every answer was announced regardless of what
 * aria-expanded claimed. `visibility` transitions as a step function biased
 * toward `visible`, so it flips on at the start of an open and off at the end of
 * a close — the content stays visible for the whole collapse, then leaves.
 */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const regionId = useId();
  const buttonId = useId();

  return (
    <div className="border-b border-neutral-200 py-4">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={regionId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
        >
          <span className="text-base font-medium text-neutral-900">{question}</span>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className={`shrink-0 text-neutral-600 transition-transform duration-medium ease-smooth ${
              open ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>
      </h3>
      <div
        id={regionId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows,visibility] duration-medium ease-smooth ${
          open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p
            className={`pt-3 text-sm leading-relaxed text-neutral-600 transition-opacity duration-medium ease-smooth ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Sections 10 and 11 — the platform's scope and the FAQ. They share a surface
 * because both answer "what am I actually buying?" for a prospect.
 *
 * Motion, scope grid: the four groups enter together, with no per-card delay.
 * A left-to-right cascade is the house style for a timeline, and that is exactly
 * why it is wrong here — these are four parts of one platform, described in the
 * present tense with no calendar attached, and a cascade would quietly re-add
 * the schedule the copy deliberately refuses to promise. Each card still keeps
 * its own reveal rather than sharing one on the grid: at md the four wrap onto
 * two rows, and per-card reveals let the second row arrive when the reader
 * actually reaches it — an order that comes from the scroll position instead of
 * from an invented delay.
 *
 * Motion, FAQ: none. The six questions get no entrance. They are a surface the
 * reader is about to operate — an entrance animation would be a performance
 * playing over the top of the thing they came to click.
 */
export function RoadmapFaq() {
  return (
    <section className="bg-surface-default">
      <div className="mx-auto max-w-container pb-16 pt-20">
        {/* Scope. The `yol-haritasi` id stays: the nav links to it. */}
        <div id="yol-haritasi" className="scroll-mt-24">
          <SectionHeader pill="Platform Kapsamı" title="Platformun kapsamı" />
          <div className="grid grid-cols-1 gap-6 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
            {PHASES.map((phase, index) => (
              <Reveal key={phase.phase}>
                <PremiumCard
                  cornerLabel={String(index + 1).padStart(2, '0')}
                  className="flex h-full flex-col"
                >
                  <h3 className="text-base font-semibold text-neutral-900">{phase.phase}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {phase.description}
                  </p>
                </PremiumCard>
              </Reveal>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div id="sss" className="scroll-mt-24 pt-20">
          <SectionHeader pill="Sık Sorulan Sorular" title="Merak edilenler" />
          <div className="mx-auto max-w-[820px] px-5 sm:px-8 lg:px-12">
            {FAQ.map((item) => (
              <FaqItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
