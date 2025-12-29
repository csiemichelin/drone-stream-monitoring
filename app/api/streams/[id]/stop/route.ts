import { NextResponse } from "next/server"
import { dataStore } from "@/lib/store"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const stream = dataStore.updateStream(params.id, { status: "inactive" })

  if (!stream) {
    return NextResponse.json({ error: "Stream not found" }, { status: 404 })
  }

  return NextResponse.json({ stream })
}
