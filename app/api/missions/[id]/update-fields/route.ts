import { NextResponse } from "next/server"
import { dataStore } from "@/lib/store"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const updates = await request.json()

  const mission = dataStore.updateMission(params.id, updates)

  if (!mission) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 })
  }

  return NextResponse.json({ mission })
}
