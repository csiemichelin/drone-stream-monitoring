// Mock VLM analysis function - placeholder for real VLM integration

import type { VLMAnalysis, AnomalyType } from "./types"

/**
 * analyzeFrame - Stub function for VLM road anomaly detection
 *
 * In production, replace this with actual VLM API calls (e.g., GPT-5 Vision, Claude Vision)
 * This stub generates realistic mock results for demonstration
 */
export async function analyzeFrame(
  streamId: string,
  frameData: string | Blob,
  options?: {
    threshold?: number
    previousAnalysis?: VLMAnalysis
  },
): Promise<VLMAnalysis> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))

  // Mock analysis - in production, this would call actual VLM
  const roadClosed = Math.random() > 0.88
  const anomalyTypes: AnomalyType[] = ["normal", "congestion", "obstacle", "road_closure", "accident"]

  let anomalyType: AnomalyType = "normal"
  if (roadClosed) {
    anomalyType = Math.random() > 0.5 ? "road_closure" : "accident"
  } else {
    const rand = Math.random()
    if (rand > 0.95) anomalyType = "accident"
    else if (rand > 0.85) anomalyType = "obstacle"
    else if (rand > 0.65) anomalyType = "congestion"
  }

  const confidence = anomalyType === "normal" ? 0.3 + Math.random() * 0.4 : 0.65 + Math.random() * 0.3

  const analysis: VLMAnalysis = {
    id: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    taskId: "",
    streamId,
    timestamp: new Date(),
    road_closed: roadClosed,
    anomaly_type: anomalyType,
    confidence,
    description: generateDescription(anomalyType, roadClosed),
    affected_lanes: {
      inner: Math.random() > 0.6,
      middle: roadClosed || Math.random() > 0.5,
      outer: Math.random() > 0.7,
      all: roadClosed && Math.random() > 0.6,
    },
    location_hint: `Sector ${Math.floor(Math.random() * 4) + 1}, ${Math.floor(Math.random() * 800) + 100}m`,
    evidence: generateEvidence(anomalyType, roadClosed, confidence),
    raw: {
      model: "mock-vlm-v1",
      processingTimeMs: Math.floor(Math.random() * 200 + 100),
      frameSize: "1920x1080",
      confidence_breakdown: {
        detection: confidence * 0.95,
        classification: confidence * 1.05,
      },
    },
    frameUrl: `/placeholder.svg?height=180&width=320&query=traffic+${anomalyType}+scene`,
  }

  return analysis
}

function generateDescription(type: AnomalyType, roadClosed: boolean): string {
  const descriptions: Record<AnomalyType, string> = {
    road_closure: "Road closure detected with visible barriers and signage. Traffic being diverted.",
    accident: "Incident detected with stopped vehicles. Emergency response may be required.",
    congestion: "Heavy traffic congestion observed. Average speed significantly reduced.",
    obstacle: "Object or obstacle detected in travel lanes. Potential hazard identified.",
    normal: "Normal traffic conditions. No anomalies detected at this time.",
    unknown: "Unusual traffic pattern detected. Manual review recommended.",
  }
  return descriptions[type] || descriptions.unknown
}

function generateEvidence(type: AnomalyType, roadClosed: boolean, confidence: number): string {
  const evidenceOptions = {
    road_closure: ["traffic cones detected", "barrier placement confirmed", "detour signs visible", "lane blockage"],
    accident: ["vehicle collision", "debris on roadway", "stopped vehicles", "emergency lights"],
    congestion: ["high vehicle density", "reduced speed detected", "queue formation", "brake light patterns"],
    obstacle: ["object in lane", "debris detected", "fallen cargo", "road hazard"],
    normal: ["steady traffic flow", "normal speed", "clear lanes", "no obstructions"],
    unknown: ["irregular pattern", "unclear situation", "needs verification"],
  }

  const options = evidenceOptions[type] || evidenceOptions.unknown
  const numEvidence = Math.min(Math.floor(confidence * 4) + 1, options.length)

  return options.slice(0, numEvidence).join(", ")
}

/**
 * Interface definition for real VLM integration
 *
 * When integrating with actual VLM services, implement this interface:
 */
export interface VLMProvider {
  name: string
  analyzeFrame(frameData: Blob | string, prompt?: string): Promise<VLMAnalysis>
  configure(apiKey: string, options?: Record<string, any>): void
}

/**
 * Example: OpenAI GPT-5 Vision integration (placeholder)
 */
export class OpenAIVLMProvider implements VLMProvider {
  name = "OpenAI GPT-5 Vision"
  private apiKey?: string

  configure(apiKey: string, options?: Record<string, any>): void {
    this.apiKey = apiKey
    // Configure additional options
  }

  async analyzeFrame(frameData: Blob | string, prompt?: string): Promise<VLMAnalysis> {
    // TODO: Implement actual OpenAI Vision API call
    // const response = await fetch('https://api.openai.com/v1/chat/completions', { ... })
    throw new Error("Not implemented - replace with actual OpenAI Vision API integration")
  }
}
