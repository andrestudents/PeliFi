interface FlowAmountProps {
  amount: number
}

export function FlowAmount({ amount }: FlowAmountProps) {
  const formatted = amount.toFixed(2)
  return <span className="font-mono font-bold">{formatted} FLOW</span>
}
