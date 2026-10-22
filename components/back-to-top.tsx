"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { scrollToTop } from "@/lib/scroll-utils"
import { playClickSound, playHoverSound } from "@/lib/sound-fx"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight

          if (totalHeight > 0) {
            const progress = Math.min(100, Math.max(0, Math.round((scrollY / totalHeight) * 100)))
            setScrollProgress(progress)
          }

          // Reveal button smoothly once scrolled past the hero view (threshold 400px)
          setIsVisible(scrollY > 400)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    const initialCheck = requestAnimationFrame(handleScroll)

    return () => {
      cancelAnimationFrame(initialCheck)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleScrollToTop = () => {
    playClickSound()
    scrollToTop()
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    playHoverSound()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  // Circular progress gauge metrics (32x32 viewBox, radius = 13)
  const radius = 13
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (circumference * scrollProgress) / 100

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          whileHover={reducedMotion ? undefined : { y: -2 }}
          whileTap={reducedMotion ? undefined : { scale: 0.94 }}
          onClick={handleScrollToTop}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="group fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-[9998] flex h-10 w-10 items-center justify-center border border-border bg-card/95 text-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] backdrop-blur-md transition-all duration-200 hover:border-primary hover:shadow-[3px_3px_0px_0px_hsl(var(--primary))] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none sm:right-6 sm:bottom-6 sm:h-11 sm:w-11 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Scroll to top"
          title={`Scroll to top (${scrollProgress}%)`}
        >
          {/* Blueprint Drafting Corner Brackets (Signature landing page motif) */}
          <span
            className="pointer-events-none absolute -top-[1px] -left-[1px] h-1.5 w-1.5 border-t-2 border-l-2 border-primary"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute -bottom-[1px] -right-[1px] h-1.5 w-1.5 border-b-2 border-r-2 border-primary"
            aria-hidden="true"
          />

          {/* Radial Scroll Progress Gauge with Centered Elevator Arrow */}
          <div className="relative flex h-8 w-8 items-center justify-center">
            <svg
              className="h-8 w-8 -rotate-90 transform"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              {/* Background Track */}
              <circle
                cx="16"
                cy="16"
                r={radius}
                className="stroke-muted/80 dark:stroke-muted/40"
                strokeWidth="2"
                fill="transparent"
              />
              {/* Active Scroll Progress Fill (Primary Vermilion) */}
              <circle
                cx="16"
                cy="16"
                r={radius}
                className="stroke-primary transition-[stroke-dashoffset] duration-150 ease-out"
                strokeWidth="2.25"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Kinetic Arrow: subtle elevator glide on hover */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-foreground group-hover:text-primary transition-colors"
              animate={reducedMotion ? undefined : { y: isHovered ? -2 : 0 }}
              transition={{ duration: 0.18 }}
            >
              <ArrowUp className="h-4 w-4 stroke-[2.5]" />
            </motion.div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}



