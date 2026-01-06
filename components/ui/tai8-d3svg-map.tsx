"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"

type SegmentStatus = "fully_blocked" | "partially_blocked" | "clear"

type SegmentProps = {
  from_id?: string
  from_name?: string
  to_id?: string
  to_name?: string
  status?: SegmentStatus
  info?: string
}

type SegmentFeature = GeoJSON.Feature<GeoJSON.LineString, SegmentProps>
type GeoJSONLike = GeoJSON.FeatureCollection | GeoJSON.Feature

type BaseMode = "satellite" | "osm" | "county"

type BlockPoint = {
  id: string
  lat: number
  lng: number
  status: "fully_blocked" | "partially_blocked"
  label: string
}

// ✅ 測試點：完全阻斷 / 部分阻斷（含經緯度）
const BLOCKAGE_POINTS: BlockPoint[] = [
  { id: "block_3", lat: 24.24142253349646, lng: 120.83369109693069, status: "partially_blocked", label: "1.6km=>1.6km 處" },
  { id: "block_2", lat: 24.19641391489506, lng: 120.83896859104198, status: "fully_blocked", label: "6.7km=>6.7km 處" },
  { id: "block_7", lat: 24.17339895177517, lng: 120.83852149496494, status: "fully_blocked", label: "9.4km=>9.4km 處" },
  { id: "block_5", lat: 24.16847971328785, lng: 120.84276812819672, status: "partially_blocked", label: "14.1km=>14.1km 處" },
  { id: "block_6", lat: 24.16543277634449, lng: 121.60416900160862, status: "partially_blocked", label: "173.8km=>173.8km 處" },
  { id: "block_4", lat: 24.160379267144165, lng: 121.6158291888184, status: "fully_blocked", label: "172.5km=>172.5km 處" },
  { id: "block_1", lat: 24.184313927998218, lng: 120.92400483086016, status: "fully_blocked", label: "21.4km=>21.4km 處" },
  { id: "block_9", lat: 24.200794525815, lng: 121.0014835884196, status: "partially_blocked", label: "31.1km=>31.1km 處" },
  { id: "block_15", lat: 24.194074784869002, lng: 120.99453869594981, status: "partially_blocked", label: "31.6km=>31.6km 處" },
  { id: "block_11", lat: 24.197756538540943, lng: 120.99836843335237, status: "fully_blocked", label: "32.0km=>32.0km 處" },
  { id: "block_14", lat: 24.19501644601175, lng: 120.99595799854484, status: "fully_blocked", label: "32.5km=>32.5km 處" },
  { id: "block_13", lat: 24.198346271253712, lng: 121.00018070921294, status: "partially_blocked", label: "32.7km=>32.7km 處" },
  { id: "block_10", lat: 24.20263921503745, lng: 121.00326291780601, status: "partially_blocked", label: "32.8km=>32.8km 處" },
  { id: "block_8", lat: 24.191875969636513, lng: 120.99251898374712, status: "partially_blocked", label: "33.3km=>33.3km 處" },
  { id: "block_17", lat: 24.2030591603107, lng: 121.00800422258834, status: "partially_blocked", label: "34.2km=>34.2km 處" },
  { id: "block_16", lat: 24.202299683641257, lng: 121.00927771273314, status: "fully_blocked", label: "34.4km=>34.4km 處" },
  { id: "block_20", lat: 24.20330933965218, lng: 121.0138720762514, status: "partially_blocked", label: "34.9km=>34.9km 處" },
  { id: "block_18", lat: 24.20417602914229, lng: 121.01433249221168, status: "fully_blocked", label: "35.0km=>35.0km 處" },
  { id: "block_19", lat: 24.206776073010175, lng: 121.01305898438568, status: "fully_blocked", label: "35.3km=>35.3km 處" },
  { id: "block_21", lat: 24.207553392326858, lng: 121.0121773367826, status: "fully_blocked", label: "35.4km=>35.4km 處" },
  { id: "block_22", lat: 24.209765730292602, lng: 121.42489699384845, status: "partially_blocked", label: "155.5km=>155.5km 處" },
  { id: "block_23", lat: 24.214490144955022, lng: 121.03704506585763, status: "fully_blocked", label: "38.2km=>38.2km 處" },
  { id: "block_24", lat: 24.25105789799798, lng: 121.16649099943265, status: "partially_blocked", label: "61.5km=>61.5km 處" },
  { id: "block_28", lat: 24.25343406325875, lng: 121.17354795830141, status: "partially_blocked", label: "62.3km=>62.3km 處" },
  { id: "block_25", lat: 24.251149773652614, lng: 121.17072911849732, status: "fully_blocked", label: "62.4km=>62.4km 處" },
  { id: "block_26", lat: 24.252138912920202, lng: 121.17199754756007, status: "partially_blocked", label: "62.5km=>62.5km 處" },
  { id: "block_29", lat: 24.254532958531996, lng: 121.17477256816983, status: "partially_blocked", label: "63.0km=>63.0km 處" },
  { id: "block_30", lat: 24.254808573509422, lng: 121.17526454558924, status: "fully_blocked", label: "63.1km=>63.1km 處" },
  { id: "block_27", lat: 24.252836068654503, lng: 121.1721279512139, status: "fully_blocked", label: "63.3km=>63.3km 處" },
  { id: "block_34", lat: 24.25510577336648, lng: 121.24970590932026, status: "partially_blocked", label: "96.1km=>96.1km 處" },
  { id: "block_31", lat: 24.254591182825436, lng: 121.24775183663724, status: "fully_blocked", label: "96.3km=>96.3km 處" },
  { id: "block_33", lat: 24.254168012277688, lng: 121.25231034959876, status: "fully_blocked", label: "97.4km=>97.4km 處" },
  { id: "block_32", lat: 24.25412538677392, lng: 121.25298046465122, status: "fully_blocked", label: "97.4km=>97.4km 處" },
  { id: "block_35", lat: 24.254423769462363, lng: 121.25568430808391, status: "partially_blocked", label: "97.7km=>97.7km 處" },
  { id: "block_36", lat: 24.253827007849864, lng: 121.25366616377585, status: "partially_blocked", label: "97.8km=>97.8km 處" },
  { id: "block_37", lat: 24.25417512099115, lng: 121.25513107356403, status: "partially_blocked", label: "97.8km=>97.8km 處" },
  { id: "block_38", lat: 24.186306251672463, lng: 121.32665756854954, status: "partially_blocked", label: "145.5km=>145.5km 處" },
  { id: "block_41", lat: 24.187379427279623, lng: 121.33241501571928, status: "fully_blocked", label: "146.1km=>146.1km 處" },
  { id: "block_40", lat: 24.18838248108385, lng: 121.33478236908104, status: "partially_blocked", label: "146.3km=>146.3km 處" },
  { id: "block_42", lat: 24.185007473705667, lng: 121.34193614571683, status: "partially_blocked", label: "147.0km=>147.0km 處" },
  { id: "block_39", lat: 24.183839179299923, lng: 121.34259589925557, status: "fully_blocked", label: "147.2km=>147.2km 處" },
  { id: "block_43", lat: 24.179793820793563, lng: 121.50990359394893, status: "fully_blocked", label: "175.8km=>175.8km 處" },
  { id: "block_44", lat: 24.17524657513239, lng: 120.93181518751715, status: "partially_blocked", label: "9.7km=>9.7km 處" },
  { id: "block_45", lat: 24.170584317300907, lng: 120.90581935642837, status: "fully_blocked", label: "8.7km=>8.7km 處" },
  { id: "block_47", lat: 24.168704946619087, lng: 120.89777502518774, status: "partially_blocked", label: "6.7km=>6.7km 處" },
  { id: "block_50", lat: 24.165079051253088, lng: 121.60557154094198, status: "partially_blocked", label: "175.7km=>175.7km 處" },
  { id: "block_49", lat: 24.16390910501218, lng: 121.60628538602407, status: "fully_blocked", label: "175.8km=>175.8km 處" },
  { id: "block_46", lat: 24.170192455505827, lng: 120.90524451561367, status: "fully_blocked", label: "8.1km=>8.1km 處" },
]

