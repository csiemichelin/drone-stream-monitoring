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

// Test alert points for Tai-8 map
export type AlertPoint = {
  id: string
  lat: number
  lng: number
  status: "fully_blocked" | "partially_blocked"
  label: string
}

export const tai8AlertPoints: AlertPoint[] = [
  { id: "block_1", lat: 24.24142253349646, lng: 120.83369109693069, status: "partially_blocked", label: "1.6km=>1.6km" },     // 東勢 - 天冷
  { id: "block_2", lat: 24.19641391489506, lng: 120.83896859104198, status: "fully_blocked", label: "6.7km=>6.7km" },         // 東勢 - 天冷
  { id: "block_3", lat: 24.17339895177517, lng: 120.83852149496494, status: "fully_blocked", label: "7.2km=>7.2km" },         // 東勢 - 天冷
  { id: "block_4", lat: 24.16847971328785, lng: 120.84276812819672, status: "partially_blocked", label: "7.8km=>7.8km" },     // 東勢 - 天冷
  { id: "block_5", lat: 24.168704946619087, lng: 120.89777502518774, status: "partially_blocked", label: "8.7km=>8.7km" },    // 東勢 - 天冷
  { id: "block_6", lat: 24.170192455505827, lng: 120.90524451561367, status: "fully_blocked", label: "9.1km=>9.1km" },        // 東勢 - 天冷
  { id: "block_7", lat: 24.170584317300907, lng: 120.90581935642837, status: "fully_blocked", label: "9.5km=>9.5km" },        // 東勢 - 天冷
  { id: "block_8", lat: 24.184313927998218, lng: 120.92400483086016, status: "fully_blocked", label: "15.4km=>15.4km" },      // 東勢 - 天冷
  { id: "block_9", lat: 24.17524657513239, lng: 120.93181518751715, status: "partially_blocked", label: "19.7km=>19.7km" },   // 東勢 - 天冷

  { id: "block_10", lat: 24.191875969636513, lng: 120.99251898374712, status: "partially_blocked", label: "24.3km=>24.3km" }, // 天冷 - 谷關
  { id: "block_11", lat: 24.194074784869002, lng: 120.99453869594981, status: "partially_blocked", label: "25.6km=>25.6km" }, // 天冷 - 谷關
  { id: "block_12", lat: 24.19501644601175, lng: 120.99595799854484, status: "fully_blocked", label: "26.5km=>26.5km" },      // 天冷 - 谷關
  { id: "block_13", lat: 24.197756538540943, lng: 120.99836843335237, status: "fully_blocked", label: "28.0km=>28.0km" },     // 天冷 - 谷關
  { id: "block_14", lat: 24.198346271253712, lng: 121.00018070921294, status: "partially_blocked", label: "29.7km=>29.7km" }, // 天冷 - 谷關
  { id: "block_15", lat: 24.200794525815, lng: 121.0014835884196, status: "partially_blocked", label: "31.1km=>31.1km" },     // 天冷 - 谷關
  { id: "block_16", lat: 24.20263921503745, lng: 121.00326291780601, status: "partially_blocked", label: "31.8km=>31.8km" },  // 天冷 - 谷關

  { id: "block_17", lat: 24.2030591603107, lng: 121.00800422258834, status: "partially_blocked", label: "34.2km=>34.2km" },   // 谷關 - 德基
  { id: "block_18", lat: 24.202299683641257, lng: 121.00927771273314, status: "fully_blocked", label: "34.4km=>34.4km" },     // 谷關 - 德基
  { id: "block_19", lat: 24.20330933965218, lng: 121.0138720762514, status: "partially_blocked", label: "34.9km=>34.9km" },   // 谷關 - 德基
  { id: "block_20", lat: 24.20417602914229, lng: 121.01433249221168, status: "fully_blocked", label: "35.0km=>35.0km" },      // 谷關 - 德基
  { id: "block_21", lat: 24.206776073010175, lng: 121.01305898438568, status: "fully_blocked", label: "35.3km=>35.3km" },     // 谷關 - 德基
  { id: "block_22", lat: 24.207553392326858, lng: 121.0121773367826, status: "fully_blocked", label: "35.4km=>35.4km" },      // 谷關 - 德基
  { id: "block_23", lat: 24.214490144955022, lng: 121.03704506585763, status: "fully_blocked", label: "38.2km=>38.2km" },     // 谷關 - 德基
  { id: "block_24", lat: 24.25105789799798, lng: 121.16649099943265, status: "partially_blocked", label: "61.5km=>61.5km" },  // 谷關 - 德基

  { id: "block_25", lat: 24.251149773652614, lng: 121.17072911849732, status: "fully_blocked", label: "62.4km=>62.4km" },     // 德基 - 梨山
  { id: "block_26", lat: 24.252138912920202, lng: 121.17199754756007, status: "partially_blocked", label: "62.5km=>62.5km" }, // 德基 - 梨山
  { id: "block_27", lat: 24.252836068654503, lng: 121.1721279512139, status: "fully_blocked", label: "63.3km=>63.3km" },      // 德基 - 梨山
  { id: "block_28", lat: 24.25343406325875, lng: 121.17354795830141, status: "partially_blocked", label: "63.0km=>63.0km" },  // 德基 - 梨山
  { id: "block_29", lat: 24.254532958531996, lng: 121.17477256816983, status: "partially_blocked", label: "64.0km=>64.0km" }, // 德基 - 梨山
  { id: "block_30", lat: 24.254808573509422, lng: 121.17526454558924, status: "fully_blocked", label: "64.1km=>64.1km" },     // 德基 - 梨山
  { id: "block_31", lat: 24.254591182825436, lng: 121.24775183663724, status: "fully_blocked", label: "95.3km=>95.3km" },     // 德基 - 梨山
  { id: "block_32", lat: 24.25510577336648, lng: 121.24970590932026, status: "partially_blocked", label: "96.1km=>96.1km" },  // 德基 - 梨山
  { id: "block_33", lat: 24.254168012277688, lng: 121.25231034959876, status: "fully_blocked", label: "97.4km=>97.4km" },     // 德基 - 梨山
  { id: "block_34", lat: 24.25412538677392, lng: 121.25298046465122, status: "fully_blocked", label: "97.6km=>97.6km" },      // 德基 - 梨山
  { id: "block_35", lat: 24.253827007849864, lng: 121.25366616377585, status: "partially_blocked", label: "98.0km=>98.0km" }, // 德基 - 梨山
  { id: "block_36", lat: 24.25417512099115, lng: 121.25513107356403, status: "partially_blocked", label: "98.8km=>98.8km" },  // 德基 - 梨山
  { id: "block_37", lat: 24.254423769462363, lng: 121.25568430808391, status: "partially_blocked", label: "99.0km=>99.0km" }, // 德基 - 梨山

  { id: "block_38", lat: 24.186306251672463, lng: 121.32665756854954, status: "partially_blocked", label: "145.5km=>145.5km" },  // 大禹嶺 - 關原
  { id: "block_39", lat: 24.187379427279623, lng: 121.33241501571928, status: "fully_blocked", label: "146.1km=>146.1km" },      // 大禹嶺 - 關原
  { id: "block_40", lat: 24.18838248108385, lng: 121.33478236908104, status: "partially_blocked", label: "146.3km=>146.3km" },   // 大禹嶺 - 關原

  { id: "block_41", lat: 24.185007473705667, lng: 121.34193614571683, status: "partially_blocked", label: "147.0km=>147.0km" },  // 關原 - 天祥
  { id: "block_42", lat: 24.183839179299923, lng: 121.34259589925557, status: "fully_blocked", label: "147.2km=>147.2km" },      // 關原 - 天祥
  { id: "block_43", lat: 24.209765730292602, lng: 121.42489699384845, status: "partially_blocked", label: "155.5km=>155.5km" },  // 關原 - 天祥
  
  { id: "block_44", lat: 24.179793820793563, lng: 121.50990359394893, status: "fully_blocked", label: "165.8km=>165.8km" },      // 天祥 - 太魯閣
  { id: "block_45", lat: 24.16543277634449, lng: 121.60416900160862, status: "partially_blocked", label: "175.4km=>175.4km" },   // 天祥 - 太魯閣
  { id: "block_46", lat: 24.165079051253088, lng: 121.60557154094198, status: "partially_blocked", label: "175.7km=>175.7km" },  // 天祥 - 太魯閣
  { id: "block_47", lat: 24.16390910501218, lng: 121.60628538602407, status: "fully_blocked", label: "175.8km=>175.8km" },       // 天祥 - 太魯閣
  { id: "block_48", lat: 24.160379267144165, lng: 121.6158291888184, status: "fully_blocked", label: "177.5km=>177.5km" },        // 天祥 - 太魯閣
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

    // Create mock streams (與台八線 9 路段 Task 一一對應：stream-1 ↔ task_1 ... stream-9 ↔ task_9)
    const tai8Streams: Stream[] = [
      {
        id: "stream-1",
        name: "東勢 - 天冷",
        sourceType: "rtsp",
        sourceUrl: "/sample-traffic.mp4",
        status: "online",
        lastSeenAt: new Date(),
        stats: { fps: 25, latencyMs: 110, bitrateKbps: 2200 },
        telemetry: { lat: 24.1843, lng: 120.9240, altitude: 120, heading: 90, speed: 0 },
        tags: ["台八線", "東勢", "天冷"],
      },
      {
        id: "stream-2",
        name: "天冷 - 谷關",
        sourceType: "rtsp",
        sourceUrl: "/sample-traffic-2.mp4",
        status: "online",
        lastSeenAt: new Date(),
        stats: { fps: 25, latencyMs: 95, bitrateKbps: 2100 },
        telemetry: { lat: 24.1964, lng: 120.8390, altitude: 120, heading: 90, speed: 0 },
        tags: ["台八線", "天冷", "谷關"],
      },
      {
        id: "stream-3",
        name: "谷關 - 德基",
        sourceType: "rtsp",
        sourceUrl: "/sample-traffic.mp4",
        status: "online",
        lastSeenAt: new Date(),
        stats: { fps: 20, latencyMs: 140, bitrateKbps: 1800 },
        telemetry: { lat: 24.2026, lng: 121.0033, altitude: 150, heading: 100, speed: 0 },
        tags: ["台八線", "谷關", "德基"],
      },
      {
        id: "stream-4",
        name: "德基 - 梨山",
        sourceType: "rtsp",
        sourceUrl: "/sample-traffic-2.mp4",
        status: "online",
        lastSeenAt: new Date(),
        stats: { fps: 22, latencyMs: 160, bitrateKbps: 1700 },
        telemetry: { lat: 24.2511, lng: 121.1707, altitude: 160, heading: 110, speed: 0 },
        tags: ["台八線", "德基", "梨山"],
      },
      {
        id: "stream-5",
        name: "梨山 - 大禹嶺",
        sourceType: "rtsp",
        sourceUrl: "/sample-traffic.mp4",
        status: "online",
        lastSeenAt: new Date(),
        stats: { fps: 18, latencyMs: 190, bitrateKbps: 1500 },
        telemetry: { lat: 24.2541, lng: 121.2529, altitude: 180, heading: 120, speed: 0 },
        tags: ["台八線", "梨山", "大禹嶺"],
      },
      {
        id: "stream-6",
        name: "大禹嶺 - 關原",
        sourceType: "rtsp",
        sourceUrl: "/sample-traffic-2.mp4",
        status: "online",
        lastSeenAt: new Date(),
        stats: { fps: 20, latencyMs: 130, bitrateKbps: 1600 },
        telemetry: { lat: 24.1863, lng: 121.3267, altitude: 190, heading: 130, speed: 0 },
        tags: ["台八線", "大禹嶺", "關原"],
      },
      {
        id: "stream-7",
        name: "關原 - 天祥",
        sourceType: "rtsp",
        sourceUrl: "/sample-traffic.mp4",
        status: "online",
        lastSeenAt: new Date(),
        stats: { fps: 16, latencyMs: 220, bitrateKbps: 1200 },
        telemetry: { lat: 24.1874, lng: 121.3324, altitude: 170, heading: 140, speed: 0 },
        tags: ["台八線", "關原", "天祥"],
      },
      {
        id: "stream-8",
        name: "天祥 - 太魯閣",
        sourceType: "rtsp",
        sourceUrl: "/sample-traffic-2.mp4",
        status: "degraded",
        lastSeenAt: new Date(Date.now() - 60_000),
        stats: { fps: 12, latencyMs: 280, bitrateKbps: 900 },
        telemetry: { lat: 24.1706, lng: 121.5475, altitude: 140, heading: 150, speed: 0 },
        tags: ["台八線", "天祥", "太魯閣"],
      },
      {
        id: "stream-9",
        name: "太魯閣 - 新城",
        sourceType: "rtsp",
        sourceUrl: "/sample-traffic.mp4",
        status: "online",
        lastSeenAt: new Date(),
        stats: { fps: 24, latencyMs: 105, bitrateKbps: 2000 },
        telemetry: { lat: 24.1639, lng: 121.6063, altitude: 120, heading: 160, speed: 0 },
        tags: ["台八線", "太魯閣", "新城"],
      },
    ]
    tai8Streams.forEach((s) => this.streams.set(s.id, s))

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
          alertCountByType: { road_collapse: 5, obstacle: 4 },
          lastAlertAt: undefined,
          alertPointIds: ["block_1", "block_2", "block_3", "block_4", "block_5", "block_6", "block_7", "block_8", "block_9"],
        },
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
          alertCountByType: { road_collapse: 2, obstacle: 5 },
          lastAlertAt: undefined,
          alertPointIds: ["block_10", "block_11", "block_12", "block_13", "block_14", "block_15", "block_16"],
        },
      },

      {
        id: "task_3",
        name: "台八線 · 谷關 - 德基路段",
        description: "巡檢範圍：谷關（24.2026, 121.0033）至 德基（24.2511, 121.1707），全長約 27 公里",
        status: "running",
        startAt: new Date(Date.now() - 3.6 * 60 * 60 * 1000),
        createdBy: "user-demo",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        boundStreamIds: ["stream-3"],
        notifyGroupIds: ["group-1", "group-3"],
        metrics: {
          alertCountTotal: 8,
          alertCountByType: { road_collapse: 5, obstacle: 3 },
          lastAlertAt: undefined,
          alertPointIds: ["block_17", "block_18", "block_19", "block_20", "block_21", "block_22", "block_23", "block_24"],
        },
      },

      {
        id: "task_4",
        name: "台八線 · 德基 - 梨山路段",
        description: "巡檢範圍：德基（24.2511, 121.1707）至 梨山（24.2541, 121.2529），全長約 35 公里",
        status: "running",
        startAt: new Date(Date.now() - 4.8 * 60 * 60 * 1000),
        createdBy: "user-demo",
        createdAt: new Date(Date.now() - 5.2 * 60 * 60 * 1000),
        boundStreamIds: ["stream-4"],
        notifyGroupIds: ["group-2"],
        metrics: {
          alertCountTotal: 13,
          alertCountByType: { road_collapse: 6, obstacle: 7 },
          lastAlertAt: undefined,
          alertPointIds: ["block_25", "block_26", "block_27", "block_28", "block_29", "block_30", "block_31", "block_32", "block_33", "block_34", "block_35", "block_36", "block_37"],
        },
      },

      {
        id: "task_5",
        name: "台八線 · 梨山 - 大禹嶺路段",
        description: "巡檢範圍：梨山（24.2541, 121.2529）至 大禹嶺（24.1863, 121.3267），全長約 49 公里",
        status: "running",
        startAt: new Date(Date.now() - 6.1 * 60 * 60 * 1000),
        createdBy: "user-demo",
        createdAt: new Date(Date.now() - 6.6 * 60 * 60 * 1000),
        boundStreamIds: ["stream-5"],
        notifyGroupIds: ["group-2", "group-3"],
        metrics: {
          alertCountTotal: 0,
          alertCountByType: { road_collapse: 0, obstacle: 0 },
          lastAlertAt: undefined,
          alertPointIds: [],
        },
      },

      {
        id: "task_6",
        name: "台八線 · 大禹嶺 - 關原路段",
        description: "巡檢範圍：大禹嶺（24.1863, 121.3267）至 關原（24.1874, 121.3324），全長約 2 公里",
        status: "running",
        startAt: new Date(Date.now() - 1.0 * 60 * 60 * 1000),
        createdBy: "user-demo",
        createdAt: new Date(Date.now() - 1.1 * 60 * 60 * 1000),
        boundStreamIds: ["stream-6"],
        notifyGroupIds: ["group-1"],
        metrics: {
          alertCountTotal: 3,
          alertCountByType: { road_collapse: 1, obstacle: 2 },
          lastAlertAt: undefined,
          alertPointIds: ["block_38", "block_39", "block_40"],
        },
      },

      {
        id: "task_7",
        name: "台八線 · 關原 - 天祥路段",
        description: "巡檢範圍：關原（24.1874, 121.3324）至 天祥（24.1706, 121.5475），全長約 25 公里",
        status: "running",
        startAt: new Date(Date.now() - 3.0 * 60 * 60 * 1000),
        createdBy: "user-demo",
        createdAt: new Date(Date.now() - 3.2 * 60 * 60 * 1000),
        boundStreamIds: ["stream-7"],
        notifyGroupIds: ["group-3"],
        metrics: {
          alertCountTotal: 3,
          alertCountByType: { road_collapse: 1, obstacle: 2 },
          lastAlertAt: undefined,
          alertPointIds: ["block_41", "block_42", "block_43"],
        },
      },

      {
        id: "task_8",
        name: "台八線 · 天祥 - 太魯閣路段",
        description: "巡檢範圍：天祥（24.1706, 121.5475）至 太魯閣（24.1639, 121.6063），全長約 7 公里",
        status: "paused",
        startAt: new Date(Date.now() - 5.5 * 60 * 60 * 1000),
        createdBy: "user-demo",
        createdAt: new Date(Date.now() - 6.0 * 60 * 60 * 1000),
        boundStreamIds: ["stream-8"],
        notifyGroupIds: ["group-2"],
        metrics: {
          alertCountTotal: 5,
          alertCountByType: { road_collapse: 3, obstacle: 2 },
          lastAlertAt: undefined,
          alertPointIds: ["block_44", "block_45", "block_46", "block_47", "block_48"],
        },
      },

      {
        id: "task_9",
        name: "台八線 · 太魯閣 - 新城路段",
        description: "巡檢範圍：太魯閣（24.1639, 121.6063）至 新城（24.1702, 120.9052），全長約 13 公里",
        status: "running",
        startAt: new Date(Date.now() - 0.8 * 60 * 60 * 1000),
        createdBy: "user-demo",
        createdAt: new Date(Date.now() - 0.9 * 60 * 60 * 1000),
        boundStreamIds: ["stream-9"],
        notifyGroupIds: ["group-1", "group-3"],
        metrics: {
          alertCountTotal: 0,
          alertCountByType: { road_collapse: 0, obstacle: 0 },
          lastAlertAt: undefined,
          alertPointIds: [],
        },
      },
    ]

    tai8Tasks.forEach((t) => this.tasks.set(t.id, t))

    const alertPointById = new Map(tai8AlertPoints.map((point) => [point.id, point]))

    this.tasks.forEach((task) => {
      const alertPointIds = task.metrics?.alertPointIds ?? []
      if (alertPointIds.length === 0) return
      const streamId = task.boundStreamIds[0]
      if (!streamId) return
      alertPointIds.forEach((pointId) => {
        const point = alertPointById.get(pointId)
        if (!point) return
        const hazardType: HazardType = point.status === "fully_blocked" ? "road_collapse" : "obstacle"
        const severity: AlertSeverity = hazardType === "road_collapse" ? "critical" : "warn"
        const interruption: InterruptionLevel = hazardType === "road_collapse" ? "full" : "partial"
        const confidence = 0.65 + Math.random() * 0.25
        const disasterType = this.getHazardTypeLabel(hazardType)
        const alertId = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        const alert: Alert = {
          id: alertId,
          taskId: task.id,
          streamId,
          createdAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
          severity,
          hazardType,
          disaster_type: disasterType,
          interruption,
          hasPeople: false,
          hasVehicles: true,
          reason: this.pickRandom(this.getHazardReasonOptions(hazardType)),
          description: this.pickRandom(this.getHazardDescriptionOptions(hazardType, point)),
          confidence,
          ai_summary: `偵測到${disasterType}，信心 ${(confidence * 100).toFixed(0)}%。`,
          ai_reasoning: "依據影像中的道路狀態、車流變化與可見障礙判斷。",
          analysis_detail: `中斷程度：${interruption === "full" ? "完全" : "部分"}，影像來源：${streamId}。`,
          occurredAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
          snapshotUrl: `/placeholder.svg?height=180&width=320&query=${hazardType}+detection`,
          analysisRaw: { model: "mock-vlm-v1", confidence },
          status: "open",
          notifications: task.notifyGroupIds.map((groupId) => ({
            groupId,
            sentAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
            channel: "demo-notification",
          })),
          lat: point.lat,
          lng: point.lng,
        }

        this.alerts.set(alert.id, alert)
      })
    })
  }

  private getHazardReason(type: HazardType): string {
    const reasons: Record<HazardType, string> = {
      obstacle: "路面出現障礙物影響通行",
      landslide: "土石流影響道路安全",
      rockfall: "邊坡落石影響通行",
      road_collapse: "道路坍方無法通行",
      flooding: "積水或淹水影響通行",
      bridge_damage: "橋梁結構受損",
      tunnel_damage: "隧道結構異常",
      slope_failure: "邊坡不穩定有滑動風險",
      unknown: "偵測到異常狀況",
    }
    return reasons[type]
  }

  private getHazardReasonOptions(type: HazardType): string[] {
    const reasons: Record<HazardType, string[]> = {
      obstacle: ["路面出現障礙物影響通行", "道路可見異物，需注意通行安全"],
      landslide: ["土石流影響道路安全", "邊坡滑動導致路面受阻"],
      rockfall: ["邊坡落石影響通行", "落石散落路面，需清除後通行"],
      road_collapse: ["道路坍方無法通行", "路基受損，已影響通行"],
      flooding: ["積水或淹水影響通行", "道路淹水，需進行管制"],
      bridge_damage: ["橋梁結構受損", "橋梁安全疑慮需管制"],
      tunnel_damage: ["隧道結構異常", "隧道內部受損，暫停通行"],
      slope_failure: ["邊坡不穩定有滑動風險", "邊坡滑動警示，需注意安全"],
      unknown: ["偵測到異常狀況", "系統偵測到異常，需確認"],
    }
    return reasons[type]
  }

  private getHazardDescription(type: HazardType): string {
    const descriptions: Record<HazardType, string> = {
      obstacle: "偵測到路面有異物或障礙，可能影響車輛通行安全。",
      landslide: "因豪雨或地質因素引發土石流，導致道路中斷或受阻。",
      rockfall: "邊坡落石掉落至道路，需清除後才能恢復通行。",
      road_collapse: "道路路基流失或坍方，需進行工程修復。",
      flooding: "道路積水或淹水，車輛暫時無法安全通行。",
      bridge_damage: "橋梁結構受損，已進行交通管制。",
      tunnel_damage: "隧道內部或結構異常，暫停通行以確保安全。",
      slope_failure: "邊坡滑動風險升高，已實施預警性管制。",
      unknown: "系統偵測到異常狀況，需人工進一步確認。",
    }
    return descriptions[type]
  }

  private getHazardDescriptionOptions(type: HazardType, point?: AlertPoint): string[] {
    const pointLabel = point?.label ? `${point.label} · ` : ""
    const descriptions: Record<HazardType, string[]> = {
      obstacle: [
        `${pointLabel}偵測到路面有異物或障礙，可能影響車輛通行安全。`,
        `${pointLabel}路面出現障礙，建議減速並注意安全。`,
      ],
      landslide: [
        `${pointLabel}因豪雨或地質因素引發土石流，導致道路中斷或受阻。`,
        `${pointLabel}土石流影響道路，需派員清理。`,
      ],
      rockfall: [
        `${pointLabel}邊坡落石掉落至道路，需清除後才能恢復通行。`,
        `${pointLabel}落石散落路面，已影響通行。`,
      ],
      road_collapse: [
        `${pointLabel}道路路基流失或坍方，需進行工程修復。`,
        `${pointLabel}路面坍方，暫停通行並進行搶修。`,
      ],
      flooding: [
        `${pointLabel}道路積水或淹水，車輛暫時無法安全通行。`,
        `${pointLabel}路面積水嚴重，已實施交通管制。`,
      ],
      bridge_damage: [
        `${pointLabel}橋梁結構受損，已進行交通管制。`,
        `${pointLabel}橋梁疑似受損，需檢查後通行。`,
      ],
      tunnel_damage: [
        `${pointLabel}隧道內部或結構異常，暫停通行以確保安全。`,
        `${pointLabel}隧道結構受損，已封閉管制。`,
      ],
      slope_failure: [
        `${pointLabel}邊坡滑動風險升高，已實施預警性管制。`,
        `${pointLabel}邊坡不穩定，建議避免通行。`,
      ],
      unknown: [
        `${pointLabel}系統偵測到異常狀況，需人工進一步確認。`,
        `${pointLabel}異常事件待確認，請注意安全。`,
      ],
    }
    return descriptions[type]
  }

  private pickRandom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)]
  }

  private getHazardTypeLabel(type: HazardType): string {
    const labels: Record<HazardType, string> = {
      obstacle: "路面障礙",
      landslide: "土石流",
      rockfall: "落石",
      road_collapse: "道路坍方",
      flooding: "淹水",
      bridge_damage: "橋梁受損",
      tunnel_damage: "隧道災害",
      slope_failure: "邊坡滑動",
      unknown: "未知事件",
    }
    return labels[type]
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
      "obstacle",
      "landslide",
      "rockfall",
      "road_collapse",
      "flooding",
      "bridge_damage",
      "tunnel_damage",
      "slope_failure",
    ]
    const weights = [0.08, 0.10, 0.22, 0.18, 0.10, 0.08, 0.14, 0.10] // sum = 1.0

    const random = Math.random()
    let hazardType: HazardType = "unknown"
    let sum = 0

    for (let i = 0; i < hazardTypes.length; i++) {
      sum += weights[i]
      if (random <= sum) {
        hazardType = hazardTypes[i]
        break
      }
    }

    // ✅ severity：依你目前語意，結構性/重大災害 = critical
    const severity: AlertSeverity =
      hazardType === "road_collapse" ||
      hazardType === "bridge_damage" ||
      hazardType === "tunnel_damage" ||
      hazardType === "landslide"
        ? "critical"
        : hazardType === "rockfall" || hazardType === "flooding" || hazardType === "slope_failure" || hazardType === "obstacle"
          ? "warn"
          : "info"

    // ✅ interruption：哪些通常會完全中斷/部分中斷（可依你想要的規則再微調）
    const interruption: InterruptionLevel =
      hazardType === "road_collapse" ||
      hazardType === "bridge_damage" ||
      hazardType === "tunnel_damage" ||
      hazardType === "landslide"
        ? "full"
        : hazardType === "rockfall" || hazardType === "flooding" || hazardType === "slope_failure" || hazardType === "obstacle"
          ? "partial"
          : "none"

    const confidence = 0.5 + Math.random() * 0.4 // 0.5-0.9
    const stream = this.streams.get(streamId)

    // ✅ 你已經有中文 label/reason/desc 的 mapping
    const disasterType = this.getHazardTypeLabel(hazardType)

    return {
      severity,
      hazardType,
      disaster_type: disasterType,
      interruption,
      hasPeople: Math.random() > 0.7,
      hasVehicles: Math.random() > 0.3,
      reason: this.getHazardReason(hazardType),
      description: this.getHazardDescription(hazardType),
      confidence,
      ai_summary: `偵測到${disasterType}，信心 ${(confidence * 100).toFixed(0)}%。`,
      ai_reasoning: "依據影像中的道路狀態、車流變化與可見障礙判斷",
      analysis_detail: `中斷程度：${interruption === "full" ? "完全" : interruption === "partial" ? "部分" : "無"}，影像來源：${streamId}。`,
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
