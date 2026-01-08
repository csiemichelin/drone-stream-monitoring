/* eslint-disable react/no-unescaped-entities */
"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { dataStore, tai8AlertPoints } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Play, Pause, Square, Radio, MapPin, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

const PAGE_SIZE = 5

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

export default function TasksPage() {
  const tasks = dataStore.getTasks()
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE))
  const safePage = Math.min(totalPages, Math.max(1, page))
  const startIndex = (safePage - 1) * PAGE_SIZE
  const pagedTasks = tasks.slice(startIndex, startIndex + PAGE_SIZE)
  const alertPointById = new Map(tai8AlertPoints.map((point) => [point.id, point]))

  useEffect(() => {
    if (page !== safePage) setPage(safePage)
  }, [page, safePage])

  // ✅ 讓切頁後視窗停留在原本高度：以 pager 作為 anchor
  const pagerRef = useRef<HTMLDivElement | null>(null)
  const pendingAnchorTopRef = useRef<number | null>(null)

  const handleSetPage = (next: number) => {
    // 在 setPage 前記錄 pager 在 viewport 的 top
    pendingAnchorTopRef.current = pagerRef.current?.getBoundingClientRect().top ?? null
    setPage(next)
  }

  useLayoutEffect(() => {
    const prevTop = pendingAnchorTopRef.current
    if (prevTop == null) return
    const nextTop = pagerRef.current?.getBoundingClientRect().top
    if (typeof nextTop !== "number") {
      pendingAnchorTopRef.current = null
      return
    }
    // 把 pager 拉回到原本的 viewport 高度
    window.scrollBy(0, nextTop - prevTop)
    pendingAnchorTopRef.current = null
  }, [safePage, pagedTasks.length])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage monitoring tasks and view their status</p>
        </div>
        <Link href="/tasks/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No tasks yet. Create your first monitoring task.</p>
              <Link href="/tasks/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          pagedTasks.map((task) => {
            const streams = task.boundStreamIds.map((id) => dataStore.getStream(id)).filter(Boolean)
            const groups = task.notifyGroupIds.map((id) => dataStore.getGroup(id)).filter(Boolean)
            const alertPointIds = task.metrics.alertPointIds ?? []
            let fullyBlockedCount = 0
            let partiallyBlockedCount = 0
            alertPointIds.forEach((pointId) => {
              const point = alertPointById.get(pointId)
              if (!point) return
              if (point.status === "fully_blocked") fullyBlockedCount += 1
              if (point.status === "partially_blocked") partiallyBlockedCount += 1
            })

            return (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{task.name}</CardTitle>
                        <Badge
                          variant={
                            task.status === "running"
                              ? "default"
                              : task.status === "ended"
                                ? "secondary"
                                : task.status === "paused"
                                  ? "outline"
                                  : "secondary"
                          }
                        >
                          {task.status === "running" && <Play className="mr-1 h-3 w-3" />}
                          {task.status === "paused" && <Pause className="mr-1 h-3 w-3" />}
                          {task.status === "ended" && <Square className="mr-1 h-3 w-3" />}
                          {task.status}
                        </Badge>
                      </div>
                      {task.description && <CardDescription className="text-sm">{task.description}</CardDescription>}
                    </div>
                    <Link href={`/tasks/${task.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Time Info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Created: </span>
                      <span className="font-medium">{new Date(task.createdAt).toLocaleString()}</span>
                    </div>
                    {task.startAt && (
                      <div>
                        <span className="text-muted-foreground">Started: </span>
                        <span className="font-medium">{new Date(task.startAt).toLocaleString()}</span>
                      </div>
                    )}
                    {task.endAt && (
                      <div>
                        <span className="text-muted-foreground">Ended: </span>
                        <span className="font-medium">{new Date(task.endAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Telemetry */}
                  {task.currentTelemetry && (task.currentTelemetry.lat || task.currentTelemetry.lng) && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Current Location:</span>
                      <span className="font-mono">
                        {task.currentTelemetry.lat?.toFixed(4)}, {task.currentTelemetry.lng?.toFixed(4)}
                        {task.currentTelemetry.altitude && ` @ ${task.currentTelemetry.altitude}m`}
                      </span>
                    </div>
                  )}

                  {/* Streams */}
                  <div>
                    <p className="text-sm font-medium mb-2 text-muted-foreground">Bound Streams ({streams.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {streams.map((stream) => {
                        const lastSeen = stream.lastSeenAt ? new Date(stream.lastSeenAt).toLocaleString() : "Unknown time"
                        return (
                          <Link key={stream.id} href={`/streams/${stream.id}`}>
                            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                              <Radio className="mr-1 h-3 w-3" />
                              <span className="font-medium">{stream.name}</span>
                              <span className="ml-1 text-[11px] text-muted-foreground">{lastSeen} (last seen)</span>
                            </Badge>
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  {/* Alert Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Alerts</p>
                      <p className="text-2xl font-bold text-primary">{task.metrics.alertCountTotal}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Full Interruptions</p>
                      <p className="text-2xl font-bold">{fullyBlockedCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Partial Interruptions</p>
                      <p className="text-2xl font-bold">{partiallyBlockedCount}</p>
                    </div>
                  </div>

                  {/* Notification Groups */}
                  {groups.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2 text-muted-foreground">
                        Notification Groups ({groups.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {groups.map((group) => (
                          <Badge key={group.id} variant="secondary">
                            {group.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {tasks.length > PAGE_SIZE && (
        <div ref={pagerRef} className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
          <span>
            Showing {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, tasks.length)} of {tasks.length} tasks
          </span>
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => handleSetPage(1)}
              className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleSetPage(Math.max(1, safePage - 1))}
              className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {getPageItems(safePage, totalPages).map((item, index) =>
              item === "ellipsis" ? (
                <span key={`${item}-${index}`} className="px-2 text-slate-400">
                  …
                </span>
              ) : (
                <button
                  key={`${item}-${index}`}
                  type="button"
                  onClick={() => handleSetPage(item)}
                  className={`h-8 w-8 grid place-items-center rounded-full border ${
                    item === safePage
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-blue-50"
                  }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => handleSetPage(Math.min(totalPages, safePage + 1))}
              className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleSetPage(totalPages)}
              className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>

            <form
              className="flex items-center gap-2 text-xs text-muted-foreground"
              onSubmit={(e) => {
                e.preventDefault()
                const target = Number.parseInt(
                  (e.currentTarget.elements.namedItem("jump") as HTMLInputElement).value,
                  10
                )
                if (Number.isNaN(target)) return
                const clamped = Math.min(totalPages, Math.max(1, target))
                handleSetPage(clamped)
              }}
            >
              <input
                name="jump"
                type="number"
                min={1}
                max={totalPages}
                className="w-16 rounded-md border border-slate-300 px-2 py-1 text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder={`${safePage}`}
              />
              <span>of {totalPages} pages</span>
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
