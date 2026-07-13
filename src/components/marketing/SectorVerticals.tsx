import { SECTOR_VERTICALS, CORE_CHIPS, RESTAURANT_MODULE_CHIPS } from '../../data/content';
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
 * Section 4 — the restaurant vertical, carried by a sector-agnostic core.
 * SECTOR_VERTICALS holds a single live entry (Restoran Zincirleri); this
 * section makes no promise about any other sector.
 */
export function SectorVerticals() {
  const sector = SECTOR_VERTICALS[0];
  const Icon = sector.icon;

  return (
    <section className="border-t border-neutral-100 bg-surface-sunken">
      <div className="mx-auto max-w-container py-20">
        <SectionHeader
          number="04"
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

        {/* The core stays sector-agnostic; the restaurant vertical adds its own modules on top. */}
        <Reveal>
          <div className="mx-5 mt-12 rounded-xl border border-neutral-200 bg-white p-8 sm:mx-8 lg:mx-12">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
              <ConcentricDiagram />

              <div>
                <h3 className="text-xl font-semibold text-neutral-900">
                  Sektöre özel modüller, sektör-agnostik çekirdek üzerine kurulur
                </h3>
                <p className="mt-2 max-w-[560px] text-sm leading-relaxed text-neutral-600">
                  Çok-kiracılık, kişi kartı, dinamik yetki ve entegrasyon çatısı sektörden
                  bağımsız aynı çekirdekte çalışır. Restoran zincirlerine özel ihtiyaçlar bu
                  çekirdek üzerine bileşen eklenerek karşılanır.
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
                      Sektöre özel — Restoran Zincirleri
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {RESTAURANT_MODULE_CHIPS.map((chip) => (
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
