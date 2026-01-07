import { NextResponse } from "next/server"
import { dataStore } from "@/lib/store"
import { getCurrentUser } from "@/lib/auth"
import type { Task } from "@/lib/types"

export async function GET() {
  try {
    const tasks = dataStore.getTasks()
    return NextResponse.json({ tasks })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
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

    const task: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      status: "idle",
      createdBy: user.id,
      createdAt: new Date(),
      boundStreamIds,
      notifyGroupIds: notifyGroupIds || [],
      metrics: {
        alertCountTotal: 0,
      }
    }

    dataStore.createTask(task)

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
