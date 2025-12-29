"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ListTodo,
  Radio,
  Megaphone,
  Bell,
  Users,
  Settings,
  Menu,
  X,
  BadgeCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
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
import type { Alert } from "@/lib/types"

const navItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: ListTodo },
  { name: "Streams", href: "/streams", icon: Radio },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Groups", href: "/groups", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function TopNav({ userName }: { userName: string }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const unreadCount = alerts.filter((a) => a.status === "open").length

  useEffect(() => {
    fetch("/api/alerts?status=open&limit=5")
      .then((res) => res.json())
      .then((data) => setAlerts(data.alerts || []))
      .catch(() => setAlerts([]))
  }, [])

  const renderNavLinks = (variant: "desktop" | "mobile") =>
    navItems.map((item) => {
      const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
      const Icon = item.icon
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            variant === "desktop" && "hover:bg-accent hover:text-accent-foreground",
            variant === "mobile" && "w-full",
            isActive && "bg-sky-600 text-white hover:text-white hover:bg-sky-700",
            !isActive && variant === "desktop" && "text-muted-foreground",
          )}
          onClick={() => setMobileOpen(false)}
        >
          <Icon className="h-4 w-4" />
          {item.name}
        </Link>
      )
    })

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex h-14 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <div className="flex h-10 w-11 items-center justify-center rounded-md bg-sky-600">
              <img
                src="/images/hazardeye_logo.png"
                alt="HazardEye Logo"
                className="h-10 w-9 object-contain"
              />
            </div>
            <span className="text-sky-600 font-bold tracking-wider uppercase">
              Hazardeye
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">{renderNavLinks("desktop")}</nav>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Megaphone className="h-5 w-5" />
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
                <div className="p-3 text-sm text-muted-foreground text-center">No new alerts</div>
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
                      <Badge variant="outline">{alert.hazardType.replace(/_/g, " ")}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm font-medium">{alert.reason}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{alert.description}</div>
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/alerts" className="w-full text-center">
                  View all alerts
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <BadgeCheck className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">{userName}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile side drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-64 bg-card shadow-lg border-l">
            <div className="flex items-center justify-between h-14 px-4 border-b">
              <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setMobileOpen(false)}>
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-600">
                  <img
                    src="/images/hazardeye_logo.png"
                    alt="HazardEye Logo"
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <span className="text-sky-600 font-bold tracking-wider uppercase">
                  Hazardeye
                </span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="p-3 space-y-1">{renderNavLinks("mobile")}</nav>
          </div>
        </>
      )}
    </header>
  )
}
