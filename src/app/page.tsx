import Nav from "@/components/ui/Nav";
import PromoBanner from "@/components/landing/PromoBanner";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import GraphPreview from "@/components/landing/GraphPreview";
import ReportPreview from "@/components/landing/ReportPreview";
import Philosophy from "@/components/landing/Philosophy";
import Pricing from "@/components/landing/Pricing";
import FinalCTA from "@/components/landing/FinalCTA";

export default function LandingPage() {
  return (
    <main>
      <PromoBanner />
      <Nav />
      <Hero />
      <HowItWorks />
      <GraphPreview />
      <ReportPreview />
      <Philosophy />
      <Pricing />
      <FinalCTA />
    </main>
  );
}
