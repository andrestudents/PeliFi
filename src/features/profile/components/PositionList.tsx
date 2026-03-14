import { UserPosition } from "@/features/profile/types"
import { Market } from "@/features/market/types"
import { PositionCard } from "./PositionCard"

interface PositionListProps {
  positions: UserPosition[]
  markets: Market[]
  onEarlyExit: (marketId: number) => void
  onClaim: (marketId: number) => void
}

export function PositionList({ positions, markets, onEarlyExit, onClaim }: PositionListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {positions.map((position) => {
        const market = markets.find((m) => m.id === position.marketId)
        if (!market) return null

        return (
          <PositionCard
            key={position.marketId}
            position={position}
            market={market}
            onEarlyExit={onEarlyExit}
            onClaim={onClaim}
          />
        )
      })}
    </div>
  )
}
