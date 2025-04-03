"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Preloader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2500)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-50 grid place-items-center bg-background"
        >
          <div className="relative h-16 w-16">
            {/* Main spinning circle */}
            <motion.div
              className="absolute left-0 top-0 h-full w-full border-2 border-primary"
              animate={{
                rotate: 360,
                borderRadius: ["25%", "50%", "25%"],
              }}
              transition={{
                duration: 2,
                ease: "linear",
                repeat: Infinity
              }}
            />
            
            {/* Secondary rotating element */}
            <motion.div
              className="absolute left-0 top-0 h-full w-full border-2 border-primary"
              animate={{
                rotate: -360,
                scale: [0.8, 0.8],
                borderRadius: ["50%", "25%", "50%"],
              }}
              transition={{
                duration: 2,
                ease: "linear",
                repeat: Infinity
              }}
            />

            {/* Center dot */}
            <motion.div
              className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                repeat: Infinity
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}