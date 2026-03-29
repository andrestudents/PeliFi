"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const scale1 = useTransform(scrollYProgress, [0, 1], [1, 1.8])
  const scale2 = useTransform(scrollYProgress, [0, 1], [1, 0.5])
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150])
  const rotate1 = useTransform(scrollYProgress, [0, 1], [12, 45])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [-6, -30])

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Floating geometric shapes with parallax */}
      <motion.div
        style={{ scale: scale1, y: y1, rotate: rotate1 }}
        className="absolute top-32 left-[10%] w-20 h-20 bg-chart-4 border-4 border-foreground shadow-shadow animate-float"
      />
      <motion.div
        style={{ scale: scale2, y: y2, rotate: rotate2 }}
        className="absolute top-40 right-[15%] w-16 h-16 bg-chart-1 border-4 border-foreground shadow-shadow animate-float-reverse"
      />
      <motion.div
        style={{ scale: scale1, y: y2 }}
        className="absolute bottom-32 left-[20%] w-14 h-14 bg-chart-2 border-4 border-foreground shadow-shadow animate-float"
      />
      <motion.div
        style={{ scale: scale2, y: y1, rotate: rotate1 }}
        className="absolute bottom-40 right-[10%] w-18 h-18 bg-chart-5 border-4 border-foreground shadow-shadow animate-float-reverse"
      />
      {/* Triangle */}
      <motion.div
        style={{ scale: scale1, y: y1 }}
        className="absolute top-60 left-[5%] animate-float-reverse"
      >
        <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[52px] border-b-chart-3"
          style={{ filter: "drop-shadow(4px 4px 0px black)" }}
        />
      </motion.div>
      {/* Circle */}
      <motion.div
        style={{ scale: scale2, y: y2 }}
        className="absolute bottom-60 right-[8%] w-16 h-16 rounded-full bg-chart-3 border-4 border-foreground shadow-shadow animate-float"
      />

      {/* Main content */}
      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="flex justify-center gap-4 mb-8"
        >
          {[
            { color: "bg-chart-4", rotate: "rotate-12" },
            { color: "bg-chart-1", rotate: "-rotate-6" },
            { color: "bg-chart-3", rotate: "rotate-3" },
          ].map((block, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + i * 0.15, type: "spring", stiffness: 400 }}
              className={`w-16 h-16 ${block.color} border-4 border-foreground shadow-shadow ${block.rotate}`}
            />
          ))}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className="text-6xl md:text-8xl font-heading font-bold"
        >
          PeliFi
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-2xl md:text-3xl font-heading font-bold text-main"
        >
          No Loss. No Cheat. Just Luck.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-lg md:text-xl font-base max-w-2xl mx-auto"
        >
          Join a lottery pool where your funds generate yield. Winners share the yield, losers get their principal back intact.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 300 }}
          className="pt-8"
        >
          <button
            onClick={() => (window.location.href = "/app")}
            className="bg-main text-main-foreground text-xl font-heading font-bold px-12 py-5 border-4 border-foreground shadow-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
          >
            Launch App
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center gap-4 mt-12"
        >
          {[
            { color: "bg-chart-2", rotate: "-rotate-12" },
            { color: "bg-chart-5", rotate: "rotate-6" },
            { color: "bg-chart-4", rotate: "-rotate-3" },
          ].map((block, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3 + i * 0.1, type: "spring", stiffness: 400 }}
              className={`w-12 h-12 ${block.color} border-4 border-foreground shadow-shadow ${block.rotate}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
