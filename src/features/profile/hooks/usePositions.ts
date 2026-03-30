"use client"

import { useState } from "react"
import { MOCK_INITIAL_POSITIONS } from "@/lib/mock-positions"
import { UserPosition } from "../types"

export function usePositions() {
  const [positions, setPositions] = useState<UserPosition[]>(MOCK_INITIAL_POSITIONS)

  const addPosition = (position: UserPosition) => {
    setPositions((prev) => [...prev, position])
  }

  const removePosition = (poolId: number) => {
    setPositions((prev) => prev.filter((p) => p.poolId !== poolId))
  }

  return {
    positions,
    addPosition,
    removePosition,
  }
}
