import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PHASES, FAQ } from '../../data/content';
import { PremiumCard, Reveal, SectionHeader, TRANSITION } from '../primitives';

/**
 * FAQ disclosure that opens smoothly instead of the native <details> snap.
 *
 * Uses the CSS grid-template-rows 0fr→1fr technique (the standard way to
 * animate height:auto) on an accessible button + region pair: the trigger is a
 * real <button> inside a heading with aria-expanded/aria-controls, so keyboard
 * and screen-reader behaviour matches — or improves on — native <details>.
 * The 250ms transition uses the house easing token; the global reduced-motion
 * kill-switch in index.css collapses it to an instant toggle.
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
            className={`shrink-0 text-neutral-600 ${open ? 'rotate-180' : ''} ${TRANSITION}`}
          />
        </button>
      </h3>
      <div
        id={regionId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-medium ease-smooth ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
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
 * Sections 10 and 11 — the product roadmap and the FAQ. They share a surface
 * because both answer "what happens next?" for a prospect.
 */
export function RoadmapFaq() {
  return (
    <section className="bg-surface-default">
      <div className="mx-auto max-w-container pb-16 pt-20">
        {/* Roadmap */}
        <div id="yol-haritasi" className="scroll-mt-24">
          <SectionHeader number="10" pill="Platform Kapsamı" title="Platformun kapsamı" />
          <div className="grid grid-cols-1 gap-6 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
            {PHASES.map((phase, index) => (
              <Reveal key={phase.phase} delay={index * 0.05}>
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
          <SectionHeader number="11" pill="Sık Sorulan Sorular" title="Merak edilenler" />
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
