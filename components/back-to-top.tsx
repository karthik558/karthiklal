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
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleScrollToTop}
          className="fixed right-6 bottom-6 z-[9998] group flex items-center justify-center h-14 w-14 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
          aria-label="Scroll to top"
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Progress squircle background */}
          <svg className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none" viewBox="0 0 56 56">
            <rect
              x="2"
              y="2"
              width="52"
              height="52"
              rx="16"
              fill="none"
              className="stroke-muted/20"
              strokeWidth="2"
            />
            {/* Active Progress squircle */}
            <motion.rect
              x="2"
              y="2"
              width="52"
              height="52"
              rx="16"
              fill="none"
              className="stroke-primary"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={180.53} // Perimeter: 4*(52 - 32) + 2*PI*16 = 80 + 100.53 = 180.53
              strokeDashoffset={180.53 - (180.53 * scrollProgress) / 100}
              transition={{ duration: 0.1, ease: "easeOut" }}
            />
          </svg>

          {/* Inner Button Content */}
          <div className="absolute inset-1.5 flex items-center justify-center rounded-[12px] bg-background/80 backdrop-blur-md border border-border/50 shadow-sm transition-all duration-300 group-hover:bg-primary group-hover:border-primary">
            <ArrowUp 
              className="h-5 w-5 text-foreground/80 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-primary-foreground" 
              strokeWidth={2.5} 
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

