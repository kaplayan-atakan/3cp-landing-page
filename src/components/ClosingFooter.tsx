import { FOOTER_GROUPS, CONTACT_EMAIL } from '../data/content';
import { asset } from '../asset';
import { TextRollButton, TRANSITION } from './primitives';

/**
 * Section 7 — closing CTA band (brand teal) followed by the dark footer.
 */
export function ClosingFooter() {
  const mailto = `mailto:${CONTACT_EMAIL}`;

  return (
    <>
      {/* Closing CTA band */}
      <section id="demo" className="relative scroll-mt-24 overflow-hidden">
        <img
          src={asset('images/banner-network.png')}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-brand-teal/90 to-footer-deep/85"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-container px-5 py-24 text-center sm:px-8 lg:px-12">
          <h2 className="mx-auto max-w-[820px] text-[clamp(1.5rem,4vw,2.6rem)] font-semibold leading-tight tracking-[-0.02em] text-white">
            Müşteri geri bildirimini içgörüye çevirmeye hazır mısınız?
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-white/90">
            Size özel bir demo ile 3CP'nin işletmenizde nasıl çalışacağını gösterelim.
          </p>
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
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white">
        <div className="mx-auto max-w-container px-5 pb-8 pt-12 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="text-xl font-bold tracking-tight">3CP</span>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
                Centralized Customer Control Panel. Çok-kiracılı, çok-sektörlü müşteri yönetim
                platformu.
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

          <div className="mt-10 border-t border-neutral-800 pt-6">
            <p className="text-xs text-white/60">© 2026 3CP. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
