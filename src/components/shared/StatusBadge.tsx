import { PoolStatus } from "@/features/pool/types"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: PoolStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: PoolStatus) => {
    switch (status) {
      case "Open":
        return "bg-[#05E17A] text-black border-2 border-black"
      case "Active":
        return "bg-[#FACC00] text-black border-2 border-black"
      case "Completed":
        return "bg-[#0099FF] text-black border-2 border-black"
      case "Cancelled":
        return "bg-[#FF4D50] text-black border-2 border-black"
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full font-bold text-sm shadow-shadow",
        getStatusColor(status)
      )}
    >
      {status}
    </span>
  )
}
