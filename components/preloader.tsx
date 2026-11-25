"use client"

import { useEffect, useRef, useState } from "react"
import { animate, AnimatePresence, motion, useReducedMotion } from "framer-motion"

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const counter = useRef<HTMLSpanElement>(null)
  const [exiting, setExiting] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      onComplete?.()
      return
    }
    const animation = animate(0, 100, {
      duration: 1.55,
      ease: [.4, 0, .16, 1],
      onUpdate(value) {
        if (counter.current) counter.current.textContent = String(Math.round(value))
      },
      onComplete: () => setExiting(true),
    })
    return () => animation.stop()
  }, [onComplete, reduced])

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!exiting && (
        <motion.div className="editorial-preloader" role="status" aria-label="Loading website"
          exit={{ opacity: 0 }} transition={{ duration: .45 }}>
          <div className="intro-counter" aria-hidden="true"><span ref={counter}>0</span>%</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
