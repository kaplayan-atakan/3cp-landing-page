import { useEffect, useRef, useState } from 'react';
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type AnimationPlaybackControls,
} from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks';
import { cn } from '../../lib/utils';
import {
  SPRING_MOMENTUM,
  SPRING_UI,
  projectMomentum,
  rubberband,
  velocityFrom,
} from '../../lib/motion';
import { SECTION_FOLIOS, type SectionFolio } from '../../data/content';

/**
 * ScrollRail — "saat yelkovanı" scroll scrubber'ı.
 *
 * Viewport'un sağ kenarında sabit dikey bir ray ve üzerinde sürüklenebilir bir
 * topuz. Topuz sayfa konumunu GÖSTERİR ve DEĞİŞTİRİR: parmağa 1:1 yapışır,
 * bırakıldığında hızı devralan bir yaya devredilir, uçuş hâlindeyken yeniden
 * yakalanabilir. İçindeki ibre sayfa boyunca iki tam tur (0→720°) döner; ray
 * üzerindeki tikler her section'ın gerçek sayfa offset oranına oturur
 * ([data-editorial-section] wrapper'ları ölçülür).
 *
 * Eskiden dekoratif bir göstergeydi (aria-hidden + pointer-events-none) ve
 * reduced-motion altında hiç render edilmezdi. Artık bir KONTROL: role="slider",
 * klavyeyle gezilebilir, reduced-motion'da da render edilir — erişilebilirlik
 * özelliği kapatılmaz, yalnız hareketi sadeleşir.
 *
 * Ray şeridinin kendisi pointer-events-none kalır; yalnız topuz girdi alır.
 * 1024–1500px arası viewport'larda ray, container'ın sağ kenarındaki içeriğin
 * üstünden geçiyor: 60vh'lik bir şeridi tıklanamaz yapmak, raya tıklayıp
 * atlamanın kazandırdığından fazlasını götürürdü.
 *
 * Yalnız lg ve üstünde görünür. Konuma bağlı her şey transform üzerinden akar.
 */

/** Topuz çapı (px) — ibrenin, hit alanının ve ray hesabının ortak sabiti. */
const KNOB_SIZE = 30;

/**
 * Rubber-band asimptotu (px): topuz sınırın en fazla bu kadar ötesine geçebilir.
 *
 * rubberband()'in `dimension`'ı direncin ne kadar hızlı arttığını değil, aşımın
 * nereye doyduğunu belirler. Sürüklenen eksenin tamamını (≈500px'lik ray)
 * vermek, topuzun rayın 500px ötesine kaçabilmesi demek olurdu; topuz çapının
 * dört katı "sınıra yaslandı" hissini veren ama topuzu rayın yanında tutan aşım.
 */
const OVERSHOOT_LIMIT = KNOB_SIZE * 4;

/** Bu hızda (px/s) topuzun uzaması tam genliğine ulaşır. */
const STRETCH_FULL_VELOCITY = 900;

/** velocityFrom() 100ms'lik pencereyle çalışır; geçmiş biraz daha uzun tutulur. */
const VELOCITY_HISTORY_MS = 200;

/**
 * PageUp/PageDown adımı (section). Ok tuşu bir section; sayfa tuşu 11
 * section'lık belgenin yaklaşık çeyreği — dört basışta belge katedilir. Slider
 * sözleşmesi sayfa adımının ok adımından büyük olmasını ister.
 */
const PAGE_STEP = 3;

/**
 * Snap penceresi: momentum projeksiyonu bir section başlangıcının viewport'un
 * bu kadarı yakınına inerse oraya çekilir.
 *
 * Eşik scroll px'i cinsinden tanımlı, çünkü kullanıcıya maliyeti o: sayfanın ne
 * kadar fazla kaydığı. Ray px'i cinsinden düşünmek yanıltıcı — ~12000px'lik
 * belge ~500px'lik raya sıkıştığı için 1 ray px'i ≈ 24 scroll px. Şartnamedeki
 * örnek %8'lik eşik bu oranda ≈3 ray px'ine denk gelir ve tikler ~46px arayla
 * durduğu için pratikte hiç tetiklenmezdi. %20 ise tik başına ~%40'lık bir
 * yakalama alanı bırakır: section başına yakın inersen çeker, ortasına inersen
 * serbest bırakır.
 */
const SNAP_WINDOW_VH = 0.2;

