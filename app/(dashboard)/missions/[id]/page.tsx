import { dataStore } from "@/lib/store"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Pause, Square, Radio, AlertTriangle, MapPin } from "lucide-react"
import Link from "next/link"

interface MissionDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function MissionDetailPage({ params }: MissionDetailPageProps) {
  const { id } = await params
  const mission = dataStore.getMission(id)

  if (!mission) {
    notFound()
  }

  const streams = mission.boundStreamIds.map((sid) => dataStore.getStream(sid)).filter(Boolean)
  const groups = mission.notifyGroupIds.map((gid) => dataStore.getGroup(gid)).filter(Boolean)
  const alerts = dataStore.getAlerts({ missionId: id })
  const recentAlerts = alerts.slice(0, 10)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{mission.name}</h1>
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
              {mission.status}
            </Badge>
          </div>
          {mission.description && <p className="text-muted-foreground">{mission.description}</p>}
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2">
            <span>Created: {new Date(mission.createdAt).toLocaleString()}</span>
            {mission.startAt && <span>Started: {new Date(mission.startAt).toLocaleString()}</span>}
            {mission.endAt && <span>Ended: {new Date(mission.endAt).toLocaleString()}</span>}
          </div>
        </div>

        <div className="flex gap-2">
          {mission.status === "idle" && (
            <form action={`/api/missions/${mission.id}/start`} method="POST">
              <Button type="submit">
                <Play className="mr-2 h-4 w-4" />
                Start
              </Button>
            </form>
          )}
          {mission.status === "running" && (
            <>
              <form action={`/api/missions/${mission.id}/pause`} method="POST">
                <Button type="submit" variant="outline">
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
              </form>
              <form action={`/api/missions/${mission.id}/stop`} method="POST">
                <Button type="submit" variant="destructive">
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              </form>
            </>
          )}
          {mission.status === "paused" && (
            <>
              <form action={`/api/missions/${mission.id}/start`} method="POST">
                <Button type="submit">
                  <Play className="mr-2 h-4 w-4" />
                  Resume
                </Button>
              </form>
              <form action={`/api/missions/${mission.id}/stop`} method="POST">
                <Button type="submit" variant="destructive">
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{mission.metrics.alertCountTotal}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bound Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mission.boundStreamIds.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Notify Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mission.notifyGroupIds.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mission.startAt && mission.endAt
                ? `${Math.round((new Date(mission.endAt).getTime() - new Date(mission.startAt).getTime()) / 60000)}m`
                : mission.startAt
                  ? `${Math.round((Date.now() - new Date(mission.startAt).getTime()) / 60000)}m`
                  : "-"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Streams */}
        <Card>
          <CardHeader>
            <CardTitle>Bound Streams</CardTitle>
            <CardDescription>Streams monitored by this mission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {streams.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No bound streams</p>
            ) : (
              streams.map((stream) => (
                <Link key={stream.id} href={`/streams/${stream.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer">
                    <div className="relative w-20 h-12 bg-muted rounded overflow-hidden shrink-0">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Radio className="h-6 w-6 text-muted-foreground" />
                      </div>
                      {stream.status === "online" && (
                        <Badge className="absolute top-1 left-1 text-xs bg-success live-pulse" variant="default">
                          LIVE
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{stream.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {stream.telemetry.lat?.toFixed(4) ?? "0.0000"}, {stream.telemetry.lng?.toFixed(4) ?? "0.0000"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{stream.stats.fps ?? 0}fps</span>
                        <span className="text-xs text-muted-foreground">|</span>
                        <span className="text-xs text-muted-foreground">{stream.stats.latencyMs ?? 0}ms</span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        stream.status === "online"
                          ? "default"
                          : stream.status === "degraded"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {stream.status}
                    </Badge>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Notification Groups */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Groups</CardTitle>
            <CardDescription>Groups that receive alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {groups.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No notification groups configured</p>
            ) : (
              groups.map((group) => (
                <Link key={group.id} href={`/groups/${group.id}`}>
                  <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{group.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{group.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{group.members.length} members</span>
                        {group.notifyPhones.length > 0 && (
                          <>
                            <span className="text-xs text-muted-foreground">|</span>
                            <span className="text-xs text-muted-foreground">{group.notifyPhones.length} phones</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alert History */}
      <Card>
        <CardHeader>
          <CardTitle>Alert History</CardTitle>
          <CardDescription>Recent alerts from this mission</CardDescription>
        </CardHeader>
        <CardContent>
          {recentAlerts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No alerts yet</p>
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <AlertTriangle
                    className={`h-5 w-5 mt-0.5 ${
                      alert.severity === "critical"
                        ? "text-destructive"
                        : alert.severity === "warn"
                          ? "text-warning"
                          : "text-muted-foreground"
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
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
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{alert.reason}</p>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Confidence: {(alert.confidence * 100).toFixed(0)}%</span>
                      {alert.hasPeople && <span>People detected</span>}
                      {alert.hasVehicles && <span>Vehicles detected</span>}
                      {alert.interruption !== "none" && <span>Interruption: {alert.interruption}</span>}
                    </div>
                  </div>
                  <Badge variant={alert.status === "open" ? "default" : "secondary"}>{alert.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Telemetry */}
      {mission.currentTelemetry && (
        <Card>
          <CardHeader>
            <CardTitle>Current Telemetry</CardTitle>
            <CardDescription>Live drone position and movement data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mission.currentTelemetry.lat && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Latitude</p>
                    <p className="text-sm font-mono font-medium">{mission.currentTelemetry.lat.toFixed(6)}</p>
                  </div>
                </div>
              )}
              {mission.currentTelemetry.lng && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Longitude</p>
                    <p className="text-sm font-mono font-medium">{mission.currentTelemetry.lng.toFixed(6)}</p>
                  </div>
                </div>
              )}
              {mission.currentTelemetry.altitude && (
                <div>
                  <p className="text-xs text-muted-foreground">Altitude</p>
                  <p className="text-sm font-mono font-medium">{mission.currentTelemetry.altitude}m</p>
                </div>
              )}
              {mission.currentTelemetry.heading && (
                <div>
                  <p className="text-xs text-muted-foreground">Heading</p>
                  <p className="text-sm font-mono font-medium">{mission.currentTelemetry.heading} deg</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