function segmentKey(p: SegmentProps): string {
  const a = p.from_id ? String(p.from_id).trim() : ""
  const b = p.to_id ? String(p.to_id).trim() : ""
  if (a && b) return a + "-" + b
  const fa = p.from_name ? String(p.from_name).trim() : ""
  const fb = p.to_name ? String(p.to_name).trim() : ""
  if (fa && fb) return fa + "-" + fb
  return "segment"
}

function segmentLabel(p: SegmentProps): string {
  const fa = p.from_name ? String(p.from_name).trim() : ""
  const fb = p.to_name ? String(p.to_name).trim() : ""
  if (fa && fb) return fa + " - " + fb
  return segmentKey(p)
}

const colorByBlockCount = (n: number) => {
  if (n <= 3) return "#22c55e"
  else if (n < 6) return "#facc15"
  else if (n < 11) return "#f97316"
  else if (n < 16) return "#ef4444"
  else return "#7c3aed"
}

const EARTH_RADIUS = 6371000
function toXY(lat: number, lng: number) {
  const phi = (lat * Math.PI) / 180
  const lambda = (lng * Math.PI) / 180
  return {
    x: EARTH_RADIUS * lambda * Math.cos(phi),
    y: EARTH_RADIUS * phi,
  }
}

function pointToSegmentDistanceMeters(
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number }
): number {
  const ab = { x: b.x - a.x, y: b.y - a.y }
  const ap = { x: p.x - a.x, y: p.y - a.y }
  const abLenSq = ab.x * ab.x + ab.y * ab.y
  const t = abLenSq === 0 ? 0 : Math.max(0, Math.min(1, (ap.x * ab.x + ap.y * ab.y) / abLenSq))
  const proj = { x: a.x + ab.x * t, y: a.y + ab.y * t }
  const dx = p.x - proj.x
  const dy = p.y - proj.y
  return Math.sqrt(dx * dx + dy * dy)
}

type SegmentBucket = {
  center: { lat: number; lng: number }
  label: string
  fully: BlockPoint[]
  partially: BlockPoint[]
}

const AGGREGATE_ZOOM_THRESHOLD = 12

