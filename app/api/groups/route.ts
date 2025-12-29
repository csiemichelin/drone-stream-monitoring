import { NextResponse } from "next/server"
import { dataStore } from "@/lib/store"
import { getCurrentUser } from "@/lib/auth"
import type { NotificationGroup } from "@/lib/types"

export async function GET() {
  try {
    const groups = dataStore.getGroups()
    return NextResponse.json({ groups })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, favorite, members, notifyPhones, notifyEmails, notifyChannels } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const group: NotificationGroup = {
      id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description: description || "",
      favorite: favorite || false,
      members: members || [],
      notifyPhones: notifyPhones || [],
      notifyEmails: notifyEmails || [],
      notifyChannels: notifyChannels || [],
      createdBy: user.id,
      createdAt: new Date(),
    }

    dataStore.createGroup(group)

    return NextResponse.json({ group }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 })
  }
}
