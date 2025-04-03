"use client"

import { useEffect } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { usePathname } from "next/navigation"

const variants = {
  hidden: { 
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  enter: { 
    opacity: 1,
    y: 0,
    scale: 1
  },
  exit: { 
    opacity: 0,
    y: -20,
    scale: 0.98
  },
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 700 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      mouseX.set((clientX - centerX) / centerX)
      mouseY.set((clientY - centerY) / centerY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <motion.div
      key={pathname}
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ 
        duration: 0.6, 
        ease: [0.33, 1, 0.68, 1],
        staggerChildren: 0.1
      }}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
        rotateX: mouseYSpring,
        rotateY: mouseXSpring,
      }}
      className="will-change-transform"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: -20 },
          enter: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 20 },
        }}
        transition={{ duration: 0.5 }}
        className="glass rounded-xl"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

