import { Pool } from "@/features/pool/types"
import { UserPosition } from "@/features/profile/types"
import { PoolCard } from "./PoolCard"

interface PoolGridProps {
  pools: Pool[]
  userPositions: UserPosition[]
  onPlaceBet: (position: UserPosition) => void
  onClaim: (poolId: number) => void
}

export function PoolGrid({ pools, userPositions, onPlaceBet, onClaim }: PoolGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pools.map((pool) => {
        const userPosition = userPositions.find(p => p.poolId === pool.id)
        return (
          <PoolCard
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
