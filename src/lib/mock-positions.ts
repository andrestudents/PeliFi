import { UserPosition } from "@/features/profile/types"

export const MOCK_INITIAL_POSITIONS: UserPosition[] = [
  {
    marketId: 0,
    side: "YES",
    principal_FLOW: 100,
    entryExchangeRate: 1.00,
    currentExchangeRate: 1.12,
    currentFLOWValue: 112,
    userYieldSoFar: 12,
    effectiveYieldRate: 0.12,
    estimatedPayoutIfWin: 130,
    estimatedPayoutIfLose: 100,
    estimatedWinBonus: 18,
    estimatedEarlyExit: 50,
    marketStatus: "Open",
  },
  {
    marketId: 2,
    side: "NO",
    principal_FLOW: 50,
    entryExchangeRate: 1.00,
    currentExchangeRate: 1.20,
    currentFLOWValue: 50,
    userYieldSoFar: 10,
    effectiveYieldRate: 0.20,
    estimatedPayoutIfWin: 0,
    estimatedPayoutIfLose: 50,
    estimatedWinBonus: 0,
    estimatedEarlyExit: 25,
    marketStatus: "Resolved",
  },
]
