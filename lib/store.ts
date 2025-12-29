import type {
  User,
  Session,
  Stream,
  NotificationGroup,
  Task,
  Alert,
  VLMAnalysisResult,
  HazardType,
  AlertSeverity,
  InterruptionLevel,
  Settings,
} from "./types"

class DataStore {
  private users: Map<string, User> = new Map()
  private sessions: Map<string, Session> = new Map()
  private streams: Map<string, Stream> = new Map()
  private groups: Map<string, NotificationGroup> = new Map()
  private tasks: Map<string, Task> = new Map()
  private alerts: Map<string, Alert> = new Map()
  private settings: Settings = {
    thresholdConfidence: 0.6,
    enableNotifications: true,
    enable3D: true,
    reduceMotion: false,
  }
  private listeners: Set<(event: string, data: any) => void> = new Set()

  constructor() {
    this.initMockData()
  }

  // Event system
  subscribe(callback: (event: string, data: any) => void) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  private emit(event: string, data: any) {
    this.listeners.forEach((listener) => listener(event, data))
  }

  // Initialize mock data
  private initMockData() {
    // Create demo user
    const demoUser: User = {
      id: "user-demo",
      name: "Demo Admin",
      email: "admin@example.com",
      passwordHash: "admin123", // demo password
      role: "admin",
      createdAt: new Date(),
    }
    this.users.set(demoUser.id, demoUser)

    // Create mock streams
    this.streams.set("stream-1", {
      id: "stream-1",
      name: "Highway 101 North",
      sourceType: "hls",
      sourceUrl: "/sample-traffic.mp4",
      status: "online",
      lastSeenAt: new Date(),
      stats: { fps: 30, latencyMs: 120, bitrateKbps: 2500 },
      telemetry: { lat: 37.7749, lng: -122.4194, altitude: 50, heading: 180, speed: 0 },
      tags: ["highway", "north"],
    })

    this.streams.set("stream-2", {
      id: "stream-2",
      name: "Downtown Intersection",
      sourceType: "rtsp",
      sourceUrl: "/sample-traffic-2.mp4",
      status: "online",
      lastSeenAt: new Date(),
      stats: { fps: 25, latencyMs: 95, bitrateKbps: 2100 },
      telemetry: { lat: 37.7849, lng: -122.4094, altitude: 30, heading: 90, speed: 0 },
      tags: ["downtown", "intersection"],
    })

    this.streams.set("stream-3", {
      id: "stream-3",
      name: "Bridge Monitoring",
      sourceType: "hls",
      sourceUrl: "/sample-traffic.mp4",
      status: "degraded",
      lastSeenAt: new Date(Date.now() - 60000),
      stats: { fps: 15, latencyMs: 250, bitrateKbps: 1200 },
      telemetry: { lat: 37.8049, lng: -122.4294 },
      tags: ["bridge"],
    })

    // Create mock notification groups
    this.groups.set("group-1", {
      id: "group-1",
      name: "Emergency Response Team",
      description: "Primary emergency response team for critical incidents",
      favorite: true,
      members: [
        { name: "John Smith", role: "Team Leader" },
        { name: "Sarah Johnson", role: "Field Coordinator" },
      ],
      notifyPhones: ["+1-555-0101", "+1-555-0102"],
      notifyEmails: ["emergency@example.com", "response@example.com"],
      notifyChannels: ["slack-emergency", "telegram-ops"],
      createdBy: "user-demo",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    })

    this.groups.set("group-2", {
      id: "group-2",
      name: "Traffic Management",
      description: "Regular traffic monitoring and management team",
      favorite: true,
      members: [{ name: "Mike Davis" }, { name: "Emily Chen" }],
      notifyPhones: ["+1-555-0201"],
      notifyEmails: ["traffic@example.com"],
      notifyChannels: ["line-traffic"],
      createdBy: "user-demo",
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    })

    this.groups.set("group-3", {
      id: "group-3",
      name: "City Operations",
      description: "City operations and planning department",
      favorite: false,
      members: [{ name: "Alex Wong", role: "Director" }],
      notifyPhones: [],
      notifyEmails: ["cityops@example.com"],
      notifyChannels: ["slack-cityops"],
      createdBy: "user-demo",
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    })

    // Create mock tasks
    const task1: Task = {
      id: "task-1",
      name: "Highway 101 Morning Monitoring",
      description: "Regular morning rush hour monitoring",
      status: "running",
      startAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      createdBy: "user-demo",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      boundStreamIds: ["stream-1"],
      notifyGroupIds: ["group-1", "group-2"],
      metrics: {
        alertCountTotal: 5,
        alertCountByType: { accident: 1, congestion: 3, obstacle: 1 },
        lastAlertAt: new Date(Date.now() - 5 * 60 * 1000),
      },
      currentTelemetry: { lat: 37.7749, lng: -122.4194, altitude: 50 },
      historyStreams: [{ streamId: "stream-1", startAt: new Date(Date.now() - 2 * 60 * 60 * 1000) }],
    }

    const task2: Task = {
      id: "task-2",
      name: "Multi-Stream City Coverage",
      description: "Comprehensive city-wide monitoring",
      status: "running",
      startAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      createdBy: "user-demo",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      boundStreamIds: ["stream-1", "stream-2", "stream-3"],
      notifyGroupIds: ["group-1"],
      metrics: {
        alertCountTotal: 12,
        alertCountByType: { accident: 2, congestion: 6, obstacle: 3, signal_loss: 1 },
        lastAlertAt: new Date(Date.now() - 10 * 60 * 1000),
      },
      historyStreams: [
        { streamId: "stream-1", startAt: new Date(Date.now() - 4 * 60 * 60 * 1000) },
        { streamId: "stream-2", startAt: new Date(Date.now() - 4 * 60 * 60 * 1000) },
        { streamId: "stream-3", startAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
      ],
    }

    const task3: Task = {
      id: "task-3",
      name: "Bridge Safety Check",
      description: "Scheduled safety inspection monitoring",
      status: "ended",
      startAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
      createdBy: "user-demo",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      boundStreamIds: ["stream-3"],
      notifyGroupIds: ["group-3"],
      metrics: {
        alertCountTotal: 2,
        alertCountByType: { congestion: 2 },
        lastAlertAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
      },
      historyStreams: [
        {
          streamId: "stream-3",
          startAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          endAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
        },
      ],
    }

    this.tasks.set(task1.id, task1)
    this.tasks.set(task2.id, task2)
    this.tasks.set(task3.id, task3)

    // Create mock alerts
    this.createMockAlert("task-1", "stream-1", "critical", "accident", 0.92, true, true)
    this.createMockAlert("task-1", "stream-1", "warn", "congestion", 0.78, false, true)
    this.createMockAlert("task-2", "stream-2", "critical", "road_closure", 0.88, true, true)
    this.createMockAlert("task-2", "stream-3", "warn", "signal_loss", 0.65, false, false)
  }

  private createMockAlert(
    taskId: string,
    streamId: string,
    severity: AlertSeverity,
    hazardType: HazardType,
    confidence: number,
    hasPeople: boolean,
    hasVehicles: boolean,
  ) {
    const alertId = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const task = this.tasks.get(taskId)

    const alert: Alert = {
      id: alertId,
      taskId,
      streamId,
      createdAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
      severity,
      hazardType,
      interruption: hazardType === "road_closure" ? "full" : hazardType === "obstacle" ? "partial" : "none",
      hasPeople,
      hasVehicles,
      reason: this.getHazardReason(hazardType),
      description: this.getHazardDescription(hazardType),
      confidence,
      occurredAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
      snapshotUrl: `/placeholder.svg?height=180&width=320&query=${hazardType}+detection`,
      analysisRaw: { model: "gpt-5-vision", confidence },
      status: Math.random() > 0.7 ? "open" : "ack",
      ackAt: Math.random() > 0.7 ? undefined : new Date(Date.now() - Math.random() * 30 * 60 * 1000),
      notifications: task
        ? task.notifyGroupIds.map((groupId) => ({
            groupId,
            sentAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
            channel: "demo-notification",
          }))
        : [],
    }

    this.alerts.set(alertId, alert)
  }

  private getHazardReason(type: HazardType): string {
    const reasons: Record<HazardType, string> = {
      road_closure: "Road construction or emergency closure",
      accident: "Vehicle collision detected",
      congestion: "Heavy traffic volume",
      obstacle: "Debris or obstacle on roadway",
      signal_loss: "Stream connection interrupted",
      stream_interrupt: "Video feed degraded",
      unknown: "Unusual pattern detected",
    }
    return reasons[type]
  }

  private getHazardDescription(type: HazardType): string {
    const descriptions: Record<HazardType, string> = {
      road_closure: "Full or partial lane closure with barriers detected",
      accident: "Multiple vehicles involved, emergency services may be required",
      congestion: "Reduced speed and increased vehicle density observed",
      obstacle: "Object detected in traffic lane requiring attention",
      signal_loss: "Connection to stream lost, attempting reconnection",
      stream_interrupt: "Video quality degraded or frames dropping",
      unknown: "Abnormal traffic pattern requiring manual review",
    }
    return descriptions[type]
  }

  // User operations
  getUsers(): User[] {
    return Array.from(this.users.values())
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id)
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.email === email)
  }

  createUser(user: User): User {
    this.users.set(user.id, user)
    return user
  }

  // Session operations
  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId)
  }

  createSession(sessionId: string, session: Session): void {
    this.sessions.set(sessionId, session)
  }

  deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId)
  }

  // Stream operations
  getStreams(): Stream[] {
    return Array.from(this.streams.values())
  }

  getStream(id: string): Stream | undefined {
    return this.streams.get(id)
  }

  updateStream(id: string, updates: Partial<Stream>): Stream | undefined {
    const stream = this.streams.get(id)
    if (!stream) return undefined

    const updated = { ...stream, ...updates }
    this.streams.set(id, updated)
    this.emit("stream.updated", updated)
    return updated
  }

  createStream(stream: Stream): Stream {
    this.streams.set(stream.id, stream)
    this.emit("stream.created", stream)
    return stream
  }

  // Notification Group operations
  getGroups(): NotificationGroup[] {
    return Array.from(this.groups.values()).sort((a, b) => {
      if (a.favorite !== b.favorite) return a.favorite ? -1 : 1
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
  }

  getGroup(id: string): NotificationGroup | undefined {
    return this.groups.get(id)
  }

  createGroup(group: NotificationGroup): NotificationGroup {
    this.groups.set(group.id, group)
    this.emit("group.created", group)
    return group
  }

  updateGroup(id: string, updates: Partial<NotificationGroup>): NotificationGroup | undefined {
    const group = this.groups.get(id)
    if (!group) return undefined

    const updated = { ...group, ...updates }
    this.groups.set(id, updated)
    this.emit("group.updated", updated)
    return updated
  }

  deleteGroup(id: string): boolean {
    const deleted = this.groups.delete(id)
    if (deleted) this.emit("group.deleted", id)
    return deleted
  }

  // Task operations
  getTasks(): Task[] {
    return Array.from(this.tasks.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  getTask(id: string): Task | undefined {
    return this.tasks.get(id)
  }

  createTask(task: Task): Task {
    this.tasks.set(task.id, task)
    this.emit("task.created", task)
    return task
  }

  updateTask(id: string, updates: Partial<Task>): Task | undefined {
    const task = this.tasks.get(id)
    if (!task) return undefined

    const updated = { ...task, ...updates }
    this.tasks.set(id, updated)
    this.emit("task.updated", updated)
    return updated
  }

  deleteTask(id: string): boolean {
    const deleted = this.tasks.delete(id)
    if (deleted) this.emit("task.deleted", id)
    return deleted
  }

  startTask(id: string): Task | undefined {
    const task = this.tasks.get(id)
    if (!task) return undefined

    return this.updateTask(id, { status: "running", startAt: new Date() })
  }

  stopTask(id: string): Task | undefined {
    const task = this.tasks.get(id)
    if (!task) return undefined

    return this.updateTask(id, { status: "ended", endAt: new Date() })
  }

  pauseTask(id: string): Task | undefined {
    return this.updateTask(id, { status: "paused" })
  }

  // Alert operations
  getAlerts(filters?: any): Alert[] {
    let alerts = Array.from(this.alerts.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    if (filters?.status) {
      alerts = alerts.filter((a) => filters.status.includes(a.status))
    }
    if (filters?.severity) {
      alerts = alerts.filter((a) => filters.severity.includes(a.severity))
    }
    if (filters?.hazardType) {
      alerts = alerts.filter((a) => filters.hazardType.includes(a.hazardType))
    }
    if (filters?.taskId) {
      alerts = alerts.filter((a) => a.taskId === filters.taskId)
    }
    if (filters?.streamId) {
      alerts = alerts.filter((a) => a.streamId === filters.streamId)
    }

    return alerts
  }

  getAlert(id: string): Alert | undefined {
    return this.alerts.get(id)
  }

  createAlert(alert: Alert): Alert {
    this.alerts.set(alert.id, alert)

    // Update task metrics
    const task = this.tasks.get(alert.taskId)
    if (task) {
      const metrics = { ...task.metrics }
      metrics.alertCountTotal++
      metrics.alertCountByType[alert.hazardType] = (metrics.alertCountByType[alert.hazardType] || 0) + 1
      metrics.lastAlertAt = alert.createdAt
      this.updateTask(task.id, { metrics })
    }

    this.emit("alert.created", alert)
    return alert
  }

  updateAlert(id: string, updates: Partial<Alert>): Alert | undefined {
    const alert = this.alerts.get(id)
    if (!alert) return undefined

    const updated = { ...alert, ...updates }
    this.alerts.set(id, updated)
    this.emit("alert.updated", updated)
    return updated
  }

  ackAlert(id: string): Alert | undefined {
    return this.updateAlert(id, { status: "ack", ackAt: new Date() })
  }

  resolveAlert(id: string): Alert | undefined {
    return this.updateAlert(id, { status: "resolved", resolvedAt: new Date() })
  }

  // VLM Analysis simulation
  analyzeFrame(streamId: string): VLMAnalysisResult {
    // Mock VLM analysis with realistic random results
    const hazardTypes: HazardType[] = [
      "road_closure",
      "accident",
      "congestion",
      "obstacle",
      "signal_loss",
      "stream_interrupt",
      "unknown",
    ]
    const weights = [0.05, 0.08, 0.3, 0.15, 0.05, 0.05, 0.32]

    const random = Math.random()
    let hazardType: HazardType = "unknown"
    let sum = 0
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i]
      if (random <= sum) {
        hazardType = hazardTypes[i]
        break
      }
    }

    const severity: AlertSeverity =
      hazardType === "road_closure" || hazardType === "accident"
        ? "critical"
        : hazardType === "congestion" || hazardType === "obstacle"
          ? "warn"
          : "info"

    const interruption: InterruptionLevel =
      hazardType === "road_closure" ? "full" : hazardType === "obstacle" ? "partial" : "none"

    const confidence = 0.5 + Math.random() * 0.4 // 0.5-0.9

    const stream = this.streams.get(streamId)

    return {
      severity,
      hazardType,
      interruption,
      hasPeople: Math.random() > 0.7,
      hasVehicles: Math.random() > 0.3,
      reason: this.getHazardReason(hazardType),
      description: this.getHazardDescription(hazardType),
      confidence,
      occurredAt: new Date(),
      lat: stream?.telemetry.lat,
      lng: stream?.telemetry.lng,
    }
  }

  // Settings operations
  getSettings(): Settings {
    return { ...this.settings }
  }

  updateSettings(updates: Partial<Settings>): Settings {
    this.settings = { ...this.settings, ...updates }
    this.emit("settings.updated", this.settings)
    return this.settings
  }
}

export const dataStore = new DataStore()
