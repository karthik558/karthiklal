"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { playClickSound, playWindWhooshSound } from "@/lib/sound-fx"

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

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      const interactive = target.closest(
        'a, button, label, input[type="button"], input[type="submit"], [role="button"], [tabindex]:not([tabindex="-1"])'
      )
      if (interactive) {
        playClickSound()
      }
    }

    window.addEventListener("click", handleGlobalClick, { capture: true, passive: true })
    return () => window.removeEventListener("click", handleGlobalClick, { capture: true })
  }, [])

  // Fast scroll up adaptive wind whoosh sound detector (Strict Upward Scroll Only)
  useEffect(() => {
    let lastScrollY = window.scrollY
    let lastTime = performance.now()
    let lastWhooshTime = 0
    let lastScrollDownTime = 0

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const currentTime = performance.now()
      const dt = currentTime - lastTime

      if (dt >= 20) {
        const dy = currentScrollY - lastScrollY
        const velocity = dy / dt

        // Track when user is scrolling DOWN
        if (dy > 2) {
          lastScrollDownTime = currentTime
        }

        // STRICT UPWARD SCROLL ONLY:
        // 1. dy must be negative (scrolling UP)
        // 2. velocity must be fast negative (< -2.2 px/ms)
        // 3. User must NOT have scrolled down in the last 800ms (eliminates momentum recoil)
        if (dy < -2 && velocity < -2.2 && currentScrollY > 250 && currentTime - lastScrollDownTime > 800) {
          const speed = Math.abs(velocity)
          const intensity = Math.min(0.9, Math.max(0.25, (speed - 1.8) / 5))

          if (currentTime - lastWhooshTime > 750) {
            lastWhooshTime = currentTime
            playWindWhooshSound(intensity)
          }
        }

        lastScrollY = currentScrollY
        lastTime = currentTime
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <CustomCursor />
      {enabled && <SmoothScroll />}
    </>
  )
}
