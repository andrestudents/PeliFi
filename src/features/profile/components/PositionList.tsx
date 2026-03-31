import { UserPosition } from "@/features/profile/types"
import { Pool } from "@/features/pool/types"
import { PositionCard } from "./PositionCard"

interface PositionListProps {
  positions: UserPosition[]
  pools: Pool[]
  onEarlyExit: (poolId: number) => void
  onClaim: (poolId: number) => void
}

export function PositionList({ positions, pools, onEarlyExit, onClaim }: PositionListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {positions.map((position) => {
        const pool = pools.find((m) => m.id === position.poolId)
        if (!pool) return null

        return (
          <PositionCard
            key={position.poolId}
            position={position}
            pool={pool}
            onEarlyExit={onEarlyExit}
            onClaim={onClaim}
          />
        )
      })}
    </div>
  )
}
