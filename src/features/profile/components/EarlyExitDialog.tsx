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

interface EarlyExitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  poolId: number
  estimatedReturn: number
  onConfirm: (poolId: number) => void
}

export function EarlyExitDialog({
  open,
  onOpenChange,
  poolId,
  estimatedReturn,
  onConfirm,
}: EarlyExitDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = () => {
    setIsLoading(true)

    // Simulate blockchain transaction
    setTimeout(() => {
      onConfirm(poolId)
      toast.success(`${estimatedReturn.toFixed(2)} FLOW returned`)
      setIsLoading(false)
      onOpenChange(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-black shadow-shadow">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">Early Exit</DialogTitle>
          <DialogDescription>
            You will receive ~<FlowAmount amount={estimatedReturn} />. 50% penalty applies.
          </DialogDescription>
        </DialogHeader>

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
