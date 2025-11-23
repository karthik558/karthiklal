"use client"

import { motion } from "framer-motion"

interface ScrollEffectDemoProps {
  children: React.ReactNode
  speed?: number
  lag?: number
  className?: string
}

export default function ScrollEffectDemo({
  children,
  speed = 1,
  lag = 0,
  className = ""
}: ScrollEffectDemoProps) {
  // Framer Motion implementation
  // Note: 'speed' and 'lag' were specific to GSAP ScrollSmoother data attributes.
  // We can use Framer Motion's useScroll and useTransform for parallax if needed,
  // but for this demo replacement, we'll stick to a simple fade-in or just render children
  // with the class name, as the data attributes won't work with Lenis the same way.
  // If specific parallax is needed, we should use the useParallaxEffect hook.

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
