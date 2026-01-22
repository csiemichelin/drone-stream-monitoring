import { NextResponse } from "next/server"
import { dataStore } from "@/lib/store"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const mission = dataStore.startMission(id)

  if (!mission) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 })
  }

  return NextResponse.json({ mission })
}
