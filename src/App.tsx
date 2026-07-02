import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SectorProblem } from './components/SectorProblem';
import { HowItWorks } from './components/HowItWorks';
import { Capabilities } from './components/Capabilities';
import { Differentiators } from './components/Differentiators';
import { SecurityRoadmapFaq } from './components/SecurityRoadmapFaq';
import { ClosingFooter } from './components/ClosingFooter';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SectorProblem />
        <HowItWorks />
        <Capabilities />
        <Differentiators />
        <SecurityRoadmapFaq />
      </main>
      <ClosingFooter />
    </>
  );
}
