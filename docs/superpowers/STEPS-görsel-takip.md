# STEPS görsel takip notu (Task 9 denetimi)

Task 9 kapsamında hero'daki raster ürün görseli (`images/hero-dashboard.png`) kaldırılıp
yerine Türkçe, `DemoBadge`'li HTML/CSS `ProductMockup` bileşeni konuldu. Aynı denetim
`HowItWorks` bölümünün (`src/components/marketing/HowItWorks.tsx`) kullandığı
`STEPS` (`src/data/content.ts`) raster görselleri için de yapıldı.

**Sonuç:** `imageAlt` metinlerinin üçü de Türkçe ve görseli doğru tarif ediyor — bu
alanda değişiklik gerekmiyor. Ancak görsellerin kendi piksellerinde (metin `imageAlt`
değil, görselin içine gömülü arayüz metni) dürüstlük çizgisini ihlal eden içerik var.
Bu ajanın kapsamı yeni görsel varlık üretmeyi içermediği için görseller **değiştirilmedi**;
aşağıdaki bulgular bir sonraki adımda görsel değişimi/yeniden çekimi için referans olsun
diye kayda geçiriliyor.

## Görsel bazlı bulgular

### `public/images/step-1-anonim-katilim.png` — TEMİZ, aksiyon gerekmiyor
Tamamen Türkçe (“Görüşleriniz Bizim İçin Değerli.”, “Kimliğimi gizli tut”, “Hızlıca
Gönder”). Tarih, uydurma metrik veya İngilizce arayüz metni yok. `imageAlt` doğru.

### `public/images/step-2-ai-analizi.png` — İngilizce/temiz-olmayan arayüz metni
Görselin çoğu Türkçe (“Yapay Zeka Analizi (RAG Motoru)”, “Kategori”, “Duygu (Duygu
Skoru)”, “Güven Oranı”) ama duygu dağılımı lejantında İngilizce kelimeler kalmış:
**“Positive”** ve **“Critical”** (`%65 Positive`, `%35 Critical`). Ayrıca sol panelin
başlığı “Gelen Geri Bildirim” iken kart içi etiket “Geri Geri Bildirim” — muhtemelen bir
üretim/tekrar hatası (typo). Bunlar uydurma traction metriği değil (tek bir örnek yorum
üzerinden yapılan analiz gösterimi), ama görselin Türkçe/temiz olması gereken çizgisini
ihlal ediyor.

**Önerilen aksiyon:** Görsel yeniden üretilirken lejant İngilizce kelimeler yerine
“Pozitif” / “Kritik” kullanılmalı; “Geri Geri Bildirim” tekrar hatası düzeltilmeli.

### `public/images/step-3-stratejik-aksiyon.png` — 2023 tarihleri + İngilizce rozet metni
Görselde başlık altında **“14 Ekim 2023, Pazartesi”**, ticket tablosunda
**“14/10/2023”, “13/10/2023”** tarihleri var — hero görselindeki 2023 tarihleriyle aynı
sorun sınıfı (eski/sahte tarih damgası izlenimi). Ayrıca “Kritik Uyarılar” panelindeki
rozetler İngilizce: **“High Priority”**, **“Medium Priority”**. Geri kalan arayüz metni
(“Bölge Yöneticisi Paneli”, “Şube NPS Performansı”, “Otomatik Oluşan Ticket'lar”,
“Öneri”, “Ticketları Gör”) Türkçe.

**Önerilen aksiyon:** Görsel yeniden üretilirken (a) tarihler ya kaldırılmalı ya da
göreli/tarihsiz bir ifadeyle (“Bugün”, “Son 24 saat” gibi) değiştirilmeli, (b) “High
Priority” / “Medium Priority” rozetleri “Yüksek Öncelik” / “Orta Öncelik” olarak
Türkçeleştirilmeli.

## Kapsam dışı bırakılan seçenek

Brifin (b) seçeneği — `HowItWorks` bölümünü de tamamen HTML/CSS mock'a çevirmek — bu
görevin kapsamına alınmadı: Task 9 açıkça hero mockup'ı ve STEPS *denetimi* ile
sınırlıydı, üç ayrı adım görselini yeniden tasarlamak ayrı bir görev/karar gerektirir
(mevcut görseller ürünün gerçek adım akışını temsil ediyor; yalnızca üretim hatası olan
İngilizce/tarih detaylarının düzeltilmesi gerekiyor). Görsel varlık üretimi bu ajanın
araç setinde yok.

## Yapılacaklar (özet)

- [ ] `step-2-ai-analizi.png`: lejant “Positive/Critical” → “Pozitif/Kritik”; “Geri Geri
      Bildirim” tekrar hatasını düzelt.
- [ ] `step-3-stratejik-aksiyon.png`: 2023 tarihlerini kaldır/güncelle; “High/Medium
      Priority” rozetlerini Türkçeleştir.
- [x] `step-1-anonim-katilim.png`: aksiyon gerekmiyor.
