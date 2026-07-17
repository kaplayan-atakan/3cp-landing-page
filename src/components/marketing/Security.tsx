import { ShieldCheck } from 'lucide-react';
import { asset } from '../../asset';
import { SECURITY_PILLARS, AUDIT_LOG_LINES, type AuditLine } from '../../data/content';
import { AnimatedList } from '../magicui/animated-list';
import { DemoBadge, PremiumCard, Reveal, SectionHeader, TRANSITION } from '../primitives';

/** Event-name chip. Tuned for the dark log panel, so it can't reuse StatusBadge. */
const EVENT_TONES: Record<AuditLine['tone'], string> = {
  neutral: 'text-white/70 ring-white/20',
  warning: 'text-warning-fg ring-warning-fg/40',
  danger: 'text-white ring-white/40 bg-danger-fg/60',
};

function AuditRow({ line }: { line: AuditLine }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-white/[0.03] px-4 py-3 font-mono text-xs">
      {/* /60 keeps the timestamp at 6:1 on the navy panel; /40 would fall to 3.5:1. */}
      <span className="text-white/60">{line.time}</span>
      <span
        className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${EVENT_TONES[line.tone]}`}
      >
        {line.event}
      </span>
      <span className="text-white/60">{line.detail}</span>
    </div>
  );
}

/**
 * Section 7 — security and compliance. Every claim here is backed by the
 * architecture document; nothing that isn't (ISO 27001, SOC 2, uptime figures)
 * appears anywhere on the page.
 *
 * The log panel is a seeded illustration using 3CP's real audit event names. It
 * carries a DemoBadge and deliberately has no `aria-live` / `role="log"` — it
 * is not a live region, and pretending otherwise on a page that sells an
 * immutable audit trail would undercut the section's own argument.
 */
export function Security() {
  return (
    <section id="guvenlik" className="scroll-mt-24 bg-surface-default">
      <div className="mx-auto max-w-container py-20">
        <SectionHeader
          pill="Güvenlik ve Uyum"
          title="Veri güvenliği ve KVKK, sonradan değil — baştan"
        />

        <div className="grid grid-cols-1 gap-6 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
          {SECURITY_PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.title} delay={index * 0.05}>
                <PremiumCard className="flex h-full flex-col">
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-brand-teal">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold text-neutral-900">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {pillar.description}
                  </p>
                </PremiumCard>
              </Reveal>
            );
          })}
        </div>

        {/* Compliance row. KVKK only — no certification we do not hold. */}
        <Reveal>
          <div className="mt-10 flex flex-wrap items-center gap-4 px-5 sm:px-8 lg:px-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-surface-raised px-4 py-2 text-sm font-medium text-neutral-900">
              <ShieldCheck size={16} className="text-brand-teal" aria-hidden="true" />
              KVKK uyumlu
            </span>
            <a
              href={asset('belgeler/kvkk-gizlilik.pdf')}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm text-neutral-600 underline decoration-neutral-200 underline-offset-4 hover:text-neutral-900 hover:decoration-neutral-600 ${TRANSITION}`}
            >
              Aydınlatma metnini görüntüle
            </a>
          </div>
        </Reveal>

        {/* Seeded audit trail illustration. */}
        <Reveal className="mx-5 mt-12 sm:mx-8 lg:mx-12">
          {/* Sabit koyu panel (inversiyondan muaf) + dark'ta zeminden ayrışması
              için ince ışık kenarı. İçindeki white-alpha tonları iki temada da
              bu sabit navy üstünde durduğu için doğru kalır. */}
          <div className="overflow-hidden rounded-xl border border-white/10 bg-surface-dark p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Her erişim, her değişiklik kayıt altında
                </h3>
                <p className="mt-1 text-sm text-white/60">
                  Kim, ne zaman, hangi alanı gördü ya da değiştirdi.
                </p>
              </div>
              <DemoBadge label="Örnek denetim kaydı görünümü" />
            </div>

            <AnimatedList delay={50}>
              {AUDIT_LOG_LINES.map((line) => (
                <AuditRow key={`${line.time}-${line.event}`} line={line} />
              ))}
            </AnimatedList>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
