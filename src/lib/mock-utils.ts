import { Market } from "@/features/market/types"
import { Side } from "@/features/profile/types"

export interface PayoutEstimate {
  win: number
  lose: number
  earlyExit: number
}

export function estimatePayout(
  amount: number,
  side: Side,
  pool: Market,
  currentRate: number
): PayoutEstimate {
  // Calculate winner yield (yield from loser's side)
  const totalWinnerPrincipal = side === "YES" ? pool.totalYesPrincipal : pool.totalNoPrincipal
  const totalLoserPrincipal = side === "YES" ? pool.totalNoPrincipal : pool.totalYesPrincipal

  // Total yield in the pool = (TVL * currentRate) - TVL
  const totalYield = pool.totalTVL * currentRate - pool.totalTVL

  // Winner gets: their principal + their yield share + loser's yield share
  // Their yield share = (their principal / winner principal) * total yield
  // Loser yield share = (their principal / winner principal) * loser principal * yield rate
  const loserYield = totalLoserPrincipal * (currentRate - 1)

  const estimatedWin = amount * currentRate + (loserYield * amount / totalWinnerPrincipal)
  const estimatedLose = amount // Get principal back
  const estimatedEarlyExit = amount * 0.5 // 50% penalty

  return {
    win: Math.round(estimatedWin * 100) / 100,
    lose: Math.round(estimatedLose * 100) / 100,
    earlyExit: Math.round(estimatedEarlyExit * 100) / 100,
  }
}
