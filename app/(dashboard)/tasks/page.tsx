/* eslint-disable react/no-unescaped-entities */
"use client"

import Link from "next/link"
import { useState } from "react"
import { dataStore, tai8AlertPoints } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PaginationControls, paginate } from "@/components/ui/pagination"
import { Plus, Play, Pause, Square, Radio, MapPin } from "lucide-react"

const PAGE_SIZE = 5

export default function TasksPage() {
  const tasks = dataStore.getTasks()
  const [page, setPage] = useState(1)

  const { safePage, startIndex, endIndex, totalPages } = paginate(tasks.length, PAGE_SIZE, page)
  const pagedTasks = tasks.slice(startIndex, endIndex)
  const alertPointById = new Map(tai8AlertPoints.map((point) => [point.id, point]))

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

      <PaginationControls
        totalItems={tasks.length}
        pageSize={PAGE_SIZE}
        page={safePage}
        onPageChange={setPage}
        itemLabel="tasks"
        jumpLabel={`of ${totalPages} pages`}
        preserveScroll
        visibleCount={pagedTasks.length}
      />
    </div>
  )
}
