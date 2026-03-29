"use client"

import { motion } from "framer-motion"

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

        <div className="mt-8 pt-6 border-t border-background/20 text-center">
          <p className="font-base text-background/60 text-sm">
            © 2026 PeliFi. No Loss. No Cheat. Just Luck.
          </p>
        </div>
      </div>
    </footer>
  )
}
