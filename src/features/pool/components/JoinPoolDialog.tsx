"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Pool } from "@/features/pool/types"
import { UserPosition } from "@/features/profile/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FlowAmount } from "@/components/shared/FlowAmount"
import { formatDuration, estimateYieldIfWinner } from "@/lib/mock-utils"
import { sendJoinPool, waitForTransaction } from "@/lib/flow-transactions"

interface JoinPoolDialogProps {
  pool: Pool
  open: boolean
  onOpenChange: (open: boolean) => void
  onJoinPool: (position: UserPosition) => void
}

export function JoinPoolDialog({ pool, open, onOpenChange, onJoinPool }: JoinPoolDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const yieldPerWinner = estimateYieldIfWinner(
    pool.depositAmount,
    pool.totalPrincipal,
    pool.winnerCount,
    pool.activeDuration,
    pool.yieldAPR,
    pool.adminFeePercentage
  )

  const handleJoinPool = async () => {
    setIsLoading(true)
    try {
      const txId = await sendJoinPool(pool.id, pool.depositAmount)
      const toastId = toast.loading("Transaction submitted, waiting for confirmation...")

      await waitForTransaction(txId)

      const newPosition: UserPosition = {
        poolId: pool.id,
        principal: pool.depositAmount,
        entryTime: Date.now() / 1000,
        isWinner: false,
        yieldAmount: 0,
        claimed: false,
        poolStatus: "Open",
        estimatedYieldIfWinner: yieldPerWinner,
        estimatedReturn: pool.depositAmount,
      }

      onJoinPool(newPosition)
      toast.success("Successfully joined pool!", { id: toastId })
      onOpenChange(false)
    } catch (err: any) {
      console.error("Join pool failed:", err)
      toast.error(err?.message || "Failed to join pool. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-black shadow-shadow">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">Join Pool</DialogTitle>
          <DialogDescription className="font-bold text-lg">{pool.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Fixed Deposit Info */}
          <div className="bg-secondary-background border-2 border-black p-4 rounded space-y-2 text-sm">
            <div className="font-bold mb-2">Pool Info:</div>
            <div className="flex justify-between">
              <span>Fixed Deposit:</span>
              <FlowAmount amount={pool.depositAmount} />
            </div>
            <div className="flex justify-between">
              <span>Duration Closed:</span>
              <span className="font-mono font-bold">{formatDuration(pool.activeDuration)}</span>
            </div>
            <div className="flex justify-between">
              <span>Capacity:</span>
              <span className="font-mono font-bold">{pool.currentUserCount}/{pool.capacity} users</span>
            </div>
            <div className="flex justify-between">
              <span>Winners:</span>
              <span className="font-mono font-bold">{pool.winnerCount}</span>
            </div>
            <div className="flex justify-between">
              <span>APR:</span>
              <span className="font-mono font-bold">{(pool.yieldAPR * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* Yield Estimate */}
          <div className="bg-[#05E17A]/10 border-2 border-[#05E17A] p-4 rounded space-y-2 text-sm">
            <div className="font-bold mb-2">Estimated Yield if Winner:</div>
            <span className="font-mono font-bold text-[#05E17A]">COMING SOON</span>

            {/* <div className="flex justify-between">
              <span>Principal Return:</span>
              <FlowAmount amount={pool.depositAmount} />
            </div> */}
          </div>

          {/* Lossless Message */}
          <div className="bg-secondary-background border-2 border-black p-3 rounded text-center text-sm font-bold">
            Your principal always comes back intact — zero loss guaranteed.
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoinPool}
              className="flex-1 bg-main text-main-foreground border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Join Pool"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
