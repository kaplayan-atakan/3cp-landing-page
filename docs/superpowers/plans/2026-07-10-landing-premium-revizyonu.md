# 3CP Landing Premium Revizyon — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Landing page'i nihai-hal ürün anlatısına ve high-end (Swiss Modernism 2.0) görsel dile taşımak; en tepeye dot-matrix LED bandı eklemek; `shaders` bağımlılığını kaldırıp hero'yu GPU-safe CSS arka planına çevirmek.

**Architecture:** Önce temel katman (fontların self-host'a çekilmesi + serif ekleme, yeni token'lar) kurulur; sonra bağımsız görsel altyapı (premium card primitive, GPU-safe hero, LED bandı) inşa edilir; ardından içerik nihai-hal diline çevrilir; en son doluluk/efekt katmanı ve uçtan uca doğrulama gelir. Her task kendi doğrulama döngüsünü (build / `rg` taraması / Playwright davranış kontrolü) taşır — bu görsel landing için doğru test biçimidir.

**Tech Stack:** Vite 5, React 18, TypeScript 5.6 (strict), Tailwind CSS 3.4, `motion` (Framer Motion), `lucide-react`, `@fontsource-variable/*` (self-host font). `shaders` **kaldırılır**.

**Spec:** `docs/superpowers/specs/2026-07-10-landing-premium-revizyonu-design.md`

## Global Constraints

