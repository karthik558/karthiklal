"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

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
          if (window.scrollY > 500) {
            setIsVisible(true)
          } else {
            setIsVisible(false)
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

  const scrollToTop = () => {
    if (!isBrowser) return

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Don't render anything on server or if not mounted
  if (!isMounted || !isBrowser) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className={cn(
            "interactive fixed right-6 bottom-6 flex h-12 w-12 items-center justify-center rounded-full",
            "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90",
            "transition-transform duration-300 hover:scale-110",
          )}
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

