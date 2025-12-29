import { NextResponse } from "next/server"
import { dataStore } from "@/lib/store"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const group = dataStore.getGroup(id)

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 })
  }

  return NextResponse.json({ group })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const updates = await request.json()

  const group = dataStore.updateGroup(id, updates)

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 })
  }

  return NextResponse.json({ group })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const deleted = dataStore.deleteGroup(id)

  if (!deleted) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
