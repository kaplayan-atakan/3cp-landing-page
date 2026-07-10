import { ChevronDown } from 'lucide-react';
import { PHASES, FAQ } from '../../data/content';
import { Reveal, SectionHeader, StatusBadge, TRANSITION } from '../primitives';

/**
 * Sections 10 and 11 — the product roadmap and the FAQ. They share a surface
 * because both answer "what happens next?" for a prospect.
 */
export function RoadmapFaq() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-container pb-16 pt-20">
        {/* Roadmap */}
        <div id="yol-haritasi" className="scroll-mt-24">
          <SectionHeader number="10" pill="Ürün Vizyonu" title="Nereye gidiyoruz?" />
          <div className="grid grid-cols-1 gap-6 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
            {PHASES.map((phase, index) => (
              <Reveal key={phase.phase} delay={index * 0.05}>
                <div
                  className={`flex h-full flex-col rounded-xl bg-white p-6 ${
                    phase.current ? 'border-2 border-brand-teal' : 'border border-neutral-200'
                  }`}
                >
                  {phase.status && (
                    <StatusBadge
                      label={phase.status}
                      tone={phase.current ? 'success' : 'neutral'}
                      className="mb-3 self-start"
                    />
                  )}
                  <h3 className="text-base font-semibold text-neutral-900">{phase.phase}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {phase.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div id="sss" className="scroll-mt-24 pt-20">
          <SectionHeader number="11" pill="Sık Sorulan Sorular" title="Merak edilenler" />
          <div className="mx-auto max-w-[820px] px-5 sm:px-8 lg:px-12">
            {FAQ.map((item) => (
              <details key={item.question} className="group border-b border-neutral-200 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left [&::-webkit-details-marker]:hidden">
                  <span className="text-base font-medium text-neutral-900">{item.question}</span>
                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className={`shrink-0 text-neutral-600 group-open:rotate-180 ${TRANSITION}`}
                  />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
