import { NextResponse } from "next/server"
import { dataStore } from "@/lib/store"
import type { Alert } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const streamId = searchParams.get("streamId")

    if (!streamId) {
      return NextResponse.json({ error: "streamId is required" }, { status: 400 })
    }

    // Run VLM analysis
    const analysis = dataStore.analyzeFrame(streamId)
    const settings = dataStore.getSettings()

    // Check if should create alert
    const shouldAlert =
      (analysis.severity === "critical" || analysis.severity === "warn") &&
      analysis.confidence >= settings.thresholdConfidence

    let alert: Alert | null = null

    if (shouldAlert) {
      // Find tasks monitoring this stream
      const tasks = dataStore.getTasks().filter((t) => t.boundStreamIds.includes(streamId) && t.status === "running")

      // Create alert for each task
      for (const task of tasks) {
        const newAlert: Alert = {
          id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          taskId: task.id,
          streamId,
          createdAt: new Date(),
          severity: analysis.severity,
          hazardType: analysis.hazardType,
          interruption: analysis.interruption,
          hasPeople: analysis.hasPeople,
          hasVehicles: analysis.hasVehicles,
          reason: analysis.reason,
          description: analysis.description,
          confidence: analysis.confidence,
          occurredAt: analysis.occurredAt,
          analysisRaw: analysis,
          status: "open",
          notifications: task.notifyGroupIds.map((groupId) => ({
            groupId,
            sentAt: new Date(),
            channel: "demo-notification",
          })),
        }

        dataStore.createAlert(newAlert)
        if (!alert) alert = newAlert // Return first alert
      }
    }

    return NextResponse.json({ analysis, alert })
  } catch (error) {
    return NextResponse.json({ error: "Failed to analyze frame" }, { status: 500 })
  }
}
