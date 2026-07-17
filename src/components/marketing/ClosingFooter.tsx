import { FOOTER_GROUPS, CONTACT_EMAIL } from '../../data/content';
import { asset } from '../../asset';
import { Reveal, TextRollButton, TRANSITION } from '../primitives';

/**
 * Section 7 — closing CTA band (brand teal) followed by the dark footer.
 */
export function ClosingFooter() {
  const mailto = `mailto:${CONTACT_EMAIL}`;

  return (
    <>
      {/* Closing CTA band */}
      {/* The focus ring token is brand-teal, invisible on this fixed teal band.
          Both surfaces below (the teal band and the dark footer) are fixed dark
          in either theme, so a white ring is the one that contrasts on both. */}
      <section
        id="demo"
        className="relative scroll-mt-24 overflow-hidden [--focus-ring-color:255_255_255]"
      >
        <img
          src={asset('images/banner-network.png')}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Sabit teal-700 primitive: from-brand-teal dark'ta teal-400'e dönüp
            üstteki beyaz metnin kontrastını düşürürdü; band iki temada da aynı.
            Light'ta piksel birebir (brand-teal light = teal-700, /90 = 0.9). */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--color-teal-700)/0.9)] to-footer-deep/85"
          aria-hidden="true"
        />
        {/* Heading → copy → CTA cascade (80ms apart) via the shared Reveal
            primitive; reduced motion renders the band in place. */}
        <div className="relative mx-auto max-w-container px-5 py-24 text-center sm:px-8 lg:px-12">
          <Reveal>
            <h2 className="mx-auto max-w-[820px] font-serif text-[clamp(1.5rem,4vw,2.6rem)] font-semibold leading-tight tracking-[-0.02em] text-white">
              Müşteri geri bildirimini içgörüye çevirmeye hazır mısınız?
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-4 max-w-[560px] text-white/90">
              Size özel bir demo ile 3CP'nin işletmenizde nasıl çalışacağını gösterelim.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <TextRollButton
                variant="white"
                label="Demo İste"
                href={mailto}
                className="py-3 pl-6 pr-2 text-sm"
              />
              <a
                href={mailto}
                className={`text-sm text-white underline decoration-white/60 underline-offset-4 hover:decoration-white ${TRANSITION}`}
              >
                E-posta ile yazın
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      {/* Sabit koyu yüzey + dark'ta sayfa zemininden ayrışma için üst ışık kenarı.
          Odak halkası da teal yerine beyaza sabitlenir (koyu zeminde görünür). */}
      <footer className="border-t border-white/10 bg-surface-dark text-white [--focus-ring-color:255_255_255]">
        <div className="mx-auto max-w-container px-5 pb-8 pt-12 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="text-xl font-bold tracking-tight">3CP</span>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
                Centralized Customer Control Panel. Restoran zincirleri için çok-kiracılı
                müşteri yönetim platformu.
              </p>
            </div>

            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-white">{group.title}</h3>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => {
                    const isExternal = !link.href.startsWith('#');
                    return (
                      <li key={`${group.title}-${link.label}`}>
                        <a
                          href={isExternal ? asset(link.href) : link.href}
                          {...(isExternal
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                          className={`text-sm text-white/70 hover:text-white ${TRANSITION}`}
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Sabit ayraç (#253858): border-neutral-800 dark'ta açık renge invert olurdu. */}
          <div className="mt-10 border-t border-[rgb(var(--color-neutral-800-fixed))] pt-6">
            <p className="text-xs text-white/60">© 2026 3CP. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
