"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useMotionValue, useScroll, useSpring, useTransform, motion } from "framer-motion"
import { debounce } from "@/lib/utils"

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [windowHeight, setWindowHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollComplete, setScrollComplete] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Store our scroll position
  const scrollY = useMotionValue(0)
  const scrollYProgress = useScroll().scrollYProgress

  // Check if we're in a browser environment
  const isBrowser = typeof window !== "undefined"

  // Update window height on mount and resize
  useEffect(() => {
    setIsMounted(true)

    // Don't run on server
    if (!isBrowser) return

    // Delay initialization to ensure DOM is fully loaded
    const initTimer = setTimeout(() => {
      const updateHeight = () => {
        if (!containerRef.current) return
        setWindowHeight(window.innerHeight)
        document.body.style.height = `${containerRef.current.scrollHeight}px`
      }

      // Update scroll position
      const updateScrollY = () => {
        scrollY.set(window.scrollY)
      }

      // Use debounced version for resize
      const debouncedUpdateHeight = debounce(updateHeight, 100)

      try {
        // Initialize
        updateHeight()
        window.addEventListener("resize", debouncedUpdateHeight)
        window.addEventListener("scroll", updateScrollY)
      } catch (error) {
        console.error("Error setting up smooth scroll:", error)
      }

      return () => {
        try {
          window.removeEventListener("resize", debouncedUpdateHeight)
          window.removeEventListener("scroll", updateScrollY)
        } catch (error) {
          console.error("Error cleaning up smooth scroll:", error)
        }
      }
    }, 100)

    return () => {
      clearTimeout(initTimer)
    }
  }, [isBrowser, scrollY])

  // Set up smooth spring animation for the scrollY motion value
  const springConfig = { damping: 25, stiffness: 100, mass: 0.5 }
  const smoothY = useSpring(scrollY, springConfig)

  // Create a negative transform based on smooth scroll
  const y = useTransform(smoothY, (value) => -value)

  // Update the body scroll when the animation completes
  useEffect(() => {
    if (!isBrowser) return

    if (scrollComplete) {
      window.scrollTo(0, scrollY.get())
      setScrollComplete(false)
    }
  }, [scrollComplete, scrollY, isBrowser])

  // Don't apply smooth scrolling if not mounted or not in browser
  if (!isMounted || !isBrowser) {
    return <>{children}</>
  }

  return (
    <motion.div
      ref={containerRef}
      style={{ y, position: "fixed", width: "100%", willChange: "transform" }}
      onAnimationComplete={() => setScrollComplete(true)}
    >
      {children}
    </motion.div>
  )
}

