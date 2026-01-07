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

// Test blockage points for Tai-8 map
export type BlockPoint = {
  id: string
  lat: number
  lng: number
  status: "fully_blocked" | "partially_blocked"
  label: string
}

export const tai8BlockagePoints: BlockPoint[] = [
  { id: "block_3", lat: 24.24142253349646, lng: 120.83369109693069, status: "partially_blocked", label: "1.6km=>1.6km" },
  { id: "block_2", lat: 24.19641391489506, lng: 120.83896859104198, status: "fully_blocked", label: "6.7km=>6.7km" },
  { id: "block_7", lat: 24.17339895177517, lng: 120.83852149496494, status: "fully_blocked", label: "9.4km=>9.4km" },
  { id: "block_5", lat: 24.16847971328785, lng: 120.84276812819672, status: "partially_blocked", label: "14.1km=>14.1km" },
  { id: "block_6", lat: 24.16543277634449, lng: 121.60416900160862, status: "partially_blocked", label: "173.8km=>173.8km" },
  { id: "block_4", lat: 24.160379267144165, lng: 121.6158291888184, status: "fully_blocked", label: "172.5km=>172.5km" },
  { id: "block_1", lat: 24.184313927998218, lng: 120.92400483086016, status: "fully_blocked", label: "21.4km=>21.4km" },
  { id: "block_9", lat: 24.200794525815, lng: 121.0014835884196, status: "partially_blocked", label: "31.1km=>31.1km" },
  { id: "block_15", lat: 24.194074784869002, lng: 120.99453869594981, status: "partially_blocked", label: "31.6km=>31.6km" },
  { id: "block_11", lat: 24.197756538540943, lng: 120.99836843335237, status: "fully_blocked", label: "32.0km=>32.0km" },
  { id: "block_14", lat: 24.19501644601175, lng: 120.99595799854484, status: "fully_blocked", label: "32.5km=>32.5km" },
  { id: "block_13", lat: 24.198346271253712, lng: 121.00018070921294, status: "partially_blocked", label: "32.7km=>32.7km" },
  { id: "block_10", lat: 24.20263921503745, lng: 121.00326291780601, status: "partially_blocked", label: "32.8km=>32.8km" },
  { id: "block_8", lat: 24.191875969636513, lng: 120.99251898374712, status: "partially_blocked", label: "33.3km=>33.3km" },
  { id: "block_17", lat: 24.2030591603107, lng: 121.00800422258834, status: "partially_blocked", label: "34.2km=>34.2km" },
  { id: "block_16", lat: 24.202299683641257, lng: 121.00927771273314, status: "fully_blocked", label: "34.4km=>34.4km" },
  { id: "block_20", lat: 24.20330933965218, lng: 121.0138720762514, status: "partially_blocked", label: "34.9km=>34.9km" },
  { id: "block_18", lat: 24.20417602914229, lng: 121.01433249221168, status: "fully_blocked", label: "35.0km=>35.0km" },
  { id: "block_19", lat: 24.206776073010175, lng: 121.01305898438568, status: "fully_blocked", label: "35.3km=>35.3km" },
  { id: "block_21", lat: 24.207553392326858, lng: 121.0121773367826, status: "fully_blocked", label: "35.4km=>35.4km" },
  { id: "block_22", lat: 24.209765730292602, lng: 121.42489699384845, status: "partially_blocked", label: "155.5km=>155.5km" },
  { id: "block_23", lat: 24.214490144955022, lng: 121.03704506585763, status: "fully_blocked", label: "38.2km=>38.2km" },
  { id: "block_24", lat: 24.25105789799798, lng: 121.16649099943265, status: "partially_blocked", label: "61.5km=>61.5km" },
  { id: "block_28", lat: 24.25343406325875, lng: 121.17354795830141, status: "partially_blocked", label: "62.3km=>62.3km" },
  { id: "block_25", lat: 24.251149773652614, lng: 121.17072911849732, status: "fully_blocked", label: "62.4km=>62.4km" },
  { id: "block_26", lat: 24.252138912920202, lng: 121.17199754756007, status: "partially_blocked", label: "62.5km=>62.5km" },
  { id: "block_29", lat: 24.254532958531996, lng: 121.17477256816983, status: "partially_blocked", label: "63.0km=>63.0km" },
  { id: "block_30", lat: 24.254808573509422, lng: 121.17526454558924, status: "fully_blocked", label: "63.1km=>63.1km" },
  { id: "block_27", lat: 24.252836068654503, lng: 121.1721279512139, status: "fully_blocked", label: "63.3km=>63.3km" },
  { id: "block_34", lat: 24.25510577336648, lng: 121.24970590932026, status: "partially_blocked", label: "96.1km=>96.1km" },
  { id: "block_31", lat: 24.254591182825436, lng: 121.24775183663724, status: "fully_blocked", label: "96.3km=>96.3km" },
  { id: "block_33", lat: 24.254168012277688, lng: 121.25231034959876, status: "fully_blocked", label: "97.4km=>97.4km" },
  { id: "block_32", lat: 24.25412538677392, lng: 121.25298046465122, status: "fully_blocked", label: "97.4km=>97.4km" },
  { id: "block_35", lat: 24.254423769462363, lng: 121.25568430808391, status: "partially_blocked", label: "97.7km=>97.7km" },
  { id: "block_36", lat: 24.253827007849864, lng: 121.25366616377585, status: "partially_blocked", label: "97.8km=>97.8km" },
  { id: "block_37", lat: 24.25417512099115, lng: 121.25513107356403, status: "partially_blocked", label: "97.8km=>97.8km" },
  { id: "block_38", lat: 24.186306251672463, lng: 121.32665756854954, status: "partially_blocked", label: "145.5km=>145.5km" },
  { id: "block_41", lat: 24.187379427279623, lng: 121.33241501571928, status: "fully_blocked", label: "146.1km=>146.1km" },
  { id: "block_40", lat: 24.18838248108385, lng: 121.33478236908104, status: "partially_blocked", label: "146.3km=>146.3km" },
  { id: "block_42", lat: 24.185007473705667, lng: 121.34193614571683, status: "partially_blocked", label: "147.0km=>147.0km" },
  { id: "block_39", lat: 24.183839179299923, lng: 121.34259589925557, status: "fully_blocked", label: "147.2km=>147.2km" },
  { id: "block_43", lat: 24.179793820793563, lng: 121.50990359394893, status: "fully_blocked", label: "175.8km=>175.8km" },
  { id: "block_44", lat: 24.17524657513239, lng: 120.93181518751715, status: "partially_blocked", label: "9.7km=>9.7km" },
  { id: "block_45", lat: 24.170584317300907, lng: 120.90581935642837, status: "fully_blocked", label: "8.7km=>8.7km" },
  { id: "block_47", lat: 24.168704946619087, lng: 120.89777502518774, status: "partially_blocked", label: "6.7km=>6.7km" },
  { id: "block_50", lat: 24.165079051253088, lng: 121.60557154094198, status: "partially_blocked", label: "175.7km=>175.7km" },
  { id: "block_49", lat: 24.16390910501218, lng: 121.60628538602407, status: "fully_blocked", label: "175.8km=>175.8km" },
  { id: "block_46", lat: 24.170192455505827, lng: 120.90524451561367, status: "fully_blocked", label: "8.1km=>8.1km" },
]
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

    // Create mock tasks (依台八線 9 路段 + 中斷點統計重新編寫)
    const tai8Tasks: Task[] = [
      {
        id: "task_1",
        name: "台八線 · 東勢 - 天冷路段",
        description: "巡檢範圍：東勢（24.1843, 120.9240）至 天冷（24.1964, 120.8390），全長約 22 公里",
        status: "running",
        startAt: new Date(Date.now() - 1.2 * 60 * 60 * 1000),
        createdBy: "user-demo",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        boundStreamIds: ["stream-1"],
        notifyGroupIds: ["group-1", "group-2"],
        metrics: {
          alertCountTotal: 9,
          alertCountByType: { road_closure: 5, obstacle: 4 },
          lastAlertAt: new Date(Date.now() - 9 * 60 * 1000),
        },
        currentTelemetry: { lat: 24.19, lng: 120.90, altitude: 120 },
        historyStreams: [{ streamId: "stream-1", startAt: new Date(Date.now() - 1.2 * 60 * 60 * 1000) }],
      },

      {
        id: "task_2",
        name: "台八線 · 天冷 - 谷關路段",
        description: "巡檢範圍：天冷（24.1964, 120.8390）至 谷關（24.2026, 121.0033），全長約 11 公里",
        status: "running",
        startAt: new Date(Date.now() - 2.3 * 60 * 60 * 1000),
        createdBy: "user-demo",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        boundStreamIds: ["stream-2"],
        notifyGroupIds: ["group-1"],
        metrics: {
          alertCountTotal: 7,
          alertCountByType: { road_closure: 2, obstacle: 5 },
          lastAlertAt: new Date(Date.now() - 16 * 60 * 1000),
        },
        historyStreams: [{ streamId: "stream-2", startAt: new Date(Date.now() - 2.3 * 60 * 60 * 1000) }],
      },

      {
        id: "task_3",
        name: "台八線 · 谷關 - 德基路段",
        description: "巡檢範圍：谷關（24.2026, 121.0033）至 德基（24.2511, 121.1707），全長約 27 公里",
        status: "running",
        startAt: new Date(Date.now() - 3.6 * 60 * 60 * 1000),
        createdBy: "user-demo",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        boundStreamIds: ["stream-1", "stream-3"],
        notifyGroupIds: ["group-1", "group-3"],
        metrics: {
          alertCountTotal: 7,
          alertCountByType: { road_closure: 5, obstacle: 2 },
          lastAlertAt: new Date(Date.now() - 7 * 60 * 1000),
        },
        historyStreams: [
          { streamId: "stream-1", startAt: new Date(Date.now() - 3.6 * 60 * 60 * 1000) },
          { streamId: "stream-3", startAt: new Date(Date.now() - 2.8 * 60 * 60 * 1000) },
        ],
      },

      {
        id: "task_4",
        name: "台八線 · 德基 - 梨山路段",
        description: "巡檢範圍：德基（24.2511, 121.1707）至 梨山（24.2541, 121.2529），全長約 35 公里",
        status: "running",
        startAt: new Date(Date.now() - 4.8 * 60 * 60 * 1000),
        createdBy: "user-demo",
        createdAt: new Date(Date.now() - 5.2 * 60 * 60 * 1000),
        boundStreamIds: ["stream-2"],
        notifyGroupIds: ["group-2"],
        metrics: {
          alertCountTotal: 7,
          alertCountByType: { road_closure: 3, obstacle: 4 },
          lastAlertAt: new Date(Date.now() - 28 * 60 * 1000),
        },
        historyStreams: [{ streamId: "stream-2", startAt: new Date(Date.now() - 4.8 * 60 * 60 * 1000) }],
      },

      {
        id: "task_5",
        name: "台八線 · 梨山 - 大禹嶺路段",
        description: "巡檢範圍：梨山（24.2541, 121.2529）至 大禹嶺（24.1863, 121.3267），全長約 49 公里",
        status: "running",
        startAt: new Date(Date.now() - 6.1 * 60 * 60 * 1000),
        createdBy: "user-demo",
        createdAt: new Date(Date.now() - 6.6 * 60 * 60 * 1000),
        boundStreamIds: ["stream-3"],
        notifyGroupIds: ["group-2", "group-3"],
        metrics: {
          alertCountTotal: 7,
          alertCountByType: { road_closure: 3, obstacle: 4 },
          lastAlertAt: new Date(Date.now() - 43 * 60 * 1000),
        },
        historyStreams: [{ streamId: "stream-3", startAt: new Date(Date.now() - 6.1 * 60 * 60 * 1000) }],
      },

      {
        id: "task_6",
        name: "台八線 · 大禹嶺 - 關原路段",
        description: "巡檢範圍：大禹嶺（24.1863, 121.3267）至 關原（24.1874, 121.3324），全長約 2 公里",
        status: "running",
        startAt: new Date(Date.now() - 1.0 * 60 * 60 * 1000),
        createdBy: "user-demo",
        createdAt: new Date(Date.now() - 1.1 * 60 * 60 * 1000),
        boundStreamIds: ["stream-1"],
        notifyGroupIds: ["group-1"],
        metrics: {
          alertCountTotal: 0,
          alertCountByType: { road_closure: 0, obstacle: 0 },
          lastAlertAt: undefined,
        },
        historyStreams: [{ streamId: "stream-1", startAt: new Date(Date.now() - 1.0 * 60 * 60 * 1000) }],
      },

      {
        id: "task_7",
        name: "台八線 · 關原 - 天祥路段",
        description: "巡檢範圍：關原（24.1874, 121.3324）至 天祥（24.1706, 121.5475），全長約 25 公里",
        status: "running",
        startAt: new Date(Date.now() - 3.0 * 60 * 60 * 1000),
        createdBy: "user-demo",
        createdAt: new Date(Date.now() - 3.2 * 60 * 60 * 1000),
        boundStreamIds: ["stream-2"],
        notifyGroupIds: ["group-3"],
        metrics: {
          alertCountTotal: 6,
          alertCountByType: { road_closure: 2, obstacle: 4 },
          lastAlertAt: new Date(Date.now() - 19 * 60 * 1000),
        },
        historyStreams: [{ streamId: "stream-2", startAt: new Date(Date.now() - 3.0 * 60 * 60 * 1000) }],
      },

      {
        id: "task_8",
        name: "台八線 · 天祥 - 太魯閣路段",
        description: "巡檢範圍：天祥（24.1706, 121.5475）至 太魯閣（24.1639, 121.6063），全長約 7 公里",
        status: "paused",
        startAt: new Date(Date.now() - 5.5 * 60 * 60 * 1000),
        createdBy: "user-demo",
        createdAt: new Date(Date.now() - 6.0 * 60 * 60 * 1000),
        boundStreamIds: ["stream-3"],
        notifyGroupIds: ["group-2"],
        metrics: {
          alertCountTotal: 5,
          alertCountByType: { road_closure: 3, obstacle: 2 },
          lastAlertAt: new Date(Date.now() - 33 * 60 * 1000),
        },
        historyStreams: [{ streamId: "stream-3", startAt: new Date(Date.now() - 5.5 * 60 * 60 * 1000) }],
      },

      {
        id: "task_9",
        name: "台八線 · 太魯閣 - 新城路段",
        description: "巡檢範圍：太魯閣（24.1639, 121.6063）至 新城（24.1702, 120.9052），全長約 13 公里",
        status: "running",
        startAt: new Date(Date.now() - 0.8 * 60 * 60 * 1000),
        createdBy: "user-demo",
        createdAt: new Date(Date.now() - 0.9 * 60 * 60 * 1000),
        boundStreamIds: ["stream-2"],
        notifyGroupIds: ["group-1", "group-3"],
        metrics: {
          alertCountTotal: 0,
          alertCountByType: { road_closure: 0, obstacle: 0 },
          lastAlertAt: undefined,
        },
        historyStreams: [{ streamId: "stream-2", startAt: new Date(Date.now() - 0.8 * 60 * 60 * 1000) }],
      },
    ]

    tai8Tasks.forEach((t) => this.tasks.set(t.id, t))

    // Create mock alerts (對應台八線任務：挑幾個「完全阻斷多」的做 Critical，「部分阻斷」做 Warn)
    this.createMockAlert("tai8-task-dongshi-tianleng", "stream-1", "critical", "road_closure", 0.92, true, true)
    this.createMockAlert("tai8-task-guguan-deji", "stream-3", "critical", "road_closure", 0.90, true, true)
    this.createMockAlert("tai8-task-tianxiang-taroko", "stream-3", "critical", "road_closure", 0.89, true, true)

    this.createMockAlert("tai8-task-tianleng-guguan", "stream-2", "warn", "obstacle", 0.72, false, true)
    this.createMockAlert("tai8-task-deji-lishan", "stream-2", "warn", "obstacle", 0.70, false, false)
    this.createMockAlert("tai8-task-guanyuan-tianxiang", "stream-2", "warn", "obstacle", 0.68, false, false)

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
