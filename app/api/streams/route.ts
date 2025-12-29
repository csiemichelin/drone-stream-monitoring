import { NextResponse } from "next/server"
import { dataStore } from "@/lib/store"
import type { Stream } from "@/lib/types"

export async function GET() {
  try {
    const streams = dataStore.getStreams()
    return NextResponse.json({ streams })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch streams" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, sourceUrl } = await request.json()

    if (!name || !sourceUrl) {
      return NextResponse.json({ error: "Name and RTSP URL are required" }, { status: 400 })
    }

    if (!sourceUrl.startsWith("rtsp://")) {
      return NextResponse.json({ error: "Only RTSP URLs are supported for manual add" }, { status: 400 })
    }

    const stream: Stream = {
      id: `stream-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      sourceType: "rtsp",
      sourceUrl,
      status: "online",
      lastSeenAt: new Date(),
      stats: { fps: 0, latencyMs: 0, bitrateKbps: 0 },
      telemetry: {},
      tags: ["custom"],
    }

    dataStore.createStream(stream)

    return NextResponse.json({ stream }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create stream" }, { status: 500 })
  }
}
