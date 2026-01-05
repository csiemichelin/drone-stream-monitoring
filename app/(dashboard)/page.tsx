"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import React, { useEffect, useMemo, useState } from "react"
import { dataStore } from "@/lib/store"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ListTodo, Radio, Bell, AlertTriangle } from "lucide-react"

const Tai8D3SvgMap = dynamic(() => import("@/components/ui/tai8-d3svg-map"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-4 rounded-lg border bg-white/80 backdrop-blur-sm shadow-sm grid place-items-center text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
})

type Task = ReturnType<typeof dataStore.getTasks>[number]
type Stream = ReturnType<typeof dataStore.getStreams>[number]
type Alert = ReturnType<typeof dataStore.getAlerts>[number]

export default function OverviewPage() {
  // ✅ 先用空陣列，確保 server/client 第一次 render 一致
  const [tasks, setTasks] = useState<Task[]>([])
  const [streams, setStreams] = useState<Stream[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])

  // ✅ mount 後再從 dataStore 取資料
  useEffect(() => {
    setTasks(dataStore.getTasks())
    setStreams(dataStore.getStreams())
    setAlerts(dataStore.getAlerts())
  }, [])

  const runningTasks = useMemo(() => tasks.filter((t) => t.status === "running").length, [tasks])
  const onlineStreams = useMemo(() => streams.filter((s) => s.status === "online").length, [streams])
  const openAlerts = useMemo(() => alerts.filter((a) => a.status === "open").length, [alerts])
  const criticalAlerts = useMemo(
    () => alerts.filter((a) => a.severity === "critical" && a.status === "open").length,
    [alerts]
  )

  const recentAlerts = useMemo(() => alerts.slice(0, 5), [alerts])
  const runningTaskList = useMemo(() => tasks.filter((t) => t.status === "running").slice(0, 6), [tasks])
  const activeStreams = useMemo(() => streams.filter((s) => s.status === "online").slice(0, 4), [streams])

  const [showFullyBlocked, setShowFullyBlocked] = useState(true)
  const [showPartiallyBlocked, setShowPartiallyBlocked] = useState(true)
  const [showCctv, setShowCctv] = useState(true)
  const [showWeather, setShowWeather] = useState(true)
  const [zoomInSignal, setZoomInSignal] = useState(0)
  const [zoomOutSignal, setZoomOutSignal] = useState(0)
  const [mapMode, setMapMode] = useState<"topo" | "osm" | "county">("county")

  const fullyBtnVariant = showFullyBlocked ? "default" : "outline"
  const partialBtnVariant = showPartiallyBlocked ? "default" : "outline"
  const mapModeLabel = useMemo(() => {
    if (mapMode === "county") return "⬜ 灰白縣市底圖(GeoJSON)"
    if (mapMode === "osm") return "🗺️ 標準地圖(OSM)"
    return "⛰️ 地形圖(OpenTopoMap)"
  }, [mapMode])

  return (
    <div className="min-h-screen p-6 flex flex-col gap-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{runningTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">of {tasks.length} total tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Online Streams</CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{onlineStreams}</div>
            <p className="text-xs text-muted-foreground mt-1">of {streams.length} total streams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{openAlerts}</div>
            <p className="text-xs text-muted-foreground mt-1">{alerts.length} total alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{criticalAlerts}</div>
            <p className="text-xs text-muted-foreground mt-1">require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0">
        {/* Left column */}
        <div className="lg:col-span-1 flex flex-col space-y-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Active Tasks</CardTitle>
              <CardDescription>Currently running</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {runningTaskList.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No active tasks</p>
              ) : (
                runningTaskList.map((task) => (
                  <Link key={task.id} href={`/tasks/${task.id}`}>
                    <div className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium truncate">{task.name}</p>
                        <Badge variant="default" className="text-[10px]">
                          Running
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{task.description || "No description"}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Started: {task.startAt ? new Date(task.startAt).toLocaleString() : "N/A"}
                      </p>
                    </div>
                  </Link>
                ))
              )}
              <Link href="/tasks">
                <Button variant="outline" className="w-full mt-1 bg-transparent">
                  View All Tasks
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Active Streams</CardTitle>
              <CardDescription>Currently online</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeStreams.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No active streams</p>
              ) : (
                activeStreams.map((stream) => (
                  <Link key={stream.id} href={`/streams/${stream.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="relative w-16 h-10 bg-muted rounded overflow-hidden shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Radio className="h-5 w-5 text-muted-foreground" />
                        </div>
                        {stream.status === "online" && (
                          <Badge className="absolute top-1 left-1 text-[10px] bg-success live-pulse" variant="default">
                            LIVE
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{stream.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {stream.telemetry.lat?.toFixed(4)}, {stream.telemetry.lng?.toFixed(4)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{stream.stats.fps}fps</span>
                          <span className="text-xs text-muted-foreground">|</span>
                          <span className="text-xs text-muted-foreground">{stream.stats.latencyMs}ms</span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          stream.status === "online" ? "default" : stream.status === "degraded" ? "outline" : "secondary"
                        }
                      >
                        {stream.status}
                      </Badge>
                    </div>
                  </Link>
                ))
              )}
              <Link href="/streams">
                <Button variant="outline" className="w-full mt-1 bg-transparent">
                  View All Streams
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <CardTitle className="text-lg">Taiwan Command Map · Tai-8 Focus</CardTitle>
                <CardDescription>Monitor Provincial Highway 8 segments with filters</CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button variant={fullyBtnVariant} size="sm" onClick={() => setShowFullyBlocked((v) => !v)}>
                  Fully blocked
                </Button>
                <Button variant={partialBtnVariant} size="sm" onClick={() => setShowPartiallyBlocked((v) => !v)}>
                  Partially blocked
                </Button>
                <Button variant="outline" size="icon" onClick={() => setZoomInSignal((n) => n + 1)}>
                  +
                </Button>
                <Button variant="outline" size="icon" onClick={() => setZoomOutSignal((n) => n + 1)}>
                  -
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 min-h-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-white to-slate-100" />

              <div className="absolute inset-4 rounded-lg border bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-6 h-full">
                  {/* Filters panel */}
                  <div className="p-4 border-b md:border-b-0 md:border-r bg-white/90 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground">Filters</p>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={showFullyBlocked}
                          onChange={(e) => setShowFullyBlocked(e.target.checked)}
                        />
                        Fully blocked
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={showPartiallyBlocked}
                          onChange={(e) => setShowPartiallyBlocked(e.target.checked)}
                        />
                        Partially blocked
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={showCctv} onChange={(e) => setShowCctv(e.target.checked)} />
                        Live CCTV
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={showWeather} onChange={(e) => setShowWeather(e.target.checked)} />
                        Weather overlay
                      </label>
                    </div>

                  <div className="pt-2 text-[11px] text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-destructive" /> Landslide / Closed
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" /> Partial
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Clear
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-200/70 space-y-2">
                    <button
                      type="button"
                      onClick={() =>
                        setMapMode((mode) => (mode === "county" ? "osm" : mode === "osm" ? "topo" : "county"))
                      }
                      className="w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2 text-xs font-medium shadow-lg transition-colors hover:bg-slate-50"
                    >
                      🔁 切換底圖（灰白 → 標準 → 地形）
                    </button>

                    <div className="rounded-md border bg-white/90 px-3 py-2 text-[11px] text-slate-700 shadow">
                      目前：{mapModeLabel}
                    </div>
                  </div>
                </div>

                  {/* Map panel */}
                  <div className="md:col-span-5 relative">
                    <Tai8D3SvgMap
                      showFullyBlocked={showFullyBlocked}
                      showPartiallyBlocked={showPartiallyBlocked}
                      showCctv={showCctv}
                      showWeather={showWeather}
                      zoomInSignal={zoomInSignal}
                      zoomOutSignal={zoomOutSignal}
                      mapMode={mapMode}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
