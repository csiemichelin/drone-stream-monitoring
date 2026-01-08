"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { dataStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PaginationControls, paginate } from "@/components/ui/pagination"
import { Radio, MapPin, Activity } from "lucide-react"

const PAGE_SIZE = 3

export default function StreamsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const streams = dataStore.getStreams()

  const rawPage = Number.parseInt(searchParams.get("page") ?? "1", 10) || 1
  const { safePage, startIndex, endIndex } = paginate(streams.length, PAGE_SIZE, rawPage)
  const pagedStreams = streams.slice(startIndex, endIndex)

  // ✅ 讓切頁後視窗停留在原本高度：以 pager 作為 anchor
  const pushPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(nextPage))
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Streams</h1>
          <p className="text-muted-foreground">Monitor all drone video streams</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pagedStreams.map((stream) => (
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

      <PaginationControls
        totalItems={streams.length}
        pageSize={PAGE_SIZE}
        page={safePage}
        onPageChange={pushPage}
        itemLabel="streams"
        jumpLabel={`of ${streams.length} items`}
        preserveScroll
        visibleCount={pagedStreams.length}
      />
    </div>
  )
}
