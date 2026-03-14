export type MarketStatus = "Open" | "Resolved" | "Cancelled"

export interface Market {
  id: number
  question: string
  status: MarketStatus
  totalYesPrincipal: number
  totalNoPrincipal: number
  totalTVL: number
  currentExchangeRate: number
  bettingDeadline: string | null
  winningSide: "YES" | "NO" | null
  yesOdds: number
  noOdds: number
}
