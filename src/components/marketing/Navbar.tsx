import { useEffect, useState } from 'react';
import { Clock, Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../../data/content';
import { useIstanbulClock } from '../../hooks';
import { TextRollButton, TRANSITION } from '../primitives';

/**
 * Mobile navigation overlay: fixed full-screen scrim with a white bottom sheet
 * that slides up. Rendered only while open.
 */
function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menü">
      <button
        type="button"
        aria-label="Menüyü kapat"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-neutral-900/30 backdrop-blur-sm"
      />
      <div className="absolute inset-x-0 bottom-0 mx-3 mb-3 rounded-2xl bg-white p-6 shadow-overlay">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-brand-teal">3CP</span>
          <button
            type="button"
            aria-label="Menüyü kapat"
            onClick={onClose}
            className="rounded-full bg-neutral-900 p-2 text-white"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <nav className="flex flex-col">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`border-b border-neutral-100 py-3 text-2xl font-medium text-neutral-900 hover:text-brand-teal ${TRANSITION}`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mt-6">
          <TextRollButton
            label="Demo İste"
            href="#demo"
            className="w-full justify-center py-3 pl-6 pr-2 text-base"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Fixed pill navbar shown across the whole page.
 *
 * The Teal "Demo İste" CTA is revealed only after the hero (and its own primary
 * Teal CTA) has scrolled away — enforcing the single-active-Teal-CTA rule.
 */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const time = useIstanbulClock();

  useEffect(() => {
    const onScroll = () => setShowCta(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto max-w-container p-3">
        <nav className="flex items-center justify-between rounded-full bg-white p-[5px] shadow-pill">
          {/* Left: wordmark + desktop links */}
          <div className="flex items-center gap-6 pl-3">
            <a
              href="#top"
              className="text-[20px] font-bold tracking-tight text-brand-teal"
              aria-label="3CP ana sayfa"
            >
              3CP
            </a>
            <div className="hidden items-center gap-6 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-[14px] text-neutral-900 hover:text-brand-teal ${TRANSITION}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: meta + scroll-revealed CTA (desktop) */}
          <div className="hidden items-center gap-4 md:flex">
            <span className="font-mono text-[13px] text-neutral-600">Enterprise Ready</span>
            <span className="flex items-center gap-1 font-mono text-[13px] text-neutral-600">
              <Clock size={14} aria-hidden="true" />
              {time} TR&apos;de
            </span>
            {/* `invisible` (not just opacity-0) is what pulls the hidden CTA out of
                the tab order — otherwise keyboard users land on a button they
                cannot see. Because `transition-all` covers `visibility`, it still
                fades out rather than snapping. */}
            <div
              className={`${TRANSITION} ${
                showCta
                  ? 'visible translate-x-0 opacity-100'
                  : 'invisible pointer-events-none translate-x-2 opacity-0'
              }`}
              aria-hidden={!showCta}
            >
              <TextRollButton
                label="Demo İste"
                href="#demo"
                className="py-2 pl-5 pr-2 text-[13px]"
              />
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Menüyü aç"
            className="rounded-full bg-neutral-900 p-2.5 text-white md:hidden"
          >
            <Menu size={18} aria-hidden="true" />
          </button>
        </nav>
      </div>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </header>
  );
}
