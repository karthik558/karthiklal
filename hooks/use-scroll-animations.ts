"use client"

import { useScroll, useTransform, useSpring, MotionValue } from "framer-motion"
import { useRef } from "react"

export function useParallaxEffect(
  speed: number = 0.5
) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref as any,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`])

  return { ref, y }
}

export function useFadeInOnScroll(
  delay: number = 0,
  duration: number = 0.5
) {
  return {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration, delay, ease: "easeOut" }
  }
}

export function useScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return scaleX
}
