import { MarketStatus } from "@/features/market/types"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: MarketStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: MarketStatus) => {
    switch (status) {
      case "Open":
        return "bg-[#05E17A] text-black border-2 border-black"
      case "Resolved":
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
