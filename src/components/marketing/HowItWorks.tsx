import { STEPS } from '../../data/content';
import { asset } from '../../asset';
import { SectionHeader } from '../primitives';

/**
 * Section 3 — how it works / the core value pipeline (light gray).
 * An alternating (zig-zag) walkthrough so each detailed product screenshot
 * gets a large, readable presentation. Stacks vertically on mobile/tablet.
 */
export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="scroll-mt-24 border-t border-neutral-100 bg-white">
      <div className="mx-auto max-w-container py-20">
        <SectionHeader
          number="03"
          pill="Otomasyon Akışı"
          title="Üç adımda ham veriden stratejik içgörüye"
        />

        <div className="mt-4 flex flex-col gap-16 px-5 sm:px-8 lg:mt-12 lg:gap-24 lg:px-12">
          {STEPS.map((step, index) => {
            const imageFirst = index % 2 === 0;
            return (
              <div
                key={step.number}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
              >
                {/* Screenshot */}
                <div className={imageFirst ? 'lg:order-1' : 'lg:order-2'}>
                  <img
                    src={asset(step.image)}
                    alt={step.imageAlt}
                    loading="lazy"
                    className={
                      step.portrait
                        ? 'mx-auto max-h-[600px] w-auto rounded-[2rem] shadow-overlay'
                        : 'w-full rounded-2xl border border-neutral-200 shadow-overlay'
                    }
                  />
                </div>

                {/* Copy */}
                <div className={imageFirst ? 'lg:order-2' : 'lg:order-1'}>
                  <span className="font-mono text-4xl font-bold text-brand-teal">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold text-neutral-900 sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[520px] text-base leading-relaxed text-neutral-600">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-16 px-5 text-center text-lg font-medium text-neutral-900 sm:px-8 lg:px-12">
          Yorumları elle okumak yerine, sadece harekete geçmeniz gerekeni görürsünüz.
        </p>
      </div>
    </section>
  );
}
