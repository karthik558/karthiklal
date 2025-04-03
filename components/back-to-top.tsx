"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

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
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "interactive fixed right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full",
            "bg-primary/80 text-primary-foreground backdrop-blur-[2px]",
            "shadow-sm hover:shadow-md",
            "transition-all duration-200",
            "hover:bg-primary",
            "before:absolute before:inset-0 before:rounded-full",
            "before:border before:border-primary/30 before:transition-all",
            "hover:before:scale-105 before:opacity-0 hover:before:opacity-100",
          )}
          aria-label="Back to top"
        >
          <motion.div
            animate={{
              y: isHovered ? -2 : 0
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15
            }}
          >
            <ArrowUp className="h-4 w-4" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

