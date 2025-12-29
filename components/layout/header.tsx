"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import type { Alert } from "@/lib/types"

interface HeaderProps {
  title: string
  userName?: string
}

export function Header({ title, userName = "User" }: HeaderProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const unreadCount = alerts.filter((a) => a.status === "open").length

  useEffect(() => {
    // Fetch recent alerts
    fetch("/api/alerts?status=open&limit=5")
      .then((res) => res.json())
      .then((data) => setAlerts(data.alerts || []))
      .catch(console.error)
  }, [])

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6">
      <h1 className="text-2xl font-bold text-pretty">{title}</h1>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  variant="destructive"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Recent Alerts</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {alerts.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">No new alerts</div>
            ) : (
              alerts.slice(0, 5).map((alert) => (
                <DropdownMenuItem key={alert.id} className="flex flex-col items-start gap-1 p-3">
                  <div className="flex items-center gap-2 w-full">
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
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{alert.hazardType.replace(/_/g, " ")}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">{alert.description}</span>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/alerts" className="cursor-pointer text-center justify-center">
                View all alerts
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="text-sm">
          <div className="font-medium">{userName}</div>
        </div>
      </div>
    </header>
  )
}
