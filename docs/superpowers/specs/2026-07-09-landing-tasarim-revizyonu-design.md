# 3CP Landing Page — Tasarım Revizyonu

**Tarih:** 2026-07-09
**Durum:** Onaylandı
**Kapsam:** Tier 2 (çalışır + güvenli, altın kaplama yok). Kamuya açık pazarlama yüzeyi; auth, tenant verisi, RLS/ABAC devrede değil.

---

## 1. Bağlam

Mevcut landing page çalışıyor ve içeriği kaynak dokümanlarla tutarlı. Revizyonun amacı, bilgi mimarisini genişletmek ve sayfayı kurumsal bir SaaS pazarlama yüzeyine yaklaştırmak: sticky nav, animasyonlu istatistik satırı, bento yetenek ızgarası, sektör dikeyi kartları, entegrasyon mimarisi, güvenlik bölümü, yetenek marquee'si ve panel önizlemesi.

Revizyon talebi, `v0-modern-agentic.vercel.app` adlı ilgisiz bir yapay zeka ürününün landing page'inden **yalnızca bilgi mimarisi ve etkileşim desenleri** ödünç alır. Metin, görsel, renk sistemi ve marka kimliği tamamen 3CP'nindir.

### Talep ile projenin gerçekliği arasındaki üç çakışma ve çözümleri

**Stack.** Orijinal talep Next.js 15 App Router, shadcn/ui ve `npx magicui-cli@latest add` varsayıyordu. Repo Vite 5 + React 18 + Tailwind 3 üzerinde, GitHub Pages'e `/3cp-landing-page/` alt yolundan statik deploy ediliyor. `magicui-cli` artık geçerli değil (güncel yöntem: `npx shadcn@latest add @magicui/<component>`, shadcn kurulumu gerektirir).
→ **Karar:** Vite'ta kalınır. Magic UI bileşenleri elle porte edilir. Next.js migrasyonu, HeroShader (three.js/WebGPU), `vite.config.ts` ve `deploy.yml`'ın yeniden yazımını gerektirirdi; Tier 2 disiplinine ters.

**İçerik doğruluğu.** Talebin istediği fiyat kademeleri, ISO 27001 rozeti, hero performans istatistikleri (uptime %, şube sayısı), mevcut POS partner logoları ve public API/webhook paneli üç kaynak dokümanın hiçbirinde karşılığı olmayan iddialardır. Ürün POC aşamasındadır; fiyatlama modeli Mimari'de açıkça "henüz hazır değil" olarak geçer.
→ **Karar:** Uydurma içerik çıkarılır, ilgili bölümler doğrulanabilir içerikle yeniden amaçlandırılır (bkz. §4).

**Motion.** Tasarım Dili §4 "Kaçınılacaklar" listesi anlam taşımayan animasyonları ve dekoratif unsurları yasaklar. Talep ise marquee ve canlı log ticker istiyor.
→ **Karar:** Hareket uygulanır, ancak sahte canlı veri iddiası yapılmaz. AnimatedList tabanlı feed'ler **"Örnek görünüm · Demo verisi"** rozeti taşıyan panel önizlemeleri olarak sunulur; sayfa düzeyinde gerçek trafik iddiası içeren sayaç kullanılmaz.

---

## 2. Kaynak dokümanlar (tek doğruluk kaynağı)

- `C:\aaa\3cp\3CP_Tasarim_Dili.md` — token'lar, renk, tipografi, elevation, erişilebilirlik, voice & tone
- `C:\aaa\3cp\3CP_Yetenek_Seti_ve_Ekran_Listesi.md` — modül adları, faz numaraları, ekran grupları (A–R)
- `C:\aaa\3cp\3CP_Mimari_Dokumani.md` — RLS, ABAC, transactional outbox, audit olayları, adaptör çatısı
- `C:\aaa\3cp-landing-page\docs\3CP_Landing_Page_Bilesenleri.md` — mevcut landing blueprint

**Kural:** Bu dokümanlarda geçmeyen hiçbir modül, entegrasyon, sertifika, rakam veya fiyat sayfaya yazılmaz.

