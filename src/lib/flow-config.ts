import * as fcl from "@onflow/fcl"
import { getNetworkUrl } from "./network"

let configured = false

export function ensureFclConfig() {
  if (configured) return
  configured = true

  const contractAddr = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string

  fcl.config()
    .put("accessNode.api", getNetworkUrl())
    .put("0xPeliFi", contractAddr)
    .put("0xPeliFiTypes", contractAddr)
}
