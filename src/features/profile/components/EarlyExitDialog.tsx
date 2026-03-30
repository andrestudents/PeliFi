"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FlowAmount } from "@/components/shared/FlowAmount"
import { sendEarlyExit, waitForTransaction } from "@/lib/flow-transactions"

interface EarlyExitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  poolId: number
  principal: number
  onConfirm: (poolId: number) => void
}

export function EarlyExitDialog({
  open,
  onOpenChange,
  poolId,
  principal,
  onConfirm,
}: EarlyExitDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      const txId = await sendEarlyExit(poolId)
      const toastId = toast.loading("Early exit submitted, waiting for confirmation...")

      await waitForTransaction(txId)

      onConfirm(poolId)
      toast.success(`${principal.toFixed(2)} FLOW returned — full refund, no penalty`, { id: toastId })
      onOpenChange(false)
    } catch (err: any) {
      console.error("Early exit failed:", err)
      toast.error(err?.message || "Failed to exit pool. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-black shadow-shadow">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">Early Exit</DialogTitle>
          <DialogDescription>
            You will receive your full principal back — no penalty.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-secondary-background border-2 border-black p-3 rounded">
          <div className="flex justify-between items-center">
            <span className="font-bold">Return:</span>
            <FlowAmount amount={principal} />
          </div>
        </div>

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
            onClick={handleConfirm}
            className="flex-1 bg-[#FF4D50] text-white border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm Exit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
