import { SECTORS, PROBLEMS } from '../../data/content';
import { Reveal, SectionHeader, TRANSITION } from '../primitives';

/**
 * Section 2 — sector strip ribbon + problem-space architecture (white).
 */
export function SectorProblem() {
  return (
    <section className="bg-surface-default">
      <div className="mx-auto max-w-container pb-16 pt-20 lg:pt-28">
        {/* Sector strip */}
        <div className="mb-16 flex flex-wrap items-center gap-4 border-b border-neutral-100 px-5 pb-8 sm:px-8 lg:px-12">
          <span className="font-mono text-[13px] text-neutral-600">
            3CP, çok şubeli restoran zincirleri için inşa edildi.
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {SECTORS.map((sector) => (
              <span
                key={sector.name}
                className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1 text-sm font-medium text-neutral-900"
              >
                {sector.name}
              </span>
            ))}
          </div>
        </div>

        {/* Problem header */}
        <SectionHeader
          number="01"
          pill="Müşteri Deneyimi Kaosu"
          title="Müşteri geri bildirimi her yerde — ama hiçbir yerde bir arada değil."
        />

        {/* Problem grid */}
        {/* Staggered entrance (60ms/card via the shared Reveal primitive);
            reduced motion renders cards in place. */}
        <div className="grid grid-cols-1 gap-6 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
          {PROBLEMS.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <Reveal key={problem.title} delay={index * 0.06} className="h-full">
                <div
                  className={`h-full rounded-xl bg-neutral-50 p-6 hover:shadow-raised ${TRANSITION}`}
                >
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-raised text-neutral-900">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold text-neutral-900">{problem.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {problem.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
