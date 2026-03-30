import { Magic as MagicBase } from "magic-sdk"
import { FlowExtension } from "@magic-ext/flow"
import * as fcl from "@onflow/fcl"
import { getNetworkUrl, getNetwork } from "./network"

export type Magic = MagicBase<FlowExtension[]>

let magicInstance: Magic | null = null

export function getMagic(): Magic {
  if (typeof window === "undefined") {
    throw new Error("Magic hanya bisa dipakai di client side")
  }

  if (!magicInstance) {
    magicInstance = new MagicBase(
      process.env.NEXT_PUBLIC_MAGIC_API_KEY as string,
      {
        extensions: [
          new FlowExtension({
            rpcUrl: getNetworkUrl(),
            network: getNetwork() as string,
          }),
        ],
      }
    )

    fcl.config().put("accessNode.api", getNetworkUrl())
  }

  return magicInstance
}
