import Nav from "@/components/ui/Nav";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import GraphPreview from "@/components/landing/GraphPreview";
import ReportPreview from "@/components/landing/ReportPreview";
import Pricing from "@/components/landing/Pricing";
import FinalCTA from "@/components/landing/FinalCTA";

export default function LandingPage() {
  return (
    <main>
      <Nav />
      <Hero />
      <HowItWorks />
      <GraphPreview />
      <ReportPreview />
      <Pricing />
      <FinalCTA />
    </main>
  );
}
