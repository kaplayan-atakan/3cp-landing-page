import { ADAPTER_CLASSES, OUTBOX_EVENT_SAMPLE } from '../../data/content';
import { Reveal } from '../primitives';

/** Phase chip tuned for the dark section — StatusBadge's tones assume a light surface. */
function PhaseChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-white/70 ring-1 ring-inset ring-white/20">
      {label}
    </span>
  );
}

/**
 * Section 6 — the integration adapter framework.
 *
 * No partner logos and no supplier names: the architecture document is explicit
 * that 3CP is vendor-agnostic and that the v1 customer's suppliers are simply
 * the first adapters to be written. What is real, and worth showing, is the
 * shape of the framework and the outbox contract behind it.
 *
 * This is the page's one dark section; it gives the code panel its natural home
 * and breaks up an otherwise uniformly light page.
 */
export function Integrations() {
  return (
    <section id="entegrasyon" className="scroll-mt-24 bg-neutral-900">
      <div className="mx-auto max-w-container py-20">
        <div className="mb-12 px-5 sm:px-8 lg:px-12">
          <div className="mb-4 flex items-center">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white font-mono text-xs text-neutral-900">
              06
            </span>
            <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
              Entegrasyon Çatısı
            </span>
          </div>
          <h2 className="max-w-[900px] text-[clamp(1.5rem,4vw,2.8rem)] font-serif font-semibold leading-[1.15] tracking-[-0.02em] text-white">
            3CP tedarikçilerinizin işini yapmaz — onlarla konuşur
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12">
          {/* Architecture diagram */}
          <Reveal>
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[420px] rounded-xl bg-brand-teal px-6 py-4 text-center">
                <p className="font-semibold text-white">3CP Çekirdek</p>
                <p className="mt-1 text-xs text-white/80">
                  Sektör ve tedarikçi bağımsız
                </p>
              </div>

              <div className="h-8 w-px bg-white/20" aria-hidden="true" />

              <div className="w-full max-w-[420px] rounded-xl border border-dashed border-white/30 px-6 py-4 text-center">
                <p className="font-mono text-sm text-white">IIntegrationAdapter</p>
                <p className="mt-1 text-xs text-white/60">
                  inbound ingestion · outbound push
                </p>
              </div>

              <div className="h-8 w-px bg-white/20" aria-hidden="true" />

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                {ADAPTER_CLASSES.map((adapter) => {
                  const Icon = adapter.icon;
                  return (
                    <div
                      key={adapter.name}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <p className="text-sm font-medium text-white">{adapter.name}</p>
                      <p className="mt-1 text-xs leading-relaxed text-white/60">
                        {adapter.examples}
                      </p>
                    </div>
                  );
                })}
              </div>

              <p className="mt-8 max-w-[460px] text-center text-sm leading-relaxed text-white/70">
                Adaptörler çekirdeğin dışındadır. POS'unuz ya da çağrı merkeziniz değiştiğinde
                yalnız adaptör değişir; platformunuz çalışmaya devam eder.
              </p>
            </div>
          </Reveal>

          {/* Outbox contract */}
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-6">
              <div className="overflow-hidden rounded-xl border border-white/10">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3">
                  <span className="font-mono text-xs text-white/70">
                    Transactional Outbox
                  </span>
                  <PhaseChip label="MİMARİ" />
                </div>
                <pre className="overflow-x-auto bg-black/30 p-4">
                  <code className="font-mono text-[13px] leading-relaxed text-white/80">
                    {OUTBOX_EVENT_SAMPLE}
                  </code>
                </pre>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-base font-semibold text-white">Kaybolmayan olaylar</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  İş verisi ve olay kaydı aynı transaction'da yazılır. Süreç çökse bile
                  dispatcher kaldığı yerden devam eder: veritabanına yazıldıysa olay mutlaka
                  işlenir. Kayıp bir sınıflandırma ya da kayıp bir şikayet ticket'ı, sessiz veri
                  kaybıdır — bu desen onu baştan engeller.
                </p>
                <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/50">
                  Yukarıdaki, 3CP'nin iç olay sözleşmesidir. Platform dışarıya public bir API
                  sunmaz; entegrasyonlar adaptör çatısı üzerinden yürür.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
