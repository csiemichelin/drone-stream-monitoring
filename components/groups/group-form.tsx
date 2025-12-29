"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Plus, X, Star } from "lucide-react"
import type { NotificationGroup } from "@/lib/types"

interface GroupFormProps {
  group?: NotificationGroup
  mode?: "create" | "edit"
}

export function GroupForm({ group, mode = "create" }: GroupFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState(group?.name || "")
  const [description, setDescription] = useState(group?.description || "")
  const [favorite, setFavorite] = useState(group?.favorite || false)

  const [members, setMembers] = useState<Array<{ name: string; role?: string }>>(group?.members || [])
  const [memberName, setMemberName] = useState("")
  const [memberRole, setMemberRole] = useState("")

  const [phones, setPhones] = useState<string[]>(group?.notifyPhones || [])
  const [phoneInput, setPhoneInput] = useState("")

  const [emails, setEmails] = useState<string[]>(group?.notifyEmails || [])
  const [emailInput, setEmailInput] = useState("")

  const [channels, setChannels] = useState<string[]>(group?.notifyChannels || [])
  const [channelInput, setChannelInput] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = mode === "edit" ? `/api/groups/${group?.id}` : "/api/groups"
      const method = mode === "edit" ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          favorite,
          members,
          notifyPhones: phones,
          notifyEmails: emails,
          notifyChannels: channels,
        }),
      })

      if (res.ok) {
        router.push("/groups")
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to save group:", error)
    } finally {
      setLoading(false)
    }
  }

  const addMember = () => {
    if (memberName.trim()) {
      setMembers([...members, { name: memberName.trim(), role: memberRole.trim() || undefined }])
      setMemberName("")
      setMemberRole("")
    }
  }

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index))
  }

  const addPhone = () => {
    if (phoneInput.trim() && !phones.includes(phoneInput.trim())) {
      setPhones([...phones, phoneInput.trim()])
      setPhoneInput("")
    }
  }

  const removePhone = (phone: string) => {
    setPhones(phones.filter((p) => p !== phone))
  }

  const addEmail = () => {
    if (emailInput.trim() && !emails.includes(emailInput.trim())) {
      setEmails([...emails, emailInput.trim()])
      setEmailInput("")
    }
  }

  const removeEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email))
  }

  const addChannel = () => {
    if (channelInput.trim() && !channels.includes(channelInput.trim())) {
      setChannels([...channels, channelInput.trim()])
      setChannelInput("")
    }
  }

  const removeChannel = (channel: string) => {
    setChannels(channels.filter((c) => c !== channel))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Group Details</CardTitle>
          <CardDescription>Basic information about the notification group</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Emergency Response Team"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of the group's purpose"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="favorite" checked={favorite} onCheckedChange={(checked) => setFavorite(checked === true)} />
            <Label htmlFor="favorite" className="flex items-center gap-2 cursor-pointer">
              <Star className={`h-4 w-4 ${favorite ? "fill-warning text-warning" : "text-muted-foreground"}`} />
              Mark as favorite (quick access in task creation)
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>Team members in this notification group</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="Member name"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMember())}
              />
            </div>
            <div className="flex-1">
              <Input
                value={memberRole}
                onChange={(e) => setMemberRole(e.target.value)}
                placeholder="Role (optional)"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMember())}
              />
            </div>
            <Button type="button" onClick={addMember} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {members.length > 0 && (
            <div className="space-y-2">
              {members.map((member, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded border bg-muted/50">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{member.name}</p>
                    {member.role && <p className="text-xs text-muted-foreground">{member.role}</p>}
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeMember(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phone Numbers</CardTitle>
          <CardDescription>Phone numbers to receive SMS notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="+1-555-0100"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPhone())}
            />
            <Button type="button" onClick={addPhone}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          {phones.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {phones.map((phone) => (
                <Badge key={phone} variant="secondary" className="gap-1">
                  {phone}
                  <button type="button" onClick={() => removePhone(phone)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Addresses</CardTitle>
          <CardDescription>Email addresses to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="user@example.com"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEmail())}
            />
            <Button type="button" onClick={addEmail}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          {emails.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {emails.map((email) => (
                <Badge key={email} variant="secondary" className="gap-1">
                  {email}
                  <button type="button" onClick={() => removeEmail(email)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Messaging Channels</CardTitle>
          <CardDescription>Slack/Telegram/Line webhook names or group IDs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={channelInput}
              onChange={(e) => setChannelInput(e.target.value)}
              placeholder="slack-emergency or telegram-ops"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addChannel())}
            />
            <Button type="button" onClick={addChannel}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          {channels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {channels.map((channel) => (
                <Badge key={channel} variant="secondary" className="gap-1">
                  {channel}
                  <button type="button" onClick={() => removeChannel(channel)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading || !name}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "edit" ? "Saving..." : "Creating..."}
            </>
          ) : mode === "edit" ? (
            "Save Changes"
          ) : (
            "Create Group"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
