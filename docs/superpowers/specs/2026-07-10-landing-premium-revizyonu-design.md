# 3CP Landing — Premium Revizyon ve Nihai-Hal Anlatısı (Tasarım Dokümanı)

**Tarih:** 2026-07-10
**Durum:** Onay bekliyor
**Önceki spec:** `docs/superpowers/specs/2026-07-09-landing-tasarim-revizyonu-design.md` (13 bölümlük bilgi mimarisi + token katmanı — bu doküman onun üzerine inşa eder, onu iptal etmez)

---

## Amaç

Mevcut landing page teknik olarak temiz ve dürüst, ancak iki eksiği var: (1) ürünü değil ürünün **geliştirme takvimini** anlatıyor (faz numaraları, "yakında", "tanımlanacak", roadmap dili); (2) görsel dili "SaaS template" seviyesinde kalıyor, high-end bir markanın genel merkezine sunulacak "tasarımcı eli değmiş" hissi vermiyor. Bu revizyon dört iş kolunda bunu düzeltir; ayrıca kullanıcının daha önce onayladığı iki teknik işi (LED bandı, GPU-safe hero) aynı sisteme entegre eder.

Yön, `ui-ux-pro-max` skill'inin yüksek-uç kurumsal SaaS için önerdiği çerçeveyle hizalıdır: **Swiss Modernism 2.0** (grid sistemi, matematiksel boşluk, editoryal), **serif display + sans gövde** tipografi kontrastı, ve kaçınılacaklar listesinde "AI moru/pembe gradient", "playful design".

---

## En kritik ilke: dili ve tasarımı yükselt, kanıtı uydurma

Bu revizyonun tamamını yöneten tek kural. İki iş kolu (nihai-hal içerik + göz dolduran tasarım) kolayca "sahte içerik ekle"ye kayabilir. Sınır nettir:

- **İzinli (nihai-hal dili):** Bir *yeteneği* şimdiki zaman ve kendinden emin anlatmak. "Sınıflandırma, düşük güvenli sonuçları insan onayına işaretler." Ürünün planlanan nihai halinde bu yetenek vardır; geliştirme fazını gizlemek yalan değildir.
- **Yasak (sahte kanıt):** Bir *traction metriğini*, *sertifikayı*, *müşteri logosunu* veya *fiyatı* uydurmak. Önceki spec'in yasak listesi **aynen** yürürlükte kalır: ISO 27001, SOC 2, uptime yüzdesi, şube/etkileşim sayısı, üçüncü taraf marka adları (RestoPos, AssisTT), üç kademeli fiyat kartları, uydurma müşteri logosu duvarı.
- **Doluluk kaynağı:** Sayfanın "dolu ve göz dolduran" hissi tipografi, grid, doku, kenar süslemesi ve mikro-etkileşimden gelir — sahte sosyal kanıttan değil.

---

## Kapsam

Dört iş kolu, tek tutarlı görsel/anlatı sistemi:

| İş kolu | Özet |
|---|---|
| **A — Nihai-hal içerik** | Faz etiketleri, olgunluk damgaları, "yakında/tanımlanacak", roadmap dili kaldırılır; yetenekler şimdiki zamanda anlatılır. Hero ürün görseli değiştirilir. |
| **B — High-end görsel dil** | Serif display tipografi, işlenmiş card sistemi, kenar süslemesi/doku ile doluluk, elegant mikro-etkileşim. |
| **C — LED bandı** | Sayfanın en tepesinde dot-matrix `LedTicker`; ortadaki `CapabilityMarquee` bölümü kaldırılır. |
| **D — GPU-safe hero** | `shaders` bağımlılığı kaldırılır, hero arka planı token'lara bağlı CSS ile yeniden kurulur. |