function segmentCenter(segment: SegmentFeature): { lat: number; lng: number } | null {
  const coordsLngLat = segment.geometry.coordinates as any[]
  if (!coordsLngLat || coordsLngLat.length === 0) return null
  const mid = coordsLngLat[Math.floor(coordsLngLat.length / 2)]
  return { lat: mid[1], lng: mid[0] }
}

function computeSegmentBuckets(segments: SegmentFeature[], points: BlockPoint[]): Record<string, SegmentBucket> {
  if (!segments || segments.length === 0) return {}

  const buckets: Record<string, SegmentBucket> = {}
  segments.forEach((segment) => {
    const key = segmentKey(segment.properties || {})
    const center = segmentCenter(segment)
    if (!center) return
    buckets[key] = {
      center,
      label: segmentLabel(segment.properties || {}),
      fully: [],
      partially: [],
    }
  })

  points.forEach((p) => {
    let nearestKey = ""
    let nearestDist = Number.POSITIVE_INFINITY
    const pxy = toXY(p.lat, p.lng)

    segments.forEach((segment) => {
      const coordsLngLat = segment.geometry.coordinates as any[]
      for (let i = 0; i < coordsLngLat.length - 1; i++) {
        const aLat = coordsLngLat[i][1]
        const aLng = coordsLngLat[i][0]
        const bLat = coordsLngLat[i + 1][1]
        const bLng = coordsLngLat[i + 1][0]
        const a = toXY(aLat, aLng)
        const b = toXY(bLat, bLng)
        const d = pointToSegmentDistanceMeters(pxy, a, b)
        if (d < nearestDist) {
          nearestDist = d
          nearestKey = segmentKey(segment.properties || {})
        }
      }
    })

    if (!nearestKey) return
    if (!buckets[nearestKey]) {
      buckets[nearestKey] = {
        center: { lat: p.lat, lng: p.lng },
        label: "",
        fully: [],
        partially: [],
      }
    }

    if (p.status === "fully_blocked") buckets[nearestKey].fully.push(p)
    else buckets[nearestKey].partially.push(p)
  })

  return buckets
}

type SegmentStat = { count: number; status: SegmentStatus }

function computePointSegmentLabels(segments: SegmentFeature[], points: BlockPoint[]): Record<string, string> {
  if (!segments || segments.length === 0) return {}
  const labels: Record<string, string> = {}

  points.forEach((p) => {
    let nearestKey = ""
    let nearestDist = Number.POSITIVE_INFINITY
    const pxy = toXY(p.lat, p.lng)

    segments.forEach((segment) => {
      const coordsLngLat = segment.geometry.coordinates as any[]
      for (let i = 0; i < coordsLngLat.length - 1; i++) {
        const aLat = coordsLngLat[i][1]
        const aLng = coordsLngLat[i][0]
        const bLat = coordsLngLat[i + 1][1]
        const bLng = coordsLngLat[i + 1][0]
        const a = toXY(aLat, aLng)
        const b = toXY(bLat, bLng)
        const d = pointToSegmentDistanceMeters(pxy, a, b)
        if (d < nearestDist) {
          nearestDist = d
          nearestKey = segmentKey(segment.properties || {})
        }
      }
    })

    if (!nearestKey) return
    const segment = segments.find((s) => segmentKey(s.properties || {}) === nearestKey)
    if (!segment) return
    labels[p.id] = segmentLabel(segment.properties || {})
  })

  return labels
}

// ✅ 用 BLOCKAGE_POINTS 找出每個點最近的路段，並累積 count + status
function computeSegmentStatsFromPoints(segments: SegmentFeature[]): Record<string, SegmentStat> {
  if (!segments || segments.length === 0) return {}

  const stats: Record<string, SegmentStat> = {}
  segments.forEach((s) => {
    const key = segmentKey(s.properties || {})
    stats[key] = { count: 0, status: "clear" }
  })

  const bumpStatus = (cur: SegmentStatus, incoming: "fully_blocked" | "partially_blocked"): SegmentStatus => {
    // fully > partial > clear
    if (incoming === "fully_blocked") return "fully_blocked"
    if (cur === "fully_blocked") return "fully_blocked"
    return "partially_blocked"
  }

  BLOCKAGE_POINTS.forEach((p) => {
    let nearestKey = ""
    let nearestDist = Number.POSITIVE_INFINITY
    const pxy = toXY(p.lat, p.lng)

    segments.forEach((segment) => {
      const coordsLngLat = segment.geometry.coordinates as any[]
      for (let i = 0; i < coordsLngLat.length - 1; i++) {
        const aLat = coordsLngLat[i][1]
        const aLng = coordsLngLat[i][0]
        const bLat = coordsLngLat[i + 1][1]
        const bLng = coordsLngLat[i + 1][0]
        const a = toXY(aLat, aLng)
        const b = toXY(bLat, bLng)
        const d = pointToSegmentDistanceMeters(pxy, a, b)
        if (d < nearestDist) {
          nearestDist = d
          nearestKey = segmentKey(segment.properties || {})
        }
      }
    })

    if (!nearestKey) return
    if (!stats[nearestKey]) stats[nearestKey] = { count: 0, status: "clear" }

    stats[nearestKey].count += 1
    stats[nearestKey].status = bumpStatus(stats[nearestKey].status, p.status)
  })

  return stats
}

