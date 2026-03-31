declare module "@onflow/fcl" {
  export function config(): any
  export function account(address: string): Promise<any>
  export function query(opts: { cadence: string; args?: (...args: any[]) => any[] }): Promise<any>
  export function mutate(opts: Record<string, any>): Promise<string>
  export function tx(txId: string): any
  export const arg: any
  export const t: any
}
