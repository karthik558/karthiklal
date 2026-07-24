"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const CustomCursor = dynamic(() => import("@/components/custom-cursor"), {
  ssr: false,
})
const SmoothScroll = dynamic(() => import("@/components/smooth-scroll"), {
  ssr: false,
})

export default function ClientEnhancements() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const enable = () => setEnabled(true)
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(enable, { timeout: 1500 })
      return () => window.cancelIdleCallback(id)
    }

    const id = globalThis.setTimeout(enable, 500)
    return () => globalThis.clearTimeout(id)
  }, [])

  if (!enabled) return null

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
    </>
  )
}
