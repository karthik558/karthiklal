"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import SmoothScroll from "@/components/smooth-scroll"

export default function ContentWrapper({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
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
    </SmoothScroll>
  )
}