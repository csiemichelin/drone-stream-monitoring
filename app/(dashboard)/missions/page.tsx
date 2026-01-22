/* eslint-disable react/no-unescaped-entities */
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { dataStore, tai8AlertPoints } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { PaginationControls, paginate } from "@/components/ui/pagination"
import { Plus, Play, Pause, Square, Radio, MapPin, Search } from "lucide-react"

const PAGE_SIZE = 5

export default function MissionsPage() {
  const missions = dataStore.getMissions()
  const [page, setPage] = useState(1)
  const [startDateTime, setStartDateTime] = useState<Date | null>(() => new Date("2000-01-01T00:00:00Z"))
  const [endDateTime, setEndDateTime] = useState<Date | null>(() => new Date())
  const [rangeError, setRangeError] = useState<string | null>(null)

  const filteredMissions =
    rangeError == null
      ? missions.filter((mission) => {
          const created = new Date(mission.createdAt)
          if (startDateTime && created < startDateTime) return false
          if (endDateTime && created > endDateTime) return false
          return true
        })
      : []

  useEffect(() => {
    if (startDateTime && endDateTime && startDateTime > endDateTime) {
      setRangeError("Start time must be before end time")
    } else {
      setRangeError(null)
    }
    setPage(1)
  }, [startDateTime, endDateTime])

  const { safePage, startIndex, endIndex, totalPages } = paginate(filteredMissions.length, PAGE_SIZE, page)
  const pagedMissions = filteredMissions.slice(startIndex, endIndex)
  const alertPointById = new Map(tai8AlertPoints.map((point) => [point.id, point]))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Missions</h1>
          <p className="text-muted-foreground">Manage monitoring missions and view their status</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-full">
            <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-end sm:justify-between">
              {/* 左：Start/End */}
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">Start</span>
                  <DateTimePicker value={startDateTime} onChange={setStartDateTime} />
                </div>

                <span className="text-muted-foreground sm:pb-2">to</span>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">End</span>
                  <DateTimePicker value={endDateTime} onChange={setEndDateTime} />
                </div>
              </div>

              {/* 右：New Mission */}
              <Link href="/missions/new" className="sm:shrink-0">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Mission
                </Button>
              </Link>
            </CardContent>
          </div>
        </div>
      </div>

      {rangeError && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-3 text-sm text-destructive">{rangeError}</CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {missions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No missions yet. Create your first monitoring mission.</p>
              <Link href="/missions/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Mission
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : filteredMissions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-2">No missions in this date range.</p>
              <p className="text-xs text-muted-foreground">
                Adjust the dates to see missions created in that period.
              </p>
            </CardContent>
          </Card>
        ) : (
          pagedMissions.map((mission) => {
            const streams = mission.boundStreamIds.map((id) => dataStore.getStream(id)).filter(Boolean)
            const groups = mission.notifyGroupIds.map((id) => dataStore.getGroup(id)).filter(Boolean)
            const alertPointIds = mission.metrics.alertPointIds ?? []
            let fullyBlockedCount = 0
            let partiallyBlockedCount = 0
            alertPointIds.forEach((pointId) => {
              const point = alertPointById.get(pointId)
              if (!point) return
              if (point.status === "fully_blocked") fullyBlockedCount += 1
              if (point.status === "partially_blocked") partiallyBlockedCount += 1
            })

            return (
              <Card key={mission.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{mission.name}</CardTitle>
                        <Badge
                          variant={
                            mission.status === "running"
                              ? "default"
                              : mission.status === "ended"
                                ? "secondary"
                                : mission.status === "paused"
                                  ? "outline"
                                  : "secondary"
                          }
                        >
                          {mission.status === "running" && <Play className="mr-1 h-3 w-3" />}
                          {mission.status === "paused" && <Pause className="mr-1 h-3 w-3" />}
                          {mission.status === "ended" && <Square className="mr-1 h-3 w-3" />}
                          {mission.status}
                        </Badge>
                      </div>
                      {mission.description && <CardDescription className="text-sm">{mission.description}</CardDescription>}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/missions/${mission.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/missions/${mission.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Time Info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Created: </span>
                      <span className="font-medium">{new Date(mission.createdAt).toLocaleString()}</span>
                    </div>
                    {mission.startAt && (
                      <div>
                        <span className="text-muted-foreground">Started: </span>
                        <span className="font-medium">{new Date(mission.startAt).toLocaleString()}</span>
                      </div>
                    )}
                    {mission.endAt && (
                      <div>
                        <span className="text-muted-foreground">Ended: </span>
                        <span className="font-medium">{new Date(mission.endAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Telemetry */}
                  {mission.currentTelemetry && (mission.currentTelemetry.lat || mission.currentTelemetry.lng) && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Current Location:</span>
                      <span className="font-mono">
                        {mission.currentTelemetry.lat?.toFixed(4)}, {mission.currentTelemetry.lng?.toFixed(4)}
                        {mission.currentTelemetry.altitude && ` @ ${mission.currentTelemetry.altitude}m`}
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
                      <p className="text-2xl font-bold text-primary">{mission.metrics.alertCountTotal}</p>
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
        totalItems={filteredMissions.length}
        pageSize={PAGE_SIZE}
        page={safePage}
        onPageChange={setPage}
        itemLabel="missions"
        jumpLabel={`of ${totalPages} pages`}
        preserveScroll
        visibleCount={pagedMissions.length}
      />
    </div>
  )
}
