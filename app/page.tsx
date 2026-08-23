import Hero from '@/components/sections/Hero'
import TrustCards from '@/components/sections/TrustCards'
import Benefits from '@/components/sections/Benefits'
import HowItWorks from '@/components/sections/HowItWorks'
import Testimonials from '@/components/sections/Testimonials'
import FinalCTA from '@/components/sections/FinalCTA'
import BottomNav from '@/components/layout/BottomNav'

export default function Home() {
  return (
    <>
      <main className="pt-16 pb-24 md:pb-0">
        <Hero />
        <TrustCards />
        <Benefits />
        <HowItWorks />
        <Testimonials />
        <FinalCTA />
      </main>
      <BottomNav />
    </>
  )
}
