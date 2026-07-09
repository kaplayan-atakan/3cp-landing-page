# 3CP Landing Tasarım Revizyonu — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mevcut 8 bölümlük landing page'i, kaynak dokümanlarla doğrulanmış içerik ve token'a bağlı bir tasarım katmanı üzerinde 13 bölümlük kurumsal bir pazarlama yüzeyine genişletmek.

**Architecture:** Önce Tasarım Dili §11'in dört katmanlı token mimarisi `src/styles/tokens.css` olarak inşa edilir ve `tailwind.config.js` bu CSS değişkenlerine bağlanır; sonra Magic UI'ın üç bileşeni (`NumberTicker`, `Marquee`, `AnimatedList`) sıfır-shadcn bağımlılığıyla elle porte edilir; ardından her bölüm `src/components/marketing/` altında tek bir bileşen olarak yazılır. Tüm hareket `usePrefersReducedMotion` üzerinden `prefers-reduced-motion`'a saygı gösterir.

**Tech Stack:** Vite 5, React 18, TypeScript 5.6 (strict), Tailwind CSS 3.4, `motion` (Framer Motion), `lucide-react`, `shaders` (mevcut hero).

**Spec:** `docs/superpowers/specs/2026-07-09-landing-tasarim-revizyonu-design.md`

---

## Global Constraints

- **İçerik doğruluğu:** `C:\aaa\3cp\3CP_Tasarim_Dili.md`, `C:\aaa\3cp\3CP_Yetenek_Seti_ve_Ekran_Listesi.md`, `C:\aaa\3cp\3CP_Mimari_Dokumani.md` dışında hiçbir modül, entegrasyon, sertifika, rakam veya fiyat sayfaya yazılmaz.
- **Yasaklı içerik:** `ISO 27001`, `SOC 2`, uptime yüzdesi, şube/etkileşim sayısı gibi performans istatistikleri, `RestoPos` / `AssisTT` gibi üçüncü taraf marka adları, üç kademeli fiyat kartları, public partner API iddiası.
- **Tek birincil CTA kuralı** (Tasarım Dili §5.2): Sayfada aynı anda yalnız bir Teal CTA görünür. Navbar CTA'sı `scrollY > innerHeight * 0.85` olunca belirir; o noktadan sonraki hiçbir bölüm Teal CTA kullanmaz (bordered/white varyant kullanır).
- **Sıfır ham hex:** `src/` altında `#RRGGBB` yalnız `src/styles/tokens.css` ve `src/components/HeroShader.tsx` (WebGL uniform değerleri) içinde geçebilir.
- **Boşluk:** Tailwind'in doğal 4px ölçeği, 8px ızgarasına kilitli (çift adımlar). Tek istisna ikon–metin boşluğu (`gap-1` = 4px).
- **Motion:** Yalnız `transform` ve `opacity` animasyonlanır. Mikro-etkileşim 150–300ms, bölüm geçişi ≤400ms. Her animasyon `usePrefersReducedMotion` ile kapatılabilir.
- **Erişilebilirlik:** WCAG AA. Gövde metni ≥ 4.5:1, büyük metin ≥ 3:1. Durum asla yalnız renkle iletilmez (renk + metin). İkon-only butonlar `aria-label` taşır.
- **Dil:** Tüm arayüz metni Türkçe, Tasarım Dili §13 voice & tone kurallarına uyar. Butonlar eylem fiiliyle başlar, 1–3 kelime. "Lütfen", "Başarıyla", "Basit/Kolay", "Buraya tıklayın" yasak. Başlık ve butonlarda sentence case; all-caps yalnız kısaltmalar ve `StatusBadge` için.
- **TypeScript:** `strict: true`, `noUnusedLocals`, `noUnusedParameters` açık. `npm run build` (`tsc -b && vite build`) temiz geçmeli.

---

## File Structure

| Dosya | Sorumluluk | Durum |
|---|---|---|
| `src/styles/tokens.css` | 4 katmanlı design token'ları CSS custom property olarak tanımlar | Create |
| `src/index.css` | Tailwind direktifleri + `tokens.css` importu + base stiller | Modify |
| `tailwind.config.js` | Theme'i CSS değişkenlerine bağlar; marquee keyframe'leri | Modify |
| `src/lib/utils.ts` | `cn()` — sıfır bağımlılıklı class birleştirici | Create |
| `src/components/magicui/number-ticker.tsx` | Görünürlükte bir kez çalışan sayı sayacı | Create |
| `src/components/magicui/marquee.tsx` | Yatay/dikey sonsuz kaydırma, hover'da durur | Create |
| `src/components/magicui/animated-list.tsx` | Stagger'lı liste girişi | Create |
| `src/components/primitives.tsx` | Paylaşılan UI + yeni `Reveal`, `DemoBadge`, `StatPair` | Modify |
| `src/data/content.ts` | Tüm metin/veri — tek kaynak | Modify |
| `src/components/marketing/*.tsx` | Bölüm başına bir bileşen (15 dosya) | Create/Move |
| `src/App.tsx` | Bölümleri sıralar | Modify |

Mevcut `src/components/{Navbar,Hero,HeroShader,SectorProblem,HowItWorks,Capabilities,Differentiators,SecurityRoadmapFaq,ClosingFooter}.tsx` → `src/components/marketing/` altına taşınır. `HeroShader.tsx` ve `primitives.tsx` `src/components/` altında kalır (bölüm değil, altyapı).

`Differentiators.tsx` retire edilir; içeriği `SectorVerticals.tsx`'e katlanır.
`Capabilities.tsx` retire edilir; 12 kartlık matris `CapabilityMarquee` + `Roadmap` arasında bölüşülür, 4 çekirdek modül `CapabilityBento`'ya taşınır.
`SecurityRoadmapFaq.tsx` ikiye ayrılır: `Security.tsx` ve `RoadmapFaq.tsx`.

---

## Task 1: Token katmanı ve ham hex temizliği

**Files:**
- Create: `src/styles/tokens.css`
- Modify: `src/index.css`
- Modify: `tailwind.config.js`
- Modify: `src/components/primitives.tsx:24,90,92`
- Modify: `src/components/HowItWorks.tsx:12`
- Modify: `src/components/Differentiators.tsx:40`
- Modify: `src/components/ClosingFooter.tsx:22`
- Modify: `src/components/HeroShader.tsx:14-20`

**Interfaces:**
- Produces: Tailwind renk isimleri `brand-teal`, `brand-teal-hovered`, `brand-teal-dark`, `neutral-{50,100,200,400,600,800,900}`, `success`, `success-fg`, `warning`, `warning-fg`, `danger`, `danger-fg`, `information`, `information-fg`, `surface-{sunken,default}`, `footer-deep`. Gölgeler `shadow-{raised,overlay,pill}`. Hepsi `<alpha-value>` modifier'ını destekler.

- [ ] **Step 1: `src/styles/tokens.css` oluştur**

Renkler boşlukla ayrılmış RGB kanal üçlüsü olarak saklanır — Tailwind 3'ün `<alpha-value>` sözdizimi bunu gerektirir, aksi halde `bg-brand-teal/90` çalışmaz.

```css
/* =====================================================================
   3CP Design Tokens
   Kaynak: C:\aaa\3cp\3CP_Tasarim_Dili.md §5, §9, §11
   Katman 1 Primitives → Katman 2 Semantic → Katman 3 Component → Katman 4 Theme
   Renkler "R G B" kanal üçlüsüdür (Tailwind <alpha-value> uyumu için).
   ===================================================================== */

:root {
  /* --- Katman 1: Primitives (ham değerler) --------------------------- */
  --color-teal-700: 13 122 111; /* #0D7A6F — 3CP marka birincil rengi */
  --color-teal-800: 10 101 92; /* #0A655C — hover/pressed */
  --color-teal-400: 31 175 158; /* #1FAF9E — dark mode marka rengi */

  --color-neutral-50: 247 248 249; /* #F7F8F9 */
  --color-neutral-100: 235 236 240; /* #EBECF0 */
  --color-neutral-200: 223 225 230; /* #DFE1E6 */
  --color-neutral-400: 151 160 175; /* #97A0AF */
  --color-neutral-600: 94 108 132; /* #5E6C84 */
  --color-neutral-800: 37 56 88; /* #253858 */
  --color-neutral-900: 23 43 77; /* #172B4D */

  --color-green-50: 227 252 239; /* #E3FCEF */
  --color-green-700: 0 102 68; /* #006644 */
  --color-yellow-50: 255 250 230; /* #FFFAE6 */
  --color-yellow-700: 255 139 0; /* #FF8B00 */
  --color-red-50: 255 235 230; /* #FFEBE6 */
  --color-red-700: 191 38 0; /* #BF2600 */
  --color-blue-50: 222 235 255; /* #DEEBFF */
  --color-blue-700: 0 82 204; /* #0052CC */

  --color-white: 255 255 255;
  --color-surface-sunken-raw: 244 245 247; /* #F4F5F7 — Tasarım Dili §9 */
  --color-deep-navy: 14 42 64; /* #0E2A40 — yalnız kapanış bandı gradient'i */

  /* --- Katman 2: Semantic (anlam) ------------------------------------ */
  --color-background-brand-bold: var(--color-teal-700);
  --color-background-brand-hovered: var(--color-teal-800);
  --color-text-brand: var(--color-teal-700);
  --color-border-brand: var(--color-teal-700);

  --color-background-default: var(--color-white);
  --color-background-sunken: var(--color-surface-sunken-raw);

  --color-background-success: var(--color-green-50);
  --color-text-success: var(--color-green-700);
  --color-background-warning: var(--color-yellow-50);
  --color-text-warning: var(--color-yellow-700);
  --color-background-danger: var(--color-red-50);
  --color-text-danger: var(--color-red-700);
  --color-background-information: var(--color-blue-50);
  --color-text-information: var(--color-blue-700);

  /* --- Katman 3: Component ------------------------------------------- */
  --button-primary-bg: var(--color-background-brand-bold);
  --button-primary-bg-hovered: var(--color-background-brand-hovered);
  --focus-ring-color: var(--color-border-brand);

  /* --- Elevation (Tasarım Dili §9) ----------------------------------- */
  --elevation-raised: 0 1px 1px rgb(9 30 66 / 0.25), 0 0 1px rgb(9 30 66 / 0.31);
  --elevation-overlay: 0 4px 8px -2px rgb(9 30 66 / 0.25), 0 0 1px rgb(9 30 66 / 0.31);
  --elevation-pill: 0 2px 8px rgb(0 0 0 / 0.04);

  /* --- Motion --------------------------------------------------------- */
  --motion-duration-fast: 150ms;
  --motion-duration-medium: 300ms;
  --motion-duration-slow: 500ms;
  --motion-easing-standard: cubic-bezier(0.25, 0.1, 0.25, 1);

  /* --- Radius --------------------------------------------------------- */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}

/* --- Katman 4: Theme ------------------------------------------------- */
/* Light varsayılandır (yukarıdaki :root). Dark mode token'ları hazırdır
   ancak sayfa şu an light-only render eder (spec §7 — kapsam dışı). */
:root[data-theme='dark'] {
  --color-background-brand-bold: var(--color-teal-400);
  --color-background-brand-hovered: var(--color-teal-700);
  --color-text-brand: var(--color-teal-400);
  --color-border-brand: var(--color-teal-400);
  --color-background-default: 28 43 65; /* #1C2B41 */
}
```

