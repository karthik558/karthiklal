"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import { MarqueeAnimation } from "@/components/ui/marquee-effect"

export default function MarqueeSection() {
  const section = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] })
  const progress = useSpring(scrollYProgress, { stiffness: 55, damping: 24 })
  const firstRotate = useTransform(progress, [0, .5, 1], [-2, -.5, 1])
  const secondRotate = useTransform(progress, [0, .5, 1], [2, .5, -1])
  const firstX = useTransform(progress, [0, 1], [30, -30])
  const secondX = useTransform(progress, [0, 1], [-30, 30])
  return <section ref={section} className="capabilities-ribbons" aria-label="Core capabilities">
    <div className="ribbon-caption"><span>CONNECTED DISCIPLINES</span><span>ONE CURIOUS MIND ↘</span></div>
    <div className="ribbon-stage">
      <motion.div className="capability-ribbon" style={{rotate:reduced ? 0 : firstRotate,x:reduced ? 0 : firstX}}>
        <MarqueeAnimation direction="left" baseVelocity={1.2} className="ribbon-primary">{"CYBERSECURITY • DEVELOPMENT • DESIGN • INFRASTRUCTURE •"}</MarqueeAnimation>
      </motion.div>
      <motion.div className="capability-ribbon" style={{rotate:reduced ? 0 : secondRotate,x:reduced ? 0 : secondX}}>
        <MarqueeAnimation direction="right" baseVelocity={1} className="ribbon-secondary">{"THINK CLEARLY • BUILD CAREFULLY • KEEP EXPLORING •"}</MarqueeAnimation>
      </motion.div>
    </div>
  </section>
}
