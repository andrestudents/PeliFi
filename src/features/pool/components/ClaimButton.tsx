"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface ClaimButtonProps {
  poolId: number
  onClaim: (poolId: number) => void
}

export function ClaimButton({ poolId, onClaim }: ClaimButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClaim = () => {
    setIsLoading(true)

    setTimeout(() => {
      onClaim(poolId)
      toast.success("Principal & yield successfully claimed!")
      setIsLoading(false)
    }, 1500)
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