/**
 * Klavye tekrar zinciri: bu süre içindeki basışlar ölçülen konumdan değil bir
 * öncekinin HEDEFİNDEN adımlar — yoksa basılı tutulan ok, hâlâ süren yumuşak
 * scroll'u okuyup aynı section'a defalarca atlardı.
 */
const KEY_CHAIN_MS = 700;

interface RailTick {
  folio: SectionFolio;
  /** Section'ın sayfa başındaki 0..1 ilerleme oranı. */
  ratio: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getScrollable = () =>
  Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

export function ScrollRail() {
  const reducedMotion = usePrefersReducedMotion();

  const trackRef = useRef<HTMLDivElement>(null);

  const [ticks, setTicks] = useState<RailTick[]>([]);
  const [percent, setPercent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [snapPreview, setSnapPreview] = useState<number | null>(null);

  const percentRef = useRef(0);
  const snapPreviewRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const flightRef = useRef<AnimationPlaybackControls | null>(null);
  const stretchFlightRef = useRef<AnimationPlaybackControls | null>(null);
  const grabOffsetRef = useRef(0);
  const trackTopRef = useRef(0);
  const scrollableRef = useRef(0);
  const historyRef = useRef<{ value: number; time: number }[]>([]);
  const keyChainRef = useRef<{ index: number; time: number } | null>(null);

  const { scrollYProgress } = useScroll();

  /**
   * Topuzun ray üzerindeki konumu (px) — bileşendeki TEK doğruluk kaynağı.
   * Boştayken scroll, sürüklerken parmak, uçarken yay yazar. Eski hâlindeki
   * yumuşatma yayı kaldırıldı: gösterge dekorken gecikme sakin duruyordu, ama
   * bir KONTROL geriden gelirse sayfanın olmadığı bir konumu bildirir (§1).
   */
  const knobY = useMotionValue(0);
  /** Topuzun kat edebileceği mesafe (ray boyu − topuz), px. */
  const travel = useMotionValue(0);
  /** 0..1 — sürükleme hızının telegraf genliği. */
  const stretch = useMotionValue(0);

  // İki tam tur: yelkovanın bir saati "doldurma" hissi.
  //
  // İki değer de KOŞULSUZ okunur. Motion, hesaplanan değerin bağımlılıklarını
  // gövdeyi render sırasında çalıştırıp .get() çağıran MotionValue'ları
  // toplayarak bulur. `travel` ilk render'da 0 olduğu için, "distance > 0 ise
  // knobY'yi oku" biçiminde doğal bir gövde o ilk turda knobY'ye hiç
  // dokunmaz ve ibre ona abone olmaz. Bağımlılıklar her render'da yeniden
  // toplandığından abonelik sonraki bir render'da düzelirdi — ama `travel` bir
  // MotionValue, set edilmesi render tetiklemez; düzelme, başka bir state
  // değişiminin tesadüfen araya girmesine kalırdı (tikler boş ölçülürse
  // setTicks([]) React tarafından bail-out edilir ve o tesadüf hiç olmaz).
  const handRotate = useTransform(() => {
    const distance = travel.get();
    const position = knobY.get();
    return distance > 0 ? (position / distance) * 720 : 0;
  });
  const stretchX = useTransform(stretch, [0, 1], [1, 0.92]);
  const stretchY = useTransform(stretch, [0, 1], [1, 1.16]);

  /** Topuz konumu (ray px) → sayfa scroll'u (px). */
  const toScrollY = (position: number) => {
    const distance = travel.get();
    if (distance <= 0) return 0;
    return clamp(position / distance, 0, 1) * scrollableRef.current;
  };

  /**
   * `html { scroll-behavior: smooth }` global olduğu için behavior:'instant'
   * ŞART: aksi hâlde her yazım kendi yumuşak animasyonunu başlatır, hem
   * parmağın altındaki 1:1 takip hem de momentum devri yumuşatıcının arkasında
   * kalırdı.
   */
  const scrollToInstant = (top: number) => {
    window.scrollTo({ top, behavior: 'instant' });
  };

  const stopFlight = () => {
    flightRef.current?.stop();
    flightRef.current = null;
  };

  const publishPercent = (ratio: number) => {
    const next = Math.round(clamp(ratio, 0, 1) * 100);
    if (next === percentRef.current) return;
    percentRef.current = next;
    setPercent(next);
  };

  const publishSnapPreview = (index: number | null) => {
    if (index === snapPreviewRef.current) return;
    snapPreviewRef.current = index;
    setSnapPreview(index);
  };

  /** Verilen ray konumuna snap penceresi içinde düşen section tiki. */
  const snapCandidate = (position: number): number | null => {
    const distance = travel.get();
    const scrollable = scrollableRef.current;
    if (distance <= 0 || scrollable <= 0 || ticks.length === 0) return null;

    const windowPx =
      SNAP_WINDOW_VH * window.innerHeight * (distance / scrollable);
    let best = -1;
    let bestDistance = Infinity;
    for (let i = 0; i < ticks.length; i += 1) {
      const gap = Math.abs(ticks[i].ratio * distance - position);
      if (gap < bestDistance) {
        bestDistance = gap;
        best = i;
      }
    }
    return best >= 0 && bestDistance <= windowPx ? best : null;
  };

  /** Momentum projeksiyonu → yeterince yakınsa section tiki, değilse serbest. */
  const releaseTarget = (from: number, velocity: number) => {
    const distance = travel.get();
    if (distance <= 0) return 0;
    const projected = clamp(
      reducedMotion ? from : from + projectMomentum(velocity),
      0,
      distance,
    );
    const index = snapCandidate(projected);
    return index === null ? projected : ticks[index].ratio * distance;
  };

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    // Sağ/orta tuş ve ikincil dokunuşlar sürükleme başlatmaz.
    if (!track || !event.isPrimary || event.button !== 0) return;

    // §3 — Interruptibility: uçan animasyonu ANINDA bırak. Sürükleme knobY'nin
    // o anki EKRAN değerinden devam eder; hedef değerden başlasaydı topuz
    // parmağın altında sıçrardı.
    stopFlight();
    // Aynı ilke telegraf için de geçerli: MotionValue.set() süren bir
    // animasyonu durdurmaz (yalnız jump() durdurur), yani bırakıştan hemen
    // sonra yeniden yakalanırsa sönümlenme animasyonu yeni sürüklemenin
    // yazdığı uzamayı her karede ezip telegrafı sessizce öldürürdü.
    stretchFlightRef.current?.stop();
    stretchFlightRef.current = null;
    keyChainRef.current = null;

    const element = event.currentTarget;
    // Sürüklerken sayfa metninin seçilmesini engeller; bedeli odağın
    // kendiliğinden gelmemesi, o yüzden elle veriyoruz.
    event.preventDefault();
    element.setPointerCapture(event.pointerId);
    element.focus({ preventScroll: true });

    const rect = track.getBoundingClientRect();
    trackTopRef.current = rect.top;
    scrollableRef.current = getScrollable();
    // §2 — Direct manipulation: yakalama noktası korunur. Topuzu parmağın
    // merkezine snap'lemek illüzyonu ilk karede bozar.
    grabOffsetRef.current = event.clientY - rect.top - knobY.get();

    historyRef.current = [{ value: knobY.get(), time: performance.now() }];
    draggingRef.current = true;
    setDragging(true);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const distance = travel.get();
    const raw = event.clientY - trackTopRef.current - grabOffsetRef.current;

    // §9 — Rubber-banding: sınırda sert duruş "donmuş" okunur, artan direnç
    // "buraya kadar" okunur. Reduced-motion'da elastik yok, düz kesme.
    let next: number;
    if (reducedMotion) next = clamp(raw, 0, distance);
    else if (raw < 0) next = rubberband(raw, OVERSHOOT_LIMIT);
    else if (raw > distance) {
      next = distance + rubberband(raw - distance, OVERSHOOT_LIMIT);
    } else next = raw;

    knobY.set(next);
    // §1 — Response: geri bildirim sürükleme BOYUNCA, bırakışta değil.
    scrollToInstant(toScrollY(next));

    const now = performance.now();
    const history = historyRef.current;
    history.push({ value: next, time: now });
    while (history.length > 2 && now - history[0].time > VELOCITY_HISTORY_MS) {
      history.shift();
    }

    // §5 hazırlığı: hız tek çiftten değil kısa geçmişten gelir. Tek çift yavaş
    // bir karenin üstüne denk gelirse parmağın hiç sahip olmadığı bir hız
    // bildirir ve devir o yalanı miras alır.
    const velocity = reducedMotion ? 0 : velocityFrom(history);
    if (!reducedMotion) {
      // §8 / §11: uzama hızı taşır — yön zaten topuzun kendi hareketinde.
      stretch.set(Math.min(1, Math.abs(velocity) / STRETCH_FULL_VELOCITY));
    }

    // §8 — Hint in the direction of the gesture: şu an bıraksan nereye ineceğini
    // bırakmadan önce göster.
    const projected = clamp(
      reducedMotion ? next : next + projectMomentum(velocity),
      0,
      distance,
    );
    publishSnapPreview(snapCandidate(projected));
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    publishSnapPreview(null);

    const element = event.currentTarget;
    if (element.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }

    const from = knobY.get();
    const velocity = reducedMotion ? 0 : velocityFrom(historyRef.current);
    historyRef.current = [];
    // §6 — Momentum projection: hedef bırakış noktasından değil, hareketin
    // GİTTİĞİ yerden seçilir.
    const target = releaseTarget(from, velocity);

    if (reducedMotion) {
      // §14: yay ve momentum yok — anlık konumlanma. Kontrol çalışmaya devam
      // eder, yalnız yolculuğu göstermez.
      stretch.set(0);
      knobY.set(target);
      scrollToInstant(toScrollY(target));
      return;
    }

    stretchFlightRef.current = animate(stretch, 0, SPRING_UI);

    // §5 — Velocity handoff: yay bırakış hızıyla başlar, sürükleme ile
    // animasyon arasında dikiş kalmaz.
    flightRef.current = animate(from, target, {
      ...SPRING_MOMENTUM,
      velocity,
      onUpdate: (value) => {
        knobY.set(value);
        scrollToInstant(toScrollY(value));
      },
      onComplete: () => {
        flightRef.current = null;
      },
    });
  };

  const goToRatio = (ratio: number) => {
    stopFlight();
    const scrollable = getScrollable();
    scrollableRef.current = scrollable;
    window.scrollTo({
      top: clamp(ratio, 0, 1) * scrollable,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  /** Scroll oranına göre geçilmiş son section. */
  const activeTickIndex = () => {
    const ratio = scrollYProgress.get();
    let index = 0;
    for (let i = 0; i < ticks.length; i += 1) {
      if (ticks[i].ratio <= ratio + 0.0005) index = i;
    }
    return index;
  };

  const stepToTick = (delta: number) => {
    if (ticks.length === 0) return;
    const now = performance.now();
    const chain = keyChainRef.current;
    const base =
      chain && now - chain.time < KEY_CHAIN_MS ? chain.index : activeTickIndex();
    const next = clamp(base + delta, 0, ticks.length - 1);
    keyChainRef.current = { index: next, time: now };
    goToRatio(ticks[next].ratio);
  };

  const jumpToEdge = (ratio: 0 | 1) => {
    goToRatio(ratio);
    keyChainRef.current = {
      index: ratio === 0 ? 0 : ticks.length - 1,
      time: performance.now(),
    };
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    let handled = true;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        stepToTick(1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        stepToTick(-1);
        break;
      case 'PageDown':
        stepToTick(PAGE_STEP);
        break;
      case 'PageUp':
        stepToTick(-PAGE_STEP);
        break;
      case 'Home':
        jumpToEdge(0);
        break;
      case 'End':
        jumpToEdge(1);
        break;
      default:
        handled = false;
    }
    if (handled) event.preventDefault();
  };

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;

      const nextTravel = Math.max(0, track.offsetHeight - KNOB_SIZE);
      travel.set(nextTravel);

      const scrollable = getScrollable();
      scrollableRef.current = scrollable;

      // SECTION_FOLIOS sırası tek kaynak; DOM'a target üzerinden bağlanır.
      const measured: RailTick[] = [];
      if (scrollable > 0) {
        for (const folio of SECTION_FOLIOS) {
          const element = document.querySelector<HTMLElement>(
            `[data-editorial-section="${folio.target}"]`,
          );
          if (!element) continue;
          const top = element.getBoundingClientRect().top + window.scrollY;
          measured.push({ folio, ratio: clamp(top / scrollable, 0, 1) });
        }
      }
      setTicks(measured);

      if (!draggingRef.current && !flightRef.current) {
        knobY.set(scrollYProgress.get() * nextTravel);
      }
    };

    const raf = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    // Akordeon açılması / font yüklenmesi sayfa boyunu değiştirir; bayat bir
    // scrollable, topuzu yanlış yerde gösteren sessiz bir yalan olurdu.
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
      window.removeEventListener('load', measure);
      observer.disconnect();
      flightRef.current?.stop();
      flightRef.current = null;
      stretchFlightRef.current?.stop();
      stretchFlightRef.current = null;
    };
    // MotionValue'lar ve scrollYProgress render'lar arası sabit kimliktedir.
  }, []);

