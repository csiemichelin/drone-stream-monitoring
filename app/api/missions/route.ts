import { NextResponse } from "next/server"
import { dataStore } from "@/lib/store"
import { getCurrentUser } from "@/lib/auth"
import type { Mission } from "@/lib/types"

export async function GET() {
  try {
    const missions = dataStore.getMissions()
    return NextResponse.json({ missions })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch missions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, boundStreamIds, notifyGroupIds } = await request.json()

    if (!name || !boundStreamIds || boundStreamIds.length === 0) {
      return NextResponse.json({ error: "Name and at least one stream are required" }, { status: 400 })
    }

    const mission: Mission = {
      id: `mission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      status: "idle",
      createdBy: user.id,
      createdAt: new Date(),
      startAt: new Date(),
      boundStreamIds,
      notifyGroupIds: notifyGroupIds || [],
      metrics: {
        alertCountTotal: 0,
      }
    }

    dataStore.createMission(mission)

    return NextResponse.json({ mission }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create mission" }, { status: 500 })
  }
}
