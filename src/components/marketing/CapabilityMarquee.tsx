import { MARQUEE_ROW_ONE, MARQUEE_ROW_TWO } from '../../data/content';
import { Marquee } from '../magicui/marquee';

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" aria-hidden="true" />
      {label}
    </span>
  );
}

/**
 * Two capability strips scrolling in opposite directions, paused on hover.
 * Every tag names a module the source documents define — nothing here is
 * aspirational filler.
 *
 * The edge gradients fade into `surface-sunken`, so this section must keep that
 * background.
 */
export function CapabilityMarquee() {
  return (
    <section className="bg-surface-sunken py-16">
      <div className="mx-auto max-w-container">
        <p className="mb-8 px-5 text-center text-sm font-medium text-neutral-600 sm:px-8 lg:px-12">
          Tek platform, uçtan uca müşteri yönetimi
        </p>

        <div className="relative flex flex-col gap-4 overflow-hidden">
          <Marquee pauseOnHover className="[--duration:45s]">
            {MARQUEE_ROW_ONE.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:45s]">
            {MARQUEE_ROW_TWO.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </Marquee>

          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface-sunken sm:w-24"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface-sunken sm:w-24"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
