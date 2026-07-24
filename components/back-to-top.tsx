"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { scrollToTop } from "@/lib/scroll-utils"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > Math.max(window.innerHeight * 2, 1200))
    }

    window.addEventListener("scroll", toggleVisibility)
    const initialCheck = requestAnimationFrame(toggleVisibility)

    return () => {
      cancelAnimationFrame(initialCheck)
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  const handleScrollToTop = () => {
    scrollToTop()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleScrollToTop}
          className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-[9998] flex h-11 w-11 items-center justify-center gap-2 border-2 border-foreground bg-foreground text-background font-mono text-xs font-bold uppercase shadow-2xl transition-all duration-300 hover:bg-background hover:text-foreground select-none sm:right-6 sm:bottom-6 sm:w-auto sm:px-4"
          aria-label="Scroll to top"
        >
          <span className="hidden sm:inline">TOP</span>
          <ArrowUp className="h-4 w-4 stroke-[3]" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

