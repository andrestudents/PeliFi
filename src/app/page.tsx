"use client"

import { Navbar, HeroSection, HowItWorksSection, FeaturesSection, Footer } from "@/components/landing"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <Footer />
    </div>
  )
}
