"use client"

import { useRouter } from "next/navigation"
import { LandingLayout } from "@/components/layout/LandingLayout"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const router = useRouter()

  return (
    <LandingLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Decorative elements */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="w-16 h-16 bg-[#05E17A] border-2 border-black shadow-shadow rotate-12"></div>
            <div className="w-16 h-16 bg-[#0099FF] border-2 border-black shadow-shadow -rotate-6"></div>
            <div className="w-16 h-16 bg-[#FACC00] border-2 border-black shadow-shadow rotate-3"></div>
          </div>

          {/* Main heading */}
          <h1 className="text-6xl md:text-7xl font-heading font-bold text-foreground">
            PeliFi
          </h1>

          <p className="text-2xl md:text-3xl font-bold text-main">
            Predict. Stake. Earn.
          </p>

          <p className="text-xl text-foreground max-w-2xl mx-auto">
            Pasang prediksi YES/NO di pasar global. Dana kamu bekerja menghasilkan yield selama event berlangsung.
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <Button
              onClick={() => router.push("/app")}
              size="lg"
              className="bg-main text-main-foreground text-xl px-12 py-6 border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Launch App
            </Button>
          </div>

          {/* More decorative elements */}
          <div className="flex justify-center gap-4 mt-12">
            <div className="w-12 h-12 bg-[#FF4D50] border-2 border-black shadow-shadow -rotate-12"></div>
            <div className="w-12 h-12 bg-[#7A83FF] border-2 border-black shadow-shadow rotate-6"></div>
            <div className="w-12 h-12 bg-[#05E17A] border-2 border-black shadow-shadow -rotate-3"></div>
          </div>
        </div>
      </div>
    </LandingLayout>
  )
}
