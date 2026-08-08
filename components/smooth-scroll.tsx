"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

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

    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
      infinite: false,
    })

    const onScroll = () => {
      ScrollTrigger.update()
    }
    lenis.on("scroll", onScroll)

    let frame = 0
    let isPaused = false

    const raf = (time: number) => {
      if (!isPaused) {
        lenis.raf(time)
      }
      frame = requestAnimationFrame(raf)
    }

    const handleVisibility = () => {
      if (document.hidden) {
        isPaused = true
      } else {
        isPaused = false
      }
    }

    document.addEventListener("visibilitychange", handleVisibility)

    lenisRef.current = lenis
    window.lenis = lenis
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("visibilitychange", handleVisibility)
      lenis.off("scroll", onScroll)
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
