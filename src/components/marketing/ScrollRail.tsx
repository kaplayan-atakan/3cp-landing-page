import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks';

/**
 * ScrollRail — "saat yelkovanı" scroll göstergesi.
 *
 * Viewport'un sağ kenarında sabit (fixed) dikey bir ray; üzerinde sayfa
 * scroll ilerlemesini izleyen dairesel bir topuz. Topuzun içindeki kısa
 * ibre, sayfa boyunca iki tam tur (0→720°) döner — yelkovan hissi.
 * Ray üzerindeki ince tikler her ana section'ın gerçek sayfa offset
 * oranına yerleşir (EditorialFrame'in bastığı [data-editorial-section]
 * wrapper'ları ölçülür).
 *
 * Tamamen dekoratif: aria-hidden + pointer-events-none. Yalnız lg ve
 * üstünde görünür; prefers-reduced-motion altında hiç render edilmez.
 * Scroll'a bağlı her şey yalnız transform üzerinden hareket eder.
 */

/** Topuz çapı (px) — ibrenin ve ray hesabının ortak sabiti. */
const KNOB_SIZE = 30;

/** Yumuşatma: topuz scroll'u küçük bir gecikmeyle, canlı ama sakin izler. */
const RAIL_SPRING = { stiffness: 90, damping: 22, mass: 0.4 };

export function ScrollRail() {
  const reducedMotion = usePrefersReducedMotion();
  // Reduced-motion: bileşen hiç render edilmez (statik hâli bile scroll'a
  // bağlı bir gösterge olurdu; dekoratif olduğu için tamamen kaldırıyoruz).
  if (reducedMotion) return null;
  return <ScrollRailInner />;
}

function ScrollRailInner() {
  const trackRef = useRef<HTMLDivElement>(null);
  /** Topuzun kat edebileceği dikey mesafe (ray boyu − topuz), px. */
  const [travelPx, setTravelPx] = useState(0);
  /** Section tikleri: 0..1 arası sayfa ilerleme oranları. */
  const [ticks, setTicks] = useState<number[]>([]);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, RAIL_SPRING);
  const knobY = useTransform(progress, (v) => v * travelPx);
  // İki tam tur: yelkovanın bir saati "doldurma" hissi.
  const handRotate = useTransform(progress, [0, 1], [0, 720]);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setTravelPx(Math.max(0, trackRef.current.offsetHeight - KNOB_SIZE));
      }
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0) {
        const sections = Array.from(
          document.querySelectorAll<HTMLElement>('[data-editorial-section]'),
        );
        setTicks(
          sections.map((el) => {
            const top = el.getBoundingClientRect().top + window.scrollY;
            return Math.min(1, Math.max(0, top / scrollable));
          }),
        );
      }
    };

    // İlk boyamadan sonra + görseller/fontlar yüklendiğinde + resize'da ölç.
    const raf = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
      window.removeEventListener('load', measure);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      // z-30: Navbar (z-40) ve mobil menü (z-50) altında kalır. Ray dikeyde
      // ortalanıp %60vh'ye sınırlandığı için sticky navbar şeridiyle zaten
      // çakışmaz.
      className="pointer-events-none fixed right-5 top-1/2 z-30 hidden h-[60vh] w-[30px] -translate-y-1/2 lg:block"
    >
      <div ref={trackRef} className="relative h-full">
        {/* Ray: 1px, border token'ı — iki temada da soluk kalır */}
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-edge-default" />

        {/* Section tikleri — gerçek sayfa offset oranlarında */}
        {ticks.map((t, i) => (
          <div
            key={i}
            className="absolute left-1/2 h-px w-2 -translate-x-1/2 bg-neutral-400/60"
            style={{ top: `${t * 100}%` }}
          />
        ))}

        {/* Topuz: konumu spring'li scroll ilerlemesi (yalnız transform) */}
        <motion.div
          className="absolute left-1/2 top-0 rounded-full border border-edge-default bg-surface-raised shadow-raised"
          style={{
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            x: '-50%',
            y: knobY,
          }}
        >
          {/* İbre katmanı: topuz merkezinde döner (rotate yalnız transform) */}
          <motion.div className="absolute inset-0" style={{ rotate: handRotate }}>
            <span className="absolute left-1/2 top-1/2 h-[9px] w-[1.5px] -translate-x-1/2 -translate-y-full rounded-full bg-brand-teal" />
          </motion.div>
          {/* Mil: merkez nokta */}
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-teal/60" />
        </motion.div>
      </div>
    </div>
  );
}
