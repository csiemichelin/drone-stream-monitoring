// Mock WebSocket implementation for demo
// In production, replace with actual WebSocket server (e.g., Socket.io, Pusher)

export class MockWebSocket {
  private listeners: Map<string, Set<(data: any) => void>> = new Map()
  private connectionCallbacks: Set<() => void> = new Set()

  constructor(url: string) {
    console.log("[v0] MockWebSocket initialized:", url)

    // Simulate connection after short delay
    setTimeout(() => {
      this.connectionCallbacks.forEach((cb) => cb())
    }, 100)
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)?.add(callback)
  }

  off(event: string, callback: (data: any) => void) {
    this.listeners.get(event)?.delete(callback)
  }

  emit(event: string, data: any) {
    console.log("[v0] WebSocket emit:", event, data)
    this.listeners.get(event)?.forEach((cb) => cb(data))
  }

  onConnect(callback: () => void) {
    this.connectionCallbacks.add(callback)
  }

  disconnect() {
    this.listeners.clear()
    this.connectionCallbacks.clear()
  }
}

// Hook for using WebSocket in components
export function useWebSocket(url: string) {
  const ws = new MockWebSocket(url)
  return ws
}
