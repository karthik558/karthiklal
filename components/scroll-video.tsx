"use client"

import { useEffect, useRef, useState } from "react"

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => setIsLoaded(true)

    // Ensure video starts playing automatically
    video.play().catch(() => {
      // Autoplay policy fallback
    })

    if (video.readyState >= 3) {
      setIsLoaded(true)
    } else {
      video.addEventListener("canplaythrough", handleCanPlay)
      video.addEventListener("loadeddata", handleCanPlay)
    }

    return () => {
      video.removeEventListener("canplaythrough", handleCanPlay)
      video.removeEventListener("loadeddata", handleCanPlay)
    }
  }, [])

  return (
    <div className="absolute inset-0 h-full w-full z-0 overflow-hidden pointer-events-none select-none">
      {/* Background Video - Hero Section Only */}
      <video
        ref={videoRef}
        id="hero-video"
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-90"
        }`}
      >
        <source src="/user/hero_video.webm" type="video/webm" />
        <source src="/user/hero_video.webm" type="video/mp4" />
      </video>

      {/* Theme-aware overlay for readability */}
      <div className="dark-overlay absolute inset-0 bg-background/85 dark:bg-[#0a0a0c]/75 backdrop-brightness-95 dark:backdrop-brightness-90 transition-colors duration-300 pointer-events-none" />
    </div>
  )
}

