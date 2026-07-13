import { HERO_STATS } from '../../data/content';
import { NumberTicker } from '../magicui/number-ticker';
import { Reveal, TextRollButton, TRANSITION } from '../primitives';
import { HeroBackground } from './HeroBackground';
import { ProductMockup } from './ProductMockup';

/**
 * Section 1 — hero: ambient CSS background, the headline block, an HTML/CSS
 * product panel (right half on desktop, stacks below the H1 on mobile), and a
 * scope counter row.
 */
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-neutral-50">
      <HeroBackground />

      {/* Top padding only has to clear breathing room now, not the navbar: the
          header is `sticky`, so it occupies real flow space above this section. */}
      <div className="relative z-20 mx-auto w-full max-w-container px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:px-12 lg:pt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="max-w-[640px]">
            <p className="mb-4 font-mono text-[13px] tracking-wider text-neutral-600">
              Centralized Customer Control Panel
            </p>

            <h1 className="text-[clamp(1.75rem,6vw,3.8rem)] font-serif font-semibold leading-[1.1] tracking-[-0.03em] text-neutral-900">
              Çok şubeli müşteri operasyonunuz{' '}
              <span className="text-brand-teal">tek kontrol panelinde toplanır.</span>
            </h1>

            <p className="mt-4 text-[17px] leading-relaxed text-neutral-600">
              3CP; anket, yorum, şikayet ve çağrı verinizi her şubeden tek bir merkezde toplar,
              yapay zekayla otomatik sınıflandırır ve ekibinize yalnızca aksiyon alınması gerekeni
              gösterir. Markalar ve şubeler arasında tek yetki modeli, tek denetim izi.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <TextRollButton label="Demo İste" href="#demo" className="py-2.5 pl-6 pr-2 text-sm" />
              <a
                href="#nasil-calisir"
                className={`inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 ${TRANSITION}`}
              >
                Nasıl Çalışır?
              </a>
            </div>

            <p className="mt-6 font-mono text-[13px] text-neutral-600">
              Kurumsal Güvenlik · KVKK Uyumlu · Altyapı Bağımsız
            </p>
          </div>

          <Reveal delay={0.1}>
            <ProductMockup />
          </Reveal>
        </div>

        {/* Scope counters, not traction metrics — see HERO_STATS in content.ts. */}
        <Reveal delay={0.2}>
          <dl className="mt-14 grid max-w-[760px] grid-cols-2 gap-6 border-t border-neutral-200 pt-8 sm:grid-cols-4 lg:mt-16">
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <NumberTicker
                    value={stat.value}
                    className="font-mono text-3xl font-bold text-neutral-900 sm:text-4xl"
                  />
                  <span className="mt-2 block text-xs leading-snug text-neutral-600">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
