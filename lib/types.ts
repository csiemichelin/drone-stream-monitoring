// User & Auth types
export type UserRole = "admin" | "user"

export interface User {
  id: string
  name: string
  email: string
  passwordHash: string // demo uses simple comparison
  role: UserRole
  createdAt: Date
}

export interface Session {
  userId: string
  expiresAt: Date
}

// Stream types
export type StreamStatus = "online" | "offline" | "degraded"
export type SourceType = "rtsp" | "rtmp" | "hls" | "webrtc" | "file"

export interface StreamTelemetry {
  lat?: number
  lng?: number
  altitude?: number
  heading?: number
  speed?: number
}

export interface StreamStats {
  fps?: number
  latencyMs?: number
  bitrateKbps?: number
}

export interface Stream {
  id: string
  name: string
  sourceType: SourceType
  sourceUrl: string
  status: StreamStatus
  lastSeenAt?: Date
  stats: StreamStats
  telemetry: StreamTelemetry
  tags: string[]
}

// Notification Group types
export interface NotificationMember {
  name: string
  role?: string
}

export interface NotificationGroup {
  id: string
  name: string
  description: string
  favorite: boolean
  members: NotificationMember[]
  notifyPhones: string[]
  notifyEmails: string[]
  notifyChannels: string[] // line/telegram/slack webhook names
  createdBy: string
  createdAt: Date
}

// Task types
export type TaskStatus = "idle" | "running" | "ended" | "paused"

export interface TaskMetrics {
  alertCountTotal: number
  lastAlertAt?: Date
  alertPointIds?: string[]
}

export interface HistoryStream {
  streamId: string
  startAt: Date
  endAt?: Date
}

export interface Task {
  id: string
  name: string
  description?: string
  status: TaskStatus
  startAt?: Date
  endAt?: Date
  createdBy: string
  createdAt: Date
  boundStreamIds: string[]
  notifyGroupIds: string[]
  metrics: TaskMetrics
  currentTelemetry?: StreamTelemetry
}

// Alert types
export type AlertSeverity = "info" | "warn" | "critical"
export type HazardType =
  | "obstacle"
  | "landslide"
  | "rockfall"
  | "road_collapse"
  | "flooding"
  | "bridge_damage"
  | "tunnel_damage"
  | "slope_failure"
  | "unknown"
export type InterruptionLevel = "partial" | "full" | "none"
export type AlertStatus = "open" | "ack" | "resolved"

export interface AlertNotification {
  groupId: string
  sentAt: Date
  channel: string
}

export interface Alert {
  id: string
  taskId: string
  streamId: string
  createdAt: Date
  severity: AlertSeverity
  hazardType: HazardType
  disaster_type: string
  interruption: InterruptionLevel
  hasPeople: boolean
  hasVehicles: boolean
  reason: string
  description: string
  confidence: number
  ai_summary: string
  ai_reasoning: string
  analysis_detail: string
  occurredAt: Date
  lat?: number
  lng?: number
  snapshotUrl?: string
  snapshotBase64?: string
  analysisRaw: any
  status: AlertStatus
  ackAt?: Date
  resolvedAt?: Date
  notifications: AlertNotification[]
}

// VLM Analysis result (from mock VLM)
export interface VLMAnalysisResult {
  severity: AlertSeverity
  hazardType: HazardType
  disaster_type: string
  interruption: InterruptionLevel
  hasPeople: boolean
  hasVehicles: boolean
  reason: string
  description: string
  confidence: number
  ai_summary: string
  ai_reasoning: string
  analysis_detail: string
  occurredAt: Date
  lat?: number
  lng?: number
}

// Settings
export interface Settings {
  thresholdConfidence: number
  enableNotifications: boolean
  enable3D: boolean
  reduceMotion: boolean
}

// Filters
export interface AlertFilters {
  status?: AlertStatus[]
  severity?: AlertSeverity[]
  hazardType?: HazardType[]
  taskId?: string
  streamId?: string
}
