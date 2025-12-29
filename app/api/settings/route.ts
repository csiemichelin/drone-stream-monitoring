import { NextResponse } from "next/server"
import { dataStore } from "@/lib/store"

export async function GET() {
  try {
    const settings = dataStore.getSettings()
    return NextResponse.json({ settings })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const updates = await request.json()
    const settings = dataStore.updateSettings(updates)
    return NextResponse.json({ settings })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
