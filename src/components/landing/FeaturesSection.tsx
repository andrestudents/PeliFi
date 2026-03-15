"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const features = [
  { title: "Yield While You Wait", desc: "Your funds don't sit idle — automatically generating yield throughout the event duration.", color: "bg-chart-1", icon: "📈" },
  { title: "Global Predictions", desc: "Access prediction markets from around the world. Sports, politics, crypto, and more.", color: "bg-chart-3", icon: "🌍" },
  { title: "Transparent & Secure", desc: "All transactions are on-chain. Audited smart contracts you can trust.", color: "bg-main", icon: "🔒" },
  { title: "Community Driven", desc: "Create your own markets and define the rules together with the community.", color: "bg-chart-4", icon: "🤝" },
  { title: "Instant Settlement", desc: "Claim your rewards immediately after events conclude. No waiting required.", color: "bg-chart-5", icon: "⚡" },
  { title: "Mobile Ready", desc: "Access PeliFi from anywhere. Optimized for all devices.", color: "bg-chart-3", icon: "📱" },
]

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const decoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.5, 1, 0.6])
  const decoY = useTransform(scrollYProgress, [0, 1], [200, -200])
  const decoRotate = useTransform(scrollYProgress, [0, 1], [0, 180])

  return (
    <section ref={ref} id="features" className="py-24 bg-secondary-background relative overflow-hidden">
      {/* Parallax decorations */}
      <motion.div
        style={{ scale: decoScale, y: decoY, rotate: decoRotate }}
        className="absolute top-10 left-[8%] w-20 h-20 bg-chart-2 border-4 border-foreground shadow-shadow"
      />
      <motion.div
        style={{ scale: decoScale, y: decoY }}
        className="absolute bottom-10 right-[5%] w-16 h-16 rounded-full bg-chart-1 border-4 border-foreground shadow-shadow"
      />
      <motion.div
        style={{ y: decoY }}
        className="absolute top-1/2 right-[3%]"
      >
        <div className="w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[44px] border-b-chart-5"
          style={{ filter: "drop-shadow(4px 4px 0px black)" }}
        />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-4xl md:text-6xl font-heading font-bold mb-16 text-center"
        >
          Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 25 }}
              whileHover={{ y: -8, rotate: 1 }}
              className={`${f.color} p-6 border-4 border-foreground shadow-shadow transition-all`}
            >
              <span className="text-4xl">{f.icon}</span>
              <h3 className="font-heading text-xl font-bold mt-4">{f.title}</h3>
              <p className="font-base mt-3">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
