"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"
import type { Alert } from "@/lib/types"
import Link from "next/link"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [hazardFilter, setHazardFilter] = useState<string>("all")

  useEffect(() => {
    fetchAlerts()
  }, [statusFilter, severityFilter, hazardFilter])

  const fetchAlerts = () => {
    const params = new URLSearchParams()
    if (statusFilter !== "all") params.append("status", statusFilter)
    if (severityFilter !== "all") params.append("severity", severityFilter)
    if (hazardFilter !== "all") params.append("hazardType", hazardFilter)

    fetch(`/api/alerts?${params}`)
      .then((res) => res.json())
      .then((data) => setAlerts(data.alerts || []))
      .catch(console.error)
  }

  const handleAck = async (alertId: string) => {
    await fetch(`/api/alerts/${alertId}/ack`, { method: "POST" })
    fetchAlerts()
  }

  const handleResolve = async (alertId: string) => {
    await fetch(`/api/alerts/${alertId}/resolve`, { method: "POST" })
    fetchAlerts()
  }

  const stats = {
    total: alerts.length,
    open: alerts.filter((a) => a.status === "open").length,
    ack: alerts.filter((a) => a.status === "ack").length,
    resolved: alerts.filter((a) => a.status === "resolved").length,
    critical: alerts.filter((a) => a.severity === "critical").length,
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alerts Center</h1>
        <p className="text-muted-foreground">Monitor and manage all system alerts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{stats.open}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Acknowledged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{stats.ack}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{stats.resolved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{stats.critical}</div>
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
            <label className="text-sm text-muted-foreground">Status:</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="ack">Acknowledged</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Severity:</label>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
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
                <SelectItem value="road_closure">Road Closure</SelectItem>
                <SelectItem value="accident">Accident</SelectItem>
                <SelectItem value="congestion">Congestion</SelectItem>
                <SelectItem value="obstacle">Obstacle</SelectItem>
                <SelectItem value="signal_loss">Signal Loss</SelectItem>
                <SelectItem value="stream_interrupt">Stream Interrupt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(statusFilter !== "all" || severityFilter !== "all" || hazardFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter("all")
                setSeverityFilter("all")
                setHazardFilter("all")
              }}
            >
              Clear Filters
            </Button>
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
          alerts.map((alert) => (
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
                    {alert.status === "resolved" ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : alert.status === "ack" ? (
                      <Clock className="h-6 w-6" />
                    ) : (
                      <AlertTriangle className="h-6 w-6" />
                    )}
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
                      <Badge variant={alert.status === "open" ? "default" : "secondary"}>{alert.status}</Badge>
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

                    {/* Actions */}
                    {alert.status === "open" && (
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" onClick={() => handleAck(alert.id)}>
                          Acknowledge
                        </Button>
                        <Button size="sm" onClick={() => handleResolve(alert.id)}>
                          Resolve
                        </Button>
                      </div>
                    )}
                    {alert.status === "ack" && (
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" onClick={() => handleResolve(alert.id)}>
                          Resolve
                        </Button>
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
    </div>
  )
}
