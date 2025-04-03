"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { lerp } from "@/lib/utils"
import { useTheme } from "next-themes"

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorOuterRef = useRef<HTMLDivElement>(null)
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const prevTime = useRef<number | null>(null)
  const { theme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  // Declare cursorPos and cursorOuterPos
  const cursorPos = useRef({ x: 0, y: 0 })
  const cursorOuterPos = useRef({ x: 0, y: 0 })

  // Check if we're in a browser environment
  const isBrowser = typeof window !== "undefined"

  // Check if client is on mobile device
  const isMobile = isBrowser
    ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    : false

  const initCursor = () => {
    if (!isBrowser || !document || isMobile) return

    try {
      // Add mousemove event listener
      document.addEventListener("mousemove", updateCursorPosition)
      document.documentElement.classList.add("custom-cursor-active")

      // Start the animation loop
      requestAnimationFrame(animateCursor)
    } catch (error) {
      console.error("Error setting up cursor:", error)
    }
  }

  const setupInteractiveElements = () => {
    if (!isBrowser || !document || isMobile) return

    try {
      const interactiveElements = document.querySelectorAll("a, button, .interactive")
      if (interactiveElements && interactiveElements.length > 0) {
        interactiveElements.forEach((el) => {
          el.addEventListener("mouseenter", handleMouseEnter)
          el.addEventListener("mouseleave", handleMouseLeave)
        })
      }
    } catch (error) {
      console.error("Error setting up interactive elements:", error)
    }
  }

  const updateCursorPosition = (e: MouseEvent) => {
    mouse.current.x = e.clientX
    mouse.current.y = e.clientY
  }

  const animateCursor = (time: number) => {
    if (!prevTime.current) prevTime.current = time
    const deltaTime = time - prevTime.current
    prevTime.current = time

    // Use lerp for smooth movement
    cursorPos.current.x = lerp(cursorPos.current.x, mouse.current.x, 0.2)
    cursorPos.current.y = lerp(cursorPos.current.y, mouse.current.y, 0.2)

    cursorOuterPos.current.x = lerp(cursorOuterPos.current.x, mouse.current.x, 0.1)
    cursorOuterPos.current.y = lerp(cursorOuterPos.current.y, mouse.current.y, 0.1)

    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`
    }

    if (cursorOuterRef.current) {
      cursorOuterRef.current.style.transform = `translate(${cursorOuterPos.current.x}px, ${cursorOuterPos.current.y}px)`
    }

    requestAnimationFrame(animateCursor)
  }

  // Animate cursor on interactive elements
  function handleMouseEnter() {
    if (cursorRef.current && cursorOuterRef.current) {
      gsap.to(cursorRef.current, {
        scale: 1.5,
        duration: 0.3,
        ease: "power2.out",
      })
      gsap.to(cursorOuterRef.current, {
        scale: 1.8,
        duration: 0.3,
        ease: "power2.out",
        opacity: 0.4,
      })
    }
  }

  function handleMouseLeave() {
    if (cursorRef.current && cursorOuterRef.current) {
      gsap.to(cursorRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      })
      gsap.to(cursorOuterRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
        opacity: 1,
      })
    }
  }

  useEffect(() => {
    setIsMounted(true)

    // Don't run on mobile or server
    if (!isBrowser || isMobile) return

    // Delay initialization to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      initCursor()

      // Setup event listeners for hover effects with a delay
      const interactiveTimer = setTimeout(() => {
        setupInteractiveElements()
      }, 1000)

      return () => {
        clearTimeout(interactiveTimer)
      }
    }, 500)

    return () => {
      clearTimeout(timer)

      // Clean up event listeners
      if (isBrowser && document) {
        try {
          document.removeEventListener("mousemove", updateCursorPosition)
          document.documentElement.classList.remove("custom-cursor-active")

          // Clean up interactive element listeners
          const interactiveElements = document.querySelectorAll("a, button, .interactive")
          if (interactiveElements && interactiveElements.length > 0) {
            interactiveElements.forEach((el) => {
              el.removeEventListener("mouseenter", handleMouseEnter)
              el.removeEventListener("mouseleave", handleMouseLeave)
            })
          }
        } catch (error) {
          console.error("Error cleaning up cursor:", error)
        }
      }
    }
  }, [isBrowser, isMobile])

  // Don't render anything on server or if not mounted
  if (!isMounted || !isBrowser || isMobile) {
    return null
  }

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-50 flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary mix-blend-difference"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        ref={cursorOuterRef}
        className="pointer-events-none fixed left-0 top-0 z-40 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary mix-blend-difference"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />
    </>
  )
}

