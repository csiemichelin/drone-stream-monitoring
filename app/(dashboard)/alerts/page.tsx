"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import type { Alert, Stream, Task } from "@/lib/types"
import Link from "next/link"

const PAGE_SIZE = 6

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

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [hazardFilter, setHazardFilter] = useState<string>("all")
  const [taskFilter, setTaskFilter] = useState<string>("all")
  const [streamFilter, setStreamFilter] = useState<string>("all")
  const [tasks, setTasks] = useState<Task[]>([])
  const [streams, setStreams] = useState<Stream[]>([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchAlerts()
  }, [riskFilter, hazardFilter, taskFilter, streamFilter])

  useEffect(() => {
    setPage(1)
  }, [riskFilter, hazardFilter, taskFilter, streamFilter])

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks || []))
      .catch(console.error)

    fetch("/api/streams")
      .then((res) => res.json())
      .then((data) => setStreams(data.streams || []))
      .catch(console.error)
  }, [])

  const fetchAlerts = () => {
    const params = new URLSearchParams()
    if (riskFilter === "high") params.append("severity", "critical")
    if (riskFilter === "medium") params.append("severity", "warn")
    if (hazardFilter !== "all") params.append("hazardType", hazardFilter)
    if (taskFilter !== "all") params.append("taskId", taskFilter)
    if (streamFilter !== "all") params.append("streamId", streamFilter)

    fetch(`/api/alerts?${params}`)
      .then((res) => res.json())
      .then((data) => setAlerts(data.alerts || []))
      .catch(console.error)
  }

  const stats = {
    total: alerts.length,
    full: alerts.filter((a) => a.interruption === "full").length,
    partial: alerts.filter((a) => a.interruption === "partial").length,
  }
  const totalPages = Math.max(1, Math.ceil(alerts.length / PAGE_SIZE))
  const safePage = Math.min(totalPages, Math.max(1, page))
  const startIndex = (safePage - 1) * PAGE_SIZE
  const pagedAlerts = alerts.slice(startIndex, startIndex + PAGE_SIZE)

  useEffect(() => {
    if (page !== safePage) setPage(safePage)
  }, [page, safePage])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alerts Center</h1>
        <p className="text-muted-foreground">Monitor and manage all system alerts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Full Interruptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{stats.full}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Partial Interruptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{stats.partial}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Risk:</label>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Type:</label>
            <Select value={hazardFilter} onValueChange={setHazardFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="obstacle">Obstacle</SelectItem>
                <SelectItem value="landslide">Landslide</SelectItem>
                <SelectItem value="rockfall">Rockfall</SelectItem>
                <SelectItem value="road_collapse">Road Collapse</SelectItem>
                <SelectItem value="flooding">Flooding</SelectItem>
                <SelectItem value="bridge_damage">Bridge Damage</SelectItem>
                <SelectItem value="tunnel_damage">Tunnel Damage</SelectItem>
                <SelectItem value="slope_failure">Slope Failure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Task:</label>
            <Select value={taskFilter} onValueChange={setTaskFilter}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                {tasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Stream:</label>
            <Select value={streamFilter} onValueChange={setStreamFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Streams</SelectItem>
                {streams.map((stream) => (
                  <SelectItem key={stream.id} value={stream.id}>
                    {stream.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(riskFilter !== "all" ||
            hazardFilter !== "all" ||
            taskFilter !== "all" ||
            streamFilter !== "all") && (
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => {
                setRiskFilter("all")
                setHazardFilter("all")
                setTaskFilter("all")
                setStreamFilter("all")
              }}
            >
              Clear Filters
            </button>
          )}
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-success mb-4" />
              <p className="text-muted-foreground">No alerts match your filters</p>
            </CardContent>
          </Card>
        ) : (
          pagedAlerts.map((alert) => (
            <Card key={alert.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-1 ${
                      alert.severity === "critical"
                        ? "text-destructive"
                        : alert.severity === "warn"
                          ? "text-warning"
                          : "text-muted-foreground"
                    }`}
                  >
                    <AlertTriangle className="h-6 w-6" />
                  </div>

                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex flex-wrap items-start gap-2">
                      <Badge
                        variant={
                          alert.severity === "critical"
                            ? "destructive"
                            : alert.severity === "warn"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline">{alert.hazardType.replace(/_/g, " ")}</Badge>
                      {alert.interruption !== "none" && (
                        <Badge variant={alert.interruption === "full" ? "destructive" : "outline"}>
                          {alert.interruption} interruption
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(alert.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <p className="font-semibold text-lg mb-1">{alert.reason}</p>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>Confidence: {(alert.confidence * 100).toFixed(0)}%</span>
                      {alert.hasPeople && <span>• People detected</span>}
                      {alert.hasVehicles && <span>• Vehicles detected</span>}
                      <span>
                        • Task:{" "}
                        <Link href={`/tasks/${alert.taskId}`} className="text-primary hover:underline">
                          View
                        </Link>
                      </span>
                      <span>
                        • Stream:{" "}
                        <Link href={`/streams/${alert.streamId}`} className="text-primary hover:underline">
                          View
                        </Link>
                      </span>
                    </div>

                    {/* Notifications */}
                    {alert.notifications.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Notified {alert.notifications.length} group{alert.notifications.length > 1 ? "s" : ""} via{" "}
                        {alert.notifications[0].channel}
                      </div>
                    )}

                  </div>

                  {/* Snapshot */}
                  {alert.snapshotUrl && (
                    <div className="w-32 h-20 bg-muted rounded overflow-hidden shrink-0">
                      <img
                        src={alert.snapshotUrl || "/placeholder.svg"}
                        alt="Alert snapshot"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {alerts.length > PAGE_SIZE && (
        <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
          <span>
            Showing {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, alerts.length)} of {alerts.length} alerts
          </span>
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => setPage(1)}
              className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage(Math.max(1, safePage - 1))}
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
                  onClick={() => setPage(item)}
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
              onClick={() => setPage(Math.min(totalPages, safePage + 1))}
              className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage(totalPages)}
              className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
            <form
              className="flex items-center gap-2 text-xs text-muted-foreground"
              onSubmit={(e) => {
                e.preventDefault()
                const target = Number.parseInt((e.currentTarget.elements.namedItem("jump") as HTMLInputElement).value, 10)
                if (Number.isNaN(target)) return
                const clamped = Math.min(totalPages, Math.max(1, target))
                setPage(clamped)
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
              <span>of {alerts.length} items</span>
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
