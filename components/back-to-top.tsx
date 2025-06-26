"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { scrollToTop, getCurrentScrollProgress } from "@/lib/scroll-utils"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Check if we're in a browser environment
  const isBrowser = typeof window !== "undefined"

  useEffect(() => {
    setIsMounted(true)

    // Don't run on server
    if (!isBrowser) return

    // Delay initialization to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      try {
        const toggleVisibility = () => {
          try {
            const scrolled = window.scrollY
            let progress = 0
            
            try {
              progress = getCurrentScrollProgress() * 100
            } catch {
              // Fallback calculation if ScrollSmoother is not available
              const maxHeight = Math.max(
                document.documentElement.scrollHeight - window.innerHeight,
                1
              )
              progress = Math.min((scrolled / maxHeight) * 100, 100)
            }

            setScrollProgress(Math.min(Math.max(progress, 0), 100))
            setIsVisible(scrolled > 500)
          } catch (error) {
            console.warn("Error in scroll detection, using fallback", error)
            const scrolled = window.scrollY
            setIsVisible(scrolled > 500)
            setScrollProgress(0)
          }
        }

        window.addEventListener("scroll", toggleVisibility)
        // Initial check
        toggleVisibility()

        return () => {
          window.removeEventListener("scroll", toggleVisibility)
        }
      } catch (error) {
        console.error("Error setting up back-to-top:", error)
      }
    }, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [isBrowser])

  const handleScrollToTop = () => {
    if (!isBrowser) return
    scrollToTop()
  }

  // Don't render anything on server or if not mounted
  if (!isMounted || !isBrowser) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ 
            type: "spring",
            stiffness: 400,
            damping: 25
          }}
          onClick={handleScrollToTop}
          className="fixed right-6 bottom-6 z-[9998] group"
          aria-label="Scroll to top"
        >
          {/* Main button with progress ring */}
          <div className="relative w-14 h-14">
            {/* Progress circle background */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
              {/* Background circle */}
              <circle
                cx="28"
                cy="28"
                r="26"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="2"
                opacity="0.2"
              />
              {/* Progress circle */}
              <motion.circle
                cx="28"
                cy="28"
                r="26"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={163.36} // 2 * π * 26
                strokeDashoffset={163.36 - (163.36 * scrollProgress) / 100}
                className="drop-shadow-sm"
                transition={{ duration: 0.1 }}
              />
            </svg>

            {/* Button content */}
            <div className="absolute inset-1 bg-gradient-to-br from-background to-background/95 rounded-full border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group-hover:scale-105 group-active:scale-95">
              <motion.div
                whileHover={{ y: -1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <ArrowUp className="h-5 w-5 text-primary" strokeWidth={2.5} />
              </motion.div>
            </div>

            {/* Subtle glow on hover */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

