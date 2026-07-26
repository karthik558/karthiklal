"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CloudOff, Wifi } from "lucide-react"

export default function NetworkStatus() {
  const [online, setOnline] = useState(() => typeof navigator === "undefined" ? true : navigator.onLine)
  const [showRecovered, setShowRecovered] = useState(false)

  useEffect(() => {
    const handleOffline = () => {
      setOnline(false)
      setShowRecovered(false)
    }
    const handleOnline = () => {
      setOnline(true)
      setShowRecovered(true)
      window.setTimeout(() => setShowRecovered(false), 2800)
    }
    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)
    return () => {
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
    }
  }, [])

  const visible = !online || showRecovered

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={`fixed bottom-16 left-4 z-[10001] flex items-center gap-3 border-2 px-4 py-3 font-mono text-[9px] font-black uppercase tracking-widest shadow-xl sm:bottom-20 sm:left-6 ${
            online ? "border-emerald-500 bg-background text-emerald-600" : "border-foreground bg-foreground text-background"
          }`}
        >
          {online ? <Wifi className="h-4 w-4" /> : <CloudOff className="h-4 w-4" />}
          {online ? "Connection restored" : "Offline mode // cached pages remain available"}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
