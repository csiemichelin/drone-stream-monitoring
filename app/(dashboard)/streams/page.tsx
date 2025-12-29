import Link from "next/link"
import { dataStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Radio, MapPin, Activity } from "lucide-react"

export default function StreamsPage() {
  const streams = dataStore.getStreams()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Streams</h1>
          <p className="text-muted-foreground">Monitor all drone video streams</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {streams.map((stream) => (
          <Link key={stream.id} href={`/streams/${stream.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Radio className="h-12 w-12 text-muted-foreground" />
                </div>
                {stream.status === "online" && (
                  <Badge className="absolute top-2 left-2 bg-success live-pulse" variant="default">
                    LIVE
                  </Badge>
                )}
                <Badge
                  variant={
                    stream.status === "online" ? "default" : stream.status === "degraded" ? "outline" : "secondary"
                  }
                  className="absolute top-2 right-2"
                >
                  {stream.status}
                </Badge>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg mb-2 text-pretty">{stream.name}</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">{stream.location || "No location"}</span>
                  </div>

                  {stream.telemetry && (stream.telemetry.lat || stream.telemetry.lng) && (
                    <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span>
                        {stream.telemetry.lat?.toFixed(4)}, {stream.telemetry.lng?.toFixed(4)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Activity className="h-4 w-4" />
                      <span>{stream.stats.fps || 0} fps</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">|</span>
                      <span>{stream.stats.latencyMs || 0} ms latency</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">|</span>
                      <span>{stream.stats.bitrateKbps || 0} kbps bitrate</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {stream.sourceType.toUpperCase()}
                    </Badge>
                    {stream.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {streams.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Radio className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No streams available</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
