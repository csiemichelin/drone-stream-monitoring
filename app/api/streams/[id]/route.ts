import { NextResponse } from "next/server"
import { dataStore } from "@/lib/store"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const stream = dataStore.getStream(id)

  if (!stream) {
    return NextResponse.json({ error: "Stream not found" }, { status: 404 })
  }

  return NextResponse.json({ stream })
}
