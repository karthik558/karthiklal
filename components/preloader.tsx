"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface PreloaderProps {
  onComplete?: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    let exitTimeout: ReturnType<typeof setTimeout> | undefined
    let completeTimeout: ReturnType<typeof setTimeout> | undefined

    const interval = setInterval(() => {
      setProgress((previous) => {
        if (previous >= 100) {
          clearInterval(interval)
          exitTimeout = setTimeout(() => {
            setIsExiting(true)
            completeTimeout = setTimeout(() => onComplete?.(), 700)
          }, 300)
          return 100
        }

        return Math.min(100, previous + Math.floor(Math.random() * 12) + 5)
      })
    }, 45)

    return () => {
      clearInterval(interval)
      if (exitTimeout) clearTimeout(exitTimeout)
      if (completeTimeout) clearTimeout(completeTimeout)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999999] flex flex-col justify-between border-b-4 border-foreground bg-background p-8 font-mono text-xs uppercase select-none md:p-14"
          role="status"
          aria-label="Loading website"
        >
          <div className="flex items-center justify-between border-b-2 border-border pb-6">
            <div className="flex items-center gap-3 font-bold">
              <span className="inline-block h-2 w-2 animate-ping bg-foreground" />
              <span className="text-[11px] tracking-widest">KARTHIK LAL</span>
            </div>
            <div className="hidden text-[10px] tracking-widest text-muted-foreground sm:block">
              SYSTEMS ARCHITECT & IT MANAGER
            </div>
          </div>

          <div className="my-auto space-y-4 py-12 text-center">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              INITIALIZING INTERFACE PROTOCOLS
            </div>
            <div className="font-display text-[20vw] font-black uppercase leading-none tracking-tighter text-foreground sm:text-[16vw] md:text-[14vw]">
              {progress.toString().padStart(2, "0")}
              <span className="text-[0.4em] font-light">%</span>
            </div>
            <div className="mx-auto h-1.5 max-w-md overflow-hidden border border-foreground bg-card p-0.5">
              <motion.div
                className="h-full bg-foreground"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t-2 border-border pt-6 text-[10px] font-bold tracking-widest text-muted-foreground">
            <span>KERALA, INDIA // IST TIMEZONE</span>
            <span>PORTFOLIO 2026</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
