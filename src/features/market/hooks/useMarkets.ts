"use client"

import { useState } from "react"
import { MOCK_POOLS } from "@/lib/mock-data"
import { MarketStatus } from "../types"

export function usePools() {
  const [filter, setFilter] = useState<MarketStatus | "All">("All")

  const filteredPools = filter === "All"
    ? MOCK_POOLS
    : MOCK_POOLS.filter(m => m.status === filter)

  return {
    pools: filteredPools,
    filter,
    setFilter,
  }
}
