"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { Settings } from "@/lib/types"

export default function SettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    thresholdConfidence: 60,
    enableNotifications: true,
    enable3D: true,
    reduceMotion: false,
  })

  useEffect(() => {
    // Fetch settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings))
      .catch(console.error)
  }, [])

  useEffect(() => {
    // Apply 3D and motion settings to body
    if (settings.enable3D) {
      document.body.classList.remove("disable-3d")
    } else {
      document.body.classList.add("disable-3d")
    }

    if (settings.reduceMotion) {
      document.body.classList.add("reduce-motion")
    } else {
      document.body.classList.remove("reduce-motion")
    }
  }, [settings.enable3D, settings.reduceMotion])

  const handleSave = async () => {
    setLoading(true)

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        toast({
          title: "Settings saved",
          description: "Your preferences have been updated",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure system preferences and thresholds</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>VLM Analysis</CardTitle>
          <CardDescription>Configure AI detection and alert thresholds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="threshold">Confidence Threshold</Label>
              <span className="text-sm font-medium">{settings.thresholdConfidence}%</span>
            </div>
            <Slider
              id="threshold"
              value={[settings.thresholdConfidence]}
              onValueChange={(val) => setSettings({ ...settings, thresholdConfidence: val[0] })}
              max={100}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Only create alerts when detection confidence is above this threshold
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure alert notification behavior</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Send notifications to configured groups when alerts are triggered
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visual Effects</CardTitle>
          <CardDescription>Customize the appearance and animations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enable3d">Enable 3D Effects</Label>
              <p className="text-xs text-muted-foreground">Subtle card parallax and depth effects</p>
            </div>
            <Switch
              id="enable3d"
              checked={settings.enable3D}
              onCheckedChange={(checked) => setSettings({ ...settings, enable3D: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reducemotion">Reduce Motion</Label>
              <p className="text-xs text-muted-foreground">
                Minimize animations for better accessibility (overrides browser preference)
              </p>
            </div>
            <Switch
              id="reducemotion"
              checked={settings.reduceMotion}
              onCheckedChange={(checked) => setSettings({ ...settings, reduceMotion: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
