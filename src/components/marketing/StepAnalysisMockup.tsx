import { motion } from 'motion/react';
import { STEP_ANALYSIS } from '../../data/content';
import { usePrefersReducedMotion } from '../../hooks';
import { DemoBadge } from '../primitives';

/** Category chip tones. 'danger' has no StatusBadge equivalent (its tone
 * union is success | neutral | information), so both chips render from
 * plain token classes here rather than widening that union for one panel. */
const CATEGORY_TONE_CLASSES: Record<'success' | 'danger', string> = {
  success: 'bg-success text-success-fg',
  danger: 'bg-danger text-danger-fg',
};

/**
 * Step 02 — honest HTML/CSS replacement for the raster "AI analysis" screenshot.
 *
 * Text is real markup driven by STEP_ANALYSIS (seeded demo data), so it can
 * never contain the baked-in defects (English strings, wrong language) the
 * two prior raster/regeneration attempts produced. Carries a DemoBadge per
 * the page's rule for every panel rendering mock data.
 */
export function StepAnalysisMockup() {
  const { feedback, categories, sentimentScore, sentimentMax, positivePct, criticalPct, confidence } =
    STEP_ANALYSIS;
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="w-full rounded-2xl border border-neutral-200 bg-surface-raised p-5 shadow-overlay sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-xs text-neutral-600">3CP · Yapay Zeka Analizi</span>
        <DemoBadge />
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
          Gelen Geri Bildirim
        </h4>
        <p className="mt-2 rounded-lg border border-neutral-200 bg-surface-sunken p-4 text-sm leading-relaxed text-neutral-900">
          “{feedback}”
        </p>
      </div>

      <div className="mt-6">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
          Yapay Zeka Analizi (RAG Motoru)
        </h4>

        <div className="mt-3 divide-y divide-neutral-100 rounded-lg border border-neutral-200">
          {/* Kategori */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-4">
            <span className="text-sm text-neutral-600">Kategori</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category.label}
                  className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-xs font-bold ${CATEGORY_TONE_CLASSES[category.tone]}`}
                >
                  {category.label}
                </span>
              ))}
            </div>
          </div>

          {/* Duygu */}
          <div className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-neutral-600">Duygu (Duygu Skoru)</span>
              <span className="font-mono text-sm font-bold tabular-nums text-neutral-900">
                {sentimentScore} / {sentimentMax}
              </span>
            </div>
            {/* Segments keep their real widths; a single clip-path reveal
                (transform-free, GPU-friendly) sweeps the whole bar in from the
                left, once, when the panel scrolls into view. Reduced-motion
                renders the bar already full. */}
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100" aria-hidden="true">
              <motion.div
                className="flex h-full w-full"
                initial={reducedMotion ? false : { clipPath: 'inset(0 100% 0 0)' }}
                whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
                viewport={{ once: true, margin: '0px 0px -80px 0px' }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
              >
                <span className="h-full bg-success-fg" style={{ width: `${positivePct}%` }} />
                <span className="h-full bg-danger-fg" style={{ width: `${criticalPct}%` }} />
              </motion.div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success-fg" aria-hidden="true" />
                %{positivePct} Pozitif
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-danger-fg" aria-hidden="true" />
                %{criticalPct} Kritik
              </span>
            </div>
          </div>

          {/* Güven Oranı */}
          <div className="flex items-center justify-between gap-2 p-4">
            <span className="text-sm text-neutral-600">Güven Oranı</span>
            <span className="font-mono text-sm font-bold tabular-nums text-neutral-900">{confidence}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
