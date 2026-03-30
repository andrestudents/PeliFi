"use client"

import { useState, useEffect } from "react"
import { Pool } from "@/features/pool/types"
import { DurationCategory } from "@/lib/mock-utils"
import { fetchPools, ContractPoolDetails } from "@/lib/flow-scripts"

export type PoolTab = "All" | DurationCategory

function contractToPool(details: ContractPoolDetails): Pool {
  return {
    id: Number(details.poolId),
    name: details.name,
    status: mapStatus(Number(details.status)),
    capacity: Number(details.capacity),
    currentUserCount: Number(details.currentUserCount),
    depositAmount: Number(details.depositAmount),
    activeDuration: Number(details.activeDuration),
    winnerCount: Number(details.winnerCount),
    totalPrincipal: Number(details.totalPrincipal),
    yieldAPR: Number(details.yieldAPR),
    adminFeePercentage: Number(details.adminFeePercentage),
    createdAt: Number(details.createdAt),
    activatedAt: details.activatedAt ? Number(details.activatedAt) : null,
    completedAt: details.completedAt ? Number(details.completedAt) : null,
  }
}

function mapStatus(status: number): Pool["status"] {
  switch (status) {
    case 0: return "Open"
    case 1: return "Active"
    case 2: return "Completed"
    case 3: return "Cancelled"
    default: return "Open"
  }
}

export function usePools() {
  const [tab, setTab] = useState<PoolTab>("All")
  const [pools, setPools] = useState<Pool[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPools()
  }, [])

  const loadPools = async () => {
    setIsLoading(true)
    try {
      const contractPools = await fetchPools()
      const mapped = contractPools.map(contractToPool)
      setPools(mapped)
    } catch (err) {
      console.error("Failed to fetch pools:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPools = tab === "All"
    ? pools
    : pools.filter(p => {
        if (tab === "Weekly") return p.winnerCount <= 5
        if (tab === "Monthly") return p.winnerCount > 5 && p.winnerCount <= 10
        if (tab === "Yearly") return p.winnerCount > 10
        return false
      })

  return {
    pools: filteredPools,
    allPools: pools,
    tab,
    setTab,
    isLoading,
    refresh: loadPools,
  }
}
