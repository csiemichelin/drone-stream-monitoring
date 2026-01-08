"use client"

import Link from "next/link"
import { useLayoutEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { dataStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Radio, MapPin, Activity, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

const PAGE_SIZE = 3

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

export default function StreamsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const streams = dataStore.getStreams()

  const totalPages = Math.max(1, Math.ceil(streams.length / PAGE_SIZE))
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1),
  )

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pagedStreams = streams.slice(startIndex, startIndex + PAGE_SIZE)

  // ✅ 讓切頁後視窗停留在原本高度：以 pager 作為 anchor
  const pagerRef = useRef<HTMLDivElement | null>(null)
  const pendingAnchorTopRef = useRef<number | null>(null)

  const pushPage = (nextPage: number) => {
    const clamped = Math.min(totalPages, Math.max(1, nextPage))

    // 記錄 pager 在 viewport 的 top，導航後補回
    pendingAnchorTopRef.current = pagerRef.current?.getBoundingClientRect().top ?? null

    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(clamped))
    router.push(`?${params.toString()}`, { scroll: false })
  }

  useLayoutEffect(() => {
    const prevTop = pendingAnchorTopRef.current
    if (prevTop == null) return
    const nextTop = pagerRef.current?.getBoundingClientRect().top
    if (typeof nextTop !== "number") {
      pendingAnchorTopRef.current = null
      return
    }
    window.scrollBy(0, nextTop - prevTop)
    pendingAnchorTopRef.current = null
  }, [currentPage, pagedStreams.length])

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
        <div ref={pagerRef} className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
          <span>
            Showing {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, streams.length)} of {streams.length} streams
          </span>

          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => pushPage(1)}
              className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => pushPage(Math.max(1, currentPage - 1))}
              className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {getPageItems(currentPage, totalPages).map((item, index) =>
              item === "ellipsis" ? (
                <span key={`${item}-${index}`} className="px-2 text-slate-400">
                  …
                </span>
              ) : (
                <button
                  key={`${item}-${index}`}
                  type="button"
                  onClick={() => pushPage(item)}
                  className={`h-8 w-8 grid place-items-center rounded-full border ${
                    item === currentPage
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-blue-50"
                  }`}
                >
                  {item}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() => pushPage(Math.min(totalPages, currentPage + 1))}
              className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => pushPage(totalPages)}
              className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>

            <form
              className="flex items-center gap-2 text-xs text-muted-foreground"
              onSubmit={(e) => {
                e.preventDefault()
                const raw = (e.currentTarget.elements.namedItem("page") as HTMLInputElement | null)?.value ?? ""
                const target = Number.parseInt(raw, 10)
                if (Number.isNaN(target)) return
                pushPage(target)
              }}
            >
              <input
                name="page"
                type="number"
                min={1}
                max={totalPages}
                defaultValue={currentPage}
                className="w-16 rounded-md border border-slate-300 px-2 py-1 text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <span>of {streams.length} items</span>
              <button
                type="submit"
                className="rounded-md border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:bg-blue-50"
              >
                Go
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
