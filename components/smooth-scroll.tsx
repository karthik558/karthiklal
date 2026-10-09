"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"

declare global {
  interface Window {
    lenis?: Lenis | null
  }
}

export default function SmoothScroll() {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      window.lenis = null
      return
    }

    // High-performance, snappy Lenis configuration
    // Completely free of GSAP overhead and double-smoothing lag; preserves native mobile touch
    const lenis = new Lenis({
      duration: 0.6, // Fast, snappy response (eliminates the sluggish 0.9s delay)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Snappy exponential ease-out
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0, // Natural 1:1 speed (removes the artificial slowdown)
      touchMultiplier: 1.0,
      syncTouch: false, // Never hijack native 120Hz touch scrolling on mobile
      autoRaf: false,
    })

    let frame = 0
    let isPaused = false

    const raf = (time: number) => {
      if (!isPaused) {
        lenis.raf(time)
      }
      frame = requestAnimationFrame(raf)
    }

    const handleVisibility = () => {
      isPaused = document.hidden
    }

    document.addEventListener("visibilitychange", handleVisibility)

    lenisRef.current = lenis
    window.lenis = lenis
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("visibilitychange", handleVisibility)
      lenis.destroy()
      lenisRef.current = null
      window.lenis = null
    }
  }, [])

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
  }, [pathname])

  return null
}
