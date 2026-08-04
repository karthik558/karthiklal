"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const video = videoRef.current
    if (!video) return

    let animationFrameId: number
    let targetTime = 0
    let lastSetTime = -1
    let isSeeking = false
    let pendingTime: number | null = null
    let scrollTriggerInstance: ScrollTrigger | null = null

    const setVideoTime = (time: number) => {
      if (!video.duration || isNaN(video.duration)) return

      // If browser is actively decoding a frame, hold the latest target in pendingTime
      if (video.seeking || isSeeking) {
        pendingTime = time
        return
      }

      // Only seek if target time has moved significantly
      if (Math.abs(time - lastSetTime) > 0.01) {
        isSeeking = true
        lastSetTime = time
        video.currentTime = time
      }
    }

    const handleSeeked = () => {
      isSeeking = false
      if (pendingTime !== null) {
        const nextTime = pendingTime
        pendingTime = null
        setVideoTime(nextTime)
      }
    }

    video.addEventListener("seeked", handleSeeked)

    const initScrubber = async () => {
      if (!video.duration || isNaN(video.duration)) return
      setIsLoaded(true)

      // Initialize browser video decoder pipeline
      try {
        const playPromise = video.play()
        if (playPromise !== undefined) {
          await playPromise
          video.pause()
        }
      } catch {
        // Autoplay policy fallback
      }

      // Create ScrollTrigger bound to document scroll height with real-time progress
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          if (video.duration && !isNaN(video.duration)) {
            targetTime = self.progress * video.duration
            setVideoTime(targetTime)
          }
        },
      })

      // RAF loop to apply smooth pending updates continuously
      const render = () => {
        if (pendingTime !== null && !video.seeking && !isSeeking) {
          const nextTime = pendingTime
          pendingTime = null
          setVideoTime(nextTime)
        }
        animationFrameId = requestAnimationFrame(render)
      }

      render()
      ScrollTrigger.refresh()
    }

    if (video.readyState >= 1 && video.duration) {
      initScrubber()
    } else {
      const handleMetadata = () => {
        initScrubber()
      }
      video.addEventListener("loadedmetadata", handleMetadata)
      video.addEventListener("canplaythrough", handleMetadata)
    }

    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh()
    })
    resizeObserver.observe(document.body)

    return () => {
      video.removeEventListener("seeked", handleSeeked)
      if (scrollTriggerInstance) scrollTriggerInstance.kill()
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className="parallax-container fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none">
      {/* Scroll-Bound 3D Video */}
      <video
        ref={videoRef}
        id="scroll-video"
        muted
        playsInline
        preload="auto"
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="/user/hero_video.webm" type="video/mp4" />
      </video>

      {/* Theme-aware overlay for crystal-clear readability in both Light and Dark modes */}
      <div className="dark-overlay absolute inset-0 bg-background/85 dark:bg-[#0a0a0c]/75 backdrop-brightness-95 dark:backdrop-brightness-90 transition-colors duration-300 pointer-events-none" />
    </div>
  )
}
