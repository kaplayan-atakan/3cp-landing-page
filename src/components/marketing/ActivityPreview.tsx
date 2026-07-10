import { ACTIVITY_FEED } from '../../data/content';
import { AnimatedList } from '../magicui/animated-list';
import { DemoBadge, GrainOverlay, Reveal, SectionHeader, StatusBadge } from '../primitives';

/**
 * Section 8 — what the panel looks like once branches are live.
 *
 * The feed is seeded mock data inside a framed demo panel. The branch count sits
 * *inside* that frame and belongs to the demo tenant; the page never claims a
 * live figure like "47 branches active right now", because no such number
 * exists yet.
 */
export function ActivityPreview() {
  return (
    <section className="relative overflow-hidden bg-surface-sunken">
      <GrainOverlay />
      <div className="relative z-10 mx-auto max-w-container py-20">
        <SectionHeader
          number="08"
          pill="Panel Önizleme"
          title="Şubeler arasında olan biten, tek akışta"
        />

        <Reveal className="mx-5 sm:mx-8 lg:mx-12">
          <div className="mx-auto max-w-[820px] overflow-hidden rounded-xl border border-neutral-200 shadow-overlay">
            {/* Panel chrome */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-3">
              <span className="font-mono text-xs text-neutral-600">
                Demo kiracı · 12 şube
              </span>
              <DemoBadge />
            </div>

            <AnimatedList delay={60} className="bg-white p-4">
              {ACTIVITY_FEED.map((item) => (
                <div
                  key={`${item.branch}-${item.title}`}
                  className="flex items-start justify-between gap-4 rounded-lg border border-neutral-200 bg-white p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                    <p className="mt-1 font-mono text-xs text-neutral-600">{item.meta}</p>
                  </div>
                  <StatusBadge label={item.branch} tone={item.tone} shape="pill" />
                </div>
              ))}
            </AnimatedList>
          </div>

          <p className="mx-auto mt-6 max-w-[620px] text-center text-sm leading-relaxed text-neutral-600">
            Kritik uyarılar ve eşik altı yanıtlar otomatik olarak aksiyon listenize düşer. Ekibiniz
            yorumları tek tek okumak yerine yalnızca harekete geçmesi gerekeni görür.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
