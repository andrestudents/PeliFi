"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const steps = [
  { number: "01", title: "Choose Market", desc: "Find global events you want to predict the outcome of.", color: "bg-chart-1" },
  { number: "02", title: "Place Prediction", desc: "Vote YES or NO and stake your funds on your chosen position.", color: "bg-chart-3" },
  { number: "03", title: "Earn Yield", desc: "Your funds work to generate yield while the event is ongoing.", color: "bg-main" },
  { number: "04", title: "Claim Rewards", desc: "Correct prediction? Claim your rewards plus accumulated yield.", color: "bg-chart-4" },
]

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1])
  const triangleY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const circleScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1.2, 0.7])

  return (
    <section ref={ref} id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Parallax decorations */}
      <motion.div
        style={{ y: triangleY, scale: circleScale }}
        className="absolute top-20 right-[5%] w-24 h-24 bg-chart-3 border-4 border-foreground shadow-shadow rotate-12"
      />
      <motion.div
        style={{ y: triangleY }}
        className="absolute bottom-20 left-[3%]"
      >
        <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[70px] border-b-chart-2"
          style={{ filter: "drop-shadow(6px 6px 0px black)" }}
        />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-4xl md:text-6xl font-heading font-bold mb-16 text-center"
        >
          How it Works
        </motion.h2>

        <motion.div style={{ scale: bgScale }} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 60, rotate: -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ rotate: -2, scale: 1.03 }}
              className={`${step.color} p-8 border-4 border-foreground shadow-shadow`}
            >
              <span className="font-heading text-5xl font-bold opacity-30">{step.number}</span>
              <h3 className="font-heading text-2xl font-bold mt-2">{step.title}</h3>
              <p className="font-base text-lg mt-3">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
