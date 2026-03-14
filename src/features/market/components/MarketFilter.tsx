"use client"

import { MarketStatus } from "../types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MarketFilterProps {
  filter: MarketStatus | "All"
  onFilterChange: (filter: MarketStatus | "All") => void
}

export function MarketFilter({ filter, onFilterChange }: MarketFilterProps) {
  const filters: (MarketStatus | "All")[] = ["All", "Open", "Resolved", "Cancelled"]

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((f) => (
        <Button
          key={f}
          onClick={() => onFilterChange(f)}
          variant={filter === f ? "default" : "outline"}
          className={cn(
            "border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all",
            filter === f && "bg-main text-main-foreground"
          )}
        >
          {f}
        </Button>
      ))}
    </div>
  )
}
