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
        {/* Ortadaki marquee bölümü kaldırıldı — içeriği LedTicker'a taşındı */}
        <ActivityPreview />
        <CostAndQuote />
        <RoadmapFaq />
      </main>
      <ClosingFooter />
    </>
  );
}
