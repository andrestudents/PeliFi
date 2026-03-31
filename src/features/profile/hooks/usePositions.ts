"use client"

import { useState, useEffect, useCallback } from "react"
import { UserPosition } from "../types"
import { fetchUserPositions, ContractUserPosition } from "@/lib/flow-scripts"
import { fetchPools, ContractPoolDetails } from "@/lib/flow-scripts"
import { useWallet } from "@/context/WalletContext"

function contractToPosition(
  poolId: number,
  pos: ContractUserPosition,
  poolDetails: ContractPoolDetails
): UserPosition {
  const totalPrincipal = Number(poolDetails.totalPrincipal)
  const winnerCount = Number(poolDetails.winnerCount)
  const activeDuration = Number(poolDetails.activeDuration)
  const yieldAPR = Number(poolDetails.yieldAPR)
  const adminFeePercentage = Number(poolDetails.adminFeePercentage)
  const depositAmount = Number(poolDetails.depositAmount)

  const statusMap: Record<number, UserPosition["poolStatus"]> = {
    0: "Open",
    1: "Active",
    2: "Completed",
    3: "Cancelled",
  }
  const poolStatus = statusMap[Number(poolDetails.status)] || "Open"

  // Estimate yield: (depositAmount * yieldAPR * activeDuration) / (365 days * winnerCount)
  const estimatedYieldIfWinner =
    (depositAmount * yieldAPR * activeDuration) / (365 * 24 * 3600 * winnerCount)

  const estimatedReturn = pos.isWinner
    ? Number(pos.principal) + Number(pos.yieldAmount)
    : Number(pos.principal)

  return {
    poolId,
    principal: Number(pos.principal),
    entryTime: Number(pos.entryTime),
    isWinner: pos.isWinner,
    yieldAmount: Number(pos.yieldAmount),
    claimed: pos.claimed,
    poolStatus,
    estimatedYieldIfWinner,
    estimatedReturn,
  }
}

export function usePositions() {
  const { address, isConnected } = useWallet()
  const [positions, setPositions] = useState<UserPosition[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadPositions = useCallback(async () => {
    if (!address || !isConnected) {
      setPositions([])
      return
    }

    setIsLoading(true)
    try {
      // Fetch pools to get pool details needed for yield estimation
      const contractPools = await fetchPools()
      const poolMap = new Map<number, ContractPoolDetails>()
      for (const p of contractPools) {
        poolMap.set(Number(p.poolId), p)
      }

      const poolIds = Array.from(poolMap.keys())
      const userPositions = await fetchUserPositions(poolIds, address)

      const mapped = userPositions
        .filter(({ position }) => !position.claimed)
        .map(({ poolId, position }) => {
          const poolDetails = poolMap.get(poolId)
          if (!poolDetails) return null
          return contractToPosition(poolId, position, poolDetails)
        })
        .filter((p): p is UserPosition => p !== null)

      setPositions(mapped)
    } catch (err) {
      console.error("Failed to fetch positions:", err)
    } finally {
      setIsLoading(false)
    }
  }, [address, isConnected])

  useEffect(() => {
    loadPositions()
  }, [loadPositions])

  const removePosition = (poolId: number) => {
    setPositions((prev) => prev.filter((p) => p.poolId !== poolId))
  }

  return {
    positions,
    isLoading,
    removePosition,
    refresh: loadPositions,
  }
}
