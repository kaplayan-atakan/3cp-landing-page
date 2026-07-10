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
