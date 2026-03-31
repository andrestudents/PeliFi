"use client"

import { useState } from "react"
import { UserPosition } from "@/features/profile/types"
import { Pool } from "@/features/pool/types"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { FlowAmount } from "@/components/shared/FlowAmount"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { EarlyExitDialog } from "./EarlyExitDialog"
import { ClaimButton } from "@/features/pool/components/ClaimButton"

interface PositionCardProps {
  position: UserPosition
  pool: Pool
  onEarlyExit: (poolId: number) => void
  onClaim: (poolId: number) => void
}

export function PositionCard({ position, pool, onEarlyExit, onClaim }: PositionCardProps) {
  const [isEarlyExitDialogOpen, setIsEarlyExitDialogOpen] = useState(false)

  return (
    <>
      <Card className="border-2 border-black shadow-shadow">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-heading font-bold flex-1">{pool.name}</h3>
            <div className="flex gap-2 items-center">
              {position.isWinner && position.poolStatus === "Completed" && (
                <span className="bg-[#FACC00] text-black border-2 border-black px-3 py-1 rounded-full font-bold text-sm shadow-shadow">
                  Winner
                </span>
              )}
              <StatusBadge status={position.poolStatus} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-bold">Principal:</span>{" "}
              <FlowAmount amount={position.principal} />
            </div>
            <div>
              <span className="font-bold">Return:</span>{" "}
              <FlowAmount amount={position.estimatedReturn} />
            </div>
            {position.isWinner && position.yieldAmount > 0 && (
              <div className="col-span-2">
                <span className="font-bold">Yield Won:</span>{" "}
                <span className="font-mono font-bold text-[#05E17A]">+{position.yieldAmount} FLOW</span>
              </div>
            )}
          </div>

          <div className="bg-secondary-background border-2 border-black p-3 rounded space-y-2 text-sm">
            <div className="font-bold mb-2">Pool Info:</div>
            <div className="flex justify-between">
              <span>Winners:</span>
              <span className="font-mono font-bold">{pool.winnerCount} from {pool.capacity}</span>
            </div>
            {/* <div className="flex justify-between">
              <span>Est. Yield if Winner:</span>
              <span className="font-mono font-bold">~{position.estimatedYieldIfWinner} FLOW</span>
            </div> */}
            <div className="bg-[#05E17A]/10 border border-[#05E17A] p-2 rounded text-center font-bold">
              zero loss guaranteed
            </div>
          </div>

          {position.poolStatus === "Open" && (
            <Button
              onClick={() => setIsEarlyExitDialogOpen(true)}
              className="w-full bg-[#FF4D50] text-white border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Exit
            </Button>
          )}

          {(position.poolStatus === "Completed" || position.poolStatus === "Cancelled") && (
            <ClaimButton poolId={position.poolId} onClaim={onClaim} />
          )}
        </CardContent>
      </Card>

      <EarlyExitDialog
        open={isEarlyExitDialogOpen}
        onOpenChange={setIsEarlyExitDialogOpen}
        poolId={position.poolId}
        principal={position.principal}
        onConfirm={onEarlyExit}
      />
    </>
  )
}
