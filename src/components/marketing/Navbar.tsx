import { useEffect, useRef, useState } from 'react';
import { Clock, Menu, Moon, Sun, X } from 'lucide-react';
import { AnimatePresence, motion, type MotionProps } from 'motion/react';
import { NAV_LINKS } from '../../data/content';
import { useIstanbulClock, usePrefersReducedMotion, useTheme } from '../../hooks';
import { SPRING_DRAWER, SPRING_UI } from '../../lib/motion';
import { PRESS, TextRollButton, TRANSITION } from '../primitives';

/* ------------------------------------------------------------------ */
/* Material                                                            */
/* ------------------------------------------------------------------ */

/**
 * §12 — the page's one translucent material.
 *
 * A nav bar is not an opaque strip that eats a fixed band of the viewport; it
 * is a layer floating over content that keeps running underneath it. Three
 * parts make that read: a ground that only mostly covers, a backdrop blur so
 * what comes through is suggestion rather than detail, and `saturate` so the
 * colour behind survives the blur instead of going to grey mush.
 *
 * This is deliberately the ONLY glass on the page. Decorative glass is banned
 * outright; what this earns its exception with is that the translucency is
 * functional — content genuinely passes beneath it — and that it is one small
 * isolated element, which is also what keeps the blur inside a mobile frame
 * budget.
 *
 * Every value resolves through a theme token, so a single string yields a light
 * material in light and a dark one in dark: `surface-default` inverts, and
 * `edge-subtle` inverts with it — darker than the ground in light, lighter than
 * it in dark. That is the hairline §12 asks for, the contour where light catches
 * the material. On a pill it has to run the whole edge rather than sit along the
 * top, because a shape with no corners has no top. `ring` rather than `border`
 * so the 1px costs no layout.
 */
const NAV_MATERIAL =
  'nav-material bg-surface-default/70 shadow-pill ring-1 ring-edge-subtle backdrop-blur-xl backdrop-saturate-150';

/**
 * §14. `prefers-reduced-transparency` is a signal of its own, independent of
 * reduced motion: it asks the material to stop being a material — blur off,
 * ground opaque. Tailwind v3 ships no variant for the query and the config
 * belongs to another surface, so the rule lives here, component-local: one
 * query, two hooks, nothing global. `!important` is how index.css already lands
 * the reduced-motion override, and it keeps this immune to where the emitted
 * stylesheet ends up in source order.
 *
 * The scrim trades its blur for opacity rather than dropping the dim: with the
 * blur gone, separation has to come from somewhere.
 */
const REDUCED_TRANSPARENCY_CSS = `
@media (prefers-reduced-transparency: reduce) {
  .nav-material,
  .nav-scrim {
    -webkit-backdrop-filter: none !important;
    backdrop-filter: none !important;
  }
  .nav-material {
    background-color: rgb(var(--color-background-default)) !important;
  }
  .nav-scrim {
    background-color: rgb(var(--color-blanket) / 0.7) !important;
  }
}`;

/* ------------------------------------------------------------------ */
/* Press feedback                                                      */
/* ------------------------------------------------------------------ */

/**
 * `PRESS` from primitives, retargeted at the properties an icon button actually
 * changes. The shared constant transitions `box-shadow`, which none of these
 * have, and not `color`, which every one of them moves on hover — reusing it
 * verbatim would leave the glyph colour snapping while the fill behind it faded.
 * The pattern is the one primitives defines: the instant band, and a scale on
 * `:active`, which fires on pointer-DOWN (§1).
 */
const PRESS_ICON =
  'transition-[transform,background-color,color] duration-instant ease-smooth motion-safe:active:scale-[0.97]';

/**
 * §1 for a text link. Scale is the wrong response here — 14px re-rasterising
 * through 0.97 reads as a wobble, not a press — so the link answers in colour,
 * and it answers in the instant band: `active:duration-instant` cuts the press
 * response to 120ms while hover keeps the house's 300ms settle. Fast in on the
 * press, gentle out on the release, which is the shape of every bar button iOS
 * ships.
 *
 * The pressed colour is a step past hover rather than hover itself: on touch
 * there is no hover to have already spent the teal, and on a pointer the
 * `brand-teal-hovered` token is the design system's own "one state deeper".
 */
