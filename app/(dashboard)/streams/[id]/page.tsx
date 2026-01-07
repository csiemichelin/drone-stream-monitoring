"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { StreamPlayer } from "@/components/streams/stream-player"
import { InspectorPanel } from "@/components/streams/inspector-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { Stream, Alert, VLMAnalysisResult } from "@/lib/types"

export default function StreamDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const streamId = params.id as string

  const [stream, setStream] = useState<Stream | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [latestAnalysis, setLatestAnalysis] = useState<VLMAnalysisResult | null>(null)

  useEffect(() => {
    // Fetch stream data
    fetch(`/api/streams/${streamId}`)
      .then((res) => res.json())
      .then((data) => setStream(data.stream))
      .catch(console.error)

    // Fetch alerts
    fetch(`/api/alerts?streamId=${streamId}`)
      .then((res) => res.json())
      .then((data) => setAlerts(data.alerts || []))
      .catch(console.error)

    // Simulate VLM analysis every 10 seconds
    const interval = setInterval(() => {
      fetch(`/api/vlm/analyze?streamId=${streamId}`)
        .then((res) => res.json())
        .then((data) => {
          setLatestAnalysis(data.analysis)

          // If it's an alert, show toast
          if (data.alert) {
            toast({
              title: `Alert: ${data.alert.hazardType.replace(/_/g, " ")}`,
              description: data.alert.description,
              variant: data.alert.severity === "critical" ? "destructive" : "default",
            })

            // Refresh alerts
            fetch(`/api/alerts?streamId=${streamId}`)
              .then((res) => res.json())
              .then((data) => setAlerts(data.alerts || []))
              .catch(console.error)
          }
        })
        .catch(console.error)
    }, 10000)

    return () => clearInterval(interval)
  }, [streamId, toast])

  const handleCapture = (dataUrl: string) => {
    toast({
      title: "Screenshot captured",
      description: "Frame has been saved",
    })
    console.log("[v0] Captured screenshot:", dataUrl.substring(0, 50))
  }

  if (!stream) {
    return (
      <div className="p-6">
        <p>Loading stream...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row">
      {/* Left Sidebar - Stream Info (desktop only) */}
      <div className="hidden lg:block lg:w-64 lg:border-r bg-card p-4">
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Stream Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Source Type</p>
              <Badge variant="outline" className="mt-1">
                {stream.sourceType.toUpperCase()}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
              <Badge
                variant={
                  stream.status === "online" ? "default" : stream.status === "degraded" ? "outline" : "secondary"
                }
                className="mt-1"
              >
                {stream.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Tags</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {stream.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">FPS</span>
              <span className="font-medium">{stream.stats.fps || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Latency</span>
              <span className="font-medium">{stream.stats.latencyMs || 0} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bitrate</span>
              <span className="font-medium">{stream.stats.bitrateKbps || 0} kbps</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Center - Video Player (mobile first) */}
      <div className="order-1 w-full lg:order-2 lg:flex-1 p-4 lg:p-6">
        <StreamPlayer stream={stream} onCapture={handleCapture} />
      </div>

      {/* Right Sidebar - Inspector (after video on mobile) */}
      <div className="order-2 w-full lg:order-3 lg:w-96 lg:border-l bg-card">
        <div className="p-4 lg:h-full">
          <InspectorPanel alerts={alerts} latestAnalysis={latestAnalysis} />
        </div>
      </div>
    </div>
  )
}
