import * as fcl from "@onflow/fcl"
import { ensureFclConfig } from "./flow-config"

const POOL_IDS = [3, 4, 5, 7]

// ── Scripts (read-only) ──────────────────────────────────────────────

const GET_MULTIPLE_POOLS = `
import PeliFi from 0xPeliFi
import PeliFiTypes from 0xPeliFiTypes

access(all) fun main(ids: [UInt64]): {UInt64: PeliFiTypes.PoolDetails} {
    let allDetails: {UInt64: PeliFiTypes.PoolDetails} = {}
    for id in ids {
        if let details = PeliFi.getPoolDetails(poolId: id) {
            allDetails[id] = details
        }
    }
    return allDetails
}
`

const GET_USER_POSITION = `
import PeliFi from 0xPeliFi
import PeliFiTypes from 0xPeliFiTypes

access(all) fun main(poolId: UInt64, user: Address): PeliFiTypes.UserPosition? {
    return PeliFi.getUserPosition(poolId: poolId, user: user)
}
`

// ── Query Functions ──────────────────────────────────────────────────

export interface ContractPoolDetails {
  poolId: string
  name: string
  capacity: string
  depositAmount: string
  activeDuration: string
  winnerCount: string
  status: string
  currentUserCount: string
  totalPrincipal: string
  createdAt: string
  activatedAt: string | null
  completedAt: string | null
  yieldAPR: string
  adminFeePercentage: string
}

export interface ContractUserPosition {
  user: string
  principal: string
  entryTime: string
  isWinner: boolean
  yieldAmount: string
  claimed: boolean
}

export async function fetchPools(): Promise<ContractPoolDetails[]> {
  ensureFclConfig()

  const result = await fcl.query({
    cadence: GET_MULTIPLE_POOLS,
    args: (arg: any, t: any) => [arg(POOL_IDS, t.Array(t.UInt64))],
  })

  // result is { "3": {...}, "4": {...}, ... }
  return Object.values(result || {})
}

export async function fetchUserPosition(
  poolId: number,
  userAddress: string
): Promise<ContractUserPosition | null> {
  ensureFclConfig()

  const result = await fcl.query({
    cadence: GET_USER_POSITION,
    args: (arg: any, t: any) => [arg(poolId, t.UInt64), arg(userAddress, t.Address)],
  })

  return result || null
}

export async function fetchUserPositions(
  poolIds: number[],
  userAddress: string
): Promise<{ poolId: number; position: ContractUserPosition }[]> {
  const results: { poolId: number; position: ContractUserPosition }[] = []

  for (const poolId of poolIds) {
    try {
      const position = await fetchUserPosition(poolId, userAddress)
      if (position) {
        results.push({ poolId, position })
      }
    } catch {
      // Skip if error
    }
  }

  return results
}
