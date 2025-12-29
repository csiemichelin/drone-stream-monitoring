"use client"

import { usePathname } from "next/navigation"

export function BackgroundVideo() {
  const pathname = usePathname() || ""
  const isStreamDetail = /^\/streams\/[^/]+/.test(pathname)

  if (isStreamDetail) return null

  return (
    <>
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        src="/videos/sky.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-background/60" aria-hidden="true" />
    </>
  )
}
