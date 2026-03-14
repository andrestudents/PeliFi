import { Side } from "@/features/profile/types"
import { cn } from "@/lib/utils"

interface SideBadgeProps {
  side: Side
}

export function SideBadge({ side }: SideBadgeProps) {
  const getSideColor = (side: Side) => {
    switch (side) {
      case "YES":
        return "bg-[#05E17A] text-black border-2 border-black"
      case "NO":
        return "bg-[#FF4D50] text-black border-2 border-black"
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full font-bold text-sm shadow-shadow",
        getSideColor(side)
      )}
    >
      {side}
    </span>
  )
}
