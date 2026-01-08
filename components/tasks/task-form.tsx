"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Star } from "lucide-react"
import type { Stream, NotificationGroup, Task } from "@/lib/types"

type TaskFormProps = {
  task?: Pick<Task, "id" | "name" | "description" | "boundStreamIds" | "notifyGroupIds">
}

export function TaskForm({ task }: TaskFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [streams, setStreams] = useState<Stream[]>([])
  const [groups, setGroups] = useState<NotificationGroup[]>([])

  const [name, setName] = useState(task?.name ?? "")
  const [description, setDescription] = useState(task?.description ?? "")
  const [selectedStreams, setSelectedStreams] = useState<string[]>(task?.boundStreamIds ?? [])
  const [selectedGroups, setSelectedGroups] = useState<string[]>(task?.notifyGroupIds ?? [])
  const [rtspName, setRtspName] = useState("")
  const [rtspUrl, setRtspUrl] = useState("")
  const [addingRtsp, setAddingRtsp] = useState(false)

  const isEdit = Boolean(task)

  useEffect(() => {
    setName(task?.name ?? "")
    setDescription(task?.description ?? "")
    setSelectedStreams(task?.boundStreamIds ?? [])
    setSelectedGroups(task?.notifyGroupIds ?? [])
  }, [task])

  useEffect(() => {
    // Fetch streams and groups
    Promise.all([fetch("/api/streams").then((r) => r.json()), fetch("/api/groups").then((r) => r.json())]).then(
      ([streamsData, groupsData]) => {
        setStreams(streamsData.streams || [])
        setGroups(groupsData.groups || [])
      },
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = isEdit ? `/api/tasks/${task?.id}` : "/api/tasks"
      const method = isEdit ? "PATCH" : "POST"

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          boundStreamIds: selectedStreams,
          notifyGroupIds: selectedGroups,
        }),
      })

      if (res.ok) {
        const redirectTo = isEdit ? `/tasks/${task?.id}` : "/tasks"
        router.push(redirectTo)
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to save task:", error)
    } finally {
      setLoading(false)
    }
  }

  const favoriteGroups = groups.filter((g) => g.favorite)
  const otherGroups = groups.filter((g) => !g.favorite)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>Basic information about the monitoring task</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Task Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Highway Monitoring"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of the task"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bind Streams</CardTitle>
          <CardDescription>Select which streams to monitor in this task</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rtsp-name">Stream Name</Label>
              <Input
                id="rtsp-name"
                value={rtspName}
                onChange={(e) => setRtspName(e.target.value)}
                placeholder="e.g., Custom RTSP Stream"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rtsp-url">RTSP URL</Label>
              <Input
                id="rtsp-url"
                value={rtspUrl}
                onChange={(e) => setRtspUrl(e.target.value)}
                placeholder="rtsp://username:password@host:554/stream"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={addingRtsp || !rtspName || !rtspUrl}
              onClick={async () => {
                setAddingRtsp(true)
                try {
                  const res = await fetch("/api/streams", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: rtspName, sourceUrl: rtspUrl }),
                  })
                  const data = await res.json()
                  if (res.ok && data.stream) {
                    setStreams((prev) => [data.stream, ...prev])
                    setSelectedStreams((prev) => [...prev, data.stream.id])
                    setRtspName("")
                    setRtspUrl("")
                  } else {
                    console.error("Failed to add stream:", data.error)
                  }
                } catch (err) {
                  console.error("Failed to add stream:", err)
                } finally {
                  setAddingRtsp(false)
                }
              }}
            >
              {addingRtsp ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                "Add RTSP Stream"
              )}
            </Button>
            <p className="text-xs text-muted-foreground self-center">Add RTSP streams to bind them to this task.</p>
          </div>

          <div className="space-y-2">
            {streams.length === 0 ? (
              <p className="text-sm text-muted-foreground">No streams available</p>
            ) : (
              streams.map((stream) => (
                <label
                  key={stream.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer"
                >
                  <Checkbox
                    checked={selectedStreams.includes(stream.id)}
                    onCheckedChange={(checked) => {
                      setSelectedStreams(
                        checked ? [...selectedStreams, stream.id] : selectedStreams.filter((id) => id !== stream.id),
                      )
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{stream.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {stream.sourceType.toUpperCase()} | {stream.status}
                    </p>
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
                </label>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Groups</CardTitle>
          <CardDescription>Select which groups to notify when alerts are triggered</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {favoriteGroups.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Star className="h-3 w-3 fill-warning text-warning" />
                Favorite Groups
              </Label>
              {favoriteGroups.map((group) => (
                <label
                  key={group.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer"
                >
                  <Checkbox
                    checked={selectedGroups.includes(group.id)}
                    onCheckedChange={(checked) => {
                      setSelectedGroups(
                        checked ? [...selectedGroups, group.id] : selectedGroups.filter((id) => id !== group.id),
                      )
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{group.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{group.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {group.members.length > 0 && (
                        <span className="text-xs text-muted-foreground">{group.members.length} members</span>
                      )}
                      {group.notifyPhones.length > 0 && (
                        <span className="text-xs text-muted-foreground">{group.notifyPhones.length} phones</span>
                      )}
                      {group.notifyEmails.length > 0 && (
                        <span className="text-xs text-muted-foreground">{group.notifyEmails.length} emails</span>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {otherGroups.length > 0 && (
            <div className="space-y-2">
              {favoriteGroups.length > 0 && (
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Other Groups</Label>
              )}
              {otherGroups.map((group) => (
                <label
                  key={group.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer"
                >
                  <Checkbox
                    checked={selectedGroups.includes(group.id)}
                    onCheckedChange={(checked) => {
                      setSelectedGroups(
                        checked ? [...selectedGroups, group.id] : selectedGroups.filter((id) => id !== group.id),
                      )
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{group.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{group.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      {group.members.length > 0 && <span>{group.members.length} members</span>}
                      {group.notifyPhones.length > 0 && <span>{group.notifyPhones.length} phones</span>}
                      {group.notifyEmails.length > 0 && <span>{group.notifyEmails.length} emails</span>}
                      {group.notifyChannels.length > 0 && <span>{group.notifyChannels.length} channels</span>}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {groups.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No notification groups available.{" "}
              <a href="/groups/new" className="text-primary hover:underline">
                Create one
              </a>
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading || !name || selectedStreams.length === 0}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Saving..." : "Creating..."}
            </>
          ) : (
            isEdit ? "Update Task" : "Create Task"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
