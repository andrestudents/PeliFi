import { NextRequest, NextResponse } from "next/server"
import { Magic as MagicAdmin } from "@magic-sdk/admin"

const magicAdmin = new MagicAdmin(process.env.MAGIC_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { didToken } = await req.json()

    magicAdmin.token.validate(didToken)

    const metadata = await magicAdmin.users.getMetadataByToken(didToken)
    const flowAddress = (metadata as any).wallets?.flow?.publicAddress || metadata.publicAddress

    return NextResponse.json({
      address: flowAddress,
      email: metadata.email,
    })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
