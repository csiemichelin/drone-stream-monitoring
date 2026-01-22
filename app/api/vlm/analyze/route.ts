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
      // Find missions monitoring this stream
      const missions = dataStore.getMissions().filter((t) => t.boundStreamIds.includes(streamId) && t.status === "running")

      // Create alert for each mission
      for (const mission of missions) {
        const newAlert: Alert = {
          id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          missionId: mission.id,
          streamId,
          createdAt: new Date(),
          severity: analysis.severity,
          hazardType: analysis.hazardType,
          disaster_type: analysis.disaster_type,
          interruption: analysis.interruption,
          hasPeople: analysis.hasPeople,
          hasVehicles: analysis.hasVehicles,
          reason: analysis.reason,
          description: analysis.description,
          confidence: analysis.confidence,
          ai_summary: analysis.ai_summary,
          ai_reasoning: analysis.ai_reasoning,
          analysis_detail: analysis.analysis_detail,
          occurredAt: analysis.occurredAt,
          analysisRaw: analysis,
          status: "open",
          notifications: mission.notifyGroupIds.map((groupId) => ({
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
