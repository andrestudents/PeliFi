import { Magic } from "magic-sdk"
import { FlowExtension } from "@magic-ext/flow"

type MagicWithFlow = Magic & { flow: FlowExtension }

let magicInstance: MagicWithFlow | null = null

export function getMagic(): MagicWithFlow {
  if (typeof window === "undefined") {
    throw new Error("Magic hanya bisa dipakai di client side")
  }

  if (!magicInstance) {
    magicInstance = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY!, {
      extensions: [
        new FlowExtension({
          rpcUrl: process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE!,
          network: process.env.NEXT_PUBLIC_FLOW_NETWORK as "testnet" | "mainnet",
        }),
      ],
    }) as MagicWithFlow
  }

  return magicInstance
}