---

## 3. Mimari

### 3.1 Token katmanı (diğer her şeyden önce yapılır)

Yeni dosya `src/styles/tokens.css`, Tasarım Dili §11'in dört katmanını birebir uygular:

```
Katman 1 — Primitives:  --color-teal-700: 13 122 111;
Katman 2 — Semantic:    --color-background-brand-bold: var(--color-teal-700);
Katman 3 — Component:   --button-primary-bg: var(--color-background-brand-bold);
Katman 4 — Theme:       :root[data-theme="light"] / :root[data-theme="dark"]
```

Renkler **boşlukla ayrılmış RGB kanal üçlüsü** olarak saklanır. Tailwind 3'te `<alpha-value>` sözdizimiyle bağlanır ki `/90` gibi opaklık modifier'ları çalışmaya devam etsin:

```js
colors: { 'brand-teal': 'rgb(var(--color-brand-teal) / <alpha-value>)' }
```

Elevation (sunken/default/raised/overlay), motion süresi/easing ve radius da token'a taşınır.

**Temizlenecek kaçak hex'ler:**

| Dosya | Kaçak değer | Yerine |
|---|---|---|
| `primitives.tsx` | `bg-[#E3FCEF] text-[#006644]` | `bg-success text-success-fg` |
| `primitives.tsx` | `bg-[#DEEBFF] text-[#0052CC]` | `bg-information text-information-fg` |
| `primitives.tsx` | `hover:bg-[#0a655c]` | `hover:bg-brand-teal-hovered` |
| `HowItWorks.tsx`, `Differentiators.tsx` | `bg-[#F5F5F5]` | `bg-surface-sunken` |
| `ClosingFooter.tsx` | `from-[#0D7A6F]/90 to-[#0e2a40]/85` | token gradient |
| `HeroShader.tsx` | inline gradient + literal shader renkleri | shader literalleri kalır (WebGL uniform), StaticBackground token'a geçer |

**Boşluk:** Tailwind'in doğal 4px ölçeğinde kalınır, 8px ızgarasına kilitlenir (çift adımlar; ikon–metin boşluğu için `gap-1` = 4px istisna). Bölüm ritmi için semantik token eklenir.

### 3.2 Bağımlılıklar

