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

const SEGMENT_STATUS: Record<string, SegmentStatus> = {
  // 可在此定義特定路段的狀態，例如：
  // "w041-w042": "fully_blocked",
}

type BaseMode = "topo" | "osm" | "county" // ✅ 新增 county：用 twCounty2010merge 當灰白底圖

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
  if (fa && fb) return fa + " → " + fb
  return segmentKey(p)
}

const colorByStatus = (s: SegmentStatus) =>
  s === "fully_blocked" ? "#ef4444" : s === "partially_blocked" ? "#f59e0b" : "#10b981"

async function fetchTai8Subsegments(): Promise<SegmentFeature[]> {
  try {
    const res = await fetch("/geo/tai8_subsegments.geo.json", { cache: "no-store" })
    if (!res.ok) throw new Error(`Failed to load /geo/tai8_subsegments.geo.json: ${res.status}`)
    const json = await res.json()

    if (json?.type !== "FeatureCollection" || !Array.isArray(json?.features)) {
      throw new Error("Invalid GeoJSON: expect FeatureCollection")
    }

    const feats = json.features as SegmentFeature[]
    return feats.filter((f) => f?.geometry?.type === "LineString" && Array.isArray(f?.geometry?.coordinates))
  } catch (e) {
    console.warn("無法載入真實資料，使用範例資料", e)
    return [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [121.28, 24.15],
            [121.3, 24.17],
            [121.32, 24.19],
          ],
        },
        properties: { from_name: "太魯閣", to_name: "天祥", status: "clear", info: "路況良好" },
      },
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [121.32, 24.19],
            [121.34, 24.21],
            [121.36, 24.23],
          ],
        },
        properties: { from_name: "天祥", to_name: "洛韶", status: "partially_blocked", info: "施工中" },
      },
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [121.36, 24.23],
            [121.38, 24.25],
            [121.4, 24.27],
          ],
        },
        properties: { from_name: "洛韶", to_name: "慈恩", status: "fully_blocked", info: "落石封閉" },
      },
    ] as SegmentFeature[]
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
  showCctv,
  showWeather,
  zoomInSignal,
  zoomOutSignal,
  mapMode,
}: {
  showFullyBlocked: boolean
  showPartiallyBlocked: boolean
  showCctv: boolean
  showWeather: boolean
  zoomInSignal: number
  zoomOutSignal: number
  mapMode?: BaseMode
}) {
  void showFullyBlocked
  void showPartiallyBlocked
  void showCctv
  void showWeather

  const mapRef = useRef<HTMLDivElement | null>(null)
  const leafletMapRef = useRef<LeafletMap | null>(null)
  const leafletNSRef = useRef<LeafletNS | null>(null)
  const polylineLayersRef = useRef<any[]>([])
  const countyLayerRef = useRef<any>(null) // ✅ 縣市灰白圖層
  const injectedRef = useRef(false)

  const [mapReady, setMapReady] = useState(false)
  const [segments, setSegments] = useState<SegmentFeature[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSegment, setSelectedSegment] = useState<{
    label: string
    status: SegmentStatus
    info?: string
  } | null>(null)
  const mode = mapMode ?? "topo"

  // 縣市底圖資料
  const [taiwanGeo, setTaiwanGeo] = useState<GeoJSONLike | null>(null)
  const [geoLoading, setGeoLoading] = useState(true)

  // 1) 載入路段資料
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

  // 1.5) 載入縣市灰白底圖 GeoJSON
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setGeoLoading(true)
        const geo = await fetchTaiwanCounties()
        if (!cancelled) setTaiwanGeo(geo)
      } finally {
        if (!cancelled) setGeoLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // 2) 初始化 Leaflet
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

        const map = L.map(mapRef.current!, {
          center: [24.2213889, 121.3086],
          zoom: 12,
          zoomControl: true,
        })

        leafletMapRef.current = map

        const topoLayer = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
          maxZoom: 17,
          attribution: "© OpenStreetMap, SRTM | © OpenTopoMap",
        })

        const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "© OpenStreetMap",
        })

        // 預設模式：地形
        topoLayer.addTo(map)

        ;(map as any)._topoLayer = topoLayer
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

  // ✅ 3) 建立/更新 county 灰白底圖 Layer（GeoJSON -> L.geoJSON）
  useEffect(() => {
    const map = leafletMapRef.current
    const L = leafletNSRef.current
    if (!mapReady || !map || !L) return
    if (!taiwanGeo) return

    // 如果已存在，先移除再重建（避免重複疊）
    if (countyLayerRef.current) {
      try {
        map.removeLayer(countyLayerRef.current)
      } catch {}
      countyLayerRef.current = null
    }

    const geo = taiwanGeo as any
    const layer = L.geoJSON(geo, {
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

    // 如果目前模式是 county，就加上去
    if (mode === "county") {
      layer.addTo(map)
    }

    // 清掉一次 fit 旗標，讓第一次有路段時能 fit（可選）
    // injectedRef.current = false
  }, [taiwanGeo, mapReady]) // mode 另外在切換 effect 控制 add/remove

  // ✅ 4) 模式切換：topo / osm / county
  const applyMode = (next: BaseMode) => {
    const map = leafletMapRef.current
    const L = leafletNSRef.current
    if (!map || !L) return

    const topoLayer = (map as any)._topoLayer
    const osmLayer = (map as any)._osmLayer
    const countyLayer = countyLayerRef.current

    // 先全部移除（存在才移除）
    if (topoLayer && map.hasLayer(topoLayer)) map.removeLayer(topoLayer)
    if (osmLayer && map.hasLayer(osmLayer)) map.removeLayer(osmLayer)
    if (countyLayer && map.hasLayer(countyLayer)) map.removeLayer(countyLayer)

    // 再加上目標模式
    if (next === "topo") {
      topoLayer?.addTo(map)
    } else if (next === "osm") {
      osmLayer?.addTo(map)
    } else if (next === "county") {
      // county 模式不需要瓦片，只要 GeoJSON 灰白
      if (countyLayer) countyLayer.addTo(map)
    }

  }
  useEffect(() => {
    if (!mapReady) return
    applyMode(mode)
  }, [mode, mapReady])

  // ✅ 5) 畫路段
  useEffect(() => {
    const map = leafletMapRef.current
    const L = leafletNSRef.current
    if (!mapReady || !map || !L) return

    // 清除舊的路段
    polylineLayersRef.current.forEach((layer) => {
      try {
        map.removeLayer(layer)
      } catch {}
    })
    polylineLayersRef.current = []

    if (!segments || segments.length === 0) return

    const bounds = L.latLngBounds([])

    segments.forEach((segment) => {
      const coords = (segment.geometry.coordinates as any[]).map((c) => [c[1], c[0]]) // [lat, lon]
      coords.forEach((ll) => bounds.extend(ll))

      const props = segment.properties || {}
      const key = segmentKey(props)
      const status: SegmentStatus = props.status || SEGMENT_STATUS[key] || "clear"
      const color = colorByStatus(status)

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
        setSelectedSegment({ label, status, info: props.info })
      })

      line.on("mouseover", () => line.setStyle({ weight: 6 }))
      line.on("mouseout", () => line.setStyle({ weight: 4 }))
    })

    if (!injectedRef.current && bounds.isValid()) {
      injectedRef.current = true
      map.fitBounds(bounds.pad(0.15))
    }
  }, [segments, mapReady])

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
    if (mode === "topo") return "⛰️ 地形圖(OpenTopoMap)"
    if (mode === "osm") return "🗺️ 標準地圖(OSM)"
    return "⬜ 灰白縣市底圖(GeoJSON)"
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
        <div className="mt-1 font-medium text-slate-700">
          {geoLoading ? "🗺️ 載入縣市灰白底圖中..." : taiwanGeo ? "✓ 縣市灰白底圖已載入" : "⚠️ 縣市灰白底圖未載入"}
        </div>
        <div className="mt-2 text-[10px] text-slate-500">💡 點擊路段查看詳情</div>
      </div>

      {/* 圖例 */}
      <div className="absolute bottom-8 left-3 z-[500] rounded-md border-2 border-slate-300 bg-white/95 px-3 py-2 text-xs shadow-lg">
        <div className="mb-2 font-semibold text-slate-700">路段狀態</div>
        <div className="mb-1 flex items-center gap-2">
          <div className="h-1 w-6 rounded" style={{ background: "#16a34a" }} />
          <span>通行順暢</span>
        </div>
        <div className="mb-1 flex items-center gap-2">
          <div className="h-1 w-6 rounded" style={{ background: "#f59e0b" }} />
          <span>部分阻斷</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1 w-6 rounded" style={{ background: "#ef4444" }} />
          <span>完全阻斷</span>
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
      `}</style>
    </div>
  )
}