- [ ] **Step 2: `src/index.css`'i güncelle**

`tokens.css` importu `@tailwind base`'den **önce** gelmeli ki `@apply` ve base katmanı token'ları görebilsin. Focus ring'in ham hex'i token'a çekilir.

```css
@import './styles/tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-neutral-50 font-sans text-neutral-900 antialiased;
  }

  /* Visible keyboard focus for every interactive element (2px outline + 2px offset). */
  :focus-visible {
    outline: 2px solid rgb(var(--focus-ring-color));
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
}

/* Full integration of the reduced-motion preference. */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: `tailwind.config.js`'i token'lara bağla**

`neutral` paletindeki 300/500/700 boşlukları bilinçli bırakılır (kullanılmıyor); 400 ve 800 eklenir çünkü Tasarım Dili §5.3 onları tanımlar ve `ClosingFooter` `border-neutral-800` kullanıyor.

```js
/** @type {import('tailwindcss').Config} */

/** Tailwind rengini bir RGB-kanal CSS değişkenine bağlar; /opacity modifier'ını korur. */
const token = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-teal': token('--color-background-brand-bold'),
        'brand-teal-hovered': token('--color-background-brand-hovered'),
        'brand-teal-dark': token('--color-teal-400'),

        neutral: {
          50: token('--color-neutral-50'),
          100: token('--color-neutral-100'),
          200: token('--color-neutral-200'),
          400: token('--color-neutral-400'),
          600: token('--color-neutral-600'),
          800: token('--color-neutral-800'),
          900: token('--color-neutral-900'),
        },

        success: token('--color-background-success'),
        'success-fg': token('--color-text-success'),
        warning: token('--color-background-warning'),
        'warning-fg': token('--color-text-warning'),
        danger: token('--color-background-danger'),
        'danger-fg': token('--color-text-danger'),
        information: token('--color-background-information'),
        'information-fg': token('--color-text-information'),

        'surface-default': token('--color-background-default'),
        'surface-sunken': token('--color-background-sunken'),
        'footer-deep': token('--color-deep-navy'),
      },
      fontFamily: {
        sans: ['Inter', 'Geist Sans', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        smooth: 'var(--motion-easing-standard)',
      },
      transitionDuration: {
        DEFAULT: 'var(--motion-duration-slow)',
        fast: 'var(--motion-duration-fast)',
        medium: 'var(--motion-duration-medium)',
      },
      boxShadow: {
        raised: 'var(--elevation-raised)',
        overlay: 'var(--elevation-overlay)',
        pill: 'var(--elevation-pill)',
      },
      maxWidth: {
        container: '1440px',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
      },
      animation: {
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
      },
    },
  },
  plugins: [],
};
```

> **Not:** `transitionDuration.DEFAULT` bir CSS değişkenine bağlanınca `duration-500` gibi utility'ler hâlâ çalışır; yalnız çıplak `transition` varsayılanı token'dan gelir. `TRANSITION` sabiti `duration-500`'ü açıkça yazdığı için davranış değişmez.

- [ ] **Step 4: `primitives.tsx`'teki üç ham hex'i token'a çevir**

`src/components/primitives.tsx:24`:
```tsx
const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  teal: 'bg-brand-teal text-white hover:bg-brand-teal-hovered',
  white: 'bg-white text-brand-teal hover:bg-neutral-50',
};
```

`src/components/primitives.tsx:89-93`:
```tsx
const BADGE_TONES: Record<BadgeTone, string> = {
  success: 'bg-success text-success-fg',
  neutral: 'bg-neutral-100 text-neutral-600',
  information: 'bg-information text-information-fg',
};
```

- [ ] **Step 5: Bölüm arka planlarını ve gradient'i token'a çevir**

`src/components/HowItWorks.tsx:12` — `bg-[#F5F5F5]` → `bg-surface-sunken`
`src/components/Differentiators.tsx:40` — `bg-[#F5F5F5]` → `bg-surface-sunken`
`src/components/ClosingFooter.tsx:22` — `from-[#0D7A6F]/90 to-[#0e2a40]/85` → `from-brand-teal/90 to-footer-deep/85`

- [ ] **Step 6: `HeroShader.tsx`'in StaticBackground'ını token'a çevir**

`<Shader>` alt bileşenlerine geçen renkler WebGL uniform değerleridir, CSS değil — literal kalır. Yalnız `StaticBackground` gradient'i token'a taşınır:

```tsx
function StaticBackground() {
  return (
    <div
      className="absolute inset-0 bg-neutral-50"
      style={{
        backgroundImage:
          'radial-gradient(1200px 600px at 72% 18%, rgb(var(--color-teal-700) / 0.10), transparent 60%),' +
          'radial-gradient(900px 520px at 18% 88%, rgb(var(--color-teal-700) / 0.06), transparent 60%)',
      }}
    />
  );
}
```

- [ ] **Step 7: Build'i çalıştır**

Run: `npm run build`
Expected: `tsc -b` hatasız, `vite build` başarılı, `dist/` üretilir.

- [ ] **Step 8: Ham hex taraması**

Run: `rg -n "#[0-9a-fA-F]{6}" src/`
Expected: Yalnız `src/styles/tokens.css` (yorum satırları) ve `src/components/HeroShader.tsx` (WebGL uniform'ları) eşleşir.

- [ ] **Step 9: Görsel regresyon kontrolü**

Run: `npm run dev`, tarayıcıda aç.
Expected: Sayfa Task 1 öncesiyle **piksel olarak aynı** görünür. Bu task saf refactor'dür; hiçbir görsel değişiklik olmamalı. Teal butonlar teal, badge'ler yeşil/mavi, kapanış bandı gradient'i yerinde.

- [ ] **Step 10: Commit**

```bash
git add src/styles/tokens.css src/index.css tailwind.config.js src/components/
git commit -m "refactor(tokens): 4 katmanlı design token mimarisi + ham hex temizliği"
```

---

## Task 2: `motion` bağımlılığı, `cn()` ve Magic UI portları

**Files:**
- Modify: `package.json`
- Create: `src/lib/utils.ts`
- Create: `src/components/magicui/number-ticker.tsx`
- Create: `src/components/magicui/marquee.tsx`
- Create: `src/components/magicui/animated-list.tsx`
- Modify: `src/components/primitives.tsx`

**Interfaces:**
- Consumes: Task 1'in `marquee` / `marquee-vertical` Tailwind animasyonları; `usePrefersReducedMotion` (`src/hooks.ts`).
- Produces:
  - `cn(...classes: ClassValue[]): string` — `ClassValue = string | false | null | undefined`
  - `<NumberTicker value: number, startValue?: number, decimalPlaces?: number, className?: string />`
  - `<Marquee reverse?: boolean, pauseOnHover?: boolean, vertical?: boolean, repeat?: number, className?: string, children: ReactNode />`
  - `<AnimatedList delay?: number, className?: string, children: ReactNode />`
  - `<Reveal delay?: number, as?: 'div' | 'section', className?: string, children: ReactNode />`
  - `<DemoBadge label?: string />`
  - `<StatPair value: string, label: string />`

- [ ] **Step 1: `motion` paketini kur**

`motion`, Framer Motion'ın güncel paket adıdır; `motion/react` girişini sunar ve React 18 ile uyumludur.

Run: `npm install motion`
Expected: `package.json` dependencies'e `"motion": "^12.x"` eklenir.

- [ ] **Step 2: `src/lib/utils.ts` oluştur**

`clsx` + `tailwind-merge` eklemiyoruz: mevcut kod çakışan utility sınıfları üretmiyor, bu yüzden merge mantığı gereksiz ağırlık. `cn` yalnız falsy değerleri eler.

```ts
export type ClassValue = string | false | null | undefined;

/**
 * Joins class names, dropping falsy entries. Deliberately dependency-free:
 * the codebase never emits conflicting Tailwind utilities, so `tailwind-merge`
 * would be dead weight.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
```

- [ ] **Step 3: `src/components/magicui/number-ticker.tsx` oluştur**

Sayaç ilk görünümde bir kez çalışır (`useInView`, `once: true`). Reduced-motion açıkken animasyon atlanır ve hedef değer anında basılır. Sayı `tr-TR` yerelinde biçimlenir (binlik ayracı nokta) ve `tabular-nums` ile düzen kayması önlenir.

```tsx
import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks';
import { cn } from '../../lib/utils';

interface NumberTickerProps {
  value: number;
  startValue?: number;
  decimalPlaces?: number;
  className?: string;
}

export function NumberTicker({
  value,
  startValue = 0,
  decimalPlaces = 0,
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const motionValue = useMotionValue(startValue);
  const spring = useSpring(motionValue, { damping: 60, stiffness: 100 });
  const inView = useInView(ref, { once: true, margin: '0px 0px -120px 0px' });

  const format = (input: number) =>
    Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(Number(input.toFixed(decimalPlaces)));

  useEffect(() => {
    if (inView && !reducedMotion) motionValue.set(value);
  }, [inView, reducedMotion, motionValue, value]);

  useEffect(() => {
    if (reducedMotion) {
      if (ref.current) ref.current.textContent = format(value);
      return;
    }
    return spring.on('change', (latest) => {
      if (ref.current) ref.current.textContent = format(latest);
    });
    // `format` is pure and stable in behaviour; decimalPlaces is its only input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spring, decimalPlaces, reducedMotion, value]);

  return (
    <span
      ref={ref}
      className={cn('inline-block tabular-nums', className)}
      /* Screen readers announce the final value, never the intermediate frames. */
      aria-label={format(value)}
      role="text"
    >
      {format(startValue)}
    </span>
  );
}
```

- [ ] **Step 4: `src/components/magicui/marquee.tsx` oluştur**

`--gap` ve `--duration` CSS değişkenleri Task 1'in keyframe'lerini besler. Reduced-motion açıkken `animate-*` sınıfı hiç eklenmez; içerik statik, kaydırılabilir bir şeride döner.

```tsx
import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks';
import { cn } from '../../lib/utils';

interface MarqueeProps {
  children: ReactNode;
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  /** How many times the children are duplicated to make the loop seamless. */
  repeat?: number;
  className?: string;
}

export function Marquee({
  children,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  className,
}: MarqueeProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
        vertical ? 'flex-col' : 'flex-row',
        reducedMotion && 'overflow-x-auto',
        className,
      )}
    >
      {Array.from({ length: reducedMotion ? 1 : repeat }, (_, index) => (
        <div
          key={index}
          aria-hidden={index > 0}
          className={cn(
            'flex shrink-0 justify-around [gap:var(--gap)]',
            vertical ? 'flex-col' : 'flex-row',
            !reducedMotion && (vertical ? 'animate-marquee-vertical' : 'animate-marquee'),
            !reducedMotion && reverse && '[animation-direction:reverse]',
            !reducedMotion && pauseOnHover && 'group-hover:[animation-play-state:paused]',
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: `src/components/magicui/animated-list.tsx` oluştur**

Girişler alttan yukarı stagger ile belirir (40ms/öğe, Material `stagger-sequence` aralığında). Reduced-motion açıkken hepsi anında görünür. Bu bileşen **sahte canlı akış üretmez** — sabit, seed'lenmiş bir listeyi bir kez animasyonlar; feed illüzyonu için `delay` yeterlidir.

```tsx
import { Children, useMemo, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks';
import { cn } from '../../lib/utils';

interface AnimatedListProps {
  children: ReactNode;
  /** Per-item stagger, in milliseconds. */
  delay?: number;
  className?: string;
}

export function AnimatedList({ children, delay = 40, className }: AnimatedListProps) {
  const reducedMotion = usePrefersReducedMotion();
  const items = useMemo(() => Children.toArray(children), [children]);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{
            duration: 0.3,
            delay: (index * delay) / 1000,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {item}
        </motion.div>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: `primitives.tsx`'e `Reveal`, `DemoBadge`, `StatPair` ekle**

`Reveal`, sayfadaki tek scroll-reveal mekanizmasıdır — her bölüm bunu sarar, böylece motion dili tek yerden yönetilir.

`DemoBadge`, mock veri gösteren her paneli işaretler. Sahte canlı veri iddiasına karşı tek savunma budur; **`AnimatedList` kullanan her bölüm bir `DemoBadge` taşımak zorundadır.**

`src/components/primitives.tsx` sonuna eklenir (mevcut importlara `motion` ve `usePrefersReducedMotion` katılır):

```tsx
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks';
import { cn } from '../lib/utils';

/* ------------------------------------------------------------------ */
/* Reveal                                                              */
/* ------------------------------------------------------------------ */

interface RevealProps {
  children: ReactNode;
  /** Seconds to wait before the reveal starts. */
  delay?: number;
  className?: string;
}

/**
 * The page's single scroll-reveal primitive: fade + 16px rise, once per element.
 * Only `opacity` and `transform` animate, so it never triggers layout shift.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -100px 0px' }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* DemoBadge                                                           */
/* ------------------------------------------------------------------ */

/**
 * Marks any panel whose contents are seeded mock data. Mandatory on every
 * surface that renders an `AnimatedList` — the page sells auditability, so an
 * unlabelled fake feed would undercut its own claim.
 */
export function DemoBadge({ label = 'Örnek görünüm · Demo verisi' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 font-mono text-[11px] text-neutral-600">
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" aria-hidden="true" />
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* StatPair                                                            */
/* ------------------------------------------------------------------ */

/** Metric value over its label. Mono figures per Tasarım Dili §6.3. */
export function StatPair({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-mono text-xl font-bold tabular-nums text-neutral-900">{value}</p>
      <p className="mt-1 text-xs leading-snug text-neutral-600">{label}</p>
    </div>
  );
}
```

`cn` kullanan `Reveal` için `primitives.tsx` başına `import { cn } from '../lib/utils';` eklenir.

- [ ] **Step 7: Build**

Run: `npm run build`
Expected: temiz geçer. `noUnusedLocals` açık olduğu için kullanılmayan import bırakılmamalı.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json src/lib src/components/magicui src/components/primitives.tsx
git commit -m "feat(ui): motion + Magic UI portları (NumberTicker, Marquee, AnimatedList) ve Reveal/DemoBadge/StatPair"
```

---

## Task 3: İçerik katmanı — `content.ts` genişletmesi

**Files:**
- Modify: `src/data/content.ts`

**Interfaces:**
- Consumes: `LucideIcon` (`lucide-react`)
- Produces (mevcut export'lara ek):
  - `HERO_STATS: HeroStat[]` — `{ value: number; suffix?: string; label: string }`
  - `CORE_MODULES: CoreModule[]` — `{ title, phase, description, bullets: string[], icon, wide: boolean }`
  - `SECTOR_VERTICALS: SectorVertical[]` — `{ name, status, active, description, icon, stats: [Stat, Stat] }` where `Stat = { value: string; label: string }`
  - `ONBOARDING_STEPS: OnboardingStep[]` — `{ number, title, description, icon }`
  - `PERMISSION_MATRIX: { roles: string[]; actions: string[]; grid: boolean[][] }`
  - `ADAPTER_CLASSES: AdapterClass[]` — `{ name, phase, examples, icon }`
  - `OUTBOX_EVENT_SAMPLE: string`
  - `AUDIT_LOG_LINES: AuditLine[]` — `{ time, event, detail }`
  - `MARQUEE_ROW_ONE: string[]`, `MARQUEE_ROW_TWO: string[]`
  - `ACTIVITY_FEED: ActivityItem[]` — `{ branch, title, meta, tone }`
  - `COST_MODELS: CostModel[]` — `{ title, description, bullets: string[], icon }`
- Retires: `DIFFERENTIATORS` (içeriği `SECTOR_VERTICALS` açıklamalarına dağılır), `CAPABILITIES` (12 kart → `MARQUEE_ROW_*` ve `CORE_MODULES`)

> `CAPABILITIES` **silinmez** — Task 13'e kadar `Capabilities.tsx` onu kullanmaya devam eder. Task 13'te birlikte kaldırılır.

- [ ] **Step 1: Hero istatistiklerini ekle**

Her sayının kaynağı yorumda belirtilir. Bunlar performans metriği değil, **kapsam sayılarıdır** — doğrulanabilir olmayan hiçbir rakam eklenmez.

```ts
/** Section 1 — hero scope counters. Not traction metrics: every number is
 *  verifiable against the source documents. No uptime, no branch counts. */
export interface HeroStat {
  value: number;
  label: string;
}

export const HERO_STATS: HeroStat[] = [
  // Yetenek Seti §I.1–I.12
  { value: 12, label: 'yetenek modülü' },
  // Yetenek Seti §II — ekran grupları A–R
  { value: 18, label: 'ekran grubu' },
  // Yetenek Seti §0.3 + §III
  { value: 4, label: 'sektör dikeyi' },
  // Yetenek Seti §5.1 — Gemini, OpenAI, Claude, Mistral
  { value: 4, label: 'desteklenen LLM sağlayıcısı' },
];
```

- [ ] **Step 2: Çekirdek modülleri (bento) ekle**

POC dilimi tam olarak bu dört modüldür (Yetenek Seti §0.4): `IAM + Kişi Kartı + Anonim Anket + tek-provider LLM ile RAG segmentasyon`. LLM Gateway ayrı kart değil; RAG kartının altyapısı olarak anlatılır.

```ts
/** Section 3 — the four POC-core modules (Yetenek Seti §0.4). `wide` drives the bento span. */
export interface CoreModule {
  title: string;
  phase: string;
  description: string;
  bullets: string[];
  icon: LucideIcon;
  wide: boolean;
}

export const CORE_MODULES: CoreModule[] = [
  {
    title: 'Kimlik ve Yetki Altyapısı',
    phase: 'Faz 0',
    description:
      'Şirket, marka, şube ve departman hiyerarşinizin tamamı tek bir yetki modelinde. Sabit rol seti yok; her kiracı kendi rollerini tanımlar.',
    bullets: [
      'Modül × kapsam × aksiyon izin matrisi',
      'Alıcı tipine göre dinamik alan maskeleme',
      'Erişim ve değişiklik denetim kaydı',
    ],
    icon: KeyRound,
    wide: true,
  },
  {
    title: '360° Kişi Kartı',
    phase: 'Faz 1',
    description:
      'Telefon numarası birincil anahtar; anket, şikayet, kampanya, çağrı ve satın alma geçmişi tek profilde birleşir.',
    bullets: ['Değiştirilemez rıza defteri', 'Kimlik birleştirme ve dedup', 'KVKK anonimleştirme akışı'],
    icon: Contact,
    wide: false,
  },
  {
    title: 'Anket ve NPS',
    phase: 'Faz 2',
    description:
      'Şube ve kampanya bazlı QR üretimi, mobil-öncelikli doldurma arayüzü. Anonim-öncelikli toplama katılımı yüksek tutar.',
    bullets: ['Eşik altı yanıt otomatik şikayet ticket’ına döner', 'Şube, ürün ve kategori bazlı NPS kırılımı'],
    icon: ClipboardList,
    wide: false,
  },
  {
    title: 'Yapay Zeka Geri Bildirim Zekası',
    phase: 'Faz 3',
    description:
      'Yorumlar embedding + vector store üzerinden kategori, duygu ve kritiklik düzeyine göre sınıflandırılır. Düşük güvenli sonuçlar insan incelemesi için işaretlenir; her düzeltme few-shot havuzunu besler.',
    bullets: [
      'Kiracıya özel kategori taksonomisi',
      'Sağlayıcı-bağımsız LLM Gateway üzerinde çalışır',
      'Kritik eşik aşıldığında otomatik uyarı',
    ],
    icon: Sparkles,
    wide: true,
  },
];
```

- [ ] **Step 3: Sektör dikeylerini ekle**

Restoran ve Emlak'ın stat'ları Yetenek Seti §0.3 ve §III'ten sayılır. Perakende ve Otelcilik için doküman modül listesi vermez — bu yüzden stat'lar yeniden kullanılan çekirdeği sayar ve modül tarafı dürüstçe "Tanımlanacak" der. **Uydurma sayı yazılmaz.**

```ts
/** Section 5 — sector verticals. */
export interface Stat {
  value: string;
  label: string;
}

export interface SectorVertical {
  name: string;
  status: string;
  active: boolean;
  description: string;
  icon: LucideIcon;
  stats: [Stat, Stat];
}

export const SECTOR_VERTICALS: SectorVertical[] = [
  {
    name: 'Restoran Zincirleri',
    status: 'AKTİF',
    active: true,
    description:
      'İlk dikey pazar. Anket ve NPS, şikayet yönetimi ve kampanya motoru bu dikeyin kendi modülleridir; çekirdek onları taşır.',
    icon: UtensilsCrossed,
    stats: [
      { value: 'v1', label: 'İlk dikey pazar' },
      { value: '3', label: 'Sektöre özel modül' }, // Anket/NPS, Şikayet, Kampanya
    ],
  },
  {
    name: 'Emlak',
    status: 'YAKINDA',
    active: false,
    description:
      'İlan yönetimi, teklif ve pazarlık süreci, portföy eşleştirme. Aynı çekirdek, yeni modüller ve yeni ilan platformu adaptörleri.',
    icon: Home,
    stats: [
      { value: '3', label: 'Planlanan sektörel modül' }, // §III
      { value: '3', label: 'İlan platformu adaptörü' }, // Sahibinden, Emlakjet, Hürriyet Emlak
    ],
  },
  {
    name: 'Perakende',
    status: 'YAKINDA',
    active: false,
    description:
      'Çok-kiracılık, kişi kartı, dinamik yetki ve entegrasyon çatısı olduğu gibi devralınır. Sektörel modüller tasarım aşamasında.',
    icon: ShoppingBag,
    stats: [
      { value: '6', label: 'Devralınan çekirdek servis' }, // §III generic çekirdek listesi
      { value: 'Tanımlanacak', label: 'Sektörel modül seti' },
    ],
  },
  {
    name: 'Otelcilik',
    status: 'YAKINDA',
    active: false,
    description:
      'Çekirdek sektör-agnostiktir: yeni dikey, sisteme bileşen ekler; mevcut çekirdeği değiştirmez.',
    icon: BedDouble,
    stats: [
      { value: '6', label: 'Devralınan çekirdek servis' },
      { value: 'Tanımlanacak', label: 'Sektörel modül seti' },
    ],
  },
];
```

- [ ] **Step 4: Kurulum adımlarını ve izin matrisini ekle**

```ts
/** Section 6 — onboarding. */
export interface OnboardingStep {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    number: '01',
    title: 'Kurulum',
    description:
      'Kiracınız oluşturulur, marka ve şube hiyerarşiniz tanımlanır. Kurulum gerektirmez; 3CP bulut tabanlıdır.',
    icon: Building2,
  },
  {
    number: '02',
    title: 'Şube bağlama',
    description:
      'Şubeler ve departmanlar sisteme girilir, ekip üyeleri davet akışıyla eklenir.',
    icon: Network,
  },
  {
    number: '03',
    title: 'Yapılandırma',
    description:
      'Roller, izin matrisi, maskeleme politikası ve marka sesi profili ayarlanır. Kod değil, konfigürasyon.',
    icon: SlidersHorizontal,
  },
  {
    number: '04',
    title: 'Canlıya geçiş',
    description:
      'QR kodlar üretilir, anket yayına alınır. İlk yanıtlar geldiği anda sınıflandırma çalışmaya başlar.',
    icon: Rocket,
  },
];

/** Section 6 — Dense Matrix preview (Tasarım Dili §8.2). Read-only illustration. */
export const PERMISSION_MATRIX: {
  roles: string[];
  actions: string[];
  grid: boolean[][];
} = {
  roles: ['Bölge Müdürü', 'Şube Sorumlusu', 'Çağrı Merkezi Agent'],
  actions: ['Görüntüle', 'Düzenle', 'Sil', 'Onayla'],
  grid: [
    [true, true, true, true],
    [true, true, false, false],
    [true, false, false, false],
  ],
};
```

- [ ] **Step 5: Entegrasyon çatısını ve outbox örneğini ekle**

**Üçüncü taraf tedarikçi adı (RestoPos, AssisTT) yazılmaz.** Yorum/ilan platformları, 3CP'nin okuyacağı kamuya açık platformlardır ve Yetenek Seti §10 / §III'te açıkça sayılır — logo değil, düz metin olarak listelenir.

```ts
/** Section 7 — the adapter framework (Yetenek Seti §6, Mimari §"Mimari sonuç").
 *  3CP is vendor-agnostic: no shipped-integration or partner-logo claims. */
export interface AdapterClass {
  name: string;
  phase: string;
  examples: string;
  icon: LucideIcon;
}

export const ADAPTER_CLASSES: AdapterClass[] = [
  {
    name: 'POS adaptörleri',
    phase: 'Faz 4',
    examples: 'Kampanya ve kupon push, redemption event ingestion',
    icon: CreditCard,
  },
  {
    name: 'Çağrı merkezi adaptörleri',
    phase: 'Faz 4',
    examples: 'IVR lookup, screen-pop push, rıza capture',
    icon: PhoneCall,
  },
  {
    name: 'Yorum platformu adaptörleri',
    phase: 'Faz 8',
    examples: 'Google, Yemeksepeti, Getir, Migros Yemek, Trendyol Go',
    icon: Radio,
  },
  {
    name: 'İlan platformu adaptörleri',
    phase: 'Sektör genişlemesi',
    examples: 'Sahibinden, Emlakjet, Hürriyet Emlak',
    icon: Home,
  },
];

/** Mimari §8.4 — transactional outbox. This is 3CP's *internal* event contract,
 *  not a public partner API. The payload carries no PII. */
export const OUTBOX_EVENT_SAMPLE = `-- İş verisi ve outbox kaydı aynı transaction'da yazılır
INSERT INTO core.outbox_messages (id, type, payload, status)
VALUES (
  gen_random_uuid(),
  'PlatformMentionIngested',
  '{ "sourceType": "platform",
     "platformCode": "GOOGLE",
     "feedbackItemId": "…" }',   -- payload PII taşımaz
  'pending'
);

-- Dispatcher (Hangfire recurring job) kaldığı yerden devam eder:
-- "DB'ye yazıldıysa event mutlaka işlenir."`;
```

- [ ] **Step 6: Denetim kaydı satırlarını ekle**

Olay adları Mimari §8.4'ün gerçek audit yüzeyinden alınır: `LOGIN`, `LOGIN_FAILED`, `REFRESH`, `TOKEN_REUSE`, `ANONYMIZE`, `REVEAL`, `PROVISION`.

```ts
/** Section 8 — seeded audit ticker. Fixed dataset; never live, never real tenant data. */
export interface AuditLine {
  time: string;
  event: string;
  detail: string;
}

export const AUDIT_LOG_LINES: AuditLine[] = [
  { time: '09:14:02', event: 'LOGIN', detail: 'bolge_muduru · sube-34' },
  { time: '09:14:19', event: 'REVEAL', detail: 'telefon · alici_tipi=CALL_CENTER_AGENT' },
  { time: '09:15:41', event: 'LOGIN_FAILED', detail: 'bilinmeyen kimlik · 3. deneme' },
  { time: '09:16:03', event: 'ANONYMIZE', detail: 'KVKK silme talebi işlendi' },
  { time: '09:17:22', event: 'TOKEN_REUSE', detail: 'oturum iptal edildi' },
  { time: '09:18:07', event: 'PROVISION', detail: 'yeni kiracı oluşturuldu' },
  { time: '09:19:35', event: 'REFRESH', detail: 'oturum yenilendi' },
];
```

- [ ] **Step 7: Marquee etiketlerini ekle**

Her etiket bir doküman modülüne veya bileşenine karşılık gelir.

```ts
/** Section 9 — capability marquee. Every tag maps to a documented module. */
export const MARQUEE_ROW_ONE: string[] = [
  '360° Kişi Kartı',
  'Anket ve NPS',
  'RAG Segmentasyon',
  'Şikayet Yönetimi',
  'Kampanya Motoru',
  'Veri Maskeleme',
  'Denetim İzi',
  'QR Menü',
];

export const MARQUEE_ROW_TWO: string[] = [
  'ABAC İzin Matrisi',
  'LLM Gateway',
  'Marka Sesi Profili',
  'Kupon Motoru',
  'Çağrı Merkezi Köprüsü',
  'Sosyal Dinleme',
  'Loyalty Motoru',
  'Catalog Ürün Master’ı',
];
```

- [ ] **Step 8: Aktivite feed'ini ve maliyet modellerini ekle**

`ACTIVITY_FEED` mock'tur ve `DemoBadge` ile işaretlenmiş bir panel içinde render edilir. `tone` yalnız renk için değil, `StatusBadge` metnini de sürer.

```ts
/** Section 10 — mocked cross-branch activity. Seeded; rendered inside a DemoBadge'd panel. */
export interface ActivityItem {
  branch: string;
  title: string;
  meta: string;
  tone: 'success' | 'neutral' | 'information';
}

export const ACTIVITY_FEED: ActivityItem[] = [
  { branch: 'Kadıköy', title: 'Anket yanıtı alındı', meta: 'NPS 9 · Pozitif', tone: 'success' },
  { branch: 'Beşiktaş', title: 'Kritik uyarı tetiklendi', meta: 'Servis hızı · Kritiklik 0.87', tone: 'neutral' },
  { branch: 'Bakırköy', title: 'Şikayet ticket’ı açıldı', meta: 'Eşik altı NPS · SLA 4 saat', tone: 'information' },
  { branch: 'Ataşehir', title: 'Anket yanıtı alındı', meta: 'NPS 4 · Negatif', tone: 'neutral' },
  { branch: 'Şişli', title: 'Sınıflandırma düzeltildi', meta: 'İnsan onayı · few-shot havuzuna eklendi', tone: 'information' },
  { branch: 'Üsküdar', title: 'Google yorumu işlendi', meta: 'Kategori: Temizlik · Pozitif', tone: 'success' },
];

/** Section 11 — the two documented LLM cost models (Mimari §"Birim ekonomisi ve bütçe").
 *  High-level only: no unit prices, no margin figures, no tier cards. */
export interface CostModel {
  title: string;
  description: string;
  bullets: string[];
  icon: LucideIcon;
}

export const COST_MODELS: CostModel[] = [
  {
    title: 'Kendi API anahtarınız',
    description:
      'Yapay zeka maliyetini doğrudan sağlayıcınıza ödersiniz. 3CP araya girmez, üzerine bir şey eklemez.',
    bullets: [
      'Token kullanımı kiracı, modül ve tarih bazında panelde görünür',
      'Sağlayıcı ve model seçimi her modül için ayrı yapılabilir',
    ],
    icon: KeyRound,
  },
  {
    title: 'Platform havuz anahtarı',
    description:
      'Anahtar yönetimiyle uğraşmazsınız; 3CP çağrıları kendi havuzundan geçirir ve tek faturada toplar.',
    bullets: [
      'Aylık bütçe eşiği ve aşım alarmı tanımlanır',
      'Birincil sağlayıcı yanıt vermezse yedek sağlayıcı devreye girer',
    ],
    icon: Boxes,
  },
];
```

- [ ] **Step 9: `NAV_LINKS`'i yeni bölümlere göre güncelle**

Yedi link mobilde taşar; beşte tutulur.

```ts
export const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Platform', href: '#platform' },
  { label: 'Nasıl Çalışır?', href: '#nasil-calisir' },
  { label: 'Entegrasyon', href: '#entegrasyon' },
  { label: 'Güvenlik', href: '#guvenlik' },
  { label: 'SSS', href: '#sss' },
];
```

- [ ] **Step 10: `lucide-react` importlarını genişlet**

Mevcut import bloğuna eklenir: `UtensilsCrossed`, `Home`, `ShoppingBag`, `BedDouble`, `Network`, `SlidersHorizontal`, `Rocket`, `CreditCard`.
`Building2`, `KeyRound`, `Contact`, `ClipboardList`, `Sparkles`, `PhoneCall`, `Radio`, `Boxes` zaten import edilmiş durumda.

- [ ] **Step 11: Build ve commit**

Run: `npm run build`
Expected: temiz. (`content.ts` henüz tüketilmeyen export'lar barındırır; `noUnusedLocals` **modül export'larını** kapsamaz, yalnız yerel değişkenleri — hata beklenmez.)

```bash
git add src/data/content.ts
git commit -m "feat(content): yeni bölümlerin doküman-doğrulanmış içeriği"
```

---

## Task 4: Hero istatistik satırı + Navbar

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/Navbar.tsx` (yalnız `scroll-mt` uyumu; `NAV_LINKS` Task 3'te güncellendi)

**Interfaces:**
- Consumes: `HERO_STATS` (Task 3), `NumberTicker` (Task 2), `Reveal` (Task 2)

- [ ] **Step 1: Hero başlığını iki satırlı, çok-şubeli merkezîleştirme mesajına çevir**

Mevcut H1 yalnız geri bildirim→içgörü anlatıyor; talep çok-şubeli operasyonun merkezîleştirilmesini istiyor. İkinci satır Teal kalır (mevcut desen).

```tsx
<h1 className="text-[clamp(1.75rem,6vw,3.8rem)] font-bold leading-[1.1] tracking-[-0.03em] text-neutral-900">
  Çok şubeli müşteri operasyonunuz{' '}
  <span className="text-brand-teal">tek kontrol panelinde toplanır.</span>
</h1>
```

Alt metin, merkezîleştirme + otomatik anlamlandırma ikilisini kurar:

```tsx
<p className="mt-4 max-w-[720px] text-[17px] leading-relaxed text-neutral-600">
  3CP; anket, yorum, şikayet ve çağrı verinizi her şubeden tek bir merkezde toplar,
  yapay zekayla otomatik sınıflandırır ve ekibinize yalnızca aksiyon alınması gerekeni
  gösterir. Markalar ve şubeler arasında tek yetki modeli, tek denetim izi.
</p>
```

- [ ] **Step 2: İstatistik satırını CTA'ların altına, güven satırının yerine ekle**

Güven satırı (`Kurumsal Güvenlik · KVKK Uyumlu · Altyapı Bağımsız`) korunur; istatistik satırı onun altına gelir. `dl/dt/dd` kullanılır — ekran okuyucu için anlamlı bir tanım listesi.

```tsx
<Reveal delay={0.1}>
  <dl className="mt-10 grid max-w-[720px] grid-cols-2 gap-6 border-t border-neutral-200 pt-8 sm:grid-cols-4">
    {HERO_STATS.map((stat) => (
      <div key={stat.label}>
        <dt className="sr-only">{stat.label}</dt>
        <dd>
          <NumberTicker
            value={stat.value}
            className="font-mono text-3xl font-bold text-neutral-900 sm:text-4xl"
          />
          <span className="mt-2 block text-xs leading-snug text-neutral-600">{stat.label}</span>
        </dd>
      </div>
    ))}
  </dl>
</Reveal>
```

- [ ] **Step 3: Hero'ya `id="platform"` çapası eklenmez**

`#platform` çapası Task 5'teki `CapabilityBento` bölümüne aittir. Hero `id="top"` olarak kalır.

- [ ] **Step 4: Doğrula**

Run: `npm run dev`
Expected: Sayaçlar sayfa açılınca 0'dan hedefe animasyonlanır ve **bir kez** çalışır (aşağı-yukarı scroll tekrar tetiklemez). `12`, `18`, `4`, `4` görünür.

DevTools → Rendering → `prefers-reduced-motion: reduce` işaretle, yenile.
Expected: Sayaçlar animasyonsuz, doğrudan son değerde.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx src/components/Navbar.tsx
git commit -m "feat(hero): çok-şubeli merkezîleştirme başlığı + doğrulanabilir kapsam sayaçları"
```

---

## Task 5: Yetenek bento (`CapabilityBento`)

**Files:**
- Create: `src/components/marketing/CapabilityBento.tsx`

**Interfaces:**
- Consumes: `CORE_MODULES` (Task 3), `SectionHeader`, `StatusBadge`, `Reveal`, `TRANSITION`

- [ ] **Step 1: Bileşeni yaz**

Bento düzeni: `lg:grid-cols-3`. `wide: true` kartlar `lg:col-span-2` alır. Sıra: geniş, dar / dar, geniş — böylece iki satır da dolar.

Kart yapısı: ikon kutusu → faz `StatusBadge` (`tone="neutral"`, `shape="pill"`) → `h3` → açıklama → `bullets` listesi (her madde önünde 1.5px teal nokta).

```tsx
<section id="platform" className="scroll-mt-24 bg-white">
  <div className="mx-auto max-w-container py-20">
    <SectionHeader
      number="02"
      pill="Çekirdek Platform"
      title="Bugün canlı olan dört çekirdek modül"
    />
    <div className="grid grid-cols-1 gap-6 px-5 sm:px-8 lg:grid-cols-3 lg:px-12">
      {CORE_MODULES.map((module, index) => (
        <Reveal
          key={module.title}
          delay={index * 0.05}
          className={module.wide ? 'lg:col-span-2' : 'lg:col-span-1'}
        >
          {/* kart gövdesi — h-full, flex flex-col */}
        </Reveal>
      ))}
    </div>
  </div>
</section>
```

`Reveal` bir `motion.div` render ettiği için grid item'ı odur; kart gövdesi `h-full` almalıdır ki satır içinde eşit yükseklik korunsun.

- [ ] **Step 2: Kontrol et**

Run: `npm run dev`
Expected: 1440px'te 2 satır × 3 sütun bento; 768px'te tek sütun; kartlar hover'da `shadow-raised`. Faz rozetleri "Faz 0"…"Faz 3" okur.

- [ ] **Step 3: Commit**

```bash
git add src/components/marketing/CapabilityBento.tsx
git commit -m "feat(section): çekirdek modül bento ızgarası"
```

---

## Task 6: Sektör dikeyleri (`SectorVerticals`)

**Files:**
- Create: `src/components/marketing/SectorVerticals.tsx`
- Delete: `src/components/Differentiators.tsx` (Task 13'te App.tsx'ten çıkarılınca)

**Interfaces:**
- Consumes: `SECTOR_VERTICALS`, `CORE_CHIPS`, `SECTOR_CHIPS` (Task 3 / mevcut), `StatPair`, `StatusBadge`, `Reveal`, `SectionHeader`

- [ ] **Step 1: `ConcentricDiagram`'ı `Differentiators.tsx`'ten kopyala**

Aynen taşınır; yalnız `bg-[#F5F5F5]` sarmalayıcısı `bg-surface-sunken`'a döner (Task 1'de zaten yapıldı).

- [ ] **Step 2: Dört dikey kartını yaz**

Her kart: ikon → `StatusBadge` (aktif ise `tone="success"`, değilse `tone="neutral"`, `shape="pill"`) → `h3` → açıklama → `border-t` üstünde iki `StatPair` yan yana (`grid-cols-2`).

Aktif kart `border-2 border-brand-teal`, diğerleri `border border-neutral-200` (mevcut `PHASES` kartı deseni).

- [ ] **Step 3: Çekirdek/sektörel chip matrisini altına taşı**

`Differentiators.tsx:68-106`'daki "Bugün restoran, yarın her sektör" paneli olduğu gibi bu bölümün sonuna gelir.

- [ ] **Step 4: Kontrol + commit**

Run: `npm run dev` → dört kart, Restoran teal kenarlıklı ve `AKTİF`; diğerleri `YAKINDA`.

```bash
git add src/components/marketing/SectorVerticals.tsx
git commit -m "feat(section): sektör dikeyleri + çekirdek/sektörel chip matrisi"
```

---

## Task 7: Kurulum ve yönetim (`Onboarding`)

**Files:**
- Create: `src/components/marketing/Onboarding.tsx`

**Interfaces:**
- Consumes: `ONBOARDING_STEPS`, `PERMISSION_MATRIX`, `Reveal`, `SectionHeader`

- [ ] **Step 1: Dört adımlı numaralı akışı yaz**

`lg:grid-cols-4`. Her adım: mono numara (`01`…`04`, teal) → ikon → `h3` → açıklama. Adımlar arası bağlantı çizgisi `lg:` üstünde `border-t border-neutral-200` ile ima edilir; mobilde dikey yığılır.

- [ ] **Step 2: İzin matrisi panelini yaz**

Tasarım Dili §8.2'nin "Dense Matrix" düzeni: sol sütun sticky rol adları, sağda aksiyon sütunları. Salt-okunur bir illüstrasyon.

Hücre içeriği **yalnız renk değildir** (Tasarım Dili §12.5): izin varsa teal `Check` ikonu + `sr-only` "izinli"; yoksa nötr `Minus` ikonu + `sr-only` "izinsiz".

```tsx
<table className="w-full border-collapse text-sm">
  <caption className="sr-only">
    Rol ve aksiyon bazlı izin matrisi — örnek yapılandırma
  </caption>
  <thead>
    <tr>
      <th scope="col" className="…">Rol</th>
      {PERMISSION_MATRIX.actions.map((action) => (
        <th key={action} scope="col" className="…">{action}</th>
      ))}
    </tr>
  </thead>
  <tbody>
    {PERMISSION_MATRIX.roles.map((role, rowIndex) => (
      <tr key={role}>
        <th scope="row" className="…">{role}</th>
        {PERMISSION_MATRIX.grid[rowIndex].map((allowed, colIndex) => (
          <td key={PERMISSION_MATRIX.actions[colIndex]} className="…">
            {allowed ? (
              <><Check size={16} className="text-brand-teal" aria-hidden="true" /><span className="sr-only">izinli</span></>
            ) : (
              <><Minus size={16} className="text-neutral-400" aria-hidden="true" /><span className="sr-only">izinsiz</span></>
            )}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
```

Panel bir `DemoBadge label="Örnek yapılandırma"` taşır — bu gerçek bir kiracının izin seti değildir.

Tablo dar ekranda `overflow-x-auto` bir sarmalayıcı içinde yatay kayar; **sayfa gövdesi asla yatay kaymaz**.

- [ ] **Step 3: Kontrol + commit**

375px'te tablo kendi içinde kayar, `document.documentElement.scrollWidth === clientWidth` kalır.

```bash
git add src/components/marketing/Onboarding.tsx
git commit -m "feat(section): kurulum akışı + izin matrisi paneli"
```

---

## Task 8: Entegrasyon çatısı (`Integrations`)

**Files:**
- Create: `src/components/marketing/Integrations.tsx`

**Interfaces:**
- Consumes: `ADAPTER_CLASSES`, `OUTBOX_EVENT_SAMPLE`, `Reveal`, `SectionHeader`, `StatusBadge`

- [ ] **Step 1: Mimari diyagramı yaz**

Saf CSS/flex; görsel dosyası yok. Üç katman, yukarıdan aşağı:

```
┌────────────────────────────┐
│      3CP Çekirdek          │   teal dolu kutu
└────────────┬───────────────┘
             │
┌────────────▼───────────────┐
│  IIntegrationAdapter       │   kesikli kenarlıklı, mono font
│  inbound ingestion ·       │
│  outbound push             │
└──┬────────┬────────┬───────┘
   │        │        │      …
 4 adaptör sınıfı kartı (grid-cols-2 lg:grid-cols-4)
```

Her adaptör kartı: ikon → ad → `StatusBadge` faz rozeti (`tone="neutral"`) → `examples` metni.

Bölümün altına açık bir çürütme cümlesi konur:

> "3CP tedarikçilerin işini yapmaz; onlarla haberleşir. Yukarıdaki adaptörler çekirdeğin dışındadır — POS'unuz veya çağrı merkeziniz değiştiğinde yalnız adaptör değişir."

- [ ] **Step 2: Outbox kod panelini yaz**

`<pre><code>` bloğu, `font-mono text-[13px]`, `bg-neutral-900 text-neutral-100`, `overflow-x-auto`, `rounded-xl`. Üstünde bir başlık şeridi: `Mimari · Transactional Outbox` + `StatusBadge label="FAZ 4"`.

Yanına kısa bir açıklama paneli:

> **Kaybolmayan olaylar.** İş verisi ve olay kaydı aynı transaction'da yazılır. Süreç çökse bile dispatcher kaldığı yerden devam eder: veritabanına yazıldıysa olay mutlaka işlenir.
>
> Bu, 3CP'nin iç olay sözleşmesidir. Platform dışarıya public bir API sunmaz.

Son cümle zorunludur — panelin partner API sanılmasını önler.

- [ ] **Step 3: Kontrol + commit**

Kod bloğu 375px'te kendi içinde kayar; sayfa kaymaz.

```bash
git add src/components/marketing/Integrations.tsx
git commit -m "feat(section): entegrasyon adaptör çatısı diyagramı + outbox olay paneli"
```

---

## Task 9: Güvenlik ve uyumluluk (`Security`)

**Files:**
- Create: `src/components/marketing/Security.tsx`
- Create: `src/components/marketing/RoadmapFaq.tsx` (mevcut `SecurityRoadmapFaq.tsx`'in kalan iki bloğu)
- Delete: `src/components/SecurityRoadmapFaq.tsx` (Task 13'te)

**Interfaces:**
- Consumes: `SECURITY_PILLARS`, `AUDIT_LOG_LINES`, `PHASES`, `FAQ`, `AnimatedList`, `DemoBadge`, `StatusBadge`, `Reveal`, `SectionHeader`

- [ ] **Step 1: `SECURITY_PILLARS`'ı dört gerçek sütuna hizala**

`content.ts`'teki mevcut dört sütun zaten doğru (izole veri, maskeleme, rıza defteri, denetim). Başlıklar teknik karşılıklarıyla zenginleştirilir — her biri Mimari'de doğrulanmıştır:

| Sütun | Teknik karşılık | Kaynak |
|---|---|---|
| Kurumsal Seviye İzole Veri Güvenliği | PostgreSQL `FORCE ROW LEVEL SECURITY`, `tenant_id` | Mimari §5.2 |
| Akıllı Veri Maskeleme | Alıcı tipine göre dinamik maskeleme, her `REVEAL` audit'e yazılır | Mimari §8.1 |
| Değiştirilemez Onay Kaydı | Zaman damgalı, immutable rıza defteri; KVKK `ANONYMIZE` akışı | Yetenek §2 |
| Tam İzlenebilirlik ve Denetim | Transactional outbox + merkezî audit domain-event yüzeyi | Mimari §8.4 |

- [ ] **Step 2: Uyumluluk rozet satırı**

**Tek rozet: KVKK.** `ISO 27001` ve `SOC 2` üç dokümanın hiçbirinde geçmez; yazılırsa sahte uyumluluk beyanı olur.

```tsx
<div className="flex flex-wrap items-center gap-3">
  <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900">
    <ShieldCheck size={16} className="text-brand-teal" aria-hidden="true" />
    KVKK uyumlu
  </span>
  <a href={asset('belgeler/kvkk-gizlilik.pdf')} target="_blank" rel="noopener noreferrer" className="…">
    Aydınlatma metnini görüntüle
  </a>
</div>
```

- [ ] **Step 3: Denetim kaydı ticker'ını yaz**

`AnimatedList` içinde `AUDIT_LOG_LINES`. Panel: `bg-neutral-900`, mono, satır düzeni `time · event · detail`. `event` bir `StatusBadge` benzeri mono etiket; `LOGIN_FAILED` ve `TOKEN_REUSE` `danger` tonunda, `ANONYMIZE` ve `REVEAL` `warning`, diğerleri `neutral`.

`DemoBadge label="Örnek denetim kaydı görünümü"` panelin başlığının yanında zorunludur.

Panel `role="log"` **almaz** — bu canlı bir bölge değil, statik bir illüstrasyondur. `aria-live` kullanılmaz.

- [ ] **Step 4: `RoadmapFaq.tsx`'i ayır**

`SecurityRoadmapFaq.tsx`'in roadmap (`PHASES`) ve FAQ (`FAQ`) blokları aynen taşınır; `id="yol-haritasi"` ve `id="sss"` korunur. Bölüm numaraları Task 13'te yeniden verilir.

- [ ] **Step 5: Kontrol + commit**

Ticker girişleri kaydırınca alttan yukarı stagger'la belirir; reduced-motion'da hepsi anında görünür.

```bash
git add src/components/marketing/Security.tsx src/components/marketing/RoadmapFaq.tsx
git commit -m "feat(section): güvenlik sütunları + KVKK rozeti + seed'lenmiş denetim kaydı ticker'ı"
```

---

## Task 10: Yetenek marquee (`CapabilityMarquee`)

**Files:**
- Create: `src/components/marketing/CapabilityMarquee.tsx`

**Interfaces:**
- Consumes: `MARQUEE_ROW_ONE`, `MARQUEE_ROW_TWO`, `Marquee` (Task 2)

- [ ] **Step 1: İki satırı ters yönde yaz**

```tsx
<div className="relative flex flex-col gap-4 overflow-hidden">
  <Marquee pauseOnHover className="[--duration:45s]">
    {MARQUEE_ROW_ONE.map((tag) => <Tag key={tag} label={tag} />)}
  </Marquee>
  <Marquee reverse pauseOnHover className="[--duration:45s]">
    {MARQUEE_ROW_TWO.map((tag) => <Tag key={tag} label={tag} />)}
  </Marquee>
  {/* Kenar solmaları — sayfa arka planından şeride */}
  <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface-sunken" aria-hidden="true" />
  <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface-sunken" aria-hidden="true" />
</div>
```

`Tag`: `rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900` + önünde 1.5px teal nokta (`Differentiators`'ın `CORE_CHIPS` deseni).

Bölüm arka planı `bg-surface-sunken` olmalı ki kenar gradient'leri arka planla eşleşsin.

- [ ] **Step 2: Ekran okuyucu alternatifi**

`Marquee` içindeki kopyaların 2..n'i zaten `aria-hidden`. İlk kopya okunabilir kalır; ek bir `sr-only` liste gerekmez.

- [ ] **Step 3: Kontrol**

- Hover: her iki satır da durur.
- `prefers-reduced-motion: reduce`: animasyon yok, şerit `overflow-x-auto` ile elle kaydırılabilir.
- Yatay sayfa kayması yok.

- [ ] **Step 4: Commit**

```bash
git add src/components/marketing/CapabilityMarquee.tsx
git commit -m "feat(section): iki satırlı yetenek marquee'si"
```

---

## Task 11: Panel önizleme (`ActivityPreview`)

**Files:**
- Create: `src/components/marketing/ActivityPreview.tsx`

**Interfaces:**
- Consumes: `ACTIVITY_FEED`, `AnimatedList`, `DemoBadge`, `StatusBadge`, `SectionHeader`, `Reveal`

- [ ] **Step 1: Mock panel çerçevesini yaz**

Bölüm başlığı: "Panelde ne görürsünüz". Başlığın hemen altında `DemoBadge` — bölüm düzeyinde, atlanamaz.

Panel bir tarayıcı/uygulama penceresi gibi çerçevelenir: üstte `rounded-t-xl border-b border-neutral-200 bg-neutral-50 px-4 py-3` bir başlık şeridi.

Şerit içeriği:
- Solda: `Demo kiracı · 12 şube` (mono, `text-neutral-600`)
- Sağda: `StatusBadge label="DEMO" tone="information"`

**Kritik:** "12 şube" ifadesi panel çerçevesinin *içindedir* ve demo kiracıya aittir. Sayfa düzeyinde "X şube şu anda aktif" gibi bir gerçek-trafik iddiası **kurulmaz**.

- [ ] **Step 2: Feed'i yaz**

```tsx
<AnimatedList delay={60} className="p-4">
  {ACTIVITY_FEED.map((item) => (
    <div key={`${item.branch}-${item.title}`} className="flex items-start justify-between gap-4 rounded-lg border border-neutral-200 bg-white p-4">
      <div>
        <p className="text-sm font-medium text-neutral-900">{item.title}</p>
        <p className="mt-1 font-mono text-xs text-neutral-600">{item.meta}</p>
      </div>
      <StatusBadge label={item.branch} tone={item.tone} />
    </div>
  ))}
</AnimatedList>
```

`StatusBadge` şube adını taşır; `tone` yalnız arka planı sürer, anlam metinden okunur.

- [ ] **Step 3: Kontrol + commit**

Feed girişleri scroll ile 60ms aralıklarla belirir. Reduced-motion'da hepsi statik.

```bash
git add src/components/marketing/ActivityPreview.tsx
git commit -m "feat(section): demo rozetli çok-şubeli panel önizlemesi"
```

---

## Task 12: Şeffaf maliyet ve teklif (`CostAndQuote`)

**Files:**
- Create: `src/components/marketing/CostAndQuote.tsx`

**Interfaces:**
- Consumes: `COST_MODELS`, `CONTACT_EMAIL`, `Reveal`, `SectionHeader`, `TRANSITION`

- [ ] **Step 1: İki maliyet modeli kartını yaz**

`md:grid-cols-2`. Her kart: ikon → `h3` → açıklama → `bullets`.

**Hiçbir kartta rakam, birim maliyet, marj veya "önerilen" vurgusu yoktur.** Üç kademeli fiyat kartı deseni bilinçle terk edilmiştir: fiyatlandırma modeli henüz kurulmadı (Mimari §"Birim ekonomisi ve bütçe").

- [ ] **Step 2: Teklif çağrısını yaz**

Kartların altında, ortalanmış:

> **Fiyatlandırma şube sayınıza ve seçtiğiniz modüllere göre belirlenir.**
> Size özel bir teklif için 30 dakikalık bir görüşme yeterli.

CTA: **bordered/secondary varyant**, Teal değil.

```tsx
<a
  href={`mailto:${CONTACT_EMAIL}`}
  className={`inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50 ${TRANSITION}`}
>
  Teklif alın
</a>
```

**Neden Teal değil:** Bu bölüme scroll edildiğinde navbar'ın Teal CTA'sı zaten görünür durumdadır. İkinci bir Teal CTA, Tasarım Dili §5.2'nin "sayfada birden fazla marka rengi CTA'sı bir işaret sorunudur" kuralını ihlal eder.

- [ ] **Step 3: Kontrol + commit**

Sayfayı bu bölüme kadar kaydır; ekranda **yalnız bir** Teal buton (navbar) görünmeli.

```bash
git add src/components/marketing/CostAndQuote.tsx
git commit -m "feat(section): şeffaf LLM maliyet modelleri + teklif çağrısı"
```

---

## Task 13: Bölümleri birleştir, dosyaları taşı, numaraları düzelt

**Files:**
- Modify: `src/App.tsx`
- Move: `src/components/{Navbar,Hero,SectorProblem,HowItWorks,ClosingFooter}.tsx` → `src/components/marketing/`
- Delete: `src/components/{Capabilities,Differentiators,SecurityRoadmapFaq}.tsx`
- Modify: `src/data/content.ts` — `CAPABILITIES` ve `DIFFERENTIATORS` export'larını ve artık kullanılmayan ikon importlarını kaldır
- Modify: taşınan dosyalarda `../asset` → `../../asset`, `../data/content` → `../../data/content`, `./primitives` → `../primitives`, `../hooks` → `../../hooks`

**Interfaces:**
- Consumes: Task 4–12'nin tüm bölüm bileşenleri

- [ ] **Step 1: `App.tsx`'i yeni sıraya göre yaz**

```tsx
import { Navbar } from './components/marketing/Navbar';
import { Hero } from './components/marketing/Hero';
import { SectorProblem } from './components/marketing/SectorProblem';
import { CapabilityBento } from './components/marketing/CapabilityBento';
import { HowItWorks } from './components/marketing/HowItWorks';
import { SectorVerticals } from './components/marketing/SectorVerticals';
import { Onboarding } from './components/marketing/Onboarding';
import { Integrations } from './components/marketing/Integrations';
import { Security } from './components/marketing/Security';
import { CapabilityMarquee } from './components/marketing/CapabilityMarquee';
import { ActivityPreview } from './components/marketing/ActivityPreview';
import { CostAndQuote } from './components/marketing/CostAndQuote';
import { RoadmapFaq } from './components/marketing/RoadmapFaq';
import { ClosingFooter } from './components/marketing/ClosingFooter';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SectorProblem />
        <CapabilityBento />
        <HowItWorks />
        <SectorVerticals />
        <Onboarding />
        <Integrations />
        <Security />
        <CapabilityMarquee />
        <ActivityPreview />
        <CostAndQuote />
        <RoadmapFaq />
      </main>
      <ClosingFooter />
    </>
  );
}
```

- [ ] **Step 2: `SectionHeader` numaralarını yeniden ver**

Numaralar render sırasını izlemeli; atlanan numara okuyucuyu şaşırtır.

| Bölüm | `number` | `pill` |
|---|---|---|
| `SectorProblem` | `01` | Müşteri Deneyimi Kaosu |
| `CapabilityBento` | `02` | Çekirdek Platform |
| `HowItWorks` | `03` | Otomasyon Akışı |
| `SectorVerticals` | `04` | Çok-Sektör Çerçevesi |
| `Onboarding` | `05` | Kurulum ve Yönetim |
| `Integrations` | `06` | Entegrasyon Çatısı |
| `Security` | `07` | Güvenlik ve Uyum |
| `CapabilityMarquee` | — | (başlıksız şerit) |
| `ActivityPreview` | `08` | Panel Önizleme |
| `CostAndQuote` | `09` | Şeffaf Maliyet |
| `RoadmapFaq` → roadmap | `10` | Ürün Vizyonu |
| `RoadmapFaq` → FAQ | `11` | Sık Sorulan Sorular |

- [ ] **Step 3: Arka plan ritmini kur**

Ardışık iki bölüm aynı arka planı almamalı; aksi halde bölüm sınırı kaybolur.

`Hero` neutral-50 → `SectorProblem` white → `CapabilityBento` surface-sunken → `HowItWorks` white → `SectorVerticals` surface-sunken → `Onboarding` white → `Integrations` neutral-900 (koyu, kod paneli bölümü) → `Security` white → `CapabilityMarquee` surface-sunken → `ActivityPreview` white → `CostAndQuote` surface-sunken → `RoadmapFaq` white → `ClosingFooter` teal bandı + neutral-900 footer.

> `Integrations`'ı koyu yapmak sayfaya tek bir görsel nefes noktası verir ve outbox kod panelini doğal bağlamına oturtur. Koyu bölümde metin `text-white/70`, başlık `text-white`; kontrast AA'yı geçer.

- [ ] **Step 4: Çapaları `NAV_LINKS` ile doğrula**

`#platform` → `CapabilityBento`, `#nasil-calisir` → `HowItWorks`, `#entegrasyon` → `Integrations`, `#guvenlik` → `Security`, `#sss` → `RoadmapFaq`. Her hedef `scroll-mt-24` taşımalı (fixed navbar payı).

- [ ] **Step 5: Ölü kodu kaldır**

`content.ts`'ten `CAPABILITIES`, `Capability`, `DIFFERENTIATORS`, `Differentiator` ve artık kullanılmayan ikon importları (`Bot`, `Ticket`, `Megaphone`, `BarChart3`, `Gift`, `Plug`, `ScanText`, `Lock` — hangileri gerçekten kullanılmıyorsa) silinir.

Run: `rg -n "CAPABILITIES|DIFFERENTIATORS" src/`
Expected: hiç eşleşme yok.

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: temiz. `noUnusedLocals`/`noUnusedParameters` ölü importları yakalar — hepsi temizlenmiş olmalı.

- [ ] **Step 7: Commit**

```bash
git add -A src/
git commit -m "refactor(layout): bölümleri marketing/ altında birleştir, numaralandır, ölü kodu kaldır"
```

---

## Task 14: Uçtan uca doğrulama

**Files:** yok (yalnız doğrulama; bulunan hatalar ilgili task'ın dosyasında düzeltilir)

- [ ] **Step 1: Build ve tip denetimi**

Run: `npm run build`
Expected: `tsc -b` sıfır hata; `vite build` başarılı.

- [ ] **Step 2: Ham hex denetimi**

Run: `rg -n "#[0-9a-fA-F]{6}" src/ --glob '!src/styles/tokens.css' --glob '!src/components/HeroShader.tsx'`
Expected: **sıfır eşleşme.**

- [ ] **Step 3: Yasaklı içerik denetimi**

Run: `rg -in "ISO 27001|ISO27001|SOC 2|uptime|RestoPos|AssisTT|%99" src/`
Expected: **sıfır eşleşme.**

Run: `rg -n "₺|TL/ay|\\$[0-9]" src/`
Expected: **sıfır eşleşme** (fiyat rakamı yok).

- [ ] **Step 4: Responsive doğrulama (Playwright MCP)**

`npm run dev` çalışırken, `mcp__plugin_playwright_playwright__browser_navigate` ile `http://localhost:5173` açılır.

Her genişlik için (`browser_resize` → 375×812, 768×1024, 1440×900):
- `browser_take_screenshot` ile tam sayfa görüntü al
- `browser_evaluate` ile yatay taşma kontrolü:

```js
() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
})
```

Expected: her üç genişlikte `scrollWidth === clientWidth`.

- [ ] **Step 5: Tek Teal CTA kuralı**

`browser_evaluate` ile hero'nun altına kaydır, sonra:

```js
() => [...document.querySelectorAll('a')]
  .filter((a) => {
    const bg = getComputedStyle(a).backgroundColor;
    const r = a.getBoundingClientRect();
    const visible = r.top < innerHeight && r.bottom > 0 && r.width > 0;
    return visible && bg === 'rgb(13, 122, 111)';
  }).length
```

Expected: her scroll pozisyonunda `<= 1`.

- [ ] **Step 6: Marquee hover'da durur**

`browser_hover` ile marquee şeridinin üstüne gel, `browser_evaluate` ile:

```js
() => getComputedStyle(document.querySelector('.animate-marquee')).animationPlayState
```

Expected: `"paused"`.

- [ ] **Step 7: Reduced-motion**

`browser_run_code_unsafe` ile CDP emülasyonu yerine, `browser_evaluate` ile doğrudan doğrulanamaz — bu adım DevTools'ta elle yapılır:
Chrome DevTools → Rendering → *Emulate CSS media feature prefers-reduced-motion* → `reduce`, sayfayı yenile.

Expected:
- Hero sayaçları animasyonsuz, doğrudan `12` / `18` / `4` / `4`.
- Marquee satırları durur; şerit yatay kaydırılabilir.
- `AnimatedList` girişleri anında görünür.
- Hero shader'ı `StaticBackground`'a düşer.

- [ ] **Step 8: Klavye ve ekran okuyucu**

Sayfa başından sonuna `Tab`.
Expected: her interaktif elemanda görünür focus ring (2px teal, 2px offset); sıra görsel sırayla eşleşir; mobil menü açıkken `Escape` benzeri bir kaçış yolu (kapat butonu) ilk durakta.

`h1` → `h2` → `h3` hiyerarşisi atlanmaz. Her bölümde tek `h2`.

- [ ] **Step 9: Kontrast**

DevTools → Elements → Accessibility → Contrast.
Kontrol edilecekler:
- `text-neutral-600` (#5E6C84) üstünde `bg-white` → 4.5:1 ✓
- `text-neutral-600` üstünde `bg-surface-sunken` (#F4F5F7) → 4.5:1 ✓
- `Integrations` koyu bölümünde `text-white/70` üstünde `bg-neutral-900` (#172B4D) → ≥ 4.5:1 doğrula; geçmezse `text-white/80`'e çıkar
- `StatusBadge` `success` (#006644 on #E3FCEF) → ✓

- [ ] **Step 10: Demo rozeti denetimi**

Run: `rg -l "AnimatedList" src/components/marketing/`
Her eşleşen dosya için: aynı dosyada `DemoBadge` de geçmeli.
Expected: `Security.tsx` ve `ActivityPreview.tsx` — ikisi de `DemoBadge` içerir.

- [ ] **Step 11: Commit ve push**

```bash
git add -A
git commit -m "test: uçtan uca doğrulama düzeltmeleri"
git push -u origin landing-tasarim-revizyonu
```

---

## Self-Review

**Spec kapsamı:**

| Spec bölümü | Karşılayan task |
|---|---|
| §3.1 Token katmanı + hex temizliği | Task 1 |
| §3.2 Bağımlılıklar (`motion`, `cn`) | Task 2 |
| §3.3 Dosya düzeni | Task 2, 13 |
| §4 Bölüm tablosu (15 blok) | Task 4–13 |
| §4.1 Hero istatistikleri | Task 3 Step 1, Task 4 |
| §4.1 Yetenek bento | Task 3 Step 2, Task 5 |
| §4.1 Sektör dikeyleri | Task 3 Step 3, Task 6 |
| §4.1 Entegrasyon çatısı | Task 3 Step 5, Task 8 |
| §4.1 Güvenlik + audit ticker | Task 3 Step 6, Task 9 |
| §4.1 Panel önizleme | Task 3 Step 8, Task 11 |
| §4.1 Şeffaf maliyet | Task 3 Step 8, Task 12 |
| §5 Motion ve erişilebilirlik | Task 2 (Reveal/reduced-motion), Task 14 Step 6–9 |
| §6 Doğrulama | Task 14 |

Spec'in her maddesinin bir task'ı var. Boşluk yok.

**Spec'ten sapma (bilinçli):** Spec `clsx` + `tailwind-merge` eklemeyi öngörüyordu. Plan bunun yerine sıfır bağımlılıklı yerel bir `cn()` kullanıyor (Task 2 Step 2). Gerekçe: mevcut kod çakışan Tailwind utility'si üretmiyor, bu yüzden `tailwind-merge`'ün çakışma çözümü ölü ağırlık olurdu; ve mevcut bileşenler zaten düz template-string birleştirmesi kullanıyor. Net etki: eklenen tek paket `motion`.

**Tip tutarlılığı:**
- `Stat = { value: string; label: string }` — `SECTOR_VERTICALS.stats` ve `StatPair` propları eşleşiyor (`value: string`).
- `HeroStat.value: number` — `NumberTicker` `value: number` bekliyor. ✓
- `ActivityItem.tone: 'success' | 'neutral' | 'information'` — `StatusBadge`'in `BadgeTone` birliğiyle birebir aynı. ✓
- `AuditLine` `StatusBadge`'e beslenmiyor; kendi mono etiketini kullanıyor (`danger` tonu `BadgeTone`'da yok — Task 9 Step 3 bunu `StatusBadge` yerine düz sınıfla çözer). ✓
- `cn(...classes: ClassValue[])` — `Marquee` ona `boolean` geçirebilir (`reducedMotion && '…'` → `false | string`). `ClassValue` `false`'u kapsıyor. ✓

**Placeholder taraması:** Kod içeren her adımda gerçek kod var. `ONBOARDING_STEPS` içindeki "Tanımlanacak" bir plan placeholder'ı değil, kasıtlı ve doğru bir **içerik** değeridir (Perakende/Otelcilik modül setleri dokümanda tanımlı değil).
