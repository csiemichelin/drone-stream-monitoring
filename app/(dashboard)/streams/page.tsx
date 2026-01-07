import Link from "next/link"
import { dataStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Radio, MapPin, Activity } from "lucide-react"

const PAGE_SIZE = 9

function getPageItems(current: number, total: number) {
  const items: Array<number | "ellipsis"> = []
  if (total <= 7) {
    for (let i = 1; i <= total; i += 1) items.push(i)
    return items
  }
  items.push(1)
  if (current > 3) items.push("ellipsis")
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i += 1) items.push(i)
  if (current < total - 2) items.push("ellipsis")
  items.push(total)
  return items
}

export default function StreamsPage({ searchParams }: { searchParams?: { page?: string } }) {
  const streams = dataStore.getStreams()
  const totalPages = Math.max(1, Math.ceil(streams.length / PAGE_SIZE))
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Number.parseInt(searchParams?.page ?? "1", 10) || 1),
  )
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pagedStreams = streams.slice(startIndex, startIndex + PAGE_SIZE)

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

      {streams.length > PAGE_SIZE && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, streams.length)} of {streams.length} streams
          </span>
          <Pagination className="justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href={`?page=${Math.max(1, currentPage - 1)}`} />
              </PaginationItem>
              {getPageItems(currentPage, totalPages).map((item, index) => (
                <PaginationItem key={`${item}-${index}`}>
                  {item === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink href={`?page=${item}`} isActive={item === currentPage}>
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext href={`?page=${Math.min(totalPages, currentPage + 1)}`} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
