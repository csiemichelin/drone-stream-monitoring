import { dataStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ListTodo, Radio, Bell, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function OverviewPage() {
  const tasks = dataStore.getTasks()
  const streams = dataStore.getStreams()
  const alerts = dataStore.getAlerts()

  const runningTasks = tasks.filter((t) => t.status === "running").length
  const onlineStreams = streams.filter((s) => s.status === "online").length
  const openAlerts = alerts.filter((a) => a.status === "open").length
  const criticalAlerts = alerts.filter((a) => a.severity === "critical" && a.status === "open").length

  const recentAlerts = alerts.slice(0, 5)
  const activeStreams = streams.filter((s) => s.status === "online").slice(0, 4)

  return (
    <div className="p-6 space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest alerts from all tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No alerts yet</p>
            ) : (
              recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
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
                        className="text-xs"
                      >
                        {alert.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{alert.hazardType.replace(/_/g, " ")}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{alert.description}</p>
                  </div>
                  <Badge variant={alert.status === "open" ? "default" : "secondary"} className="text-xs">
                    {alert.status}
                  </Badge>
                </div>
              ))
            )}
            <Link href="/alerts">
              <Button variant="outline" className="w-full mt-2 bg-transparent">
                View All Alerts
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Active Streams */}
        <Card>
          <CardHeader>
            <CardTitle>Active Streams</CardTitle>
            <CardDescription>Currently online drone streams</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeStreams.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No active streams</p>
            ) : (
              activeStreams.map((stream) => (
                <Link key={stream.id} href={`/streams/${stream.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
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
                        {stream.telemetry.lat?.toFixed(4)}, {stream.telemetry.lng?.toFixed(4)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{stream.stats.fps}fps</span>
                        <span className="text-xs text-muted-foreground">•</span>
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
              <Button variant="outline" className="w-full mt-2 bg-transparent">
                View All Streams
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
