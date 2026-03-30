declare module "@onflow/fcl" {
  export function config(): any
  export function account(address: string): Promise<any>
  export function mutate(...args: any[]): Promise<any>
  export function tx(txId: string): any
  export const arg: any
  export const t: any
}
