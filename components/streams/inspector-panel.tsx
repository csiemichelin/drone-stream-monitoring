"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Alert } from "@/lib/types"
import type { VLMAnalysisResult } from "@/lib/types"

interface InspectorPanelProps {
  alerts: Alert[]
  latestAnalysis?: VLMAnalysisResult
}

export function InspectorPanel({ alerts, latestAnalysis }: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState("fields")

  return (
    <Card className="h-[90%] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle>Inspector</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="raw">Raw JSON</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="fields" className="flex-1 min-h-0 mt-4">
            {latestAnalysis ? (
              <div className="h-full overflow-y-auto space-y-4 pr-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Severity</label>
                  <Badge
                    variant={
                      latestAnalysis.severity === "critical"
                        ? "destructive"
                        : latestAnalysis.severity === "warn"
                          ? "outline"
                          : "secondary"
                    }
                    className="mt-1"
                  >
                    {latestAnalysis.severity}
                  </Badge>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Hazard Type</label>
                  <p className="text-sm mt-1">{latestAnalysis.hazardType.replace(/_/g, " ")}</p>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Interruption</label>
                  <Badge
                    variant={latestAnalysis.interruption === "full" ? "destructive" : "secondary"}
                    className="mt-1"
                  >
                    {latestAnalysis.interruption}
                  </Badge>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Confidence</label>
                  <p className="text-sm mt-1">{(latestAnalysis.confidence * 100).toFixed(1)}%</p>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Detection</label>
                  <div className="flex gap-2 mt-1">
                    {latestAnalysis.hasPeople && <Badge variant="secondary">People</Badge>}
                    {latestAnalysis.hasVehicles && <Badge variant="secondary">Vehicles</Badge>}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Reason</label>
                  <p className="text-sm mt-1">{latestAnalysis.reason}</p>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Description</label>
                  <p className="text-sm mt-1 text-muted-foreground">{latestAnalysis.description}</p>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Occurred At</label>
                  <p className="text-sm mt-1">{new Date(latestAnalysis.occurredAt).toLocaleString()}</p>
                </div>

                {(latestAnalysis.lat || latestAnalysis.lng) && (
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Location</label>
                    <p className="text-sm mt-1 font-mono">
                      {latestAnalysis.lat?.toFixed(6)}, {latestAnalysis.lng?.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full pt-4">
                <p className="text-sm text-muted-foreground">No analysis data available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="raw" className="flex-1 min-h-0 mt-4">
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(latestAnalysis, null, 2)}
            </pre>
          </TabsContent>

          <TabsContent value="alerts" className="flex-1 min-h-0 mt-4">
            <div className="h-full overflow-y-auto space-y-3 pr-4">
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No alerts</p>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="p-3 border rounded-lg space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
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
                    </div>
                    <p className="text-sm font-medium">{alert.hazardType.replace(/_/g, " ")}</p>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(alert.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
