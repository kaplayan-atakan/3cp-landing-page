import { ChevronDown } from 'lucide-react';
import { SECURITY_PILLARS, PHASES, FAQ } from '../data/content';
import { SectionHeader, StatusBadge, TRANSITION } from './primitives';

/**
 * Section 6 — Security pillars, product roadmap timeline, and FAQ (white).
 */
export function SecurityRoadmapFaq() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-container pb-16 pt-20">
        {/* Security */}
        <div id="guvenlik" className="scroll-mt-24">
          <SectionHeader
            number="05"
            pill="Güvenlik & Uyum"
            title="Veri güvenliği ve KVKK, sonradan değil — baştan"
          />
          <div className="grid grid-cols-1 gap-6 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
            {SECURITY_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-xl border border-neutral-200 p-6"
                >
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-brand-teal">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold text-neutral-900">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roadmap */}
        <div id="yol-haritasi" className="scroll-mt-24 pt-20">
          <SectionHeader number="06" pill="Ürün Vizyonu" title="Nereye gidiyoruz?" />
          <div className="grid grid-cols-1 gap-6 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
            {PHASES.map((phase) => (
              <div
                key={phase.phase}
                className={`rounded-xl bg-white p-6 ${
                  phase.current
                    ? 'border-2 border-brand-teal'
                    : 'border border-neutral-200'
                }`}
              >
                {phase.status && (
                  <StatusBadge
                    label={phase.status}
                    tone={phase.current ? 'success' : 'neutral'}
                    className="mb-3"
                  />
                )}
                <h3 className="text-base font-semibold text-neutral-900">{phase.phase}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div id="sss" className="scroll-mt-24 pt-20">
          <SectionHeader number="07" pill="Sık Sorulan Sorular" title="Merak edilenler" />
          <div className="mx-auto max-w-[820px] px-5 sm:px-8 lg:px-12">
            {FAQ.map((item) => (
              <details
                key={item.question}
                className="group border-b border-neutral-200 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left [&::-webkit-details-marker]:hidden">
                  <span className="text-base font-medium text-neutral-900">
                    {item.question}
                  </span>
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
