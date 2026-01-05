"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import * as d3 from "d3"

type SegmentStatus = "fully_blocked" | "partially_blocked" | "clear"
type LonLat = [number, number]
type GeoJSONLike = GeoJSON.FeatureCollection | GeoJSON.Feature

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

type SegmentProps = {
  from_id?: string
  from_name?: string
  to_id?: string
  to_name?: string
  status?: SegmentStatus
  info?: string
}

type SegmentFeature = GeoJSON.Feature<GeoJSON.LineString, SegmentProps>

const SEGMENT_STATUS: Record<string, SegmentStatus> = {
  // 範例：
  // "w041-w042": "fully_blocked",
  // "w033-w034": "partially_blocked",
}

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
  const res = await fetch("/geo/tai8_subsegments.geo.json", { cache: "no-store" })
  if (!res.ok) throw new Error(`Failed to load /geo/tai8_subsegments.geo.json: ${res.status}`)
  const json = (await res.json()) as any

  if (json?.type !== "FeatureCollection" || !Array.isArray(json?.features)) {
    throw new Error("Invalid tai8_subsegments.geo.json: expect FeatureCollection")
  }

  const feats = json.features as SegmentFeature[]
  const filtered = feats.filter((f) => f?.geometry?.type === "LineString" && Array.isArray(f?.geometry?.coordinates))
  
  return filtered;
}

