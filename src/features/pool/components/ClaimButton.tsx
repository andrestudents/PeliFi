"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { sendClaimWithdraw, waitForTransaction } from "@/lib/flow-transactions"

interface ClaimButtonProps {
  poolId: number
  onClaim: (poolId: number) => void
}

export function ClaimButton({ poolId, onClaim }: ClaimButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClaim = async () => {
    setIsLoading(true)
    try {
      const txId = await sendClaimWithdraw(poolId)
      toast.loading("Claim submitted, waiting for confirmation...", { id: txId })

      await waitForTransaction(txId)
      toast.dismiss(txId)

      onClaim(poolId)
      toast.success("Principal & yield successfully claimed!")
    } catch (err: any) {
      console.error("Claim failed:", err)
      toast.error(err?.message || "Failed to claim. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleClaim}
      disabled={isLoading}
      className="w-full bg-[#0099FF] text-black border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
    >
      {isLoading ? "Processing..." : "Claim Withdraw"}
    </Button>
  )
}
