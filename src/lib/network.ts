export enum Network {
  FLOW_MAINNET = "flow-mainnet",
  FLOW_TESTNET = "flow-testnet",
}

export const getNetworkUrl = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.FLOW_MAINNET:
      return "https://rest-mainnet.onflow.org"
    case Network.FLOW_TESTNET:
      return "https://rest-testnet.onflow.org"
    default:
      throw new Error("Network not supported")
  }
}

export const getNetwork = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.FLOW_MAINNET:
      return "mainnet"
    case Network.FLOW_TESTNET:
      return "testnet"
  }
}
