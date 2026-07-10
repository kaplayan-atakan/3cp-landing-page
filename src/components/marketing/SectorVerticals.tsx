import { SECTOR_VERTICALS, CORE_CHIPS, SECTOR_CHIPS } from '../../data/content';
import { PremiumCard, Reveal, SectionHeader, StatPair, TRANSITION } from '../primitives';

/**
 * Structural concentric-circle diagram built purely from layout primitives:
 * an outer ring ("Sektörel Modüller") wrapping a solid teal core
 * ("3CP Evrensel Çekirdek").
 */
function ConcentricDiagram() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px]">
      <div className="absolute inset-0 flex items-start justify-center rounded-full border border-neutral-200 bg-white pt-6">
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-600">
          Sektörel Modüller
        </span>
      </div>
      <div className="absolute inset-[16%] flex items-start justify-center rounded-full border border-neutral-200 bg-neutral-50 pt-5">
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-600">
          Çekirdek Servisler
        </span>
      </div>
      <div className="absolute inset-[36%] flex items-center justify-center rounded-full bg-brand-teal p-4 text-center">
        <span className="text-sm font-semibold leading-tight text-white">
          3CP Evrensel Çekirdek
        </span>
      </div>
    </div>
  );
}

/**
 * Section 4 — the multi-sector framework. One card per vertical, each carrying
 * two figures. Where the documents define no module set for a vertical, the
 * card describes the reused core qualitatively rather than inventing a number.
 */
export function SectorVerticals() {
  return (
    <section className="bg-surface-sunken">
      <div className="mx-auto max-w-container py-20">
        <SectionHeader
          number="04"
          pill="Çok-Sektör Çerçevesi"
          title="Bugün restoran, yarın her sektör — aynı çekirdek üzerinde"
        />

        <div className="grid grid-cols-1 gap-6 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
          {SECTOR_VERTICALS.map((sector, index) => {
            const Icon = sector.icon;
            return (
              <Reveal key={sector.name} delay={index * 0.05}>
                <PremiumCard className="flex h-full flex-col">
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-brand-teal">
                    <Icon size={20} aria-hidden="true" />
                  </span>

                  <h3 className="text-base font-semibold text-neutral-900">{sector.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
                    {sector.description}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-neutral-100 pt-4">
                    {sector.stats.map((stat) => (
                      <StatPair key={stat.label} value={stat.value} label={stat.label} />
                    ))}
                  </div>
                </PremiumCard>
              </Reveal>
            );
          })}
        </div>

        {/* The core stays put; each vertical adds its own modules on top. */}
        <Reveal>
          <div className="mx-5 mt-12 rounded-xl border border-neutral-200 bg-white p-8 sm:mx-8 lg:mx-12">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
              <ConcentricDiagram />

              <div>
                <h3 className="text-xl font-semibold text-neutral-900">
                  Yeni sektör, çekirdeği değiştirmez
                </h3>
                <p className="mt-2 max-w-[560px] text-sm leading-relaxed text-neutral-600">
                  Çok-kiracılık, kişi kartı, dinamik yetki ve entegrasyon çatısı her dikeyde
                  aynıdır. Sektöre özel ihtiyaçlar sisteme bileşen ekleyerek karşılanır.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                      Değişmeyen çekirdek
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {CORE_CHIPS.map((chip) => (
                        <span
                          key={chip}
                          className={`inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-900 hover:border-brand-teal ${TRANSITION}`}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-brand-teal"
                            aria-hidden="true"
                          />
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                      Sektöre özel — Örnek: Emlak
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SECTOR_CHIPS.map((chip) => (
                        <span
                          key={chip}
                          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-600"
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-neutral-200"
                            aria-hidden="true"
                          />
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
