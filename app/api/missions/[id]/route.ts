import { NextResponse } from "next/server"
import { dataStore } from "@/lib/store"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const mission = dataStore.getMission(id)

  if (!mission) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 })
  }

  return NextResponse.json({ mission })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { startAt, ...updates } = await request.json()

  const mission = dataStore.updateMission(id, updates)

  if (!mission) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 })
  }

  return NextResponse.json({ mission })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const deleted = dataStore.deleteMission(id)

  if (!deleted) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
