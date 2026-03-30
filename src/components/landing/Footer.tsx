"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-foreground border-t-4 border-foreground">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <span className="font-heading text-3xl font-bold text-background">PeliFi</span>

          <div className="flex gap-6 font-base text-background">
            <a href="#how-it-works" className="hover:text-chart-3 transition-colors font-semibold">How it Works</a>
            <a href="#features" className="hover:text-chart-3 transition-colors font-semibold">Features</a>
            <a href="#" className="hover:text-chart-3 transition-colors font-semibold">Docs</a>
          </div>

          <div className="flex gap-3">
            {["bg-main", "bg-chart-1", "bg-chart-3"].map((c, i) => (
              <div key={i} className={`w-6 h-6 ${c} border-2 border-background`} />
            ))}
          </div>
        </motion.div>

        <div className="mt-8 pt-6 border-t border-background/20 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-background/60">Powered by</span>
            <div className="flex items-center gap-3 bg-background/10 border-2 border-background/30 px-4 py-2">
              <Image src="/flow.jpeg" alt="Flow" width={24} height={24} className="rounded-sm" />
              <span className="font-heading font-bold text-sm text-background">FLOW</span>
              <span className="text-background/40 font-bold">&</span>
              <Image src="/ankr.jpeg" alt="Ankr" width={24} height={24} className="rounded-sm" />
              <span className="font-heading font-bold text-sm text-background">Ankr Protocol</span>
            </div>
          </div>
          <p className="font-base text-background/60 text-sm">
            © 2026 PeliFi. No Loss. No Cheat. Just Luck.
          </p>
        </div>
      </div>
    </footer>
  )
}
