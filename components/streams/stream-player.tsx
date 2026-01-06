"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Camera, Maximize } from "lucide-react"
import type { Stream } from "@/lib/types"

interface StreamPlayerProps {
  stream: Stream
  onCapture?: (dataUrl: string) => void
}

export function StreamPlayer({ stream, onCapture }: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)
  const [showOverlay, setShowOverlay] = useState(true)

  useEffect(() => {
    if (videoRef.current && playing) {
      videoRef.current.play().catch(() => {
        // Auto-play might be blocked
      })
    } else if (videoRef.current) {
      videoRef.current.pause()
    }
  }, [playing])

  const handleCapture = () => {
    if (videoRef.current && onCapture) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const dataUrl = canvas.toDataURL("image/png")
        onCapture(dataUrl)
      }
    }
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen()
    }
  }

  return (
    <div className="space-y-4">
      {/* Player */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video ref={videoRef} className="w-full h-full object-contain" loop muted playsInline>
          <source src={stream.sourceUrl} type="video/mp4" />
          Your browser does not support video playback
        </video>

        {/* Overlay */}
        {showOverlay && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-success live-pulse pointer-events-auto">LIVE</Badge>
              <Badge variant="secondary" className="pointer-events-auto">
                {new Date().toLocaleTimeString()}
              </Badge>
            </div>

            <div className="absolute top-4 right-4 space-y-1 text-right text-xs font-mono text-white bg-black/50 p-2 rounded">
              <div>FPS: {stream.stats.fps || 0}</div>
              <div>Latency: {stream.stats.latencyMs || 0}ms</div>
              <div>Bitrate: {stream.stats.bitrateKbps || 0} kbps</div>
            </div>

            {stream.telemetry && (stream.telemetry.lat || stream.telemetry.lng) && (
              <div className="absolute bottom-4 left-4 text-xs font-mono text-white bg-black/50 p-2 rounded">
                <div>
                  Lat: {stream.telemetry.lat?.toFixed(6)}, Lng: {stream.telemetry.lng?.toFixed(6)}
                </div>
                {stream.telemetry.altitude && <div>Alt: {stream.telemetry.altitude}m</div>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPlaying(!playing)}>
            {playing ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {playing ? "Pause" : "Play"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCapture}>
            <Camera className="h-4 w-4 mr-2" />
            Capture
          </Button>
          <Button variant="outline" size="sm" onClick={handleFullscreen}>
            <Maximize className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <input
            type="checkbox"
            id="overlay"
            checked={showOverlay}
            onChange={(e) => setShowOverlay(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="overlay" className="text-sm text-muted-foreground cursor-pointer">
            Show Overlay
          </label>
        </div>
      </div>
    </div>
  )
}
