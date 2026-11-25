"use client"

import { useEffect, useRef, useState } from "react"
import { animate, AnimatePresence, motion, useReducedMotion } from "framer-motion"

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const baseCounter = useRef<HTMLSpanElement>(null)
  const fillCounter = useRef<HTMLSpanElement>(null)
  const liquid = useRef<HTMLDivElement>(null)
  const wetLayer = useRef<HTMLDivElement>(null)
  const [exiting, setExiting] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      onComplete?.()
      return
    }
    const animation = animate(0, 100, {
      duration: 1.6,
      ease: [0.37, 0, 0.18, 1],
      onUpdate(value) {
        const pct = String(Math.round(value))
        const remaining = 100 - value
        if (baseCounter.current) baseCounter.current.textContent = pct
        if (fillCounter.current) fillCounter.current.textContent = pct
        if (liquid.current) {
          liquid.current.style.transform = `translate3d(0, ${remaining}%, 0)`
        }
        if (wetLayer.current) {
          wetLayer.current.style.clipPath = `inset(${remaining}% 0 0 0)`
        }
      },
      onComplete: () => setExiting(true),
    })
    return () => animation.stop()
  }, [onComplete, reduced])

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!exiting && (
        <motion.div
          className="editorial-preloader"
          role="status"
          aria-label="Loading website"
          exit={{ opacity: 0, y: "-6%" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="intro-counter intro-counter-base" aria-hidden="true">
            <span ref={baseCounter}>0</span>%
          </div>

          <div ref={liquid} className="preloader-liquid" aria-hidden="true">
            <svg
              className="preloader-wave preloader-wave-deep"
              viewBox="0 0 1200 140"
              preserveAspectRatio="none"
            >
              <path d="M0,70 C180,130 340,10 520,70 C700,130 880,10 1050,70 C1125,95 1165,82 1200,70 L1200,140 L0,140 Z" />
            </svg>
            <svg
              className="preloader-wave preloader-wave-mid"
              viewBox="0 0 1200 140"
              preserveAspectRatio="none"
            >
              <path d="M0,75 C160,15 320,130 480,75 C640,20 820,130 980,75 C1090,38 1150,55 1200,75 L1200,140 L0,140 Z" />
            </svg>
            <svg
              className="preloader-wave preloader-wave-front"
              viewBox="0 0 1200 140"
              preserveAspectRatio="none"
            >
              <path d="M0,68 C150,118 300,18 450,68 C600,118 750,18 900,68 C1050,118 1125,45 1200,68 L1200,140 L0,140 Z" />
            </svg>
            <div className="preloader-liquid-body" />
          </div>

          <div ref={wetLayer} className="preloader-counter-wet" aria-hidden="true">
            <div className="intro-counter intro-counter-fill">
              <span ref={fillCounter}>0</span>%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
