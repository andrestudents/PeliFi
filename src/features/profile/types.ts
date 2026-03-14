import { MarketStatus } from "@/features/market/types"

export type Side = "YES" | "NO"

export interface UserPosition {
  marketId: number
  side: Side
  principal_FLOW: number
  entryExchangeRate: number
  currentExchangeRate: number
  currentFLOWValue: number
  userYieldSoFar: number
  effectiveYieldRate: number
  estimatedPayoutIfWin: number
  estimatedPayoutIfLose: number
  estimatedWinBonus: number
  estimatedEarlyExit: number
  marketStatus: MarketStatus
}
