import { CAPABILITIES } from '../data/content';
import { SectionHeader, TRANSITION } from './primitives';

/**
 * Section 4 — capabilities grid & platform system (white).
 * 12 capability cards, presented uniformly (no status labels).
 */
export function Capabilities() {
  return (
    <section id="yetenekler" className="scroll-mt-24 bg-white">
      <div className="mx-auto max-w-container py-20">
        <SectionHeader
          number="03"
          pill="Platform Yetenekleri"
          title="Tek platform, uçtan uca müşteri yönetimi"
        />

        <div className="mt-12 grid grid-cols-1 gap-6 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-3 lg:px-12">
          {CAPABILITIES.map((capability) => {
            const Icon = capability.icon;
            return (
              <div
                key={capability.title}
                className={`flex flex-col rounded-xl border border-neutral-200 p-6 hover:shadow-raised ${TRANSITION}`}
              >
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-brand-teal">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3 className="text-base font-semibold text-neutral-900">
                  {capability.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {capability.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
