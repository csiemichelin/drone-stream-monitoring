import { NextResponse } from "next/server"
import { dataStore } from "@/lib/store"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { action, data } = await request.json()

  if (!["approve", "reject", "resolve", "snooze"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  const mission = dataStore.transitionMission(params.id, action, data)

  if (!mission) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 })
  }

  return NextResponse.json({ mission })
}
