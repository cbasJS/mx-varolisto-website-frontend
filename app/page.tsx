import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustCards from "@/components/TrustCards";
import Benefits from "@/components/Benefits";
import HowItWorks from "@/components/HowItWorks";
import MobileTestimonial from "@/components/MobileTestimonial";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16 pb-24 md:pb-0">
        <Hero />
        <TrustCards />
        <Benefits />
        <HowItWorks />
        <MobileTestimonial />
        <FinalCTA />
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
