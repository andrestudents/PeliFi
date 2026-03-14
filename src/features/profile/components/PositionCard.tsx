"use client"

import { useState } from "react"
import { UserPosition } from "@/features/profile/types"
import { Market } from "@/features/market/types"
import { SideBadge } from "@/components/shared/SideBadge"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { FlowAmount } from "@/components/shared/FlowAmount"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { EarlyExitDialog } from "./EarlyExitDialog"
import { ClaimButton } from "@/features/market/components/ClaimButton"

interface PositionCardProps {
  position: UserPosition
  market: Market
  onEarlyExit: (marketId: number) => void
  onClaim: (marketId: number) => void
}

export function PositionCard({ position, market, onEarlyExit, onClaim }: PositionCardProps) {
  const [isEarlyExitDialogOpen, setIsEarlyExitDialogOpen] = useState(false)

  return (
    <>
      <Card className="border-2 border-black shadow-shadow">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-heading font-bold flex-1">{market.question}</h3>
            <div className="flex gap-2">
              <SideBadge side={position.side} />
              <StatusBadge status={position.marketStatus} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-bold">Principal:</span>{" "}
              <FlowAmount amount={position.principal_FLOW} />
            </div>
            <div>
              <span className="font-bold">Current Value:</span>{" "}
              <FlowAmount amount={position.currentFLOWValue} />
            </div>
            <div>
              <span className="font-bold">Yield:</span>{" "}
              <FlowAmount amount={position.userYieldSoFar} />
            </div>
            <div>
              <span className="font-bold">Rate:</span>{" "}
              <span className="font-mono font-bold">{(position.effectiveYieldRate * 100).toFixed(2)}%</span>
            </div>
          </div>

          <div className="bg-secondary-background border-2 border-black p-3 rounded space-y-1 text-sm">
            <div className="font-bold mb-2">Estimates:</div>
            <div className="flex justify-between">
              <span>If Win:</span>
              <FlowAmount amount={position.estimatedPayoutIfWin} />
            </div>
            <div className="flex justify-between">
              <span>If Lose:</span>
              <FlowAmount amount={position.estimatedPayoutIfLose} />
            </div>
            <div className="flex justify-between">
              <span>Early Exit:</span>
              <FlowAmount amount={position.estimatedEarlyExit} />
            </div>
          </div>

          {position.marketStatus === "Open" && (
            <Button
              onClick={() => setIsEarlyExitDialogOpen(true)}
              className="w-full bg-[#FF4D50] text-white border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Early Exit
            </Button>
          )}

          {position.marketStatus === "Resolved" && (
            <ClaimButton marketId={position.marketId} onClaim={onClaim} />
          )}
        </CardContent>
      </Card>

      <EarlyExitDialog
        open={isEarlyExitDialogOpen}
        onOpenChange={setIsEarlyExitDialogOpen}
        marketId={position.marketId}
        estimatedReturn={position.estimatedEarlyExit}
        onConfirm={onEarlyExit}
      />
    </>
  )
}
