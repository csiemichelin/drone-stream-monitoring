import { NextResponse } from "next/server"
import { dataStore } from "@/lib/store"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { assignee } = await request.json()

  const mission = dataStore.updateMission(params.id, { assignee })

  if (!mission) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 })
  }

  return NextResponse.json({ mission })
}
