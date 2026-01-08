import { dataStore } from "@/lib/store"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, Phone, Mail, MessageSquare } from "lucide-react"
import Link from "next/link"

interface GroupDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function GroupDetailPage({ params }: GroupDetailPageProps) {
  const { id } = await params
  const group = dataStore.getGroup(id)

  if (!group) {
    notFound()
  }

  // Find tasks using this group
  const tasks = dataStore.getTasks().filter((t) => t.notifyGroupIds.includes(id))

  // Find recent alerts sent to this group
  const alerts = dataStore
    .getAlerts()
    .filter((a) => a.notifications.some((n) => n.groupId === id))
    .slice(0, 10)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{group.name}</h1>
            {group.favorite && <Star className="h-6 w-6 fill-warning text-warning" />}
          </div>
          <p className="text-muted-foreground">{group.description}</p>
          <p className="text-sm text-muted-foreground mt-2">Created {new Date(group.createdAt).toLocaleDateString()}</p>
        </div>

        <Link href={`/groups/${group.id}/edit`}>
          <Button>Edit Group</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{group.members.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Phone Numbers</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{group.notifyPhones.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{group.notifyEmails.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Channels</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{group.notifyChannels.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members */}
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>Team members in this notification group</CardDescription>
          </CardHeader>
          <CardContent>
            {group.members.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No members</p>
            ) : (
              <div className="space-y-2">
                {group.members.map((member, index) => (
                  <div key={index} className="p-3 rounded-lg border bg-muted/50">
                    <p className="text-sm font-medium">{member.name}</p>
                    {member.role && <p className="text-xs text-muted-foreground">{member.role}</p>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Methods</CardTitle>
            <CardDescription>Notification delivery channels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {group.notifyPhones.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Numbers
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.notifyPhones.map((phone) => (
                    <Badge key={phone} variant="secondary">
                      {phone}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {group.notifyEmails.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Addresses
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.notifyEmails.map((email) => (
                    <Badge key={email} variant="secondary">
                      {email}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {group.notifyChannels.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Messaging Channels
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.notifyChannels.map((channel) => (
                    <Badge key={channel} variant="secondary">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tasks Using This Group */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks Using This Group</CardTitle>
          <CardDescription>Monitoring tasks configured to notify this group</CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No tasks are using this group</p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <Link key={task.id} href={`/tasks/${task.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer">
                    <div>
                      <p className="text-sm font-medium">{task.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.metrics.alertCountTotal} alerts • {task.status}
                      </p>
                    </div>
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
                      {task.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Alerts sent to this group (demo log)</CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No notifications sent yet</p>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => {
                const notification = alert.notifications.find((n) => n.groupId === id)
                return (
                  <div key={alert.id} className="p-3 rounded-lg border space-y-1">
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
                      <span className="text-sm font-medium">{alert.hazardType.replace(/_/g, " ")}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Sent {notification ? new Date(notification.sentAt).toLocaleString() : "Unknown"}</span>
                      <span>•</span>
                      <span>via {notification?.channel || "unknown"}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
