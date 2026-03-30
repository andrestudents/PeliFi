"use client"

import { useState } from "react"
import { Pool } from "@/features/pool/types"
import { UserPosition } from "@/features/profile/types"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { CapacityBar } from "@/components/shared/CapacityBar"
import { FlowAmount } from "@/components/shared/FlowAmount"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { JoinPoolDialog } from "./JoinPoolDialog"
import { ClaimButton } from "./ClaimButton"
import { formatDuration, estimateYieldIfWinner, getCapacityPercentage } from "@/lib/mock-utils"

interface PoolCardProps {
  pool: Pool
  userPosition?: UserPosition
  onPlaceBet: (position: UserPosition) => void
  onClaim: (poolId: number) => void
}

export function PoolCard({ pool, userPosition, onPlaceBet, onClaim }: PoolCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const hasPosition = !!userPosition
  const canJoin = pool.status === "Open" && !hasPosition
  const canClaim = (pool.status === "Completed" || pool.status === "Cancelled") && hasPosition

  const yieldPerWinner = estimateYieldIfWinner(
    pool.depositAmount,
    pool.totalPrincipal,
    pool.winnerCount,
    pool.activeDuration,
    pool.yieldAPR,
    pool.adminFeePercentage
  )

  return (
    <>
      <Card className="border-2 border-black shadow-shadow shadow-lg hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all h-full flex flex-col">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-heading font-bold flex-1 leading-tight">{pool.name}</h3>
            <StatusBadge status={pool.status} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 flex-1 flex flex-col">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-secondary-background border-2 border-black p-3 rounded">
              <div className="font-bold text-xs mb-1">Deposit</div>
              <FlowAmount amount={pool.depositAmount} />
            </div>
            <div className="bg-secondary-background border-2 border-black p-3 rounded">
              <div className="font-bold text-xs mb-1">Duration</div>
              <span className="font-mono font-bold">{formatDuration(pool.activeDuration)}</span>
            </div>
          </div>

          <CapacityBar current={pool.currentUserCount} capacity={pool.capacity} />

          <div className="bg-secondary-background border-2 border-black p-3 rounded space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Winners:</span>
              <span className="font-mono font-bold">{pool.winnerCount} dari {pool.capacity}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Locked:</span>
              <FlowAmount amount={pool.totalPrincipal} />
            </div>
            <div className="flex justify-between">
              <span>Est. Yield/Winner:</span>
              <span className="font-mono font-bold text-[#05E17A]">~{yieldPerWinner} FLOW</span>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            {hasPosition && (
              <div className="bg-[#FACC00] text-black border-2 border-black px-3 py-2 rounded-full font-bold text-center">
                Position Joined
              </div>
            )}

            {canJoin && (
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="w-full bg-[#05E17A] text-black border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all py-6 text-lg"
              >
                Join Pool
              </Button>
            )}

            {canClaim && (
              <ClaimButton poolId={pool.id} onClaim={onClaim} />
            )}
          </div>
        </CardContent>
      </Card>

      <JoinPoolDialog
        pool={pool}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onJoinPool={onPlaceBet}
      />
    </>
  )
}
