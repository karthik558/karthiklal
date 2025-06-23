"use client"

import { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLoading } from "./loading-context"
import GSAPSmoothScroll from "./gsap-smooth-scroll"

export default function ContentWrapper({ children }: { children: ReactNode }) {
  const { isLoading } = useLoading()

  return (
    <AnimatePresence mode="wait">
      {!isLoading && (
        <GSAPSmoothScroll>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: { duration: 0.5, ease: "easeInOut", delay: 0.2 } 
            }}
            className="w-full"
          >
            {children}
          </motion.div>
        </GSAPSmoothScroll>
      )}
    </AnimatePresence>
  )
}