Eklenecek: `motion` (Framer Motion'ın güncel paket adı; `motion/react` importu), `clsx`, `tailwind-merge`.
Yeni dosya: `src/lib/utils.ts` → `cn()` helper (Magic UI kaynağı bunu bekler).

shadcn/ui **kurulmaz**. Magic UI bileşenleri (`number-ticker`, `marquee`, `animated-list`) elle `src/components/magicui/` altına porte edilir; `marquee` için `tailwind.config.js`'e keyframe eklenir.

Değişmeden kalır: `shaders` hero'su, `vite.config.ts` base path, `.github/workflows/deploy.yml`, `src/asset.ts`.

### 3.3 Dosya düzeni

```
src/
  styles/tokens.css          YENİ
  lib/utils.ts               YENİ  — cn()
  components/
    magicui/                 YENİ  — number-ticker, marquee, animated-list
    marketing/               YENİ  — bölüm başına bir bileşen
    primitives.tsx           GÜNCELLENİR — token'lara bağlanır
  data/content.ts            GENİŞLETİLİR — yeni bölümlerin verisi
  hooks.ts                   KORUNUR — usePrefersReducedMotion
```

---

## 4. Bölümler

Talebin 13 bölümü, mevcut 8 bölümle harmanlanır. Talebin 5. bölümü (onboarding workflow) ile 8. bölümü (admin experience) aynı süreci iki kez anlattığı için **tek bölümde birleştirilir**.

| # | Bölüm | Talep eşleşmesi | Durum |
|---|---|---|---|
| 1 | Sticky nav | 1 | `Navbar.tsx` genişler |
| 2 | Hero + istatistik satırı | 2 | `Hero.tsx` + NumberTicker |
| 3 | Sektör şeridi + Problem | — | Korunur |
| 4 | Yetenek bento (4 çekirdek modül) | 3 | Yeni |
| 5 | Nasıl çalışır (3 adım) | — | Korunur |
| 6 | Sektör dikeyleri (4 kart) | 4 | Yeni; `Differentiators` içine katlanır |
| 7 | Kurulum & yönetim (4 adım + izin matrisi paneli) | 5 + 8 | Yeni, birleşik |
| 8 | Entegrasyon çatısı (diyagram + event paneli) | 6 | Yeni |
| 9 | Güvenlik & uyumluluk + audit ticker | 7 | Genişler |
| 10 | Yetenek marquee (2 satır) | 9 | Yeni |
| 11 | Panel önizleme (AnimatedList, demo rozetli) | 10 | Yeni |
| 12 | Şeffaf maliyet & teklif | 11 yerine | Yeni |
| 13 | Yol haritası + SSS | — | Korunur |
| 14 | Kapanış CTA bandı | 12 | Korunur |
| 15 | Footer | 13 | Korunur |

### 4.1 Uydurma içerik yerine ne yazılır

**Bölüm 2 — Hero istatistikleri.** Performans iddiası değil, dokümandan doğrulanabilir kapsam sayıları. NumberTicker ile animasyonlu:

| Sayı | Etiket | Kaynak |
|---|---|---|
| 12 | yetenek modülü | Yetenek Seti §I.1–I.12 |
| 18 | ekran grubu | Yetenek Seti §II, gruplar A–R |
| 4 | sektör dikeyi | Yetenek Seti §0.3 + §III |
| 4 | desteklenen LLM sağlayıcısı | Yetenek Seti §5.1 (Gemini, OpenAI, Claude, Mistral) |

Uptime yüzdesi, şube sayısı, işlenen etkileşim sayısı **yazılmaz**.

**Bölüm 4 — Yetenek bento.** Yalnızca `HAZIR` durumundaki dört çekirdek modül: IAM (Faz 0), Kişi Kartı (Faz 1), Anket/NPS (Faz 2), AI Segmentasyon/RAG (Faz 3). Kalan sekiz modül bölüm 13'teki yol haritasında faz rozetiyle görünür.

**Bölüm 6 — Sektör dikeyleri.** Restoran (`AKTİF`), Emlak · Perakende · Otelcilik (`YAKINDA`). Kart başına iki olgusal stat çifti (ör. dikey durumu, sektöre özel modüller). `Differentiators.tsx`'in "değişmeyen çekirdek / sektöre özel" chip matrisi ve iç içe daire diyagramı buraya taşınır.

**Bölüm 8 — Entegrasyon çatısı.** RestoPos / AssisTT gibi **üçüncü taraf marka adı veya logosu kullanılmaz** — Mimari §"Mimari sonuç" bunların sabit bileşen değil, v1 müşterisinin tedarikçileri için yazılacak ilk referans adaptörler olduğunu açıkça söyler; ayrıca izinsiz marka kullanımı hukuki risktir. Yerine `IIntegrationAdapter` çatısının diyagramı: çekirdek → adaptör arayüzü → dört adaptör sınıfı (POS, çağrı merkezi, yorum platformları, ilan platformları), her biri faz rozetiyle.

Kod paneli **public partner API'si iddia etmez** (3CP böyle bir yüzey sunmuyor). Mimari §8.4'teki gerçek domain-event / `outbox_messages` payload şeklini gösterir; "Mimari · Faz 4" etiketiyle.

**Bölüm 9 — Güvenlik & uyumluluk.** Dört sütun: KVKK (maskeleme, anonimleştirme, zaman damgalı rıza defteri), RLS tabanlı tenant izolasyonu (`FORCE ROW LEVEL SECURITY`, Mimari §5.2), ABAC izin motoru, transactional outbox + denetim izi. Hepsi dokümanda doğrulanmış.

Rozet satırında **yalnız KVKK**. ISO 27001 ve SOC 2 üç dokümanın hiçbirinde geçmiyor — yazılmaz.

AnimatedList audit ticker'ı Mimari §8.4'teki gerçek olay adlarını kullanır: `LOGIN`, `LOGIN_FAILED`, `REFRESH`, `TOKEN_REUSE`, `REVEAL`, `ANONYMIZE`, `PROVISION`. Seeded/sabit veri; "Örnek denetim kaydı görünümü" rozeti taşır.

**Bölüm 11 — Panel önizleme.** Şubeler arası aktivite feed'i (sipariş, geri bildirim, uyarı). Sayfa düzeyinde "X şube şu anda aktif" iddiası **yoktur**; sayaç, mock panel çerçevesinin içinde demo tenant bağlamında görünür. Bölümün başında "Örnek görünüm · Demo verisi" rozeti.

**Bölüm 12 — Şeffaf maliyet & teklif.** Üç kademeli fiyat kartı **yoktur** (fiyatlama modeli henüz kurulmadı — Mimari §"Birim ekonomisi ve bütçe"). Yerine Mimari'de belgelenmiş iki LLM maliyet modelinin **yüksek seviyeli** anlatımı: tenant kendi API key'ini kullanır (maliyet tenant'ta) veya platform havuz key'i (3CP taşır). **Rakam, marj veya birim maliyet paylaşılmaz.** Ardından "Size özel teklif alın" CTA'sı ve düşük sürtünmeli iletişim.

---

## 5. Motion ve erişilebilirlik

- Bölüm bazlı `whileInView` reveal; `once: true`.
- İstatistik sayaçları ilk görünümde bir kez çalışır.
- Marquee: iki satır, ters yön, hover'da durur.
- AnimatedList: 30–50ms stagger (Material motion `stagger-sequence`).
- Tümü `usePrefersReducedMotion` (`src/hooks.ts`) ve mevcut `@media (prefers-reduced-motion: reduce)` CSS bloğuna bağlıdır. Reduced-motion açıkken marquee ve feed statik render edilir.
- Süreler 150–300ms mikro-etkileşim, ≤400ms bölüm geçişi. Yalnız `transform` ve `opacity` animasyonlanır (CLS önlenir).
- **Tek birincil CTA kuralı** (Tasarım Dili §5.2): sayfada aynı anda yalnız bir Teal CTA görünür. Navbar CTA'sı hero geçilene kadar gizli kalır — mevcut davranış korunur.
- Tüm interaktif elemanlar Tab ile erişilebilir; ikon-only butonlar `aria-label` taşır; durum yalnız renkle iletilmez (renk + metin).
- Marquee ve feed `aria-hidden` değildir; ekran okuyucu için statik liste alternatifi sunulur.

---

## 6. Doğrulama

1. `npm run build` — `tsc -b` strict mod + `noUnusedLocals` temiz geçer.
2. `npm run dev` — Playwright MCP ile 375 / 768 / 1440 genişliklerinde:
   - yatay kaydırma yok
   - her bölüm görünür ve okunabilir
   - marquee hover'da duruyor
   - navbar CTA'sı hero geçilince beliriyor
3. `prefers-reduced-motion: reduce` emülasyonuyla: sayaç anında son değeri gösterir, marquee durur, feed statik.
4. Klavye ile baştan sona Tab — focus ring her adımda görünür, sıra görsel sırayla eşleşir.
5. Kontrast denetimi: gövde metni ≥ 4.5:1, büyük metin ≥ 3:1 (Tasarım Dili §12.1).
6. `grep` ile kaçak hex taraması: `src/` altında `#[0-9a-fA-F]{6}` yalnız `tokens.css` ve `HeroShader.tsx` (WebGL uniform) içinde geçmeli.
7. İçerik denetimi: sayfada `ISO`, `uptime`, `RestoPos`, `AssisTT` veya fiyat rakamı geçmemeli.

---

## 7. Kapsam dışı

- Next.js migrasyonu
- shadcn/ui kurulumu
- Dark mode (token'lar hazırlanır, tema uygulanmaz — sayfa light-only kalır)
- Gerçek fiyatlandırma, sertifika rozetleri, partner logoları — bunlar ürün ekibinden doğrulanmış içerik geldiğinde ayrı bir iş olarak eklenir
