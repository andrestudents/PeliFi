"use client"

import { useState } from "react"
import { MOCK_MARKETS } from "@/lib/mock-data"
import { MarketStatus } from "../types"

export function useMarkets() {
  const [filter, setFilter] = useState<MarketStatus | "All">("All")

  const filteredMarkets = filter === "All"
    ? MOCK_MARKETS
    : MOCK_MARKETS.filter(m => m.status === filter)

  return {
    markets: filteredMarkets,
    filter,
    setFilter,
  }
}