  useEffect(() => {
    // §3: kullanıcı sayfayı kendi kavradığında uçan animasyon derhal bırakır.
    // Aksi hâlde her karede scrollTo yazıp girdinin üstüne binerdi — animasyon
    // sırasında input kilitlemenin sinsi hâli.
    const release = () => {
      flightRef.current?.stop();
      flightRef.current = null;
    };
    window.addEventListener('wheel', release, { passive: true });
    window.addEventListener('touchstart', release, { passive: true });
    return () => {
      window.removeEventListener('wheel', release);
      window.removeEventListener('touchstart', release);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (ratio) => {
    // Bildirilen değer her zaman gerçek scroll: ekran okuyucu sayfanın nerede
    // olduğunu duyar, topuzun rubber-band'de nereye kaçtığını değil.
    publishPercent(ratio);
    // Konumu o an kim sürüyorsa o yazar.
    if (draggingRef.current || flightRef.current) return;
    knobY.set(ratio * travel.get());
  });

  const activeFolio = (() => {
    if (ticks.length === 0) return null;
    const ratio = percent / 100;
    let found = ticks[0];
    for (const tick of ticks) if (tick.ratio <= ratio) found = tick;
    return found.folio;
  })();

  return (
    // z-30: Navbar (z-40) ve mobil menü (z-50) altında kalır.
    <div className="pointer-events-none fixed right-5 top-1/2 z-30 hidden h-[60vh] w-[30px] -translate-y-1/2 lg:block">
      <div ref={trackRef} className="relative h-full">
        {/* Ray: 1px, border token'ı — iki temada da soluk kalır */}
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-edge-default" />

        {/* Section tikleri — gerçek sayfa offset oranlarında. Öngörülen iniş
            noktası büyüyerek snap hedefini bırakmadan önce bildirir. */}
        {ticks.map((tick, index) => (
          <div
            key={tick.folio.target}
            className={cn(
              'absolute left-1/2 h-px w-2 -translate-x-1/2 transition-transform duration-fast ease-smooth',
              snapPreview === index
                ? 'scale-x-150 bg-brand-teal'
                : 'bg-neutral-400/60',
            )}
            style={{ top: `${tick.ratio * 100}%` }}
          />
        ))}

        {/*
          Topuz. before:-inset-2 → 46px'lik görünmez hit alanı (§10); görsel
          30px'lik topuz tek başına küçük kalırdı. Odak halkası (index.css
          :focus-visible) elemanın kendi kutusunu izlediği için hedef büyürken
          halka görünen topuza yapışık kalır.

          Kasıtlı olarak transition-* YOK: index.css'in utilities katmanı
          :focus-visible'a transform içeren bir transition-property basıyor —
          buraya bir süre eklesek, klavyeyle odaklanmış topuz Motion'ın yazdığı
          transform'u bir CSS geçişinin arkasından uygular ve scroll'u geriden
          takip ederdi. Basış geri bildirimi zaten anında olmalı (§1).
        */}
        <motion.div
          role="slider"
          tabIndex={0}
          aria-label="Sayfa konumu"
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-valuetext={
            activeFolio
              ? `${Number(activeFolio.number)}. bölüm — ${activeFolio.label}`
              : undefined
          }
          onPointerDown={beginDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={handleKeyDown}
          className={cn(
            'pointer-events-auto absolute left-1/2 top-0 touch-none select-none rounded-full border bg-surface-raised',
            "before:absolute before:-inset-2 before:content-['']",
            dragging
              ? 'cursor-grabbing border-brand-teal shadow-overlay'
              : 'cursor-grab border-edge-default shadow-raised',
          )}
          style={{
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            x: '-50%',
            y: knobY,
            scaleX: reducedMotion ? 1 : stretchX,
            scaleY: reducedMotion ? 1 : stretchY,
          }}
        >
          {/* İbre katmanı: topuz merkezinde döner (rotate yalnız transform) */}
          <motion.div
            className="absolute inset-0"
            style={reducedMotion ? undefined : { rotate: handRotate }}
          >
            <span className="absolute left-1/2 top-1/2 h-[9px] w-[1.5px] -translate-x-1/2 -translate-y-full rounded-full bg-brand-teal" />
          </motion.div>
          {/* Mil: merkez nokta */}
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-teal/60" />
        </motion.div>
      </div>
    </div>
  );
}
