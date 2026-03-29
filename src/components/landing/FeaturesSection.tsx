"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const features = [
  { title: "No Loss Guarantee", desc: "Your principal is always safe. Even if you don't win, you get back your entire deposit.", color: "bg-chart-1", icon: "🛡️" },
  { title: "Multiple Pool Types", desc: "Weekly (5 winners), Monthly (10 winners), or Yearly (15 winners) pools with varying prize sizes.", color: "bg-chart-3", icon: "🎲" },
  { title: "Provably Fair", desc: "Winners selected through transparent, tamper-proof on-chain randomness. No cheating possible.", color: "bg-main", icon: "✓" },
  { title: "Permissionless", desc: "Anyone can join. No gatekeeping, no restrictions. Just deposit and participate.", color: "bg-chart-4", icon: "🚪" },
  { title: "Yield Generation", desc: "Your funds work for you, generating yield throughout the pool period automatically.", color: "bg-chart-5", icon: "📈" },
  { title: "Easy Onboarding", desc: "Walletless login with email or Google. No complex wallet setup required.", color: "bg-chart-3", icon: "📱" },
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
