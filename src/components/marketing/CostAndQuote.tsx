import { COST_MODELS, CONTACT_EMAIL } from '../../data/content';
import { PremiumCard, Reveal, SectionHeader, TRANSITION } from '../primitives';

/**
 * Section 9 — cost transparency, where a pricing table would normally go.
 *
 * 3CP has no pricing model yet: the architecture document lists the unit
 * economics as an open input that must land before the first sales proposal.
 * Inventing three tiers would be a fabrication, so the section instead explains
 * the two LLM cost models that *are* documented, at a high level — no unit
 * prices, no margins.
 *
 * The CTA is deliberately not Teal: by the time a visitor scrolls here the
 * navbar's Teal CTA is on screen, and the design language forbids two brand
 * coloured CTAs at once.
 */
export function CostAndQuote() {
  return (
    <section className="bg-surface-sunken">
      <div className="mx-auto max-w-container py-20">
        <SectionHeader
          number="09"
          pill="Şeffaf Maliyet"
          title="Yapay zeka maliyetiniz size görünür kalır"
        />

        <div className="grid grid-cols-1 gap-6 px-5 sm:px-8 md:grid-cols-2 lg:px-12">
          {COST_MODELS.map((model, index) => {
            const Icon = model.icon;
            return (
              <Reveal key={model.title} delay={index * 0.05}>
                <PremiumCard className="flex h-full flex-col">
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-brand-teal">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-semibold text-neutral-900">{model.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {model.description}
                  </p>
                  <ul className="mt-6 flex flex-col gap-3 border-t border-neutral-100 pt-6">
                    {model.bullets.map((bullet) => (
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

        <Reveal>
          <div className="mt-12 px-5 text-center sm:px-8 lg:px-12">
            <p className="mx-auto max-w-[560px] text-base font-medium text-neutral-900">
              Şube sayınıza ve modüllerinize göre fiyatlandırmayı, kısa bir demo görüşmesinde
              birlikte netleştirelim.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={`mt-6 inline-flex items-center justify-center rounded-full border border-neutral-200 bg-surface-default px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50 ${TRANSITION}`}
            >
              Demo İste
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