### Kapsam dışı
- Yeni bölüm/ekran eklenmez; mevcut 13 bölümün içeriği ve görseli yükseltilir.
- Dark mode aktifleştirilmez (token'lar hazır, sayfa light-only render eder — önceki spec §7 ile aynı).
- Gerçek müşteri logosu, sertifika, fiyat tablosu **eklenmez** (üstteki ilke).
- Backend/veri entegrasyonu yok; tüm veri `content.ts`'te statiktir.

---

## İş kolu A — Nihai-hal içerik revizyonu

Tek dosya değişir: `src/data/content.ts` (metin), artı onu tüketen birkaç bileşende etiket/rozet render'ı. Aşağıdaki dönüşümler uygulanır.

### A1. Faz etiketleri kaldırılır

- **`CoreModule.phase`** (`Faz 0/1/2/3`) alanı kaldırılır. Kartlar modülü mevcut bir yetenek olarak sunar; "hangi sprint'te geldi" bilgisi silinir. Kartın köşesindeki faz rozeti, yerini tipografik bir modül numarasına (`01–04`) veya sade bir ikon muhafazasına bırakır (bkz. İş kolu B card sistemi).
- **`AdapterClass.phase`** (`FAZ 4/8/SEKTÖR GENİŞLEMESİ`) alanı kaldırılır. Adaptör sınıfları ürünün entegrasyon çatısının parçası olarak sunulur; faz damgası yerine adaptör sınıfını niteleyen nötr bir etiket (ör. kategori) gelir veya rozet tamamen kalkar.

### A2. "Bugün canlı olan dört çekirdek modül" çelişkisi çözülür

`CapabilityBento` başlığı ("Bugün canlı olan dört çekirdek modül") ile faz rozetleri arasındaki çelişki, faz rozetleri kalkınca doğal olarak çözülür. Başlık, "canlı" iddiasını yumuşatan ama nihai-hal dilini koruyan bir forma çekilir (ör. "Platformun dört çekirdek modülü") — böylece pre-POC olgusuyla çelişmez, ama ürünü tam sunar.

### A3. Sektör dikeyleri: olgunluk damgaları kaldırılır

`SECTOR_VERTICALS` ve `SECTORS`:
- `status: 'AKTİF' | 'YAKINDA'` ve `active: boolean` alanları anlatıdan çıkarılır. Dört sektör de platformun hizmet verdiği dikeyler olarak eşit sunulur. (Alanlar tipten silinebilir veya görsel damga render'ı kaldırılabilir; karar plan aşamasında, ama **ekranda `YAKINDA` damgası görünmez.**)
- Stat metinleri nihai-hal diline çekilir: `"İlk dikey pazar"`, `"Planlanan sektörel modül"`, `"Tanımlanacak"` gibi ifadeler kaldırılır. "Tanımlanacak" bir pazarlama yüzeyinde asla görünmez.
- **Dürüstlük notu:** Doküman Perakende/Otelcilik için modül sayısı vermiyor. Nihai-hal dilinde bu, sayı uydurmak yerine **niteliksel** anlatımla çözülür (ör. "aynı çekirdek üzerinde sektörel modüller") — sayısal stat yerine yetenek cümlesi. Uydurma sayı yasak kuralı korunur.

### A4. Roadmap → ürün vizyonu / yetenek genişliği

`PHASES` ve `RoadmapFaq`'in roadmap yarısı:
- `Q3 2026`, `Q4 2026`, `2027 ve Ötesi` gibi takvimli faz başlıkları ve `current`/`status` damgaları kaldırılır.
- Bölüm, "nereye gidiyoruz" (gelecek zaman, gidişat) yerine platformun **yetenek genişliğini** (şimdiki zaman) anlatan bir forma dönüşür. İçerik korunur ama çerçeve "yol haritası"ndan "platform kapsamı"na kaçar. Bölüm başlığı ("Nereye gidiyoruz?") buna göre güncellenir.
- FAQ yarısı korunur; yalnız gidişat imaları ("İlk odağımız", "genişleyen vizyon") nihai-hal diliyle yumuşatılır.

### A5. Hero ürün görseli değiştirilir

Bu, ilkeyi ilk çiğneyen tek yer ve en yüksek görünürlüklü içerik. Mevcut `images/` altındaki hero ürün görseli: İngilizce arayüz, `14.500 Total Feedback Volume`, `85% AI Sentiment`, `Jan 2023` tarihleri, lorem-ipsum yorumlar taşıyor.
- **Karar:** Görsel, Türkçe arayüzlü, tarih/rakamları nötr veya `content.ts`'in dürüstlük çizgisine uygun (uydurma traction metriği içermeyen) bir panele değiştirilir.
- **Yöntem seçenekleri (plan aşamasında netleşir):** (a) mevcut mock görselin Türkçeleştirilmiş/temizlenmiş bir versiyonu; (b) gerçek uygulama bileşenlerinden HTML/CSS ile kurulmuş, `DemoBadge` taşıyan canlı bir mockup (raster görsel yerine); (c) daha soyut, ürün "hissini" veren ama sahte metrik içermeyen bir kompozisyon. Tercih (b) — çünkü hem dürüst (DemoBadge), hem retina-keskin, hem de "tasarımcı eli değmiş" hissine katkı sağlar; ama görsel varlık üretimi gerekiyorsa (a)/(c) fallback.
- Aynı denetim `STEPS` görsellerine de uygulanır (`step-1/2/3` PNG'leri): İngilizce/lorem içerik varsa Türkçeleştirilir veya değiştirilir.

---

## İş kolu B — High-end görsel dil

Amaç: Vakko/Farfetch/Tommy Hilfiger merkezindeki bir yöneticiye sunulabilecek "couture" seviye. Dört kaldıraç.

### B1. Editoryal tipografi — serif display başlık (en yüksek etkili tek hamle)

- **Karar:** Gövde `Inter` kalır; başlıklar için bir **serif display** eklenir. Birincil aday: **Playfair Display** (skill'in "Classic Elegant" eşleşmesi: Playfair Display + Inter, "luxury/premium/editorial"). Alternatif: Cormorant.
- Tailwind `fontFamily`'ye `serif: ['Playfair Display', 'Georgia', 'serif']` eklenir. `sans` (Inter) ve `mono` (JetBrains Mono) korunur.
- Serif yalnız **büyük başlıklarda** (hero H1, bölüm H2'leri, kapanış bandı) kullanılır; gövde, buton, etiket, mono figürler değişmez. Aşırı kullanımdan kaçınılır — kontrast serifin seyrekliğinden gelir.
- **Font yükleme:** Mevcut mekanizma Google Fonts CDN'dir (`index.html`). Serif de aynı `<link>`'e eklenir. **Not (gizlilik tutarlılığı):** GPU-safe iş kolu shader telemetrisini gizlilik gerekçesiyle kaldırırken Google Fonts CDN'e üçüncü-taraf çağrı bırakmak tutarsızdır; bu doküman fontların **self-host** edilmesini (woff2 yerel, `font-display: swap`) önerir. Karar plan aşamasında; ama KVKK anlatısıyla tutarlı olması için self-host tercih edilir.

### B2. İşlenmiş card sistemi ("basic" → "tasarımcı eli değmiş")

Mevcut kartlar düz `border-neutral-200` + beyaz zemin + eş köşe; hepsi birbirinin aynı. Yeni card sistemi ortak bir primitive üzerinden kurulur (`primitives.tsx`'e `PremiumCard` veya mevcut kart desenlerinin yükseltilmesi):
- **Hairline üst vurgu:** kartın üstünde ince (1px) brand-teal veya gradient bir çizgi/aksan.
- **Katmanlı yükselme:** hover'da `shadow-raised → shadow-overlay` yumuşak geçiş (yalnız `box-shadow` + `transform: translateY(-2px)`, layout shift yok, reduced-motion'da kapanır).
- **İkon muhafazası:** ikonlar için tutarlı, işlenmiş bir kap (yuvarlatılmış kare, ince iç gölge veya token'lı zemin) — çıplak ikon yerine.
- **Tipografik köşe numarası / rozet:** modül/adım kartlarında mono, tabular köşe numarası (faz rozetinin yerini alır).
- **Kasıtlı ritim:** bento düzeninde `wide` kartların gerçekten farklı bir iç kompozisyon taşıması (yalnız geniş değil, farklı düzenli) — "bento var ama bento ritmi yok" sorununu çözer.
- Tüm kart stilleri token'lara bağlı kalır (sıfır ham hex kuralı korunur).

### B3. Doluluk ve kenar süslemesi (Swiss Modernism)

Sayfa "boş" değil "kompozisyonel dolu" hissetmeli:
- **Bölüm çerçeveleme:** bölüm numaralarının tipografik anıtsallaştırılması (büyük, ince, kenarda duran figürler), ince ayraç çizgileri (hairline dividers), grid çizgisi ipuçları.
- **Çok hafif arka plan dokusu:** bölümlerde token'lı, çok düşük opasiteli grain/grid dokusu (GPU-safe hero ile aynı SVG-noise tekniği) — beyaz alanı "işlenmiş" gösterir.
- **Matematiksel grid:** 12-kolon grid hizası ve tutarlı `max-w-container`; asimetrik ama hizalı yerleşimler (Swiss Modernism).
- Doluluk **sahte kanıtla değil**, bu tipografik/dokusal katmanlarla sağlanır (üstteki ilke).

### B4. Elegant mikro-etkileşim ("boğmadan")

Skill'in `--motion` "standart" tier'ı: abartısız ama hissedilir. Mevcut `Reveal` (16px fade-rise) korunur, üstüne seçili anlar eklenir:
- Büyük serif başlıklarda kelime/satır maskeli giriş (yalnız `transform`/`opacity`).
- Kartlarda `scale-feedback` (0.98–1.0 press) ve hover yükselmesi (B2).
- Koyu `Integrations` bölümünde ince ışık/gradient süzülmesi.
- `stagger-sequence` 30–50ms liste girişleri (mevcut `AnimatedList` bunu zaten yapıyor).
- **Kural:** görünümde en fazla 1–2 anahtar eleman animasyonlanır; hepsi `prefers-reduced-motion`'da durur; tüm süreler 150–400ms; yalnız `transform`/`opacity`. Sayfanın referans anı zaten en iyi bölümü olan koyu `Integrations`'tır — diğer bölümler onun özenine çekilir.

---

## İş kolu C — LED bandı (`LedTicker`)

Kullanıcı kararları (onaylı): navbar'ın **üstünde**, ince bant; **dot-matrix orta sadakat** estetik.

- **Yeni bileşen:** `src/components/marketing/LedTicker.tsx`.
- **Yerleşim:** Sayfanın fiziksel en tepesi, `App.tsx`'te `<Navbar>`'dan önce. Tam genişlik, ~48px yükseklik. Sayfayla birlikte yukarı kayar (sticky **değil**); navbar altında sticky kalır.
- **Estetik (dot-matrix):** zemin `#0B1120` (yeni token: `--color-led-bg`), metin `--color-teal-400` (`#1FAF9E`, mevcut token), hafif bloom (`text-shadow`/`drop-shadow`). Üzerine CSS `repeating-linear-gradient` / `radial-gradient` ile piksel-ızgara maskesi. Mono, uppercase, geniş `letter-spacing`. Kenarlarda `mask-image` fade-out (sonsuz şerit hissi).
- **Motor:** Mevcut `Marquee` (`src/components/magicui/marquee.tsx`, önceki spec Task 2 portu) yeniden kullanılır. Reduced-motion'da durur ve yatay kaydırılabilir olur.
- **İçerik:** `MARQUEE_ROW_ONE` + `MARQUEE_ROW_TWO` (birleştirilmiş veya iki satır). Bu etiketler artık üstteki LED'de yaşar.
- **Ortadaki bölüm kaldırılır:** `src/components/marketing/CapabilityMarquee.tsx` ve `App.tsx`'teki kullanımı silinir. İki yan etki çözülür:
  - `CapabilityMarquee` numarasız bir şeritti → **01–11 numaralandırması bozulmaz.**
  - Kalkınca `Security` (beyaz) ile `ActivityPreview` (beyaz) yan yana gelir → **`ActivityPreview` `surface-sunken`'a alınır**, arka plan ritmi geri gelir.
- **Erişilebilirlik:** dekoratif; ekran okuyucudan gizli değil ama tek `aria-label` ile özetlenir (etiket listesi tekrarını okutmamak için). Kontrast: `#1FAF9E` on `#0B1120` ≥ 4.5:1 doğrulanır.

---

## İş kolu D — GPU-safe hero

Kullanıcı kararı (onaylı): `shaders`'ı **tamamen kaldır**, CSS ile yeniden kur.

- **Silinen:** `src/components/HeroShader.tsx`, `primitives.tsx`'teki `ShaderErrorBoundary`, `Hero.tsx`'teki `lazy`/`Suspense` shader importu, `package.json`'dan `shaders` bağımlılığı.
- **Kazanılan:** 1.35 MB'lık chunk + `three/webgpu` gider; `shaders.com/api/telemetry`'ye giden telemetri POST'u (varsayılan açık, `samplingRate .05`) ortadan kalkar; React'e ulaşmayan cihaz-kaybı (device-lost) riski yok olur.
- **Yeni hero arka planı (`Hero.tsx` içinde veya küçük bir `HeroBackground` bileşeni):**
  - Token'lara bağlı çok katmanlı `radial-gradient` (mevcut `StaticBackground`'ın deseni temel alınır: teal-700 %10 ve %6 washes).
  - Çok hafif SVG-noise/grain dokusu (data-URI, harici istek yok) — bu aynı doku İş kolu B3'te de kullanılır (tek teknik, iki yer).
  - İsteğe bağlı çok yavaş gradient kayması: yalnız `transform`/`opacity`, `prefers-reduced-motion`'da durur.
- **Görsel sonuç:** Bugünküne çok yakın, çünkü mevcut shader zaten görünmüyor (beyaz üstüne beyaz + multiply teal). Hero'nun imza anı artık LED bandı + serif H1 + işlenmiş ürün mockup'ı olur.
- **Hero sağ yarısı:** Mevcutta boş. İş kolu A5'in yeni ürün mockup'ı ve/veya B3 kenar süslemesi bu boşluğu kompozisyonel olarak doldurur (dengesizlik giderilir).

---

## Token ve config değişiklikleri

`src/styles/tokens.css`:
- `--color-led-bg: 11 17 32;` (`#0B1120`) eklenir.
- Gerekirse LED bloom/gölge ve premium card hairline için birkaç semantic token.
- Ham hex yalnız `tokens.css`'te kuralı korunur (LED zemini token'a girer).

`tailwind.config.js`:
- `fontFamily.serif` eklenir.
- `colors`'a `led-bg` (ve varsa yeni card/aksan renkleri) eklenir.
- LED piksel-ızgara maskesi ve fade için gerekirse `maskImage`/`backgroundImage` utility'leri.

`index.html` / font:
- Serif font eklenir; tercihen self-host (B1 notu).

---

## Dosya yapısı değişiklikleri

| Dosya | Aksiyon |
|---|---|
| `src/components/marketing/LedTicker.tsx` | **Create** — dot-matrix LED bandı |
| `src/components/marketing/CapabilityMarquee.tsx` | **Delete** — içeriği LED'e taşındı |
| `src/components/HeroShader.tsx` | **Delete** — CSS arka plana geçildi |
| `src/data/content.ts` | **Modify** — nihai-hal içerik (A1–A5) |
| `src/components/primitives.tsx` | **Modify** — `ShaderErrorBoundary` sil; `PremiumCard`/serif başlık primitive ekle |
| `src/components/marketing/Hero.tsx` | **Modify** — shader→CSS arka plan, serif H1, yeni ürün mockup |
| `src/components/marketing/CapabilityBento.tsx` | **Modify** — faz rozeti→numara, premium card |
| `src/components/marketing/SectorVerticals.tsx` | **Modify** — olgunluk damgaları kaldır, premium card |
| `src/components/marketing/Integrations.tsx` | **Modify** — faz rozeti kaldır, premium card |
| `src/components/marketing/RoadmapFaq.tsx` | **Modify** — roadmap→vizyon çerçeve |
| `src/components/marketing/ActivityPreview.tsx` | **Modify** — `surface-sunken` arka plan |
| `src/App.tsx` | **Modify** — `LedTicker` en üste, `CapabilityMarquee` sil |
| `tailwind.config.js`, `src/styles/tokens.css`, `index.html` | **Modify** — serif, led-bg, font yükleme |
| `package.json` | **Modify** — `shaders` bağımlılığı kaldır |

---

## Doğrulama kriterleri

Önceki spec'in tüm doğrulamaları (yatay taşma, tek Teal CTA, başlık hiyerarşisi, reduced-motion, yasak içerik) **korunur ve tekrar çalıştırılır**. Ek olarak:

**İçerik (A):**
- `rg -n "Faz [0-9]|FAZ [0-9]|YAKINDA|Tanımlanacak|SEKTÖR GENİŞLEMESİ" src/` → ekrana render edilen sonuç **yok** (JSDoc yorumları hariç).
- Roadmap bölümünde takvimli faz başlığı (`Q3 2026` vb.) ekranda görünmez.
- Hero ürün görseli ve `STEPS` görselleri: İngilizce/lorem/uydurma-metrik içermez.
- Yasak içerik taraması (ISO 27001, SOC 2, uptime, RestoPos, AssisTT, fiyat) → sıfır (önceki kural).

**Tipografi/tasarım (B):**
- Hero H1 ve bölüm H2'leri serif render eder (computed `font-family` Playfair Display).
- Kartlarda hover yükselmesi yalnız `box-shadow`/`transform`; layout shift (CLS) yok.
- Reduced-motion'da tüm yeni efektler durur.
- Kontrast: serif başlık, LED metni, kart metinleri ≥ 4.5:1 (büyük metin ≥ 3:1).

**LED (C):**
- `LedTicker` sayfanın en tepesinde; navbar altında sticky kalır, LED değil.
- Reduced-motion'da LED durur ve kaydırılabilir.
- `CapabilityMarquee` DOM'da yok; `MARQUEE_ROW_*` yalnız LED'de.
- 01–11 numaralandırması eksiksiz; ardışık iki bölüm aynı arka planı almaz.

**GPU-safe (D):**
- `package.json`'da `shaders` yok; `rg -n "shaders/react|HeroShader" src/` → sıfır.
- `dist/` çıktısında `three`/`shaders` chunk'ı yok; hero chunk'ı belirgin küçülür.
- Ağ trafiğinde `shaders.com` isteği yok.
- Hero arka planı reduced-motion'da statik.

**Genel:**
- `npm run build` (`tsc -b && vite build`) temiz.
- 375 / 768 / 1440'ta yatay taşma yok.
- Görsel regresyon: Playwright ile üç genişlikte ekran görüntüsü; koyu `Integrations` bölümü referans özen seviyesi olarak korunur.

---

## Self-review

**Placeholder taraması:** Doküman "plan aşamasında netleşir" dediği yerler (serif seçimi Playfair vs Cormorant, hero mockup yöntemi a/b/c, font self-host kararı) bilinçli açık uçlardır — bunlar tasarım kararı değil, uygulama detayıdır ve `writing-plans` aşamasında karara bağlanır. Belirsiz **gereksinim** yok.

**İç tutarlılık:** İş kolu D shader telemetrisini gizlilik için kaldırırken, İş kolu B1 Google Fonts CDN'i aynı gerekçeyle self-host'a çeker — tutarlı. İş kolu C ortadaki marquee'yi kaldırırken numaralandırma ve arka plan ritmi yan etkileri açıkça çözülür. Üstteki "kanıtı uydurma" ilkesi, A (nihai-hal) ve B (doluluk) iş kollarının sahte içeriğe kaymasını her iki yerde de sınırlar.

**Kapsam:** Dört iş kolu birbirine bağlı (tipografi kararı card'ları, LED'i, hero'yu etkiler; doku tekniği hero ve bölümlerde paylaşılır) — tek spec doğru. Uygulama planı bunları bağımlılık sırasına göre task'lara böler (token/font → primitives → içerik → bölümler → LED → hero → doğrulama).

**Dürüstlük çizgisi:** Bu revizyonun en büyük riski, "göz doldur" ve "nihai halden bahset" taleplerinin sahte kanıta kaymasıdır. Doküman bunu tek bir üst ilkeye bağlar ve her iş kolunda tekrar hatırlatır. Uydurma sayı/logo/sertifika/fiyat yasağı, önceki spec'ten devralınarak korunur.
