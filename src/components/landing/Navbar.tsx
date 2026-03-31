"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

const navItems = ["How it Works", "Features"]

export function Navbar() {
  const [active, setActive] = useState<string | null>(null)

  const scrollTo = (id: string) => {
    const el = document.getElementById(id.toLowerCase().replace(/\s/g, "-"))
    el?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background border-b-4 border-foreground"
    >
      <div className="w-[80%] mx-auto flex items-center justify-between h-16">
        <motion.span
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <Image src="/logo.png" alt="PeliFi" width={32} height={32} className="rounded" />
          <span className="font-heading text-2xl font-bold">PeliFi</span>
        </motion.span>

        <div className="flex gap-3">
          {navItems.map((item) => (
            <motion.button
              key={item}
              onClick={() => {
                setActive(item)
                scrollTo(item)
              }}
              className={`px-5 py-2 font-base font-semibold border-4 border-foreground shadow-shadow transition-all ${active === item
                ? "bg-main translate-x-[2px] translate-y-[2px]"
                : "bg-chart-3 hover:translate-x-[2px] hover:translate-y-[2px]"
                }`}
              whileTap={{ scale: 0.95 }}
              style={
                active === item
                  ? { boxShadow: "none" }
                  : { boxShadow: "var(--shadow)" }
              }
            >
              {item}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => (window.location.href = "/app")}
          className="px-6 py-2 bg-main font-base font-bold border-4 border-foreground shadow-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          Launch App
        </motion.button>
      </div>
    </motion.nav>
  )
}