export default function Tai8D3SvgMap({
  showFullyBlocked,
  showPartiallyBlocked,
  showCctv,
  showWeather,
  zoomInSignal,
  zoomOutSignal,
}: {
  showFullyBlocked: boolean
  showPartiallyBlocked: boolean
  showCctv: boolean
  showWeather: boolean
  zoomInSignal: number
  zoomOutSignal: number
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)

  const [vp, setVp] = useState({ w: 0, h: 0 })

  const [taiwanGeo, setTaiwanGeo] = useState<GeoJSONLike | null>(null)
  const [geoLoading, setGeoLoading] = useState(true)

  const [segments, setSegments] = useState<SegmentFeature[]>([])
  const [loading, setLoading] = useState(true)

  const [hoverInfo, setHoverInfo] = useState<{
    seg: SegmentFeature
    x: number
    y: number
    label: string
    key: string
    status: SegmentStatus
    info?: string
  } | null>(null)

  // ResizeObserver
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      setVp({ w: r.width, h: r.height })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // 台灣底圖
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setGeoLoading(true)
        const res = await fetch("/geo/twCounty2010merge.geo.json", { cache: "no-store" })
        if (!res.ok) throw new Error(`Failed to load /geo/twCounty2010merge.geo.json: ${res.status}`)
        const json = (await res.json()) as GeoJSONLike
        if (!cancelled) setTaiwanGeo(json)
      } catch (e) {
        console.error(e)
        if (!cancelled) setTaiwanGeo(null)
      } finally {
        if (!cancelled) setGeoLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // 台八線子路段
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const feats = await fetchTai8Subsegments()
        if (cancelled) return
        setSegments(feats)
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

  const visibleSegments = useMemo(() => segments, [segments])

  // 主 render
  useEffect(() => {
    const svgEl = svgRef.current
    const host = containerRef.current
    if (!svgEl || !host) return
    if (vp.w <= 0 || vp.h <= 0) return

    const svg = d3.select(svgEl)
    svg.selectAll("*").remove()

    svg
      .attr("width", vp.w)
      .attr("height", vp.h)
      .attr("viewBox", `0 0 ${vp.w} ${vp.h}`)
      .style("background", "#eef6ff")
      .style("touch-action", "none")

    const gRoot = svg.append("g").attr("class", "root")

    // projection
    const projection = d3.geoMercator()

    if (taiwanGeo) {
      const padding = 24
      projection.fitExtent(
        [
          [padding, padding],
          [vp.w - padding, vp.h - padding],
        ],
        taiwanGeo as any
      )
    } else {
      const fakeGeo: GeoJSONLike = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [119, 21.8],
                  [123, 21.8],
                  [123, 25.4],
                  [119, 25.4],
                  [119, 21.8],
                ],
              ],
            },
          },
        ],
      }
      const padding = 24
      projection.fitExtent(
        [
          [padding, padding],
          [vp.w - padding, vp.h - padding],
        ],
        fakeGeo as any
      )
    }

    const geoPath = d3.geoPath(projection)

    // 1) 台灣底圖
    if (taiwanGeo) {
      const features =
        (taiwanGeo as any).type === "FeatureCollection" ? (taiwanGeo as any).features : [(taiwanGeo as any)]

      gRoot
        .append("g")
        .attr("class", "tw-counties")
        .selectAll("path")
        .data(features)
        .enter()
        .append("path")
        .attr("d", geoPath as any)
        .attr("fill", "#bdbdbd")
        .attr("stroke", "#94a3b8")
        .attr("stroke-width", 1)
        .attr("opacity", 0.95)

      gRoot
        .append("g")
        .attr("class", "county-labels")
        .selectAll("text")
        .data(features)
        .enter()
        .append("text")
        .text((f: any) => f?.properties?.COUNTYNAME ?? "")
        .attr("x", (f: any) => geoPath.centroid(f as any)[0])
        .attr("y", (f: any) => geoPath.centroid(f as any)[1])
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("font-size", 6)
        .attr("font-weight", 500)
        .attr("fill", "white")
        .attr("stroke", "#007EB7")
        .attr("stroke-width", 0.5)
        .attr("paint-order", "stroke")
        .style("pointer-events", "none")
    } else {
      gRoot
        .append("text")
        .attr("x", 16)
        .attr("y", 24)
        .attr("fill", "#334155")
        .attr("font-size", 12)
        .text("⚠️ 未載入台灣底圖：請放 public/geo/twCounty2010merge.geo.json")
    }

    // 2) 台八線：每個子路段一條線（顏色依狀態）
    const segGroup = gRoot.append("g").attr("class", "tai8-segments")

    const toLonLatCoords = (f: SegmentFeature): LonLat[] =>
      (f.geometry.coordinates as any).map(([lon, lat]: any) => [Number(lon), Number(lat)] as LonLat)

    const linePath = (coords: LonLat[]) =>
      d3
        .line<LonLat>()
        .x((d) => projection([d[0], d[1]])?.[0] ?? 0)
        .y((d) => projection([d[0], d[1]])?.[1] ?? 0)
        .curve(d3.curveLinear)(coords) ?? ""

    // 先畫粗白色邊框層（強調每段之間的區隔）
    segGroup
      .selectAll("path.seg-border")
      .data(visibleSegments)
      .enter()
      .append("path")
      .attr("class", "seg-border")
      .attr("d", (f) => linePath(toLonLatCoords(f)))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5) // 加粗邊界
      .attr("opacity", 1)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .style("pointer-events", "none")

    // 再畫主要線條（依狀態著色）
    segGroup
      .selectAll("path.seg")
      .data(visibleSegments)
      .enter()
      .append("path")
      .attr("class", "seg")
      .attr("d", (f) => linePath(toLonLatCoords(f)))
      .attr("fill", "none")
      .attr("stroke", (f) => {
        const p = (f.properties ?? {}) as SegmentProps
        const key = segmentKey(p)
        const status: SegmentStatus = p.status ?? SEGMENT_STATUS[key] ?? "clear"
        return colorByStatus(status)
      })
      .attr("stroke-width", 0.8) // 加粗主線
      .attr("opacity", 0.95)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .style("cursor", "pointer")
      .style("pointer-events", "stroke")
      .style("transition", "stroke-width 0.2s ease")
      .on("mouseenter", function (event, f) {
        // hover 時加粗
        d3.select(this).attr("stroke-width", 1)

        const p = (f.properties ?? {}) as SegmentProps
        const key = segmentKey(p)
        const label = segmentLabel(p)
        const status: SegmentStatus = p.status ?? SEGMENT_STATUS[key] ?? "clear"

        // 用這條 path 的 bounding box 中心點
        const pathEl = event.currentTarget as SVGPathElement
        const bbox = pathEl.getBBox()
        const cx = bbox.x + bbox.width / 2
        const cy = bbox.y + bbox.height / 2

        const t = d3.zoomTransform(svgEl)
        const sx = t.applyX(cx)
        const sy = t.applyY(cy)

        setHoverInfo({
          seg: f,
          x: sx,
          y: sy,
          label,
          key,
          status,
          info: p.info,
        })
      })
      .on("mouseleave", function () {
        d3.select(this).attr("stroke-width", 0.8)
        setHoverInfo(null)
      })

    // 點空白也清除 hover
    svg.on("click", () => setHoverInfo(null))

    // zoom/pan
    const zoomed = (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
      gRoot.attr("transform", event.transform.toString())

      if (hoverInfo?.seg) {
        const selectedKey = hoverInfo.key
        const selected = segGroup
          .selectAll<SVGPathElement, SegmentFeature>("path.seg")
          .filter((ff) => {
            const pp = (ff.properties ?? {}) as SegmentProps
            return segmentKey(pp) === selectedKey
          })
          .node()

        if (!selected) return
        const bbox = selected.getBBox()
        const cx = bbox.x + bbox.width / 2
        const cy = bbox.y + bbox.height / 2

        const t = event.transform
        setHoverInfo((prev) => (prev ? { ...prev, x: t.applyX(cx), y: t.applyY(cy) } : prev))
      }
    }

    const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([1, 24]).on("zoom", zoomed)
    zoomBehaviorRef.current = zoom

    svg.call(zoom as any)

    // ✅ 你的目標點：北緯24°10'53"、東經121°18'31"
    const TARGET_LON = 121.10276111
    const TARGET_LAT = 24.2213889

    // 想預設拉近多少（可調：4~10 常見）
    const k0 = 7.5

    const p = projection([TARGET_LON, TARGET_LAT])
    if (p) {
      const [x0, y0] = p
      const t0 = d3.zoomIdentity
        .translate(vp.w / 2 - x0 * k0, vp.h / 2 - y0 * k0)
        .scale(k0)

      svg.call(zoom.transform as any, t0)
    } else {
      // fallback：投影失敗就回到原點
      svg.call(zoom.transform as any, d3.zoomIdentity)
    }
  }, [vp.w, vp.h, taiwanGeo, visibleSegments])

  // 外部 zoom signals
  useEffect(() => {
    const svgEl = svgRef.current
    const zoom = zoomBehaviorRef.current
    if (!svgEl || !zoom) return
    if (zoomInSignal <= 0) return
    d3.select(svgEl).transition().duration(350).call(zoom.scaleBy as any, 1.25)
  }, [zoomInSignal])

  useEffect(() => {
    const svgEl = svgRef.current
    const zoom = zoomBehaviorRef.current
    if (!svgEl || !zoom) return
    if (zoomOutSignal <= 0) return
    d3.select(svgEl).transition().duration(350).call(zoom.scaleBy as any, 0.8)
  }, [zoomOutSignal])

  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* 右上角狀態 */}
      <div className="absolute right-3 top-3 z-[500] rounded-md border bg-white/90 px-3 py-2 text-xs shadow-lg">
        <div className="font-medium text-slate-700">
          {geoLoading ? "🗺️ 載入底圖中..." : taiwanGeo ? "✓ 底圖已載入" : "⚠️ 底圖未載入"}
        </div>
        <div className="mt-1 font-medium text-slate-700">
          {loading ? "🔄 載入台八線子路段中..." : `✓ 台八線子路段已載入 (${segments.length} 段)`}
        </div>
        <div className="mt-2 text-[10px] text-slate-500">
          💡 將鼠標移到路段上查看詳情
        </div>
      </div>

      {/* SVG 地圖 */}
      <svg ref={svgRef} className="absolute inset-0 z-[200]" />

      {/* Hover 提示框 */}
      {hoverInfo && (
        <div
          className="pointer-events-none absolute z-[600]"
          style={{
            left: clamp(hoverInfo.x + 14, 12, Math.max(12, vp.w - 260)),
            top: clamp(hoverInfo.y - 10, 12, Math.max(12, vp.h - 200)),
            width: 240,
          }}
        >
          <div className="rounded-lg border-2 bg-white p-3 text-xs shadow-2xl">
            <div className="mb-2 text-sm font-semibold text-slate-900">{hoverInfo.label}</div>

            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-600">狀態：</span>
              <span
                className={
                  hoverInfo.status === "fully_blocked"
                    ? "text-red-600 font-semibold"
                    : hoverInfo.status === "partially_blocked"
                    ? "text-orange-600 font-semibold"
                    : "text-green-600 font-semibold"
                }
              >
                {hoverInfo.status === "fully_blocked"
                  ? "⛔ 完全阻斷"
                  : hoverInfo.status === "partially_blocked"
                  ? "⚠️ 部分阻斷"
                  : "✓ 通行順暢"}
              </span>
            </div>

            <div className="mt-2 text-[10px] text-slate-400">ID: {hoverInfo.key}</div>

            {hoverInfo.info && (
              <div className="mt-2 border-t pt-2 text-[11px] text-slate-700">{hoverInfo.info}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}