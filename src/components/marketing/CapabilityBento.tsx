import { CORE_MODULES } from '../../data/content';
import { GrainOverlay, PremiumCard, Reveal, SectionHeader } from '../primitives';

/**
 * Section 2 — the platform's four core modules (IAM, the customer record,
 * anonymous surveys, and RAG classification). Laid out as a bento: the two
 * `wide` modules span two columns each, so both rows fill.
 */
export function CapabilityBento() {
  return (
    <section id="platform" className="relative scroll-mt-24 overflow-hidden bg-surface-sunken">
      <GrainOverlay />
      <div className="relative z-10 mx-auto max-w-container py-20">
        <SectionHeader
          number="02"
          pill="Çekirdek Platform"
          title="Platformun dört çekirdek modülü"
        />

        <div className="grid grid-cols-1 gap-6 px-5 sm:px-8 lg:grid-cols-3 lg:px-12">
          {CORE_MODULES.map((module, index) => {
            const Icon = module.icon;
            return (
              <Reveal
                key={module.title}
                delay={index * 0.05}
                className={module.wide ? 'lg:col-span-2' : 'lg:col-span-1'}
              >
                <PremiumCard
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
                </PremiumCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