- **Üst ilke — dili ve tasarımı yükselt, kanıtı uydurma:** Bir yeteneği şimdiki zaman anlatmak izinlidir; bir traction metriği / sertifika / müşteri logosu / fiyat uydurmak yasaktır.
- **Yasak içerik (önceki spec'ten devralınır):** `ISO 27001`, `SOC 2`, uptime yüzdesi, şube/etkileşim sayısı, `RestoPos`/`AssisTT` gibi üçüncü taraf marka adları, üç kademeli fiyat kartları, uydurma müşteri logosu.
- **Sıfır ham hex:** `src/` altında `#RRGGBB` yalnız `src/styles/tokens.css` içinde geçebilir. (GPU-safe iş kolundan sonra `HeroShader.tsx` istisnası ortadan kalkar.)
- **Tek birincil CTA kuralı:** Sayfada aynı anda yalnız bir Teal CTA görünür (navbar CTA'sı `scrollY > innerHeight*0.85`).
- **Boşluk:** 8px ızgarası (çift adımlar); istisna ikon–metin `gap-1`.
- **Motion:** Yalnız `transform`/`opacity`. Mikro-etkileşim 150–300ms, bölüm geçişi ≤400ms. Her animasyon `usePrefersReducedMotion` ile durur.
- **Erişilebilirlik:** WCAG AA. Gövde ≥ 4.5:1, büyük metin ≥ 3:1. Durum asla yalnız renkle iletilmez.
- **Dil:** Tüm arayüz metni Türkçe. Başlık/butonlarda sentence case; all-caps yalnız kısaltmalar ve `StatusBadge`/LED için.
- **TypeScript:** `strict`, `noUnusedLocals`, `noUnusedParameters` açık. `npm run build` temiz geçmeli.
- **Serif kullanımı:** `font-serif` (Playfair Display) yalnız büyük başlıklarda (hero H1, bölüm H2'leri, kapanış bandı). Gövde/buton/etiket/mono değişmez.

---

## File Structure

| Dosya | Sorumluluk | Durum |
|---|---|---|
| `src/main.tsx` | Self-host font importları | Modify |
| `index.html` | Google Fonts `<link>` kaldırılır | Modify |
| `tailwind.config.js` | `fontFamily.serif`, `led-bg` rengi | Modify |
| `src/styles/tokens.css` | `--color-led-bg` + premium card token'ları | Modify |
| `src/components/primitives.tsx` | `ShaderErrorBoundary` sil; `PremiumCard` + `SerifHeading` ekle | Modify |
| `src/components/marketing/LedTicker.tsx` | Dot-matrix LED bandı | Create |
| `src/components/HeroShader.tsx` | — | Delete |
| `src/components/marketing/HeroBackground.tsx` | Token'lara bağlı CSS hero arka planı | Create |
| `src/components/marketing/ProductMockup.tsx` | Türkçe, DemoBadge'li HTML/CSS ürün paneli | Create |
| `src/components/marketing/Hero.tsx` | shader→CSS arka plan, serif H1, ProductMockup | Modify |
| `src/components/marketing/CapabilityMarquee.tsx` | — | Delete |
| `src/components/marketing/CapabilityBento.tsx` | Faz rozeti→numara, PremiumCard | Modify |
| `src/components/marketing/SectorVerticals.tsx` | Olgunluk damgaları kaldır, PremiumCard | Modify |
| `src/components/marketing/Integrations.tsx` | Faz rozeti kaldır | Modify |
| `src/components/marketing/RoadmapFaq.tsx` | Roadmap→vizyon çerçeve | Modify |
| `src/components/marketing/ActivityPreview.tsx` | `surface-sunken` arka plan | Modify |
| `src/data/content.ts` | Nihai-hal içerik | Modify |
| `src/App.tsx` | `LedTicker` en üste, `CapabilityMarquee` sil | Modify |
| `package.json` | `shaders` kaldır, `@fontsource-variable/*` ekle | Modify |

**Kararlar (spec'in açık uçları bağlandı):**
- Serif: **Playfair Display** (`@fontsource-variable/playfair-display`).
- Font: **üçü de self-host** (`@fontsource-variable/inter`, `.../playfair-display`, `.../jetbrains-mono`); `index.html`'deki Google `<link>` kaldırılır → shader telemetrisi kaldırmayla tutarlı, sıfır üçüncü-taraf çağrı.
- Hero mockup: **HTML/CSS canlı panel** (`ProductMockup.tsx`), raster PNG değil.

---

## Task 1: Fontları self-host'a çek + serif ekle

**Files:**
- Modify: `package.json`
- Modify: `src/main.tsx`
- Modify: `index.html:20-25`
- Modify: `tailwind.config.js:42-45`

**Interfaces:**
- Produces: Tailwind `font-serif` (Playfair Display), `font-sans` (Inter Variable), `font-mono` (JetBrains Mono Variable) — hepsi yerel.

- [ ] **Step 1: `@fontsource-variable` paketlerini kur**

Run: `npm install @fontsource-variable/inter @fontsource-variable/playfair-display @fontsource-variable/jetbrains-mono`
Expected: `package.json` dependencies'e üç paket eklenir.

- [ ] **Step 2: `src/main.tsx`'e font importlarını ekle**

`src/main.tsx` başına (mevcut importların üstüne):

```tsx
import '@fontsource-variable/inter';
import '@fontsource-variable/playfair-display';
import '@fontsource-variable/jetbrains-mono';
```

- [ ] **Step 3: `index.html`'den Google Fonts'u kaldır**

`index.html:20-25`'teki üç satırı sil:

```html
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
```

Bu satırlar tamamen kaldırılır (yerine hiçbir şey konmaz; fontlar artık `main.tsx`'ten gelir).

- [ ] **Step 4: `tailwind.config.js` fontFamily'yi güncelle**

`tailwind.config.js:42-45`:

```js
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display Variable"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace'],
      },
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: `tsc -b` temiz, `vite build` başarılı. `dist/assets/` altında woff2 font dosyaları görünür.

- [ ] **Step 6: Google Fonts çağrısı kalmadığını doğrula**

Run: `rg -n "fonts.googleapis|fonts.gstatic" index.html src/`
Expected: **sıfır eşleşme.**

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/main.tsx index.html tailwind.config.js
git commit -m "feat(fonts): üç fontu self-host'a çek + Playfair Display serif ekle"
```

---

## Task 2: Yeni token'lar (LED zemini + premium card)

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `tailwind.config.js`

**Interfaces:**
- Produces: `--color-led-bg` (RGB kanal üçlüsü); Tailwind renkleri `led-bg`. Premium card için `--card-hairline` semantic token.

- [ ] **Step 1: `tokens.css`'e token ekle**

`src/styles/tokens.css` içinde Katman 1 primitives bloğuna ekle:

```css
  --color-led-bg: 11 17 32; /* #0B1120 — LED bandı zemini (dot-matrix) */
```

Katman 2 semantic bloğuna ekle:

```css
  --card-hairline: var(--color-teal-700); /* premium card üst aksan çizgisi */
```

- [ ] **Step 2: `tailwind.config.js` colors'a ekle**

`tailwind.config.js` `colors` bloğuna (`footer-deep` satırının yanına):

```js
        'led-bg': token('--color-led-bg'),
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: temiz.

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css tailwind.config.js
git commit -m "feat(tokens): LED zemini ve premium card hairline token'ları"
```

---

## Task 3: GPU-safe hero — `shaders`'ı kaldır, CSS arka planına geç

**Files:**
- Delete: `src/components/HeroShader.tsx`
- Create: `src/components/marketing/HeroBackground.tsx`
- Modify: `src/components/primitives.tsx` (`ShaderErrorBoundary` sil)
- Modify: `src/components/marketing/Hero.tsx`
- Modify: `package.json`

**Interfaces:**
- Consumes: `usePrefersReducedMotion` (`src/hooks.ts`).
- Produces: `<HeroBackground />` — full-bleed, `pointer-events-none`, `aria-hidden`, GPU'suz dekoratif arka plan.

- [ ] **Step 1: `HeroBackground.tsx` oluştur**

`src/components/marketing/HeroBackground.tsx`:

```tsx
import { usePrefersReducedMotion } from '../../hooks';

/**
 * GPU-free hero background. Token-bound radial gradients over a near-white base,
 * plus a barely-there inline SVG grain (no network request). An optional very
 * slow drift animates only transform/opacity and stops under reduced-motion.
 * Replaces the former WebGL shader stack (removed with the `shaders` dependency).
 */
export function HeroBackground() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-neutral-50"
      aria-hidden="true"
    >
      <div
        className={`absolute inset-0 ${reducedMotion ? '' : 'motion-safe:animate-[heroDrift_28s_ease-in-out_infinite_alternate]'}`}
        style={{
          backgroundImage:
            'radial-gradient(1200px 600px at 72% 18%, rgb(var(--color-teal-700) / 0.12), transparent 60%),' +
            'radial-gradient(900px 520px at 18% 88%, rgb(var(--color-teal-700) / 0.07), transparent 60%)',
        }}
      />
      {/* Inline SVG grain as a data-URI — no external fetch. */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: `heroDrift` keyframe'ini Tailwind'e ekle**

`tailwind.config.js` `keyframes` bloğuna ekle:

```js
        heroDrift: {
          '0%': { transform: 'translate3d(0,0,0) scale(1)' },
          '100%': { transform: 'translate3d(0,-1.5%,0) scale(1.04)' },
        },
```

- [ ] **Step 3: `Hero.tsx`'te shader'ı `HeroBackground` ile değiştir**

`src/components/marketing/Hero.tsx` başındaki `lazy`/`Suspense` shader importunu ve kullanımını kaldır:

```tsx
// Kaldır:
// import { lazy, Suspense } from 'react';
// const HeroShader = lazy(() => import('../HeroShader').then((m) => ({ default: m.HeroShader })));
// <Suspense fallback={...}><HeroShader /></Suspense>
```

Yerine ekle:

```tsx
import { HeroBackground } from './HeroBackground';
// ...JSX içinde, hero section'ın ilk çocuğu olarak:
<HeroBackground />
```

(Hero içeriği `HeroBackground`'ın üstünde kalması için `relative z-10` taşımalı — mevcut yapı zaten katmanlıysa koru.)

- [ ] **Step 4: `ShaderErrorBoundary`'yi `primitives.tsx`'ten sil**

`src/components/primitives.tsx` içindeki `ShaderErrorBoundary` sınıfını, `BoundaryProps`/`BoundaryState` tiplerini ve artık kullanılmayan `Component` importunu kaldır.

- [ ] **Step 5: `HeroShader.tsx`'i sil ve `shaders` paketini kaldır**

```bash
git rm src/components/HeroShader.tsx
npm uninstall shaders
```

- [ ] **Step 6: Build ve artık-referans taraması**

Run: `npm run build`
Expected: temiz. `noUnusedLocals` artık import bırakmadığını doğrular.

Run: `rg -n "shaders/react|HeroShader|ShaderErrorBoundary" src/`
Expected: **sıfır eşleşme.**

- [ ] **Step 7: `dist/` chunk'ının küçüldüğünü doğrula**

Run: `npm run build`
Expected: Çıktıda `HeroShader-*.js` (1.35 MB) chunk'ı **yok**; toplam bundle belirgin küçülür.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor(hero): shaders bağımlılığını kaldır, GPU-safe CSS arka planına geç"
```

---

## Task 4: `PremiumCard` ve `SerifHeading` primitive'leri

**Files:**
- Modify: `src/components/primitives.tsx`

**Interfaces:**
- Consumes: `cn` (`src/lib/utils.ts`), `motion` (`motion/react`), `usePrefersReducedMotion`.
- Produces:
  - `<PremiumCard as?, className?, hairline?, cornerLabel?, children />` — hairline üst aksan + hover yükselmesi (yalnız box-shadow/transform).
  - `<SerifHeading as?, className?, children />` — `font-serif` başlık sarmalayıcı.

- [ ] **Step 1: `SerifHeading` ekle**

`src/components/primitives.tsx` sonuna:

```tsx
interface SerifHeadingProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

/** Editorial serif heading (Playfair Display). Used only for large titles. */
export function SerifHeading({ children, as = 'h2', className }: SerifHeadingProps) {
  const Tag = as;
  return <Tag className={cn('font-serif tracking-[-0.01em]', className)}>{children}</Tag>;
}
```

- [ ] **Step 2: `PremiumCard` ekle**

```tsx
interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  /** Show the 1px teal hairline accent at the top edge. */
  hairline?: boolean;
  /** Optional mono tabular corner number (replaces phase badges). */
  cornerLabel?: string;
}

/**
 * Elevated content card with a hairline top accent and a soft hover lift.
 * Only box-shadow and transform animate (no layout shift); the lift is disabled
 * under reduced-motion. This is the single "designer's hand" card primitive.
 */
export function PremiumCard({ children, className, hairline = true, cornerLabel }: PremiumCardProps) {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 shadow-raised transition-shadow duration-medium ease-smooth',
        !reducedMotion && 'hover:-translate-y-0.5 hover:shadow-overlay motion-safe:transition-[transform,box-shadow]',
        className,
      )}
    >
      {hairline && (
        <span
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-teal to-transparent opacity-70"
          aria-hidden="true"
        />
      )}
      {cornerLabel && (
        <span className="absolute right-4 top-4 font-mono text-xs tabular-nums text-neutral-400">
          {cornerLabel}
        </span>
      )}
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: temiz. (Bileşenler henüz tüketilmese de export'lar `noUnusedLocals`'a takılmaz.)

- [ ] **Step 4: Commit**

```bash
git add src/components/primitives.tsx
git commit -m "feat(ui): PremiumCard ve SerifHeading primitive'leri"
```

---

## Task 5: `LedTicker` bileşeni + en üste yerleştir

**Files:**
- Create: `src/components/marketing/LedTicker.tsx`
- Delete: `src/components/marketing/CapabilityMarquee.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/marketing/ActivityPreview.tsx` (arka plan `surface-sunken`)

**Interfaces:**
- Consumes: `Marquee` (`src/components/magicui/marquee.tsx`), `MARQUEE_ROW_ONE`, `MARQUEE_ROW_TWO` (`content.ts`).
- Produces: `<LedTicker />` — sayfanın en tepesinde dot-matrix bant.

- [ ] **Step 1: `LedTicker.tsx` oluştur**

`src/components/marketing/LedTicker.tsx`:

```tsx
import { Marquee } from '../magicui/marquee';
import { MARQUEE_ROW_ONE, MARQUEE_ROW_TWO } from '../../data/content';

const LABELS = [...MARQUEE_ROW_ONE, ...MARQUEE_ROW_TWO];

/**
 * Dot-matrix LED ticker at the very top of the page. Near-black base, teal-400
 * glyphs with a faint bloom, and a CSS pixel-grid mask overlay that gives the
 * shop-window LED look. Scrolls with the page (not sticky). Reuses the Marquee
 * motor, which stops and becomes horizontally scrollable under reduced-motion.
 */
export function LedTicker() {
  return (
    <div
      className="relative w-full overflow-hidden bg-led-bg"
      role="marquee"
      aria-label="3CP platform yetenekleri"
    >
      {/* Pixel-grid mask — the single detail that reads as a real LED panel. */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-40"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(rgb(255 255 255 / 0.15) 0.5px, transparent 0.6px)',
          backgroundSize: '3px 3px',
        }}
      />
      {/* Edge fade so the strip reads as endless. */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        aria-hidden="true"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          background: 'transparent',
        }}
      />
      <Marquee pauseOnHover className="[--duration:32s] py-2.5">
        {LABELS.map((label) => (
          <span
            key={label}
            className="mx-6 font-mono text-[13px] font-medium uppercase tracking-[0.22em] text-brand-teal-dark"
            style={{ textShadow: '0 0 8px rgb(var(--color-teal-400) / 0.55)' }}
          >
            {label}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
```

- [ ] **Step 2: `App.tsx`'e `LedTicker`'ı en üste ekle, `CapabilityMarquee`'yi çıkar**

`src/App.tsx`:

```tsx
import { LedTicker } from './components/marketing/LedTicker';
// Kaldır: import { CapabilityMarquee } from './components/marketing/CapabilityMarquee';

export default function App() {
  return (
    <>
      <LedTicker />
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
        {/* CapabilityMarquee kaldırıldı — içeriği LedTicker'a taşındı */}
        <ActivityPreview />
        <CostAndQuote />
        <RoadmapFaq />
      </main>
      <ClosingFooter />
    </>
  );
}
```

- [ ] **Step 3: `CapabilityMarquee.tsx`'i sil**

```bash
git rm src/components/marketing/CapabilityMarquee.tsx
```

- [ ] **Step 4: `ActivityPreview` arka planını `surface-sunken` yap**

`src/components/marketing/ActivityPreview.tsx` — kök `<section>`'ın arka planını `bg-white`'tan `bg-surface-sunken`'a çevir (ardışık iki beyaz bölüm sorununu çözer: `Security` beyaz → `ActivityPreview` sunken).

- [ ] **Step 5: Build ve artık-referans taraması**

Run: `npm run build`
Expected: temiz.

Run: `rg -n "CapabilityMarquee" src/`
Expected: **sıfır eşleşme.**

- [ ] **Step 6: Playwright — LED en tepede ve reduced-motion**

`npm run dev` çalışırken, `http://localhost:5173` aç.

`browser_evaluate` ile:
```js
() => {
  const led = document.querySelector('[aria-label="3CP platform yetenekleri"]');
  const nav = document.querySelector('nav');
  return {
    ledExists: !!led,
    ledAboveNav: led && nav ? led.getBoundingClientRect().top < nav.getBoundingClientRect().top : null,
    ledTop: led ? Math.round(led.getBoundingClientRect().top) : null,
  };
}
```
Expected: `ledExists: true`, `ledAboveNav: true`, `ledTop: 0` (sayfa başında).

Reduced-motion (`browser_run_code_unsafe` ile `emulateMedia({reducedMotion:'reduce'})`, sonra reload):
```js
() => document.querySelectorAll('.animate-marquee').length
```
Expected: `0` (reduced-motion'da marquee animasyonu eklenmez; Marquee bileşeni statik + kaydırılabilir döner).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(led): dot-matrix LED bandını en üste taşı, ortadaki marquee'yi kaldır"
```

---

## Task 6: Nihai-hal içerik — faz etiketleri ve olgunluk damgaları kaldırılır

**Files:**
- Modify: `src/data/content.ts`
- Modify: `src/components/marketing/CapabilityBento.tsx`
- Modify: `src/components/marketing/Integrations.tsx`
- Modify: `src/components/marketing/SectorVerticals.tsx`

**Interfaces:**
- Consumes: yok (saf içerik + render değişikliği).
- Produces: `CoreModule` ve `AdapterClass` tiplerinden `phase` alanı kaldırılmış; `CapabilityBento` kartları `PremiumCard` `cornerLabel` ile numaralanmış.

- [ ] **Step 1: `CoreModule.phase`'i kaldır**

`src/data/content.ts` — `CoreModule` arayüzünden `phase: string;` satırını sil; `CORE_MODULES` içindeki dört `phase: 'Faz N'` satırını sil.

- [ ] **Step 2: `CapabilityBento` başlığını ve kartları güncelle**

`src/components/marketing/CapabilityBento.tsx`:
- `SectionHeader` başlığını `"Bugün canlı olan dört çekirdek modül"` → `"Platformun dört çekirdek modülü"` yap.
- Kartları `PremiumCard`'a sar; faz rozeti yerine `cornerLabel={String(index + 1).padStart(2, '0')}` ver (`01`–`04`).
- `module.phase` referanslarını kaldır.
- Büyük başlığı `SerifHeading`'e çevir (varsa `SectionHeader` içindeki title zaten büyükse `SectionHeader`'ı Task 8'de ele alırız; burada yalnız kart başlıklarını koru).

- [ ] **Step 3: `AdapterClass.phase`'i kaldır**

`src/data/content.ts` — `AdapterClass` arayüzünden `phase: string;` satırını sil; `ADAPTER_CLASSES` içindeki dört `phase` satırını (`FAZ 4`, `FAZ 4`, `FAZ 8`, `SEKTÖR GENİŞLEMESİ`) sil.

`src/components/marketing/Integrations.tsx` — kartlarda `adapter.phase` render eden rozeti kaldır (adaptör adı + `examples` kalır).

- [ ] **Step 4: Sektör olgunluk damgalarını kaldır**

`src/data/content.ts` — `SECTOR_VERTICALS` içindeki stat metinlerini nihai-hal diline çevir:
- Restoran: `{ value: 'v1', label: 'İlk dikey pazar' }` → `{ value: '3', label: 'Sektöre özel modül' }` (ilk stat da niteliksel/sayısal dürüst forma); ikinci stat korunur.
- Emlak: `'Planlanan sektörel modül'` → `'Sektöre özel modül'`.
- Perakende: `{ value: 'Tanımlanacak', label: 'Sektörel modül seti' }` → sayısal olmayan, yetenek cümlesi taşıyan bir stat'a çevrilir (ör. `{ value: '∞', label: '...' }` **kullanılmaz**; bunun yerine stat çifti niteliksel iki değere indirilir — bkz. Step 5).
- Otelcilik: aynı Perakende yaklaşımı.

`src/components/marketing/SectorVerticals.tsx` — `status`/`active`'e bağlı `YAKINDA`/`AKTİF` damga render'ını kaldır. Kartlar `PremiumCard` olur.

- [ ] **Step 5: "Tanımlanacak" ve uydurma-sayı olmadan Perakende/Otelcilik stat'ları**

`src/data/content.ts` — Perakende ve Otelcilik `stats` çiftini şu forma çevir (sayı uydurmadan, nitelik anlatan):

```ts
    stats: [
      { value: 'Tümü', label: 'Çekirdek servisler devralınır' },
      { value: 'Sektörel', label: 'Modüller çekirdek üzerine kurulur' },
    ],
```

(`'Tanımlanacak'` kelimesi tamamen kaldırılır; `value` alanı `string` olduğu için niteliksel değer geçerlidir.)

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: temiz. (`SECTORS`/`SECTOR_VERTICALS`'ın `status`/`active` alanları hâlâ tipte olabilir ama render edilmez; kullanılmayan alan build'i kırmaz.)

- [ ] **Step 7: Faz/damga taraması**

Run: `rg -n "Faz [0-9]|FAZ [0-9]|YAKINDA|Tanımlanacak|SEKTÖR GENİŞLEMESİ" src/`
Expected: Yalnız JSDoc yorumları eşleşebilir; **render edilen JSX/veri değeri eşleşmez.** (Şüpheli her eşleşme elle doğrulanır.)

- [ ] **Step 8: Commit**

```bash
git add src/data/content.ts src/components/marketing/
git commit -m "feat(content): nihai-hal dili — faz etiketleri ve olgunluk damgaları kaldırıldı"
```

---

## Task 7: Roadmap → ürün vizyonu çerçevesi

**Files:**
- Modify: `src/data/content.ts` (`PHASES`)
- Modify: `src/components/marketing/RoadmapFaq.tsx`

**Interfaces:**
- Produces: `PHASES` takvimsiz, şimdiki-zaman yetenek anlatısına çevrilmiş; roadmap başlığı vizyon diline güncellenmiş.

- [ ] **Step 1: `PHASES` içeriğini nihai-hal diline çevir**

`src/data/content.ts` — `Phase` arayüzünden `current: boolean` ve `status?: string` alanlarını kaldır (veya render'dan çıkar); `PHASES`'i takvimsiz, yetenek-grubu anlatısına çevir:

```ts
export const PHASES: Phase[] = [
  {
    phase: 'Çekirdek Platform',
    description:
      'Çok katmanlı rol yönetimi, 360° müşteri profili, anonim anket ve yapay zeka anlamlandırma motoru.',
  },
  {
    phase: 'Entegrasyon Çatısı',
    description:
      'Evrensel entegrasyon altyapısı, şikayet yönetimi ve çağrı merkezi köprüsü.',
  },
  {
    phase: 'Etkileşim Motoru',
    description:
      'Kampanya ve kupon motoru, çok kanallı sosyal dinleme ve gelişmiş raporlama.',
  },
  {
    phase: 'Sektör Genişliği',
    description:
      'Sadakat ve ödül motoru; emlak, perakende ve otelcilik dikeyleri aynı çekirdek üzerinde.',
  },
];
```

`Phase` arayüzünü buna göre sadeleştir:

```ts
export interface Phase {
  phase: string;
  description: string;
}
```

- [ ] **Step 2: `RoadmapFaq.tsx` başlığını ve `current`/`status` render'ını güncelle**

`src/components/marketing/RoadmapFaq.tsx`:
- Roadmap `SectionHeader` başlığını `"Nereye gidiyoruz?"` → `"Platformun kapsamı"` (veya `"Uçtan uca yetenek genişliği"`) yap; pill `"Ürün Vizyonu"` → `"Platform Kapsamı"`.
- `phase.current` / `phase.status`'a bağlı `AKTİF`/`GELECEK VİZYONU` damga render'ını kaldır.
- Takvim (`Q3 2026` vb.) hiçbir yerde görünmez.

- [ ] **Step 3: FAQ gidişat imalarını yumuşat**

`src/data/content.ts` — `FAQ` içindeki gidişat imalarını nihai-hal diline çek:
- "3CP yalnızca restoranlar için mi?" cevabındaki `"İlk odağımız restoran zincirleri olsa da"` → `"3CP çok sektörlü bir platformdur; restoran zincirleri, emlak, perakende ve otelcilik aynı güçlü çekirdek üzerine kurulur."`

- [ ] **Step 4: Build ve takvim taraması**

Run: `npm run build`
Expected: temiz.

Run: `rg -n "Q[1-4] 20[0-9]{2}|GELECEK VİZYONU|2027 ve Ötesi" src/`
Expected: **sıfır eşleşme.**

- [ ] **Step 5: Commit**

```bash
git add src/data/content.ts src/components/marketing/RoadmapFaq.tsx
git commit -m "feat(content): roadmap'i takvimsiz platform-kapsamı anlatısına çevir"
```

---

## Task 8: Serif başlıklar (hero H1 + bölüm H2'leri)

**Files:**
- Modify: `src/components/marketing/Hero.tsx`
- Modify: `src/components/primitives.tsx` (`SectionHeader` başlığını serif yap)

**Interfaces:**
- Consumes: `SerifHeading` (Task 4).
- Produces: Hero H1 ve tüm `SectionHeader` başlıkları `font-serif` render eder.

- [ ] **Step 1: Hero H1'i serif yap**

`src/components/marketing/Hero.tsx` — H1 `className`'ine `font-serif` ekle; ağırlığı Playfair için ayarla (`font-semibold` genelde yeterli, `font-bold` çok ağır olabilir). İkinci satır (teal `<span>`) korunur.

- [ ] **Step 2: `SectionHeader`'ın title'ını serif yap**

`src/components/primitives.tsx` — `SectionHeader` bileşenindeki büyük `title` render'ına `font-serif` ekle (tüm bölüm H2'leri tek yerden serif olur). Pill ve numara mono/sans kalır.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: temiz.

- [ ] **Step 4: Playwright — computed font-family**

`browser_evaluate`:
```js
() => {
  const h1 = document.querySelector('h1');
  const h2 = document.querySelector('main h2');
  return {
    h1Font: h1 && getComputedStyle(h1).fontFamily,
    h2Font: h2 && getComputedStyle(h2).fontFamily,
  };
}
```
Expected: ikisi de `"Playfair Display Variable"` ile başlar.

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/Hero.tsx src/components/primitives.tsx
git commit -m "feat(type): hero H1 ve bölüm başlıklarını editoryal serife çevir"
```

---

## Task 9: Hero ürün mockup'ı (`ProductMockup`) + STEPS görselleri

**Files:**
- Create: `src/components/marketing/ProductMockup.tsx`
- Modify: `src/components/marketing/Hero.tsx`
- Modify: `src/data/content.ts` (`STEPS` görsel/metin denetimi — gerekirse)

**Interfaces:**
- Consumes: `DemoBadge` (`primitives.tsx`), `StatPair` (`primitives.tsx`).
- Produces: `<ProductMockup />` — Türkçe, DemoBadge'li, uydurma-metrik içermeyen HTML/CSS dashboard paneli; hero'nun sağ yarısını doldurur.

- [ ] **Step 1: `ProductMockup.tsx` oluştur**

`src/components/marketing/ProductMockup.tsx` — Türkçe arayüzlü, sahte traction metriği içermeyen bir panel. İçerik `ACTIVITY_FEED` ve `PERMISSION_MATRIX` gibi mevcut dürüst mock verilerden beslenir; panel `DemoBadge` taşır. Örnek iskelet:

```tsx
import { DemoBadge } from '../primitives';
import { ACTIVITY_FEED } from '../../data/content';

/**
 * Türkçe, GPU-free HTML/CSS product panel for the hero. Carries a DemoBadge and
 * seeds from ACTIVITY_FEED — no invented traction figures, no English strings,
 * no dates. Retina-crisp (vector/text, not a raster PNG).
 */
export function ProductMockup() {
  return (
    <div className="relative rounded-2xl border border-neutral-200 bg-white p-5 shadow-overlay">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-xs text-neutral-600">3CP · Şube akışı</span>
        <DemoBadge />
      </div>
      <ul className="space-y-2">
        {ACTIVITY_FEED.slice(0, 4).map((item) => (
          <li
            key={item.branch + item.title}
            className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium text-neutral-900">{item.title}</p>
              <p className="font-mono text-xs text-neutral-600">{item.meta}</p>
            </div>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-[11px] text-neutral-600">
              {item.branch}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: `Hero.tsx`'e `ProductMockup`'ı yerleştir**

`src/components/marketing/Hero.tsx` — hero'nun sağ yarısına (boş alan) `<ProductMockup />` ekle. Mobilde H1'in altına düşer (mevcut responsive grid'e uyar). Eski raster hero görseli (`images/…`) kullanımı kaldırılır.

- [ ] **Step 3: `STEPS` ve hero raster görsellerini denetle**

Run: `rg -n "step-1|step-2|step-3|Total Feedback|AI Sentiment|Jan 20|Feb 20|2023" src/`
Expected: Hero artık raster ürün görseli kullanmıyorsa eşleşme yalnız `STEPS` alt-bölümünde kalır. `STEPS` görselleri İngilizce/lorem/uydurma-metrik içeriyorsa: (a) görseli Türkçe/temiz bir varyantla değiştir **veya** (b) `HowItWorks` bölümünü de HTML/CSS mock'a çevir. Bu adım, hero dışındaki raster görsellerin de dürüstlük çizgisine uymasını sağlar.

> **Not:** Görsel varlık üretimi bu ajanın kapsamı dışındaysa, `STEPS` görselleri için minimum aksiyon: `imageAlt` metinlerinin Türkçe ve doğru olduğunu doğrula, ve görselin İngilizce/uydurma-metrik taşıdığı tespit edilirse bunu `docs/`'a bir takip notu olarak yaz. Hero mockup'ı (Step 1-2) her hâlükârda HTML/CSS'tir ve bu bağımlılığı taşımaz.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: temiz.

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/ProductMockup.tsx src/components/marketing/Hero.tsx src/data/content.ts
git commit -m "feat(hero): Türkçe DemoBadge'li HTML/CSS ürün mockup'ı"
```

---

## Task 10: Doluluk, kenar süslemesi ve elegant efekt

**Files:**
- Modify: `src/components/marketing/*.tsx` (bölüm çerçeveleme)
- Modify: `src/components/primitives.tsx` (`SectionHeader` numara anıtsallaştırma, ayraç)

**Interfaces:**
- Consumes: `Reveal` (mevcut), `HeroBackground`'ın grain deseni (Task 3).

- [ ] **Step 1: Bölüm numaralarını anıtsallaştır**

`src/components/primitives.tsx` — `SectionHeader`'daki numara rozetini büyüt/inceleyerek (büyük, ince mono figür, düşük opasite) Swiss Modernism hissini ver. Yalnız tipografik ölçek; yeni renk yok.

- [ ] **Step 2: İnce ayraç çizgileri ekle**

Bölüm geçişlerine (ör. `HowItWorks`, `SectorVerticals` üstü) `border-t border-neutral-100` hairline ayraçlar ekle — beyaz alanı bölümlere ayırır.

- [ ] **Step 3: Bölümlere çok hafif grain**

Açık zeminli bölümlere (ör. `CapabilityBento`, `ActivityPreview`) Task 3'ün SVG-grain deseninden `opacity-[0.02]` bir katman ekle (tek teknik, yeniden kullanım). Reduced-motion'dan bağımsız (statik doku).

- [ ] **Step 4: Kart press mikro-etkileşimi**

`PremiumCard`'a `active:scale-[0.99]` (yalnız `transform`, reduced-motion'da `motion-safe:` ile sınırlı) ekle — dokunsal his.

- [ ] **Step 5: Build ve reduced-motion doğrulama**

Run: `npm run build`
Expected: temiz.

Playwright reduced-motion'da: hero drift durur, kart lift/scale durur, LED durur.
```js
() => getComputedStyle(document.querySelector('h1')).fontFamily
```
(Serif hâlâ uygulanır; yalnız hareket durur.)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(polish): Swiss Modernism doluluk — anıtsal numaralar, ayraçlar, grain, press"
```

---

## Task 11: Uçtan uca doğrulama

**Files:** yok (yalnız doğrulama; bulunan hatalar ilgili task'ın dosyasında düzeltilir).

- [ ] **Step 1: Build ve tip denetimi**

Run: `npm run build`
Expected: `tsc -b` sıfır hata; `vite build` başarılı.

- [ ] **Step 2: Ham hex denetimi**

Run: `rg -n "#[0-9a-fA-F]{6}" src/ --glob '!src/styles/tokens.css'`
Expected: **sıfır eşleşme** (`HeroShader.tsx` istisnası artık yok).

- [ ] **Step 3: Yasak içerik ve nihai-hal denetimi**

Run: `rg -in "ISO 27001|SOC 2|uptime|RestoPos|AssisTT|%99" src/`
Expected: **sıfır** (JSDoc dışında).

Run: `rg -n "Faz [0-9]|FAZ [0-9]|YAKINDA|Tanımlanacak|Q[1-4] 20[0-9]{2}|₺|TL/ay|\$[0-9]" src/`
Expected: render edilen değer/JSX **eşleşmez** (yalnız JSDoc yorumları olabilir; elle doğrula).

- [ ] **Step 4: `shaders` ve Google Fonts yokluğu**

Run: `rg -n "shaders/react|HeroShader|fonts.googleapis|fonts.gstatic" src/ index.html`
Expected: **sıfır eşleşme.**

Run: `cat package.json | rg "shaders"`
Expected: **sıfır eşleşme** (`@fontsource-variable/*` eşleşmez, `shaders` yok).

- [ ] **Step 5: Ağ trafiği — üçüncü taraf yok**

`npm run dev`, Playwright ile `http://localhost:5173` aç, `browser_network_requests` (filter: `shaders|googleapis|gstatic|telemetry`).
Expected: **sıfır** üçüncü-taraf isteği.

- [ ] **Step 6: Responsive ve yatay taşma**

Playwright, `browser_resize` → 375×812, 768×1024, 1440×900. Her genişlikte:
```js
() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth })
```
Expected: her üçünde `sw === cw`.

- [ ] **Step 7: Tek Teal CTA kuralı**

`html.style.scrollBehavior='auto'` ile scroll sweep; her konumda görünür Teal CTA (`bg` = `rgb(13,122,111)`, `visibility!=hidden`, `opacity>0.05`) sayısı **≤ 1**. (Ölçüm tuzağı: smooth scroll'u geçici kapat — önceki doğrulama kaydına bakın.)

- [ ] **Step 8: LED, serif, numaralandırma**

Playwright:
- LED sayfanın en tepesinde (`ledTop === 0`), navbar altında sticky kalır.
- `h1` ve `main h2` computed font-family Playfair Display.
- Bölüm numaraları 01–11 eksiksiz; ardışık iki bölüm aynı arka planı almaz.
- Reduced-motion: LED durur + kaydırılabilir, hero drift durur, kart lift durur, serif korunur.

- [ ] **Step 9: Görsel regresyon**

Playwright ile üç genişlikte tam-sayfa ekran görüntüsü. Koyu `Integrations` bölümü referans özen seviyesi; diğer bölümler ona yaklaşmış olmalı (premium card, serif başlık, grain). Ekran görüntülerini repo dışında tut (scratchpad); commit etme.

- [ ] **Step 10: DemoBadge ve mock veri denetimi**

Run: `rg -l "AnimatedList|ProductMockup|ACTIVITY_FEED" src/components/marketing/`
Her mock-veri gösteren panelde `DemoBadge` bulunmalı (`Security`, `ActivityPreview`, `Onboarding`, `ProductMockup`).

- [ ] **Step 11: Commit ve push**

```bash
git add -A
git commit -m "test: premium revizyon uçtan uca doğrulama düzeltmeleri"
git push -u origin feat/landing-premium-revizyonu
```

---

## Self-Review

**Spec kapsamı:**

| Spec iş kolu | Karşılayan task |
|---|---|
| A — Nihai-hal içerik (faz, damga, roadmap, hero görseli) | Task 6, 7, 9 |
| B1 — Serif tipografi | Task 1 (font), Task 8 (uygulama) |
| B2 — Premium card | Task 4 (primitive), Task 6/9 (uygulama) |
| B3 — Doluluk / kenar süslemesi | Task 10 |
| B4 — Elegant efekt | Task 4 (lift), Task 10 (press/grain) |
| C — LED bandı | Task 2 (token), Task 5 |
| D — GPU-safe hero | Task 3 |
| Font self-host (gizlilik tutarlılığı) | Task 1 |

Spec'in her iş kolunun bir task'ı var. Boşluk yok.

**Placeholder taraması:** Task 9 Step 3, görsel varlık üretimi ajanın kapsamı dışındaysa açık bir fallback (takip notu) tanımlar — bu bir placeholder değil, koşullu ama tam tanımlı bir aksiyon. Diğer tüm step'lerde gerçek kod/komut var.

**Tip tutarlılığı:**
- `PremiumCard` propları (`hairline`, `cornerLabel`) Task 4'te tanımlanır, Task 6/9/10'da aynı adlarla tüketilir. ✓
- `SerifHeading`/`SectionHeader` serif uygulaması Task 8'de tek yerden. ✓
- `CoreModule.phase` ve `AdapterClass.phase` Task 6'da tipten **ve** veriden birlikte kaldırılır (yarım kalmaz). ✓
- `Phase` arayüzü Task 7'de sadeleşir; `PHASES` aynı task'ta yeni tiple yeniden yazılır. ✓
- `HeroBackground` Task 3'te üretilir, `Hero.tsx` aynı task'ta tüketir. ✓

**Dürüstlük çizgisi:** Task 6 Step 5 ve Task 9, "nihai-hal" ve "göz doldur" taleplerinin sahte içeriğe kaymasını açıkça engeller (uydurma sayı yerine niteliksel stat; DemoBadge'li mockup). Task 11 Step 3/10 bunu tarama ile doğrular.

**Ölçüm tuzağı hatırlatması:** Task 11 Step 7, önceki doğrulama kaydındaki `scroll-behavior: smooth` tuzağını açıkça not eder — tek-Teal-CTA denetimi bu yüzden yanlış ihlal raporlayabilir.
