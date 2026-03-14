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
  market: Market,
  currentRate: number
): PayoutEstimate {
  // Calculate winner yield (yield from loser's side)
  const totalWinnerPrincipal = side === "YES" ? market.totalYesPrincipal : market.totalNoPrincipal
  const totalLoserPrincipal = side === "YES" ? market.totalNoPrincipal : market.totalYesPrincipal

  // Total yield in the market = (TVL * currentRate) - TVL
  const totalYield = market.totalTVL * currentRate - market.totalTVL

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
