import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AuthorityBar from "@/components/AuthorityBar";
import HowItWorks from "@/components/HowItWorks";
import CarHotspots from "@/components/CarHotspots";
import SavingsComparator from "@/components/SavingsComparator";
import InstallmentPlans from "@/components/InstallmentPlans";
import BenefitsSection from "@/components/BenefitsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqAccordion from "@/components/FaqAccordion";
import Footer from "@/components/Footer";
import MobileCtaBar from "@/components/MobileCtaBar";
import SimulatorProvider from "@/components/SimulatorProvider";

export default function Home() {
  return (
    <SimulatorProvider>
      <Navbar />
      <main>
        <HeroSection />
        <AuthorityBar />
        <HowItWorks />
        <CarHotspots />
        <SavingsComparator />
        <InstallmentPlans />
        <BenefitsSection />
        <TestimonialsSection />
        <FaqAccordion />
      </main>
      <Footer />
      <MobileCtaBar />
    </SimulatorProvider>
  );
}
