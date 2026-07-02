# 3CP — Landing Page Bileşen ve İçerik Dokümanı

**Amaç:** GitHub Pages üzerinde yayınlanacak, potansiyel müşterilere (prospect) 3CP ürününü tanıtan pazarlama landing page'inin bileşenlerini, sıralamasını, içeriklerini ve tasarım referanslarını tanımlar.

**Kaynak Belge Seti:** `3CP_Yetenek_Seti_ve_Ekran_Listesi.md` (NE) · `3CP_Mimari_Dokumani.md` (NASIL) · `3CP_Tasarim_Dili.md` (NASIL GÖRÜNÜR).

**Durum:** Ürün geliştirme (POC / Faz 0–3) devam ederken paralel hazırlanan tanıtım sayfası.

> **Not:** Bu doküman landing page'in **içerik ve bileşen planıdır** (blueprint). Kod değildir; sayfa geliştirilirken referans alınır. İçerik dili, müşteriye dönük (pazarlama) tonda ve Türkçedir. Ürünün iç geliştirme kuralları (Tier 1/Tier 2, faz DoD, subagent yönetişimi vb.) burada **yer almaz** — bunlar müşteri tarafında görünmez.

---

## 0. Ürün Özeti — 3CP Nedir?

**3CP — Centralized Customer Control Panel (Merkezi Müşteri Kontrol Paneli).**

Çok şubeli ve çok markalı işletmelerin, müşteri yönetiminin tamamını **tek bir panelden** yürütmesini sağlayan çok-kiracılı (multi-tenant) ve **çok-sektörlü** bir SaaS platformu.

- **İlk dikey pazar (v1):** Restoran zincirleri (çok şubeli / çok markalı).
- **Çekirdek konumlanış:** "Restoran CRM'i" değil — **çok-sektörlü, çok-kiracılı müşteri yönetim platformu.** Restoran yalnızca ilk dikeydir; emlak, perakende, otelcilik gibi sektörler aynı çekirdek üzerine eklenir.
- **Temel değer önermesi:** Dağınık müşteri geri bildirimini (anket, yorum, şikayet, sosyal medya) tek havuzda toplar ve **yapay zeka ile otomatik olarak sınıflandırıp segmentler** — operatör dağınık veriyi elle okumak yerine, anlamlandırılmış ve önceliklendirilmiş içgörüyü panelde görür.

### Çekirdek Yetenekler (müşteriye dönük dille)

