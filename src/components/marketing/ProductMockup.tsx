import { ACTIVITY_FEED } from '../../data/content';
import { DemoBadge, StatusBadge } from '../primitives';

/**
 * Türkçe, GPU-free HTML/CSS product panel for the hero.
 *
 * Retina-crisp by construction (text/vector, not a raster screenshot) and
 * carries a DemoBadge because it seeds from ACTIVITY_FEED — the same honest
 * mock data used in the Section 8 panel preview. No invented traction
 * figures, no English strings, no fabricated dates.
 *
 * Uses a different window of ACTIVITY_FEED than Section 8 (which renders the
 * full list) so the hero panel and the Section 8 preview don't show an
 * identical row-for-row list.
 */
export function ProductMockup() {
  const items = ACTIVITY_FEED.slice(1, 6);

  return (
    <div className="relative rounded-2xl border border-neutral-200 bg-white p-5 shadow-overlay">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-neutral-600">3CP · Şube akışı</span>
        <DemoBadge />
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.branch + item.title}
            className="flex items-center justify-between gap-3 rounded-lg border border-neutral-100 px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-neutral-900">{item.title}</p>
              <p className="mt-0.5 truncate font-mono text-xs text-neutral-600">{item.meta}</p>
            </div>
            <StatusBadge label={item.branch} tone={item.tone} shape="pill" className="shrink-0" />
          </li>
        ))}
      </ul>
    </div>
  );
}
