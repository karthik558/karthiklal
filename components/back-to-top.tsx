"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { scrollToTop } from "@/lib/scroll-utils"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const isBrowser = typeof window !== "undefined"

  useEffect(() => {
    setIsMounted(true)
    if (!isBrowser) return

    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400)
    }

    window.addEventListener("scroll", toggleVisibility)
    toggleVisibility()

    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [isBrowser])

  const handleScrollToTop = () => {
    if (!isBrowser) return
    scrollToTop()
  }

  if (!isMounted || !isBrowser) return null

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
          className="fixed right-6 bottom-6 z-[9998] flex items-center justify-center gap-2 px-4 h-11 border-2 border-foreground bg-foreground text-background font-mono text-xs font-bold uppercase shadow-2xl transition-all duration-300 hover:bg-background hover:text-foreground select-none"
          aria-label="Scroll to top"
        >
          <span>TOP</span>
          <ArrowUp className="h-4 w-4 stroke-[3]" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}



