"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PreloaderProps {
  onComplete?: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsExiting(true)
            setTimeout(() => {
              onComplete?.()
            }, 700)
          }, 300)
          return 100
        }
        const next = prev + Math.floor(Math.random() * 12) + 5
        return next > 100 ? 100 : next
      })
    }, 45)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999999] flex flex-col justify-between bg-background p-8 md:p-14 font-mono text-xs uppercase select-none border-b-4 border-foreground"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between border-b-2 border-border pb-6">
            <div className="flex items-center gap-3 font-bold">
              <span className="w-2 h-2 bg-foreground animate-ping inline-block" />
              <span className="tracking-widest text-[11px]">KARTHIK LAL</span>
            </div>
            <div className="text-muted-foreground tracking-widest text-[10px] hidden sm:block">
              SYSTEMS ARCHITECT & IT MANAGER
            </div>
          </div>

          {/* Center Kinetic Counter */}
          <div className="my-auto py-12 text-center space-y-4">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              INITIALIZING INTERFACE PROTOCOLS
            </div>

            <div className="font-display text-[20vw] sm:text-[16vw] md:text-[14vw] font-black uppercase text-foreground leading-none tracking-tighter">
              {progress.toString().padStart(2, "0")}<span className="text-[0.4em] font-light">%</span>
            </div>

            {/* Progress Bar Line */}
            <div className="max-w-md mx-auto h-1.5 bg-card border border-foreground overflow-hidden p-0.5">
              <motion.div
                className="h-full bg-foreground"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="flex items-center justify-between border-t-2 border-border pt-6 text-muted-foreground text-[10px] tracking-widest font-bold">
            <span>KERALA, INDIA // IST TIMEZONE</span>
            <span>PORTFOLIO 2026</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}