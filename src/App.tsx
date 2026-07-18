import { Fragment } from 'react';
import { LedTicker } from './components/marketing/LedTicker';
import { Navbar } from './components/marketing/Navbar';
import { Hero } from './components/marketing/Hero';
import { SectorProblem } from './components/marketing/SectorProblem';
import { CapabilityBento } from './components/marketing/CapabilityBento';
import { HowItWorks } from './components/marketing/HowItWorks';
import { SectorVerticals } from './components/marketing/SectorVerticals';
import { Onboarding } from './components/marketing/Onboarding';
import { Integrations } from './components/marketing/Integrations';
import { Security } from './components/marketing/Security';
import { ActivityPreview } from './components/marketing/ActivityPreview';
import { CostAndQuote } from './components/marketing/CostAndQuote';
import { RoadmapFaq } from './components/marketing/RoadmapFaq';
import { ClosingFooter } from './components/marketing/ClosingFooter';
import { ScrollRail } from './components/marketing/ScrollRail';
import { EditorialFrame } from './components/editorial/EditorialFrame';
import { PageFold } from './components/editorial/PageFold';
import { SECTION_FOLIOS } from './data/content';

/**
 * Ana section sırası — SECTION_FOLIOS ile birebir eşleşir (01–11).
 * LedTicker / Navbar / ClosingFooter dergi çerçevesinin dışında kalır.
 */
const SECTIONS = [
  Hero, // 01 Platform
  SectorProblem, // 02 Problem
  CapabilityBento, // 03 Çekirdek Modüller
  HowItWorks, // 04 Nasıl Çalışır
  SectorVerticals, // 05 Restoran Dikeyi
  Onboarding, // 06 Kurulum
  Integrations, // 07 Entegrasyon
  Security, // 08 Güvenlik
  // Ortadaki marquee bölümü kaldırıldı — içeriği LedTicker'a taşındı
  ActivityPreview, // 09 Canlı Akış
  CostAndQuote, // 10 Maliyet
  RoadmapFaq, // 11 Yol Haritası & SSS
] as const;

export default function App() {
  return (
    <>
      {/* Keyboard-only users (no screen reader, so landmarks don't help) get one
          jump past the ticker + navbar straight to the content. Visible only
          once focused — the first Tab from page load lands here. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-surface-default focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-content-primary focus:shadow-overlay focus:outline focus:outline-2 focus:outline-brand-teal"
      >
        İçeriğe geç
      </a>
      <LedTicker />
      <Navbar />
      {/* Sağ kenarda scroll ilerlemesini gösteren saat-ibresi rayı (lg+) */}
      <ScrollRail />
      <main id="main-content">
        {SECTIONS.map((Section, index) => (
          <Fragment key={SECTION_FOLIOS[index].target}>
            {/* Section'lar arası "sayfa kıvrımı" ayracı */}
            {index > 0 && <PageFold />}
            <EditorialFrame folio={SECTION_FOLIOS[index]} index={index}>
              <Section />
            </EditorialFrame>
          </Fragment>
        ))}
      </main>
      <ClosingFooter />
    </>
  );
}
