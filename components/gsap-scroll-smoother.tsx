"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollSmoother } from "gsap/ScrollSmoother"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollSmoother, ScrollTrigger)
}

interface GSAPScrollSmootherProps {
  children: React.ReactNode
}

export default function GSAPScrollSmoother({ children }: GSAPScrollSmootherProps) {
  const smootherRef = useRef<ScrollSmoother | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Re-enable ScrollSmoother with improved configuration
  const ENABLE_SCROLL_SMOOTHER = true

  useEffect(() => {
    // Only run on client side and if enabled
    if (typeof window === "undefined" || !ENABLE_SCROLL_SMOOTHER) return

    let cleanupAnchorListener: (() => void) | null = null

    // Delay initialization to ensure DOM is ready
    const initTimer = setTimeout(() => {
      if (wrapperRef.current && contentRef.current && !smootherRef.current) {
        try {
          // Create ScrollSmoother instance with minimal, stable configuration
          smootherRef.current = ScrollSmoother.create({
            wrapper: wrapperRef.current,
            content: contentRef.current,
            smooth: 1, // Default smooth value for responsiveness
            effects: true, // Enable data-speed effects for parallax
          })

          // Handle smooth scrolling to anchors with better detection
          const handleAnchorClick = (e: Event) => {
            const target = e.target as HTMLElement
            const link = target.closest('a[href^="#"]') as HTMLAnchorElement
            
            if (link && link.getAttribute('href')?.startsWith('#')) {
              const targetId = link.getAttribute('href')?.substring(1)
              const targetElement = document.getElementById(targetId || '')
              
              if (targetElement && smootherRef.current) {
                e.preventDefault()
                e.stopPropagation()
                // Use ScrollSmoother's smooth scrolling
                smootherRef.current.scrollTo(targetElement, true, "top 100px")
              }
            }
          }

          // Add event listener for anchor clicks
          document.addEventListener('click', handleAnchorClick, { capture: true })
          
          // Store cleanup function
          cleanupAnchorListener = () => {
            document.removeEventListener('click', handleAnchorClick, { capture: true })
          }

          setIsInitialized(true)
        } catch (error) {
          console.error("Failed to initialize ScrollSmoother:", error)
        }
      }
    }, 100)

    // Cleanup function
    return () => {
      clearTimeout(initTimer)
      if (smootherRef.current) {
        smootherRef.current.kill()
        smootherRef.current = null
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      // Remove anchor click listener
      if (cleanupAnchorListener) {
        cleanupAnchorListener()
      }
      setIsInitialized(false)
    }
  }, [])

  // Handle window resize and refresh ScrollSmoother
  useEffect(() => {
    if (typeof window === "undefined" || !isInitialized || !ENABLE_SCROLL_SMOOTHER) return

    const handleResize = () => {
      if (smootherRef.current) {
        smootherRef.current.refresh()
      }
    }

    // Refresh ScrollTrigger when content changes
    const refreshScrollTrigger = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("load", refreshScrollTrigger)
    
    // Initial refresh after a short delay
    const refreshTimer = setTimeout(refreshScrollTrigger, 200)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("load", refreshScrollTrigger)
      clearTimeout(refreshTimer)
    }
  }, [isInitialized])

  // If ScrollSmoother is disabled, return children without wrapper
  if (!ENABLE_SCROLL_SMOOTHER) {
    return <>{children}</>
  }

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  )
}
