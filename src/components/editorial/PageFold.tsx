/**
 * PageFold — section'lar arasına giren "sayfa kıvrımı" ayracı.
 *
 * İnce, tam genişlik bir bölge: üstte 1px hairline, alt kenara doğru
 * koyulaşan yumuşak bir gölge (kağıdın kıvrılıp gölge düşürmesi) ve en
 * altta yalnız dark temada okunan hafif bir ışık kenarı.
 *
 * Tamamen statik CSS — animasyon yok, bu yüzden reduced-motion işi yok.
 * Tema uyumu katmanların doğasından gelir:
 *  - zemin şeffaf: body'nin theme-aware bg-neutral-50'si görünür
 *    (light'ta açık gri, dark'ta inversiyonla koyu lacivert);
 *  - gölge --color-blanket alfası: light'ta belirgin, dark'ta zaten koyu
 *    zeminde neredeyse kaybolur;
 *  - beyaz alfa hairline: light'ta açık zeminde görünmez, dark'ta koyu
 *    zeminde "kıvrımın ışık yakalayan kenarı" olarak okunur.
 */
export function PageFold() {
  return (
    <div aria-hidden="true" className="relative h-8 w-full overflow-hidden">
      {/* Üst hairline: bir önceki sayfanın bittiği çizgi */}
      <div className="absolute inset-x-0 top-0 h-px bg-edge-subtle" />
      {/* Kıvrım gölgesi: alta doğru koyulaşır (light temanın taşıyıcısı) */}
      <div
        className="absolute inset-x-0 bottom-0 h-6"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgb(var(--color-blanket) / 0.06))',
        }}
      />
      {/* Işık kenarı: yalnız koyu zeminde algılanır (dark temanın taşıyıcısı) */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.07]" />
    </div>
  );
}
