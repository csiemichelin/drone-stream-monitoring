import { NextResponse } from "next/server"
import { dataStore } from "@/lib/store"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const severity = searchParams.get("severity")
    const limit = searchParams.get("limit")

    const filters: any = {}
    if (status) filters.status = status.split(",")
    if (severity) filters.severity = severity.split(",")

    let alerts = dataStore.getAlerts(filters)

    if (limit) {
      alerts = alerts.slice(0, Number.parseInt(limit))
    }

    return NextResponse.json({ alerts })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}