const PRESS_LINK =
  'transition-colors duration-medium ease-smooth hover:text-brand-teal active:text-brand-teal-hovered active:duration-instant';

/**
 * Hover/press fill for a ghost control sitting ON the material. An opaque chip
 * (`bg-neutral-100`) would punch a hole through the translucency exactly where
 * the eye is; a tint of the ink keeps the material intact underneath. It also
 * inverts for free — `content-primary` is dark ink in light and light ink in
 * dark, so "10% of the ink" is a shade in light and a highlight in dark. At 10%
 * over white it lands within a hair of the `neutral-100` it replaces.
 */
const GHOST_FILL = 'hover:bg-content-primary/10 active:bg-content-primary/20';

/* ------------------------------------------------------------------ */
/* ThemeToggle                                                         */
/* ------------------------------------------------------------------ */

/**
 * Ghost icon button that flips the `data-theme` attribute. The aria-label
 * names the theme the click switches TO, per the Turkish copy convention.
 */
function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Aydınlık tema' : 'Karanlık tema'}
      className={`rounded-full p-2 text-content-secondary hover:text-content-primary ${GHOST_FILL} ${PRESS_ICON} ${className}`}
    >
      {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* MobileMenu                                                          */
/* ------------------------------------------------------------------ */

/**
 * Mobile navigation overlay: a dimming scrim under a bottom sheet.
 *
 * §12 governs which of the two is a material. The sheet is a modal task, so it
 * takes the "dim to focus" treatment — scrim behind, opaque surface in front —
 * rather than a second pane of glass. That is not only the rule against stacking
 * translucency ("never stack a light translucent surface on another": the sheet
 * covers the navbar pill, and the pill is already translucent), it is also the
 * cheaper answer, since a sheet full of text over a blurred scrim over a blurred
 * pill would be three composited layers deep on the weakest hardware we serve.
 * `surface-overlay` rather than `surface-default`: this is the top of the
 * elevation scale, and in dark that is what makes it read as above the page
 * instead of level with it. In light both tokens are white — no pixel moves.
 */
function MobileMenu({ onClose }: { onClose: () => void }) {
  const reducedMotion = usePrefersReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  /**
   * §7. The sheet leaves along the path it arrived on — up off the bottom edge,
   * back down to it — and both directions run the same spring. That IS the
   * mirrored easing the rule asks for: a spring's response shape is symmetric
   * by construction, so there is no inverse bezier to hand-derive. `SPRING_DRAWER`
   * is Apple's shipped drawer value (damping 0.8 / response 0.3).
   *
   * §14. Under reduced motion the travel is dropped for a short cross-fade and
   * the overshoot goes with it. The gate has to live here in JS: the global
   * override in index.css only reaches CSS transitions, not Motion's animations.
   */
  const sheetMotion: MotionProps = reducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : {
        initial: { y: '100%' },
        animate: { y: '0%' },
        exit: { y: '100%' },
        transition: SPRING_DRAWER,
      };

  /* A surface that claims `aria-modal` owes the reader a way out that isn't
     "find the close button". Escape is the one every dialog is expected to
     answer — without it the sheet reads as a trap to exactly the people who
     can't flick it away. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  /*
   * `aria-modal` is a promise to assistive tech, not to the Tab key: on its own
   * it doesn't stop physical focus from walking out the back of the sheet into
   * the page behind the scrim. This makes the promise real — focus moves into
   * the panel on open, cycles within it on Tab, and returns to whatever opened
   * the sheet on close — and locks body scroll so the page underneath can't
   * drift while the sheet is up. Mount-only: the panel's contents are stable
   * for the life of the sheet.
   */
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    focusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menü">
      {/* §12 "dim to focus". Pushing the page back as well would mean reaching
          into App, so the scrim carries the separation alone. */}
      <motion.button
        type="button"
        aria-label="Menüyü kapat"
        onClick={onClose}
        className="nav-scrim absolute inset-0 h-full w-full cursor-default bg-blanket/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={SPRING_UI}
      />
      {/* The 12px inset lives on this wrapper as padding rather than on the card
          as margin, so the card's own height is the full travel: `y: 100%` parks
          its top edge exactly on the viewport bottom. With the margin outside the
          animated box, the same 100% would leave a 12px sliver sitting at the
          screen edge through the spring's settle, then blink out at unmount. */}
      <motion.div ref={panelRef} className="absolute inset-x-0 bottom-0 px-3 pb-3" {...sheetMotion}>
        <div className="rounded-2xl bg-surface-overlay p-6 shadow-overlay">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xl font-bold tracking-tight text-brand-teal">3CP</span>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                aria-label="Menüyü kapat"
                onClick={onClose}
                className={`rounded-full bg-neutral-900 p-2 text-neutral-50 active:bg-neutral-800 ${PRESS}`}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`border-b border-neutral-100 py-3 text-2xl font-medium text-content-primary ${PRESS_LINK}`}
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
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */

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
    /* `sticky`, not `fixed`: the LED band above sits in normal flow, so a fixed
       header would paint straight over it. Sticky keeps the header in flow —
       it rides below the band and pins to the viewport once the band scrolls out. */
    <header className="sticky top-0 z-40">
      <style>{REDUCED_TRANSPARENCY_CSS}</style>
      <div className="mx-auto max-w-container p-3">
        <nav className={`flex items-center justify-between rounded-full p-[5px] ${NAV_MATERIAL}`}>
          {/* Left: wordmark + desktop links */}
          <div className="flex items-center gap-6 pl-3">
            {/* The wordmark takes the scale that the nav links refuse: it is a
                mark, not a line of running text, so it reads as a target. */}
            <a
              href="#top"
              className={`text-[20px] font-bold tracking-tight text-brand-teal ${PRESS}`}
              aria-label="3CP ana sayfa"
            >
              3CP
            </a>
            <div className="hidden items-center gap-6 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-[14px] text-content-primary ${PRESS_LINK}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: meta + scroll-revealed CTA (desktop) */}
          <div className="hidden items-center gap-4 md:flex">
            {/* Meta waits for `lg`: at `md` the five nav links and this text fight
                for the same row and "Nasıl Çalışır?" wraps onto a second line.

                §12 vibrancy: this used to recede via `neutral-600`, which is the
                flat grey the rule names. Over an opaque white pill that was 5.3:1;
                over a translucent one with a dark section passing beneath it, it
                falls to 2.9:1 — the material is what broke it. Contrast is not
                where hierarchy can be spent here, so it goes to full ink (7.6:1 at
                the worst backdrop) and recedes on size and face instead: 13px mono
                against 14px sans. The weight bump is the rest of the same rule —
                small type over a moving, blurred backdrop needs the extra stroke. */}
            <span className="hidden items-center gap-1 font-mono text-[13px] font-medium text-content-primary lg:flex">
              <Clock size={14} aria-hidden="true" />
              {time} TR&apos;de
            </span>
            <ThemeToggle />
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
          {/* Fixed dark surface, not `neutral-900`: the neutral scale inverts in
              dark, which would flip this button to a bright fill on the dark
              navbar material. The sheet's own X button keeps the inversion —
              it sits on a dark panel where the bright fill is the contrast. */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Menüyü aç"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            className={`rounded-full bg-surface-dark p-2.5 text-white active:bg-[rgb(var(--color-neutral-800-fixed))] md:hidden ${PRESS}`}
          >
            <Menu size={18} aria-hidden="true" />
          </button>
        </nav>
      </div>

      {/* AnimatePresence is what gives the sheet an exit at all: mounted on a
          bare `&&`, it was appearing and vanishing on a single frame in both
          directions — symmetric only in the sense that neither end existed. */}
      <AnimatePresence>
        {menuOpen && <MobileMenu key="mobile-menu" onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </header>
  );
}
