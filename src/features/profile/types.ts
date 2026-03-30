import { PoolStatus } from "@/features/pool/types"

export interface UserPosition {
  poolId: number
  principal: number
  entryTime: number
  isWinner: boolean
  yieldAmount: number
  claimed: boolean
  poolStatus: PoolStatus
  estimatedYieldIfWinner: number
  estimatedReturn: number
}
