"use client"

import { useState } from "react"
import { MOCK_INITIAL_POSITIONS } from "@/lib/mock-positions"
import { UserPosition } from "../types"

export function usePositions() {
  const [positions, setPositions] = useState<UserPosition[]>(MOCK_INITIAL_POSITIONS)

  const addPosition = (position: UserPosition) => {
    setPositions((prev) => [...prev, position])
  }

  const removePosition = (marketId: number) => {
    setPositions((prev) => prev.filter((p) => p.marketId !== marketId))
  }

  return {
    positions,
    addPosition,
    removePosition,
  }
}
