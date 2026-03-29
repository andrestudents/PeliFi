import { Market } from "@/features/market/types"
import { UserPosition } from "@/features/profile/types"
import { MarketCard } from "./MarketCard"

interface MarketGridProps {
  pools: Market[]
  userPositions: UserPosition[]
  onPlaceBet: (position: UserPosition) => void
  onClaim: (poolId: number) => void
}

export function MarketGrid({ pools, userPositions, onPlaceBet, onClaim }: MarketGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pools.map((pool) => {
        const userPosition = userPositions.find(p => p.marketId === pool.id)
        return (
          <MarketCard
            key={pool.id}
            pool={pool}
            userPosition={userPosition}
            onPlaceBet={onPlaceBet}
            onClaim={onClaim}
          />
        )
      })}
    </div>
  )
}
