import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks';
import { cn } from '../../lib/utils';
import type { SectionFolio } from '../../data/content';

/**
 * EditorialFrame — dergi sayfası çerçevesi.
 *
 * Her ana section'ı sarar ve tek bir dekoratif katman ekler: dev folio
 * numarası — Playfair, çok büyük, neredeyse görünmez opaklıkta (içi boş sayfa
 * numarası hissi), tek/çift index'te sol/sağ alternasyon + hafif scroll
 * parallax'ı (yalnız transform).
 *
 * Buradaki dikey mono kenar notu ("03 — ÇEKİRDEK MODÜLLER") kaldırıldı: dergi
 * folio'su sayfanın TEK numaralama sistemi. Kenar notu hem aynı numarayı
 * üçüncü kez tekrarlıyordu hem de sayfadan ayıklanmaya çalışılan
 * tracked-uppercase eyebrow deseninin ta kendisiydi.
 *
 * Section bileşenlerinin kendi id anchor'ları içlerinde kalır — wrapper
 * id taşımaz, scroll-margin davranışına karışmaz. Dekor katmanı ayrı bir
 * absolute + overflow-hidden kabukta yaşar; parallax taşması sayfaya
 * yatay scroll sızdıramaz. Katman children'dan SONRA geldiği için opak
 * section zeminlerinin üstünde, z-index'li içerik bloklarının (z-10/z-20)
 * altında boyanır — filigran tam olarak "sayfanın dokusu" gibi durur.
 *
 * data-editorial-section: ScrollRail bu attribute üzerinden section
 * offset'lerini ölçüp rayına tik işaretlerini yerleştirir.
 */

interface EditorialFrameProps {
  folio: SectionFolio;
  /** App.tsx'teki sıra — folio numarasının sol/sağ alternasyonunu belirler. */
  index: number;
  children: ReactNode;
}

/** Parallax genliği (px). Küçük tutulur: doku, gösteri değil. */
const PARALLAX_RANGE = 40;

export function EditorialFrame({ folio, index, children }: EditorialFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Section viewport'a girerken 0 → çıkarken 1; folio ±40px kayar.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [PARALLAX_RANGE, -PARALLAX_RANGE],
  );

  const folioOnLeft = index % 2 === 0;

  return (
    <div ref={ref} data-editorial-section={folio.target} className="relative">
      {children}

      {/* Dekor kabuğu: tıklama geçirmez, ekran okuyucuya görünmez,
          parallax taşmasını kendi içinde kırpar. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Dev folio numarası — düşük opaklık + ince stroke ile içi boş
            görünüm. text-neutral-900 dark'ta inversiyonla açık tona döner,
            iki temada da aynı "hayalet rakam" etkisi korunur. */}
        <motion.span
          className={cn(
            'absolute top-10 select-none font-serif text-[clamp(6rem,14vw,11rem)] font-bold leading-none tracking-tight text-neutral-900/[0.04] [-webkit-text-stroke:1px_rgb(var(--color-neutral-900)/0.07)]',
            folioOnLeft ? 'left-3 sm:left-8' : 'right-3 sm:right-8',
          )}
          style={reducedMotion ? undefined : { y: parallaxY }}
        >
          {folio.number}
        </motion.span>
      </div>
    </div>
  );
}
