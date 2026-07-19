"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

type FlowerDividerProps = {
  className?: string
}

export function FlowerDivider({ className }: FlowerDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative z-20 flex h-24 items-center justify-center w-full overflow-hidden", className)}
    >
      <div className="relative w-full max-w-5xl flex items-center h-full">
        {/* Static Background Line */}
        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        {/* Animated Moving Beam Container */}
        <motion.div 
          animate={{ x: ["-100%", "100%"] }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut",
            repeatDelay: 0.5
          }}
          className="absolute w-full h-full flex items-center justify-center"
        >
          {/* The visible beam */}
          <div className="relative w-1/3 max-w-[250px] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent">
            {/* Glowing core dot in the middle of the beam */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-[2px] bg-primary rounded-full shadow-[0_0_12px_2px_hsl(var(--primary)/0.9)]" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