async function fetchTai8Subsegments(): Promise<SegmentFeature[]> {
  try {
    const res = await fetch("/geo/tai8_subsegments_v2.geo.json", { cache: "no-store" })
    if (!res.ok) throw new Error(`Failed to load /geo/tai8_subsegments_v2.geo.json: ${res.status}`)
    const json = await res.json()

    if (json?.type !== "FeatureCollection" || !Array.isArray(json?.features)) {
      throw new Error("Invalid GeoJSON: expect FeatureCollection")
    }

    const feats = json.features as SegmentFeature[]
    return feats.filter((f) => f?.geometry?.type === "LineString" && Array.isArray(f?.geometry?.coordinates))
  } catch (e) {
    console.warn("無法載入真實資料，使用範例資料", e)
    return []
  }
}

async function fetchTaiwanCounties(): Promise<GeoJSONLike | null> {
  try {
    const res = await fetch("/geo/twCounty2010merge.geo.json", { cache: "no-store" })
    if (!res.ok) throw new Error(`Failed to load /geo/twCounty2010merge.geo.json: ${res.status}`)
    const json = (await res.json()) as GeoJSONLike
    return json
  } catch (e) {
    console.warn("無法載入 /geo/twCounty2010merge.geo.json", e)
    return null
  }
}

type LeafletMap = any
type LeafletNS = any

