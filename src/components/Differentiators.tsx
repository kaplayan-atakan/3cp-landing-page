import {
  DIFFERENTIATORS,
  CORE_CHIPS,
  SECTOR_CHIPS,
} from '../data/content';
import { SectionHeader, TRANSITION } from './primitives';

/**
 * Structural concentric-circle diagram built purely from layout primitives:
 * an outer ring ("Sektörel Modüller") wrapping a solid teal core
 * ("Sektör-Bağımsız Çekirdek").
 */
function ConcentricDiagram() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[380px]">
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
 * Section 5 — differentiators & platform promise (light gray, split layout).
 */
export function Differentiators() {
  return (
    <section className="bg-surface-sunken">
      <div className="mx-auto max-w-container py-20">
        <SectionHeader number="04" pill="Stratejik Üstünlük" title="3CP'yi farklı kılan ne?" />

        {/* Split: diagram + pillars */}
        <div className="mt-12 grid grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
          <div className="flex items-center justify-center">
            <ConcentricDiagram />
          </div>

          <div className="flex flex-col gap-8">
            {DIFFERENTIATORS.map((item, index) => (
              <div key={item.title} className="flex gap-4">
                <span className="mt-1 font-mono text-sm font-bold text-brand-teal">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform expansion matrix */}
        <div className="mx-5 mt-12 rounded-xl border border-neutral-200 bg-white p-8 sm:mx-8 lg:mx-12">
          <h3 className="mb-4 text-xl font-semibold text-neutral-900">
            Bugün restoran, yarın her sektör
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" aria-hidden="true" />
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
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-200" aria-hidden="true" />
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
