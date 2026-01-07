"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useMemo, useState } from "react"
import { dataStore } from "@/lib/store"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ListTodo, Radio, Bell, AlertTriangle, ArrowUpRight, Layers, CloudSun, HardHat } from "lucide-react"

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
  const [showWeather, setShowWeather] = useState(true)
  const [zoomInSignal, setZoomInSignal] = useState(0)
  const [zoomOutSignal, setZoomOutSignal] = useState(0)
  const [mapMode, setMapMode] = useState<"satellite" | "osm" | "county">("county")
  const nextMapMode = useMemo<"satellite" | "osm" | "county">(
    () => (mapMode === "county" ? "osm" : mapMode === "osm" ? "satellite" : "county"),
    [mapMode]
  )

  const fullyBtnVariant = showFullyBlocked ? "default" : "outline"
  const partialBtnVariant = showPartiallyBlocked ? "default" : "outline"
  const mapModeLabel = useMemo(() => {
    if (mapMode === "county") return "⬜ 行政區地圖"
    if (mapMode === "osm") return "🗺️ 標準地圖"
    return "🛰️ 衛星空拍圖"
  }, [mapMode])

  return (
    <div className="min-h-screen p-6 flex flex-col gap-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">當前任務</CardTitle>
            <span className="h-9 w-9 rounded-full bg-primary/20 text-primary grid place-items-center shadow-sm">
              <ListTodo className="h-5 w-5" />
            </span>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-3xl font-bold text-primary">{runningTasks}</div>
            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">筆巡檢任務執行中</p>
              <Link
                href="/tasks"
                className="group inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-primary"
              >
                <span className="underline-offset-2 group-hover:underline">查看更多</span>
                <ArrowUpRight className="h-4 w-4 transition-colors group-hover:text-primary" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">即時串流</CardTitle>
            <span className="h-9 w-9 rounded-full bg-success/20 text-success grid place-items-center shadow-sm">
              <Radio className="h-5 w-5" />
            </span>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-3xl font-bold text-success">{onlineStreams}</div>
            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">路巡檢影像串流接收中</p>
              <Link
                href="/streams"
                className="group inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-success"
              >
                <span className="underline-offset-2 group-hover:underline">查看更多</span>
                <ArrowUpRight className="h-4 w-4 transition-colors group-hover:text-success" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">異常偵測警示</CardTitle>
            <span className="h-9 w-9 rounded-full bg-warning/20 text-warning grid place-items-center shadow-sm">
              <Bell className="h-5 w-5" />
            </span>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-3xl font-bold text-warning">{openAlerts}</div>
            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">筆異常偵測警示（含中、高風險）</p>
              <Link
                href="/alerts"
                className="group inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-warning"
              >
                <span className="underline-offset-2 group-hover:underline">查看更多</span>
                <ArrowUpRight className="h-4 w-4 transition-colors group-hover:text-warning" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">高風險警示</CardTitle>
            <span className="h-9 w-9 rounded-full bg-destructive/20 text-destructive grid place-items-center shadow-sm">
              <AlertTriangle className="h-5 w-5" />
            </span>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-3xl font-bold text-destructive">{criticalAlerts}</div>
            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">筆高風險警示，需立即處理</p>
              <Link
                href="/alerts"
                className="group inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-destructive"
              >
                <span className="underline-offset-2 group-hover:underline">查看更多</span>
                <ArrowUpRight className="h-4 w-4 transition-colors group-hover:text-destructive" />
              </Link>
            </div>
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
              <div className="flex items-center gap-3">
                <Image
                  src="/icons/tai8_icon.png"
                  alt="台八線 Icon"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-md"
                  priority
                />
                <div>
                  <CardTitle className="text-lg">台八線 · 中部橫貫公路</CardTitle>
                  <CardDescription>道路中斷偵測</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 min-h-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-sky-50" />

              <div className="absolute inset-4 rounded-lg border bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-6 h-full">
                  {/* Filters panel */}
                  <div className="p-4 border-b md:border-b-0 md:border-r bg-white/90 space-y-3 flex flex-col h-full">
                    <div className="-mx-4 -mt-4 mb-3 flex items-center gap-2 bg-sky-700 px-4 py-2 text-xs font-semibold text-white">
                      <Layers className="h-4 w-4" />
                      <span>資訊篩選</span>
                    </div>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <button
                        type="button"
                        onClick={() => setShowFullyBlocked((v) => !v)}
                        className="flex w-full items-center gap-4 cursor-pointer select-none"
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                            showFullyBlocked ? "bg-red-600" : "bg-slate-300"
                          }`}
                        >
                          <Image
                            src="/icons/fully_blocked.png"
                            alt="完全阻斷"
                            width={36}
                            height={36}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        </span>
                        <span
                          className={`transition-colors ${
                            showFullyBlocked ? "font-semibold text-slate-900" : "text-slate-600"
                          }`}
                        >
                          完全阻斷
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPartiallyBlocked((v) => !v)}
                        className="flex w-full items-center gap-4 cursor-pointer select-none"
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                            showPartiallyBlocked ? "bg-amber-500" : "bg-slate-300"
                          }`}
                        >
                          <Image
                            src="/icons/partially_blocked.png"
                            alt="部分阻斷"
                            width={36}
                            height={36}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        </span>
                        <span
                          className={`transition-colors ${
                            showPartiallyBlocked ? "font-semibold text-slate-900" : "text-slate-600"
                          }`}
                        >
                          部分阻斷
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowWeather((v) => !v)}
                        className="flex w-full items-center gap-4 cursor-pointer select-none"
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors ${
                            showWeather ? "bg-sky-700" : "bg-slate-300"
                          }`}
                        >
                          <CloudSun className="h-5 w-5" />
                        </span>
                        <span
                          className={`text-slate-700 transition-colors ${
                            showWeather ? "font-semibold text-slate-900" : "text-slate-600"
                          }`}
                        >
                          天氣資訊
                        </span>
                      </button>
                    </div>
                  
                  <div className="pt-3 mt-2 border-t border-slate-200/70 space-y-2 mt-auto">
                    <div className="rounded-md border bg-white/90 px-3 py-2 text-[11px] text-slate-700 shadow">
                      目前：{mapModeLabel}
                    </div>
                    <button
                      type="button"
                      onClick={() => setMapMode(nextMapMode)}
                      className="w-full overflow-hidden rounded-md border-2 border-slate-300 bg-white shadow-lg transition hover:-translate-y-[1px] hover:shadow-xl active:translate-y-0"
                    >
                      <div className="relative h-28 w-full">
                        <Image
                          src={`/images/${nextMapMode}.jpg`}
                          alt={`${nextMapMode} preview`}
                          fill
                          className="object-cover"
                          sizes="100vw"
                          priority={nextMapMode === "satellite"}
                        />
                      </div>
                      <div className="border-t px-3 py-2 text-center text-xs font-semibold text-slate-700">
                        {nextMapMode === "satellite"
                          ? "下一個：衛星空拍圖"
                          : nextMapMode === "osm"
                          ? "下一個：標準地圖"
                          : "下一個：灰白底圖"}
                      </div>
                    </button>
                  </div>
                </div>

                  {/* Map panel */}
                  <div className="md:col-span-5 relative">
                    <Tai8D3SvgMap
                      showFullyBlocked={showFullyBlocked}
                      showPartiallyBlocked={showPartiallyBlocked}
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
