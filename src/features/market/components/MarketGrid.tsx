import { Market } from "@/features/market/types"
import { UserPosition } from "@/features/profile/types"
import { MarketCard } from "./MarketCard"

interface MarketGridProps {
  markets: Market[]
  userPositions: UserPosition[]
  onPlaceBet: (position: UserPosition) => void
  onClaim: (marketId: number) => void
}

export function MarketGrid({ markets, userPositions, onPlaceBet, onClaim }: MarketGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {markets.map((market) => {
        const userPosition = userPositions.find(p => p.marketId === market.id)
        return (
          <MarketCard
            key={market.id}
            market={market}
            userPosition={userPosition}
            onPlaceBet={onPlaceBet}
            onClaim={onClaim}
          />
        )
      })}
    </div>
  )
}