export default function Tai8LeafletMap({
  showFullyBlocked,
  showPartiallyBlocked,
  showWeather,
  zoomInSignal,
  zoomOutSignal,
  mapMode,
}: {
  showFullyBlocked: boolean
  showPartiallyBlocked: boolean
  showWeather: boolean
  zoomInSignal: number
  zoomOutSignal: number
  mapMode?: BaseMode
}) {
  void showWeather

  const mapRef = useRef<HTMLDivElement | null>(null)
  const leafletMapRef = useRef<LeafletMap | null>(null)
  const leafletNSRef = useRef<LeafletNS | null>(null)
  const polylineLayersRef = useRef<any[]>([])
  const blockageLayerRef = useRef<any>(null)
  const countyLayerRef = useRef<any>(null)
  const countyLabelLayerRef = useRef<any>(null)
  const segmentLabelLayerRef = useRef<any>(null)
  const injectedRef = useRef(false)

  const [mapReady, setMapReady] = useState(false)
  const [segments, setSegments] = useState<SegmentFeature[]>([])
  const [segmentStats, setSegmentStats] = useState<Record<string, SegmentStat>>({})
  const [loading, setLoading] = useState(true)
  const [selectedSegment, setSelectedSegment] = useState<{
    label: string
    blockCount: number
    status: SegmentStatus
    info?: string
  } | null>(null)
  const [mapZoom, setMapZoom] = useState<number | null>(null)

  const mode = mapMode ?? "county"
  const [taiwanGeo, setTaiwanGeo] = useState<GeoJSONLike | null>(null)
  const segmentBuckets = useMemo(() => computeSegmentBuckets(segments, BLOCKAGE_POINTS), [segments])
  const pointSegmentLabels = useMemo(() => computePointSegmentLabels(segments, BLOCKAGE_POINTS), [segments])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const feats = await fetchTai8Subsegments()
        if (!cancelled) setSegments(feats)
      } catch (e) {
        console.error(e)
        if (!cancelled) setSegments([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // ✅ 依據 BLOCKAGE_POINTS 動態計算「每個路段」的 count + status
  useEffect(() => {
    if (!segments || segments.length === 0) {
      setSegmentStats({})
      return
    }
    setSegmentStats(computeSegmentStatsFromPoints(segments))
  }, [segments])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const geo = await fetchTaiwanCounties()
        if (!cancelled) setTaiwanGeo(geo)
      } finally {
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return
    if (leafletMapRef.current) return

    const ensureCss = () => {
      const id = "leaflet-css"
      if (document.getElementById(id)) return
      const cssLink = document.createElement("link")
      cssLink.id = id
      cssLink.rel = "stylesheet"
      cssLink.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"
      document.head.appendChild(cssLink)
    }

    const ensureScript = () =>
      new Promise<void>((resolve, reject) => {
        const id = "leaflet-js"
        if ((window as any).L) return resolve()
        const existing = document.getElementById(id) as HTMLScriptElement | null
        if (existing) {
          existing.addEventListener("load", () => resolve())
          existing.addEventListener("error", () => reject(new Error("Leaflet script load error")))
          return
        }
        const script = document.createElement("script")
        script.id = id
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error("Leaflet script load error"))
        document.head.appendChild(script)
      })

    let cancelled = false

    ;(async () => {
      try {
        ensureCss()
        await ensureScript()
        if (cancelled) return

        const L = (window as any).L
        if (!L) return
        leafletNSRef.current = L

        const taiwanBounds = L.latLngBounds([21.6, 119.0], [25.6, 123.8])
        const MIN_ZOOM = 8

        const map = L.map(mapRef.current!, {
          center: [24.2213889, 121.3086],
          zoom: 15,
          minZoom: MIN_ZOOM,
          maxBounds: taiwanBounds,
          maxBoundsViscosity: 1.0,
          worldCopyJump: false,
          zoomControl: true,
        })

        if (!map.getPane("countyPane")) {
          const countyPane = map.createPane("countyPane")
          countyPane.style.zIndex = "200"
        }
        if (!map.getPane("countyLabelPane")) {
          const labelPane = map.createPane("countyLabelPane")
          labelPane.style.zIndex = "350"
        }

        leafletMapRef.current = map
        setMapZoom(map.getZoom())

        const satelliteLayer = L.tileLayer("https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
          attribution: "© Google",
          errorTileUrl:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        })

        const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap",
        })

        satelliteLayer.addTo(map)

        ;(map as any)._satelliteLayer = satelliteLayer
        ;(map as any)._osmLayer = osmLayer

        setMapReady(true)
      } catch (e) {
        console.error(e)
      }
    })()

    return () => {
      cancelled = true
      setMapReady(false)
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const map = leafletMapRef.current
    if (!map) return
    const handleZoom = () => setMapZoom(map.getZoom())
    map.on("zoomend", handleZoom)
    return () => {
      map.off("zoomend", handleZoom)
    }
  }, [mapReady])

  useEffect(() => {
    const map = leafletMapRef.current
    const L = leafletNSRef.current
    if (!mapReady || !map || !L) return
    if (!taiwanGeo) return

    if (countyLayerRef.current) {
      try {
        map.removeLayer(countyLayerRef.current)
      } catch {}
      countyLayerRef.current = null
    }
    if (countyLabelLayerRef.current) {
      try {
        map.removeLayer(countyLabelLayerRef.current)
      } catch {}
      countyLabelLayerRef.current = null
    }

    const geo = taiwanGeo as any
    const layer = L.geoJSON(geo, {
      pane: "countyPane",
      style: () => ({
        color: "#94a3b8",
        weight: 1,
        opacity: 1,
        fillColor: "#bdbdbd",
        fillOpacity: 0.85,
      }),
      interactive: false,
    })

    countyLayerRef.current = layer

    const labelLayer = L.layerGroup()
    L.geoJSON(geo, {
      onEachFeature: (feature: any, featureLayer: any) => {
        const name = feature?.properties?.COUNTYNAME
        if (!name) return
        const bounds = featureLayer.getBounds?.()
        if (!bounds) return
        const center = bounds.getCenter()
        const marker = L.marker(center, {
          interactive: false,
          pane: "countyLabelPane",
          icon: L.divIcon({
            className: "county-label",
            html: `<div>${name}</div>`,
          }),
        })
        labelLayer.addLayer(marker)
      },
    })

    countyLabelLayerRef.current = labelLayer

    if (mode === "county") {
      layer.addTo(map)
      labelLayer.addTo(map)
    }
  }, [taiwanGeo, mapReady, mode])

  const applyMode = (next: BaseMode) => {
    const map = leafletMapRef.current
    const L = leafletNSRef.current
    if (!map || !L) return

    const satelliteLayer = (map as any)._satelliteLayer
    const osmLayer = (map as any)._osmLayer
    const countyLayer = countyLayerRef.current
    const countyLabels = countyLabelLayerRef.current
    const segLabels = segmentLabelLayerRef.current

    if (satelliteLayer && map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer)
    if (osmLayer && map.hasLayer(osmLayer)) map.removeLayer(osmLayer)
    if (countyLayer && map.hasLayer(countyLayer)) map.removeLayer(countyLayer)
    if (countyLabels && map.hasLayer(countyLabels)) map.removeLayer(countyLabels)
    if (segLabels && map.hasLayer(segLabels)) map.removeLayer(segLabels)

    if (next === "satellite") {
      satelliteLayer?.addTo(map)
    } else if (next === "osm") {
      osmLayer?.addTo(map)
    } else if (next === "county") {
      if (countyLayer) countyLayer.addTo(map)
      if (countyLabels) countyLabels.addTo(map)
      if (segLabels) segLabels.addTo(map)
    }

    polylineLayersRef.current.forEach((layer) => layer?.bringToFront?.())
  }

  useEffect(() => {
    if (!mapReady) return
    applyMode(mode)
  }, [mode, mapReady])

  useEffect(() => {
    const map = leafletMapRef.current
    const L = leafletNSRef.current
    if (!mapReady || !map || !L) return

    polylineLayersRef.current.forEach((layer) => {
      try {
        map.removeLayer(layer)
      } catch {}
    })
    polylineLayersRef.current = []

    if (segmentLabelLayerRef.current) {
      try {
        map.removeLayer(segmentLabelLayerRef.current)
      } catch {}
      segmentLabelLayerRef.current = null
    }

    if (!segments || segments.length === 0) return

    const bounds = L.latLngBounds([])

    const labelLayer = L.layerGroup()
    const seenNames = new Set<string>()

    if (!map.getPane("segmentLabelPane")) {
      const p = map.createPane("segmentLabelPane")
      p.style.zIndex = "600"
    }

    const addPointLabel = (name: string, lat: number, lng: number) => {
      const n = (name ?? "").trim()
      if (!n) return
      if (seenNames.has(n)) return
      seenNames.add(n)

      const anchor = L.circleMarker([lat, lng], {
        radius: 1,
        opacity: 0,
        fillOpacity: 0,
        interactive: false,
        pane: "segmentLabelPane",
      })

      const LABEL_OFFSET_BY_NAME: Record<string, { x: number; y: number }> = {
        天冷: { x: 5, y: -1 },
        谷關: { x: 8, y: 26 },
        大禹嶺: { x: -6, y: 27 },
        天祥: { x: -7, y: 28 },
        太魯閣: { x: 8, y: 0 },
        新城: { x: -18, y: 24 },
      }

      const getLabelOffset = (name: string) => {
        const n = (name ?? "").trim()
        const o = LABEL_OFFSET_BY_NAME[n]
        return L.point(o?.x ?? 0, o?.y ?? 0)
      }

      anchor.bindTooltip(n, {
        permanent: true,
        direction: "top",
        offset: getLabelOffset(n),
        opacity: 1,
        className: "segment-text-label",
      })

      labelLayer.addLayer(anchor)
    }

    segments.forEach((segment) => {
      const coordsLngLat = segment.geometry.coordinates as any[]
      const coords = coordsLngLat.map((c) => [c[1], c[0]]) // [lat,lng]
      coords.forEach((ll) => bounds.extend(ll))

      const props = segment.properties || {}
      const key = segmentKey(props)

      // ✅ 這裡不再用測試 SEGMENT_BLOCK_COUNT，改用 BLOCKAGE_POINTS 動態算出來的 segmentStats
      const stat = segmentStats[key] ?? { count: 0, status: "clear" }
      const blockCount = stat.count
      const color = colorByBlockCount(blockCount)

      const border = L.polyline(coords, {
        color: "white",
        weight: 6,
        opacity: 0.7,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(map)

      const line = L.polyline(coords, {
        color,
        weight: 4,
        opacity: 0.95,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(map)

      polylineLayersRef.current.push(border, line)

      line.on("click", () => {
        const label = segmentLabel(props)
        setSelectedSegment({ label, blockCount, status: stat.status, info: props.info })
      })
      line.on("mouseover", () => line.setStyle({ weight: 6 }))
      line.on("mouseout", () => line.setStyle({ weight: 4 }))

      const first = coords[0]
      const last = coords[coords.length - 1]
      if (first && props.from_name) addPointLabel(String(props.from_name), first[0], first[1])
      if (last && props.to_name) addPointLabel(String(props.to_name), last[0], last[1])
    })

    segmentLabelLayerRef.current = labelLayer

    if (mode === "county") {
      labelLayer.addTo(map)
    }

    if (!injectedRef.current && bounds.isValid()) {
      injectedRef.current = true
      map.fitBounds(bounds.pad(0.15))
    }
  }, [segments, segmentStats, mapReady, mode])

  // 5.5) 標記完全阻斷 / 部分阻斷測試點
  useEffect(() => {
    const map = leafletMapRef.current
    const L = leafletNSRef.current
    if (!mapReady || !map || !L) return

    if (blockageLayerRef.current) {
      try {
        map.removeLayer(blockageLayerRef.current)
      } catch {}
      blockageLayerRef.current = null
    }

    const layer = L.layerGroup()
    const useAggregate = mapZoom !== null && mapZoom <= AGGREGATE_ZOOM_THRESHOLD

    const offsetLatLng = (lat: number, lng: number, dx: number, dy: number) => {
      const projected = map.project([lat, lng])
      const shifted = projected.add([dx, dy])
      const ll = map.unproject(shifted)
      return [ll.lat, ll.lng]
    }

    const createIcon = (status: "fully_blocked" | "partially_blocked", count?: number) => {
      const bgColor = status === "fully_blocked" ? "#ef4444" : "#f59e0b"
      const imgSrc = status === "fully_blocked" ? "/icons/fully_blocked.png" : "/icons/partially_blocked.png"
      const countHtml = typeof count === "number" ? `<span class="blockage-count">${count}</span>` : ""
      return L.divIcon({
        className: "blockage-icon",
        html: `
          <div class="blockage-pin" style="background:${bgColor}">
            <img src="${imgSrc}" alt="${status}" />
            ${countHtml}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      })
    }

    const popupHtml = (routeLabel: string, detailText: string, singleLine = false) => {
      const safeRouteLabel = (routeLabel ?? "").trim() || "未命名路段"
      const textClass = singleLine ? "seg-pop__text seg-pop__text--single" : "seg-pop__text"
      const singleLineText = `台八線 · ${safeRouteLabel} 路段 ${detailText}`
      return `
      <div class="seg-pop">
        <div class="seg-pop__title">路段資訊</div>

        <div class="seg-pop__divider"></div>

        <div class="seg-pop__actions">
          <a class="seg-pop__more" href="javascript:void(0)">
            查看詳情
            <span class="seg-pop__more-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" focusable="false">
                <path d="M4.75 5.75a1 1 0 0 1 1.41 0l6.34 6.34a1 1 0 0 1 0 1.41l-6.34 6.34a1 1 0 0 1-1.41-1.41L10.39 12 4.75 7.16a1 1 0 0 1 0-1.41z" />
                <path d="M11.75 5.75a1 1 0 0 1 1.41 0l6.34 6.34a1 1 0 0 1 0 1.41l-6.34 6.34a1 1 0 0 1-1.41-1.41L17.39 12 11.75 7.16a1 1 0 0 1 0-1.41z" />
              </svg>
            </span>
          </a>
        </div>

        <div class="seg-pop__item">
          <img class="seg-pop__icon" src="/icons/tai8_icon.png" alt="tai8" />
          <div class="${textClass}">
            ${
              singleLine
                ? `<div class="seg-pop__single">${singleLineText}</div>`
                : `<div class="seg-pop__route">台八線 · ${safeRouteLabel} 路段</div>`
            }
          </div>
        </div>
        ${
          singleLine
            ? ""
            : `<div class="seg-pop__detail-line">${detailText}</div>`
        }
      </div>
    `
    }

    if (useAggregate) {
      Object.values(segmentBuckets).forEach((bucket) => {
        const fullyCount = showFullyBlocked ? bucket.fully.length : 0
        const partiallyCount = showPartiallyBlocked ? bucket.partially.length : 0
        if (fullyCount === 0 && partiallyCount === 0) return

        if (fullyCount > 0) {
          const [lat, lng] = offsetLatLng(bucket.center.lat, bucket.center.lng, -18, 0)
          const marker = L.marker([lat, lng], { icon: createIcon("fully_blocked", fullyCount) }).addTo(layer)
          marker.bindPopup(popupHtml(bucket.label, `完全中斷 ${fullyCount} 處`, true), {
            closeButton: true,            // ✅ 右上角 X
            autoClose: true,
            closeOnClick: true,
            offset: L.point(0, -18),
            className: "seg-pop-wrap",     // ✅ 方便你寫 CSS
          })
        }

        if (partiallyCount > 0) {
          const [lat, lng] = offsetLatLng(bucket.center.lat, bucket.center.lng, 18, 0)
          const marker = L.marker([lat, lng], { icon: createIcon("partially_blocked", partiallyCount) }).addTo(layer)
          marker.bindPopup(popupHtml(bucket.label, `部分中斷 ${partiallyCount} 處`, true), {
            closeButton: true,
            autoClose: true,
            closeOnClick: true,
            offset: L.point(0, -18),
            className: "seg-pop-wrap",
          })
        }
      })
    } else {
      const filtered = BLOCKAGE_POINTS.filter((p) => {
        if (p.status === "fully_blocked" && !showFullyBlocked) return false
        if (p.status === "partially_blocked" && !showPartiallyBlocked) return false
        return true
      })

      filtered.forEach((p) => {
        const icon = createIcon(p.status)
        const marker = L.marker([p.lat, p.lng], { icon }).addTo(layer)
        const routeLabel = pointSegmentLabels[p.id] ?? "未命名路段"
        const statusText = p.status === "fully_blocked" ? "完全中斷" : "部分中斷"
        marker.bindPopup(popupHtml(routeLabel, `${p.label}：${statusText}`), {
          closeButton: true,
          autoClose: true,
          closeOnClick: true,
          offset: L.point(0, -18),
          className: "seg-pop-wrap",
        })
      })
    }

    layer.addTo(map)
    blockageLayerRef.current = layer
  }, [mapReady, showFullyBlocked, showPartiallyBlocked, mode, mapZoom, segmentBuckets, pointSegmentLabels])

  // 6) 外部縮放控制
  useEffect(() => {
    const map = leafletMapRef.current
    if (!map || zoomInSignal <= 0) return
    map.zoomIn()
  }, [zoomInSignal])

  useEffect(() => {
    const map = leafletMapRef.current
    if (!map || zoomOutSignal <= 0) return
    map.zoomOut()
  }, [zoomOutSignal])

  const modeLabel = useMemo(() => {
    if (mode === "satellite") return "🛰️ 衛星空拍圖"
    if (mode === "osm") return "🗺️ 標準地圖"
    return "⬜ 行政區地圖"
  }, [mode])

  return (
    <div className="absolute inset-0">
      {/* Leaflet 地圖容器 */}
      <div ref={mapRef} className="absolute inset-0 z-[100]" />

      {/* 右上角狀態 */}
      <div className="absolute right-3 top-3 z-[500] rounded-md border-2 border-slate-300 bg-white/95 px-3 py-2 text-xs shadow-lg">
        <div className="font-medium text-slate-700">{modeLabel}</div>
        <div className="mt-1 font-medium text-slate-700">
          {loading ? "🔄 載入台八線子路段中..." : `✓ 台八線子路段已載入 (${segments.length} 段)`}
        </div>
        <div className="mt-2 text-[12px] text-slate-500">💡 點擊路段查看詳情</div>
      </div>

      {/* 圖例 */}
      <div className="absolute bottom-8 left-3 z-[500] rounded-md border-2 border-slate-300 bg-white/95 px-3 py-2 text-xs shadow-lg">
        <div className="mb-2 font-semibold text-slate-700">道路中斷數量</div>
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-[2px]">
            <div className="h-3 w-5 rounded-sm bg-[#22c55e]" />
            <div className="h-3 w-5 rounded-sm bg-[#facc15]" />
            <div className="h-3 w-5 rounded-sm bg-[#f97316]" />
            <div className="h-3 w-5 rounded-sm bg-[#ef4444]" />
            <div className="relative h-3 w-6">
              <div className="h-3 w-full rounded-l-sm bg-[#7c3aed]" />
              <div className="absolute right-[-6px] top-1/2 h-0 w-0 -translate-y-1/2 border-y-[6px] border-y-transparent border-l-[6px] border-l-[#7c3aed]" />
            </div>
          </div>

          <div className="flex items-start gap-[2px] text-[10px] text-slate-600">
            <div className="w-5 text-left">0</div>
            <div className="w-5 text-left">3</div>
            <div className="w-5 text-left">5</div>
            <div className="w-5 text-left">10</div>
            <div className="w-5 text-left">15 ~</div>
          </div>
        </div>
      </div>

      {/* 路段詳情彈窗 */}
      {selectedSegment && (
        <div className="absolute left-1/2 top-1/2 z-[600] w-80 -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-lg border-2 border-slate-300 bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-start justify-between">
              <div className="text-base font-semibold text-slate-900">{selectedSegment.label}</div>
              <button
                type="button"
                onClick={() => setSelectedSegment(null)}
                className="text-xl leading-none text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="mb-2 flex items-center gap-2">
              <span className="font-medium text-slate-600">狀態：</span>
              <span
                className={
                  selectedSegment.status === "fully_blocked"
                    ? "font-semibold text-red-600"
                    : selectedSegment.status === "partially_blocked"
                      ? "font-semibold text-orange-500"
                      : "font-semibold text-green-600"
                }
              >
                {selectedSegment.status === "fully_blocked"
                  ? "⛔ 完全阻斷"
                  : selectedSegment.status === "partially_blocked"
                    ? "⚠️ 部分阻斷"
                    : "✓ 通行順暢"}
              </span>
            </div>

            <div className="text-sm text-slate-700">
              <span className="font-medium text-slate-600">道路中斷數量：</span>
              <span className="font-semibold">{selectedSegment.blockCount}</span>
            </div>

            {selectedSegment.info && (
              <div className="mt-3 border-t border-slate-200 pt-3 text-sm text-slate-700">{selectedSegment.info}</div>
            )}
          </div>
        </div>
      )}

      {/* Leaflet CSS 小修正 */}
      <style jsx>{`
        :global(.leaflet-container) {
          font-family: inherit;
        }
        :global(.county-label) {
          white-space: nowrap;
          pointer-events: none;
        }
        :global(.county-label div) {
          transform: translate(-50%, -50%);
          color: #6b7280;
          font-size: 18px;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.9);
        }
        :global(.segment-text-label) {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        :global(.segment-text-label::before) {
          display: none !important;
        }
        :global(.segment-text-label) {
          color: #111827;
          font-size: 14px;
          font-weight: 700;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.95);
          white-space: nowrap;
        }

        :global(.blockage-pin) {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        }
        :global(.blockage-pin img) {
          width: 32px;
          height: 32px;
          object-fit: cover;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.2);
        }
        :global(.blockage-count) {
          position: absolute;
          right: -6px;
          top: -6px;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          border-radius: 9999px;
          background: #0369a1;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          line-height: 18px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
        }
        :global(.seg-pop) {
          background: #fff;
        }

        :global(.seg-pop__title) {
          padding: 10px 12px 8px 12px;
          font-size: 14px;
          font-weight: 700;
          color: #111827;
        }

        :global(.seg-pop__divider) {
          border-top: 1px dashed #e5e7eb; /* 分隔線 */
          margin: 0 12px;
        }

        :global(.seg-pop__actions) {
          padding: 6px 12px 8px 12px;
          text-align: right; /* 置右 */
        }

        :global(.seg-pop__more) {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 12px;
          font-weight: 700;
          color: #f97316;
          text-decoration: underline; /* 底線 */
          text-underline-offset: 2px;
        }
        :global(.seg-pop__more-icon) {
          width: 14px;
          height: 14px;
          display: inline-flex;
        }
        :global(.seg-pop__more-icon svg) {
          width: 14px;
          height: 14px;
          fill: currentColor;
        }

        :global(.seg-pop__item) {
          display: flex;
          align-items: center;     /* ✅ icon+文字同一行 */
          gap: 8px;
          margin: 8px 10px 10px 10px;
          padding: 8px 10px;
          background: #dbeafe;     /* ✅ 淺藍底 */
          border-radius: 4px;
        }

        :global(.seg-pop__icon) {
          width: 18px;
          height: 18px;
          object-fit: contain;
          flex: 0 0 auto;
        }

        :global(.seg-pop__text) {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
          line-height: 1.2;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }
        :global(.seg-pop__text--single) {
          display: block;
        }
        :global(.seg-pop__single) {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        :global(.seg-pop__route) {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        :global(.seg-pop__detail) {
          font-weight: 600;
          color: #0f172a;
        }
        :global(.seg-pop__detail-line) {
          margin: 0 10px 10px 10px;
          padding-left: 6px;
          color: #6b7280;
          font-size: 12px;
          font-weight: 600;
        }
        :global(.seg-pop-wrap .leaflet-popup-close-button) {
          position: absolute;  
          top: 8px;
          right: 10px;
          width: 22px;
          height: 22px;
          line-height: 22px;
          text-align: center;
        }
      `}</style>
    </div>
  )
}