| Yetenek | Ne İşe Yarar |
| --- | --- |
| **Kimlik & Yetki (IAM)** | Şirket → Marka → Şube → Departman hiyerarşisi; her müşterinin kendi rollerini ve izin matrisini tanımlaması; alıcı tipine göre alan maskeleme; tam audit log. |
| **Kişi Kartı** | Telefon numarası birincil anahtar olan tekil müşteri profili; 360° geçmiş (anket, şikayet, kampanya, çağrı, satın alma); KVKK uyumlu rıza defteri. |
| **Anket / NPS** | QR kodla mobil-öncelikli, **anonim-öncelikli** anket toplama; NPS kırılımı; eşik altı sonuçların otomatik şikayet ticket'ına dönüşmesi. |
| **AI Geri Bildirim Zekası (RAG)** | Çok kaynaklı yorumları embedding + vektör arama ile kategori/duygu/kritiklik olarak otomatik sınıflandırma; insan düzeltmesiyle sürekli iyileşme. |
| **LLM & Marka Prompt Yönetimi** | Vendor-agnostik LLM altyapısı (Gemini, OpenAI, Claude, Mistral); marka bazlı ses tonu ve prompt yönetimi; token/maliyet takibi. |
| **Entegrasyon Adaptör Çatısı** | POS, çağrı merkezi, yorum platformları ile tedarikçi-agnostik entegrasyon; yeni tedarikçi = çekirdeğe dokunmadan yeni adaptör. |
| **Şikayet / Çağrı Merkezi / Kampanya / Kanal Dinleme / Raporlama / Loyalty** | Sonraki fazlarda devreye alınan operasyon modülleri (roadmap'te). |

### Farklılaştırıcılar

- **Çok-kiracılık + çok-sektör:** Yeni müşteri konfigürasyonla, yeni sektör additive modüllerle eklenir — çekirdek değişmez.
- **Tedarikçi-agnostik:** 3CP tedarikçilerin işini yapmaz, onlarla haberleşir.
- **Anonim-öncelikli & KVKK-uyumlu:** Anket zorunlu kimlik istemez; rıza defteri immutable; Google review-gating yapılmaz (politika uyumlu).
- **Güvenlik çekirdekte:** PostgreSQL Row-Level Security ile tenant izolasyonu, veri-temelli alan maskeleme, tam erişim audit'i.

### POC = Satış Demo'su (uçtan uca ince dilim)

> Müşteri QR'dan anonim anket doldurur → yanıt otomatik sınıflandırılır → operatör segmentlenmiş geri bildirimi panelde görür.

Bu akış, 3CP'nin çekirdek değer önermesini (otomatik geri bildirim zekası) tek bir çalışan dilimle kanıtlar. Landing page'in "Nasıl Çalışır?" bölümü bu akışı anlatır.

---

## 1. Hedef Kitle ve Sayfa Amacı

- **Birincil hedef kitle:** Çok şubeli / çok markalı restoran zinciri karar vericileri (genel müdür, pazarlama direktörü, operasyon/müşteri deneyimi yöneticisi).
- **İkincil hedef kitle:** Diğer sektörlerden (emlak, perakende vb.) genişlemeyle ilgilenen işletmeler.
- **Sayfa amacı (dönüşüm):** Ziyaretçiyi **demo talebi / iletişim** aksiyonuna yönlendirmek.
- **İkincil amaç:** Ürünün ne olduğunu, hangi problemi çözdüğünü ve neden farklı olduğunu 60 saniyede anlatmak.

---

## 2. Tasarım Dili Referansı (landing page'e uyarlama)

Landing page, ürün panelinin tasarım dilini (`3CP_Tasarim_Dili.md`) miras alır ama **pazarlama yüzeyi** olduğu için biraz daha "hava alan" (whitespace) ve hero-odaklı olabilir. Ürün paneli bilgi-yoğunken, landing page ikna-odaklıdır.

### 2.1 Renk

| Rol | Değer | Kullanım |
| --- | --- | --- |
| **Brand Teal** | `#0D7A6F` | Birincil CTA butonları, aktif linkler, vurgu, logo. **Tek marka rengi.** |
| **Teal (dark mode)** | `#1FAF9E` | Karanlık mod marka rengi. |
| Neutral 50 | `#F7F8F9` | Sayfa arka planı (açık bölümler). |
| Neutral 100 | `#EBECF0` | Kart / subtle yüzey arka planı. |
| Neutral 200 | `#DFE1E6` | Bölücüler, kenarlıklar. |
| Neutral 600 | `#5E6C84` | İkincil metin. |
| Neutral 900 | `#172B4D` | Başlıklar, birincil metin. |
| Success / Warning / Danger / Info | `#006644` / `#FF8B00` / `#BF2600` / `#0052CC` | Sadece anlamsal durum vurgusu (ikon/rozet). Dekoratif kullanım yasak. |
| Accent paleti | Red · Orange · Yellow · Green · Teal · Blue · Purple · Magenta · Gray · Lime | Kategori/özellik ikonları, illüstrasyon vurguları (sabit anlam taşımaz). |

> **Kural:** Sayfada aynı anda birden fazla "marka renginde CTA" olmaz — birincil aksiyon Teal, ikincil aksiyon nötr/outline.

### 2.2 Tipografi

- **UI/Başlık fontu:** `Inter` (veya `Geist Sans`).
- **Mono font:** `Geist Mono` (metrik sayılar, teknik string, "kanıt" niteliğindeki rakamlar).
- **Hero başlık:** Heading XL üstü — landing için 40–56px Bold kabul edilebilir (panel ölçeğinin üstünde, pazarlama istisnası).
- **Bölüm başlıkları:** Heading L (24px Bold) / Heading M (20px SemiBold).
- **Gövde:** Body L (16px / 1.6) uzun anlatım; Body M (14px) ikincil.
- **Metrikler (sosyal kanıt / istatistik):** Metric XL (40px Bold Mono) / Metric L (32px Bold Mono).
- **All-caps yasağı:** Sadece kısaltmalar (KVKK, NPS, QR, AI, POS) ve Status Badge istisnadır.

### 2.3 Boşluk & Layout

- **Temel birim:** 8px. Sayfa bölümleri arası büyük boşluk: `space.800` (64px) / `space.1000` (80px) hero için.
- **Izgara:** 12 sütun; desktop geniş modda merkezli, max 1440px.
- **Kart iç padding:** `space.200` (16px); bölümler arası `space.400` (32px)+.

### 2.4 Elevation & Bileşen Ruhu

- Kartlar: Default (`#FFFFFF`) → hover'da Raised (hafif gölge). Dekoratif gölge yok.
- **Sakin, bilgi-yoğun, durum-odaklı** ruh korunur: anlamsız animasyon yok, `prefers-reduced-motion` desteklenir.
- Focus göstergesi: 2px solid outline + 2px offset (erişilebilirlik).

### 2.5 İçerik Dili (Voice & Tone)

- **Açık, doğrudan, saygılı ama samimi.** Şube müdürü de genel müdür de anlar.
- Butonlar eylem fiiliyle, 1–3 kelime: `Demo İste` · `İletişime Geç` · `Nasıl Çalışır?`
- "Eğlendirmeye" çalışmaz; ürün bir iş aracıdır.

---

## 3. Sayfa Yapısı — Bileşen Sıralaması

```text
1.  Navbar (üst navigasyon)
2.  Hero (değer önermesi + birincil CTA)
3.  Sektör / Konum Şeridi (v1 restoran, çok-sektör vaadi)
4.  Problem (çözülen acılar)
5.  Nasıl Çalışır? (POC ince dilimi — 3 adım akışı)
6.  Çekirdek Yetenekler (özellik grid'i)
7.  Farklılaştırıcılar (neden 3CP?)
8.  Çok-Sektör Genişleme (platform vaadi)
9.  Güvenlik & KVKK Uyumu
10. Yol Haritası (fazlar — şeffaflık)
11. Sık Sorulan Sorular (FAQ)
12. Kapanış CTA (demo talebi bandı)
13. Footer
```

---

## 4. Bileşen Detayları ve İçerikleri

Her bileşen için: **amaç**, **yapı**, **içerik (kopya metin)** ve **tasarım notu** verilir. Kopya metinler doğrudan kullanılabilir taslaklardır.

---

### 4.1 Navbar (Üst Navigasyon)

**Amaç:** Kalıcı navigasyon + her an erişilebilir birincil CTA.

**Yapı:**

- Sol: 3CP logo/kelime-işareti (Teal).
- Orta/sağ: Bölüm linkleri — `Nasıl Çalışır?` · `Yetenekler` · `Güvenlik` · `Yol Haritası` · `SSS`.
- Sağ uç: Birincil CTA butonu → `Demo İste` (Teal, dolu).
- Sticky (yukarı kaydırınca sabit), scroll'da hafif gölge (Raised elevation).
- Mobilde: hamburger menü + görünür kalan `Demo İste`.

**İçerik:**

- Logo metni: `3CP`
- Alt/tam ad (opsiyonel tooltip veya footer'da): `Centralized Customer Control Panel`

**Tasarım notu:** Yükseklik ~64px. Aktif bölüm linki Teal ile işaretlenir. Sadece 1 birincil CTA.

---

### 4.2 Hero

**Amaç:** İlk 5 saniyede "ne bu, kime, ne kazandırır" sorusunu yanıtlamak.

**Yapı:**

- Sol (veya merkez): H1 başlık + alt açıklama (subtitle) + 2 CTA (birincil + ikincil) + küçük güven satırı.
- Sağ: ürün panelinin şematik/mockup görseli veya "geri bildirim → AI sınıflandırma → segment" akış illüstrasyonu (sakin, tek-renkli aksanlı).

**İçerik (kopya):**

- **H1:** `Tüm müşteri geri bildiriminiz tek panelde — yapay zeka ile otomatik anlamlandırılmış.`
- **Alt başlık:** `3CP, çok şubeli ve çok markalı işletmelerin anket, yorum, şikayet ve çağrı verisini tek merkezde toplar; yapay zeka ile otomatik sınıflandırır ve size sadece harekete geçmeniz gerekeni gösterir.`
- **Birincil CTA:** `Demo İste`
- **İkincil CTA:** `Nasıl Çalışır?` (sayfada #nasil-calisir bölümüne kaydırır)
- **Güven satırı (CTA altı):** `Çok-kiracılı · KVKK uyumlu · Tedarikçi-agnostik`

**Tasarım notu:** Hero arka planı Neutral 50 veya çok hafif Teal tonlu degrade. Başlık Neutral 900, "yapay zeka ile otomatik anlamlandırılmış" kısmı Teal vurgulu olabilir. Bol boşluk (`space.1000`).

---

### 4.3 Sektör / Konum Şeridi

**Amaç:** "Kimin için?" sorusunu netleştirmek ve çok-sektör vaadini erken kurmak. (Klasik "müşteri logoları" şeridinin pre-launch alternatifi.)

**Yapı:**

- Yatay şerit; küçük başlık + sektör rozetleri (ikon + etiket).
- Aktif/hazır sektör (Restoran) vurgulu; gelecek sektörler soluk/"yakında" rozetiyle.

**İçerik:**

- Üst mikro-başlık: `İlk dikey pazar restoran zincirleri — çekirdek her sektöre genişler.`
- Rozetler:
  - `Restoran Zincirleri` — `AKTİF` (Status Badge, success)
  - `Emlak` — `YAKINDA` (neutral)
  - `Perakende` — `YAKINDA` (neutral)
  - `Otelcilik` — `YAKINDA` (neutral)

**Tasarım notu:** Rozetlerde tek-renkli line ikon tercih edilir (tutarlılık). Status Badge tasarım dilinden (all-caps, pill).

---

### 4.4 Problem Bölümü

**Amaç:** Prospect'in kendini gördüğü acıları isimlendirmek — çözümden önce problemi sahiplendirmek.

**Yapı:**

- Bölüm başlığı + 3–4 problem kartı (ikon + kısa başlık + 1 cümle).

**İçerik:**

- **Bölüm başlığı:** `Müşteri geri bildirimi her yerde — ama hiçbir yerde bir arada değil.`
- Problem kartları:
  1. **Dağınık veri** — `Anketler, Google yorumları, şikayetler ve çağrı kayıtları farklı sistemlerde; hiçbiri tek müşteri görünümünde birleşmiyor.`
  2. **Elle okuma yükü** — `Yüzlerce yorumu okuyup kategorilere ayırmak insana kalıyor; kritik sinyaller gecikince fark ediliyor.`
  3. **Çok şube / çok marka karmaşası** — `Her şubenin, her markanın performansını karşılaştırmak ve doğru kişiye doğru yetkiyi vermek zorlaşıyor.`
  4. **KVKK ve maskeleme riski** — `Müşteri verisini herkesin görmesi risk; kim neyi ne zaman gördü sorusunun izlenebilir yanıtı yok.`

**Tasarım notu:** Kartlar eşit yükseklik, Neutral 100 arka plan. İkonlar tek-renkli. Danger/warning renkleri **kullanılmaz** (problem anlatımı dekoratif kırmızıya kaçmamalı) — nötr kalır.

---

### 4.5 Nasıl Çalışır? (POC İnce Dilimi)

**Amaç:** Çekirdek değer önermesini somut 3 adımlı akışla göstermek. Bu, POC = satış demo akışıdır.

**Yapı:**

- Bölüm başlığı + 3 adımlı yatay/dikey akış (numaralı adımlar, aralarında ok/bağlaç).
- Her adım: ikon + başlık + kısa açıklama.
- Altında küçük bir "sonuç" cümlesi.

**İçerik:**

- **Bölüm başlığı:** `Üç adımda otomatik geri bildirim zekası`
- Adımlar:
  1. **Müşteri QR'dan anonim anket doldurur** — `Masadaki QR koddan açılan mobil-öncelikli anket; zorunlu kimlik yok, tamamlanma oranı yüksek.`
  2. **Yanıt otomatik sınıflandırılır** — `Yapay zeka; yorumu kategori, duygu ve kritiklik olarak etiketler. Düşük güvenli sonuçlar insan incelemesine işaretlenir.`
  3. **Operatör segmentlenmiş içgörüyü panelde görür** — `Dağınık veri değil, önceliklendirilmiş ve anlamlandırılmış geri bildirim. Eşik altı puanlar otomatik şikayet ticket'ına döner.`
- **Sonuç cümlesi:** `Yorumları elle okumak yerine, sadece harekete geçmeniz gerekeni görürsünüz.`

**Tasarım notu:** Adım numaraları Teal. Akış oku ince, nötr. Mobilde dikey stack. İsteğe bağlı: her adımda küçük "ürün ekranı" kesiti (gerçek panel görseli hazır olduğunda).

---

### 4.6 Çekirdek Yetenekler (Özellik Grid'i)

**Amaç:** Ürünün kapsamını taranabilir bir grid'de sunmak.

**Yapı:**

- Bölüm başlığı + responsive kart grid'i (desktop 3 sütun, tablet 2, mobil 1).
- Her kart: ikon + yetenek adı + 1–2 cümle fayda.
- Kartlarda "faz/roadmap" rozeti opsiyonel (POC'de olanlar `HAZIR`, gelecekler `YOL HARİTASINDA`).

**İçerik:**

- **Bölüm başlığı:** `Tek platform, uçtan uca müşteri yönetimi`
- Kartlar:
  1. **Kimlik & Yetki (IAM)** — `Şirket → Marka → Şube → Departman hiyerarşisi. Kendi rollerinizi ve izin matrisinizi tanımlayın; alıcı tipine göre alan maskeleme.` · `HAZIR`
  2. **Kişi Kartı** — `Telefon numarası birincil anahtar; tekil müşteri profili ve 360° geçmiş. KVKK uyumlu, zaman damgalı rıza defteri.` · `HAZIR`
  3. **Anket & NPS** — `QR ile anonim-öncelikli anket toplama, dinamik soru seti, şube/ürün bazlı NPS kırılımı.` · `HAZIR`
  4. **AI Geri Bildirim Zekası** — `Çok kaynaklı yorumları kategori, duygu ve kritiklik olarak otomatik sınıflandırma; insan düzeltmesiyle sürekli iyileşme.` · `HAZIR`
  5. **LLM & Marka Prompt Yönetimi** — `Vendor-agnostik LLM altyapısı; marka bazlı ses tonu ve prompt yönetimi; token ve maliyet takibi.` · `HAZIR`
  6. **Şikayet Yönetimi** — `Kanal-agnostik ticket, AI destekli yanıt taslağı, SLA takibi, Kanban görünüm.` · `YOL HARİTASINDA`
  7. **Çağrı Merkezi Köprüsü** — `IVR numarasıyla maskeli screen-pop, kişi kartından outbound arama, çağrı geçmişi.` · `YOL HARİTASINDA`
  8. **Kampanya & Kupon** — `Segment bazlı kampanya, POS'a kupon push, AI destekli mesaj metni, İYS uyumu.` · `YOL HARİTASINDA`
  9. **Kanal Dinleme** — `Google, Yemeksepeti, Getir, sosyal medya yorumlarını tek gelen kutusunda topla; AI destekli yanıt.` · `YOL HARİTASINDA`
  10. **Raporlama & BI** — `Modüller arası dashboard, Excel/Power BI export, AI destekli yönetici özeti.` · `YOL HARİTASINDA`
  11. **Loyalty Motoru** — `Puan/tier kuralları, kişi kartı ile senkron üyelik, kampanya tetikleme.` · `YOL HARİTASINDA`
  12. **Entegrasyon Adaptör Çatısı** — `POS ve çağrı merkezi ile tedarikçi-agnostik entegrasyon; yeni tedarikçi = yeni adaptör.` · `YOL HARİTASINDA`

**Tasarım notu:** Rozetler Status Badge stilinde: `HAZIR` → success, `YOL HARİTASINDA` → neutral/information. Grid hizalı, eşit yükseklik kartlar. İkonlar aynı stroke ailesinden.

---

### 4.7 Farklılaştırıcılar (Neden 3CP?)

**Amaç:** Rakiplerden (klasik CRM / tek-sektör araçlar) ayrışmayı net vurgulamak.

**Yapı:**

- Bölüm başlığı + 4 farklılaştırıcı (ikon + başlık + açıklama). Zebra/iki sütun düzen olabilir.

**İçerik:**

- **Bölüm başlığı:** `3CP'yi farklı kılan ne?`
- Maddeler:
  1. **Çok-kiracılı, çok-sektörlü çekirdek** — `Yeni müşteri konfigürasyonla, yeni sektör additive modüllerle eklenir — çekirdek kod değişmez. "Restoran CRM'i" değil, bir platform.`
  2. **Tedarikçi-agnostik entegrasyon** — `3CP tedarikçilerin işini yapmaz, onlarla haberleşir. POS'unuz, çağrı merkeziniz değişse bile çekirdek aynı kalır.`
  3. **Anonim-öncelikli & politika-uyumlu** — `Anket zorunlu kimlik istemez (tamamlanma oranı yüksek); Google review-gating yapılmaz — yaptırım riski yoktur.`
  4. **Güvenlik çekirdekte** — `Tenant izolasyonu veritabanı seviyesinde (Row-Level Security), veri-temelli alan maskeleme ve tam erişim audit'i standarttır — sonradan eklenen bir özellik değil.`

**Tasarım notu:** Her maddede kısa ve güçlü başlık; açıklama Body M. Teal vurgu sadece başlıkta veya ikonda.

---

### 4.8 Çok-Sektör Genişleme (Platform Vaadi)

**Amaç:** 3CP'nin restoranla sınırlı olmadığını, bir "platform" olduğunu göstermek. Yatırım/uzun vade değeri iletir.

**Yapı:**

- Bölüm başlığı + iki katman görseli/açıklaması: "Sektör-bağımsız çekirdek" vs "Sektöre özel modüller & entegrasyonlar".
- Somut örnek: Emlak dikeyi.

**İçerik:**

- **Bölüm başlığı:** `Bugün restoran, yarın her sektör`
- **Açıklama:** `3CP'nin çekirdeği hiçbir sektöre sabit bağlı değildir. Çok-kiracılık, kişi kartı, dinamik yetki, LLM altyapısı ve entegrasyon çatısı her sektörde aynıdır. Her yeni sektör, çekirdeğe dokunmadan kendi modüllerini ve entegrasyonlarını ekler.`
- İki sütun:
  - **Değişmeyen çekirdek:** `Çok-kiracılık · Kişi Kartı · Dinamik Yetki · LLM Gateway · Entegrasyon Çatısı · Maskeleme`
  - **Sektöre özel (örnek: emlak):** `İlan Yönetimi · Teklif/Pazarlık · Portföy Eşleştirme · Sahibinden/Emlakjet/Hürriyet Emlak adaptörleri`

**Tasarım notu:** Basit bir "çekirdek + eklenen katman" diyagramı (concentric veya layered). Nötr renkler, Teal ile çekirdek vurgusu.

---

### 4.9 Güvenlik & KVKK Uyumu

**Amaç:** Kurumsal alıcının en kritik itirazını (veri güvenliği / uyum) proaktif karşılamak.

**Yapı:**

- Bölüm başlığı + 3–4 güven maddesi (kalkan/kilit ikonları) + kısa açıklamalar.

**İçerik:**

- **Bölüm başlığı:** `Veri güvenliği ve KVKK, sonradan değil — baştan`
- Maddeler:
  1. **Tenant izolasyonu** — `Her müşterinin verisi veritabanı seviyesinde izole edilir (Row-Level Security). Bir müşterinin verisine başka müşteri erişemez.`
  2. **Alan maskeleme** — `Telefon, e-posta gibi hassas alanlar alıcı tipine göre otomatik maskelenir. "Göster" aksiyonu her zaman kayıt altına alınır.`
  3. **İmmutable rıza defteri** — `Müşteri onayları (SMS/e-posta/telefon) zaman damgalı ve değiştirilemez şekilde tutulur; KVKK silme talebi akışı vardır.`
  4. **Tam audit log** — `Kim, ne zaman, hangi alanı gördü/değiştirdi — hepsi izlenebilir.`

**Tasarım notu:** Güven bölümü sakin ve net; abartılı "askeri seviye güvenlik" dili kullanılmaz — doğrudan ve kanıt-odaklı.

---

### 4.10 Yol Haritası (Fazlar)

**Amaç:** Şeffaflık; ürünün geliştirme aşamasında olduğunu dürüstçe iletmek ve gelecek değeri göstermek.

**Yapı:**

- Yatay timeline veya faz kartları. Mevcut faz (POC) vurgulu.

**İçerik:**

- **Bölüm başlığı:** `Nereye gidiyoruz?`
- Fazlar:
  - **Faz 0–3 · POC (şimdi)** — `IAM + Kişi Kartı + Anonim Anket + AI Segmentasyon + LLM altyapısı.` · Status: `GELİŞTİRİLİYOR`
  - **Faz 4–6** — `Entegrasyon çatısı, Şikayet Yönetimi, Çağrı Merkezi Köprüsü.`
  - **Faz 7–9** — `Kampanya & Kupon, Kanal Dinleme, Raporlama & BI.`
  - **Faz 10+** — `Loyalty Motoru ve sektör genişlemeleri (emlak vb.).`

**Tasarım notu:** POC kartı Teal kenarlık / vurgu. Diğerleri nötr. Status Badge kullanımı.

> **İçerik uyarısı:** İç geliştirme detayları (Tier 1/Tier 2, %Y başarı eşiği, Hat B/B3 zorluk notları) buraya **yazılmaz** — bunlar müşteriye dönük değildir. Sadece kaba faz gruplaması gösterilir.

---

### 4.11 Sık Sorulan Sorular (FAQ)

**Amaç:** Satış öncesi tekrar eden itiraz/soruları yanıtlamak; SEO'ya katkı.

**Yapı:**

- Accordion (aç/kapa) listesi.

**İçerik (soru → yanıt):**

1. **3CP sadece restoranlar için mi?** → `Hayır. İlk dikey pazarımız restoran zincirleri, ancak çekirdek çok-sektörlüdür; emlak, perakende gibi sektörler aynı platform üzerine eklenir.`
2. **Mevcut POS / çağrı merkezi sistemimle çalışır mı?** → `Evet. 3CP tedarikçi-agnostiktir; sisteminiz için bir adaptör yazılarak entegre edilir, çekirdek değişmez.`
3. **KVKK açısından güvenli mi?** → `Evet. Anonim-öncelikli anket toplama, immutable rıza defteri, alan maskeleme, tenant izolasyonu ve tam audit standarttır.`
4. **Anketler için müşterinin telefon numarası zorunlu mu?** → `Hayır. Anket varsayılan olarak kimlik istemeden doldurulur; kimlik ve rıza yalnızca müşteri isterse opsiyonel alınır.`
5. **Hangi yapay zeka sağlayıcılarını kullanıyorsunuz?** → `Altyapı vendor-agnostiktir: Gemini, OpenAI, Claude, Mistral ve gelecekteki sağlayıcılar. Modül bazında sağlayıcı/model seçilebilir.`
6. **Ne zaman kullanıma hazır olacak?** → `Şu anda POC (Faz 0–3) aşamasındayız. Erken erişim ve demo için bizimle iletişime geçebilirsiniz.`

**Tasarım notu:** Accordion başlıkları Heading S. Açık durumda içerik Body M. Bir anda birden çok açık olabilir.

---

### 4.12 Kapanış CTA Bandı

**Amaç:** Sayfanın sonunda güçlü, tek odaklı dönüşüm çağrısı.

**Yapı:**

- Tam genişlik Teal (veya koyu) arka planlı bant; başlık + kısa metin + birincil CTA + (opsiyonel) ikincil iletişim yöntemi.

**İçerik:**

- **Başlık:** `Müşteri geri bildirimini içgörüye çevirmeye hazır mısınız?`
- **Alt metin:** `Size özel bir demo ile 3CP'nin işletmenizde nasıl çalışacağını gösterelim.`
- **Birincil CTA:** `Demo İste`
- **İkincil:** `E-posta ile yazın` (mailto veya iletişim formu)

**Tasarım notu:** Kontrast WCAG AA (koyu arka plan + beyaz metin). Tek CTA odağı.

---

### 4.13 Footer

**Amaç:** İkincil navigasyon, yasal ve iletişim bilgisi.

**Yapı:**

- Sol: logo + tek cümle tanım. Orta: bölüm linkleri. Sağ: iletişim / sosyal.
- Alt satır: telif + yasal linkler.

**İçerik:**

- Tanım: `3CP — Centralized Customer Control Panel. Çok-kiracılı, çok-sektörlü müşteri yönetim platformu.`
- Link grupları: `Ürün` (Yetenekler, Nasıl Çalışır, Güvenlik, Yol Haritası) · `Şirket` (İletişim, Demo İste) · `Yasal` (KVKK / Gizlilik).
- Alt satır: `© 2026 3CP. Tüm hakları saklıdır.`

**Tasarım notu:** Nötr arka plan (Neutral 100 veya koyu). Linkler `color.link`; çevre metinle aynı renk olmaz.

---

## 5. Ortak Bileşenler (Sayfa Genelinde Tekrarlanan)

| Bileşen | Kullanım | Tasarım Referansı |
| --- | --- | --- |
| **Birincil Buton** | `Demo İste`, `İletişime Geç` | Teal dolu, `button.primary` token; hover/pressed durumları. |
| **İkincil Buton** | `Nasıl Çalışır?`, outline aksiyonlar | Nötr/outline; marka rengi kullanmaz. |
| **Status Badge** | Sektör şeridi, yetenek/roadmap rozetleri | All-caps, pill; success/neutral/information. |
| **Kart** | Problem, yetenek, faz kartları | Default elevation, hover'da Raised; `space.200` padding. |
| **Bölüm Başlığı Bloğu** | Her section üstü | Heading L + opsiyonel Body L alt açıklama; ortalı veya sola dayalı tutarlı. |
| **İkon** | Tüm bölümlerde | Tek stroke ailesi; `aria-label` veya `aria-hidden`. |
| **Accordion** | FAQ | Klavye erişilebilir; `aria-expanded`. |

---

## 6. Erişilebilirlik Kontrol Listesi (landing page)

- [ ] Tüm renk/metin kombinasyonları WCAG AA kontrast (4.5:1 normal, 3:1 büyük).
- [ ] Durum bilgisi asla yalnızca renkle iletilmez (renk + ikon/metin).
- [ ] Tüm interaktif öğeler klavye ile erişilebilir; görünür focus göstergesi (2px outline + 2px offset).
- [ ] Tüm ikonlar `aria-label` / `aria-hidden`; görseller `alt` metinli.
- [ ] `prefers-reduced-motion` desteklenir; dekoratif animasyon yoktur.
- [ ] Touch hedefleri mobilde ≥ 44×44px.
- [ ] Başlık hiyerarşisi doğru (tek H1, mantıklı H2/H3 sırası).

---

## 7. Teknik Notlar (GitHub Pages)

- **Yayın:** GitHub Pages (statik). Framework kararı ayrı verilecek (statik HTML/CSS, Next.js static export veya Astro gibi).
- **Performans:** Landing page hızlı yüklenmeli (LCP düşük); görseller optimize (WebP/AVIF), fontlar `font-display: swap`.
- **Tema:** Açık mod birincil; karanlık mod token'ları (`#1FAF9E` marka) hazır tutulur ama landing için opsiyonel.
- **SEO:** Anlamlı `<title>`, meta description, Open Graph görseli; FAQ için structured data (opsiyonel).
- **Analitik:** Demo talebi / CTA tıklamaları izlenebilir olmalı (dönüşüm ölçümü).

---

## 8. Açık Kararlar (Sonraki Adımlar)

- [ ] Framework/teknoloji seçimi (statik HTML mi, Astro/Next static mi).
- [ ] Görsel varlıklar: gerçek panel ekran görüntüleri mi, illüstratif mockup mı (POC ilerleyince gerçek ekranlar).
- [ ] Demo talebi akışı: form mu, e-posta/mailto mu, takvim (Calendly vb.) mi.
- [ ] Logo / kelime-işareti final tasarımı.
- [ ] İçeriklerin İngilizce versiyonu gerekli mi (çok-dil).
- [ ] Nihai font onayı (Inter / Geist Sans) — tasarım dili notu.
