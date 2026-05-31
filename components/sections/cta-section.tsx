"use client"

import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CtaSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Mouse position for parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth mouse movement
  const springConfig = { damping: 25, stiffness: 150 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  // Parallax transforms
  const textX = useTransform(springX, [-0.5, 0.5], [-50, 50])
  const textY = useTransform(springY, [-0.5, 0.5], [-50, 50])

  const bgX = useTransform(springX, [-0.5, 0.5], [20, -20])
  const bgY = useTransform(springY, [-0.5, 0.5], [20, -20])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e
    const { width, height, left, top } = currentTarget.getBoundingClientRect()

    // Calculate normalized mouse position (-0.5 to 0.5)
    const x = (clientX - left) / width - 0.5
    const y = (clientY - top) / height - 0.5

    mouseX.set(x)
    mouseY.set(y)
  }

  return (
    <section
      id="contact"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        mouseX.set(0)
        mouseY.set(0)
      }}
      className="relative min-h-[30vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden py-16 md:py-24"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-background">
        <motion.div
          style={{ x: bgX, y: bgY }}
          className="absolute inset-0 opacity-30"
        >
          <div className="absolute top-1/4 left-1/4 w-[520px] h-[520px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-accent/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000" />
        </motion.div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.06)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.06)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 bg-noise opacity-25 pointer-events-none" />
      </div>

      <div className="container relative z-10 flex flex-col items-center justify-center text-center">
        {/* Main Title with Parallax - Clickable */}
        <Link href="/contact" className="group relative cursor-pointer">
          <motion.div
            style={{ x: textX, y: textY }}
            className="relative mb-12"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="text-5xl md:text-[10vw] font-display font-black leading-[0.9] tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/60 select-none group-hover:from-primary group-hover:to-accent transition-all duration-500 max-w-[90vw] mx-auto"
            >
              Let's Talk
            </motion.h2>

            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-8 -right-8 md:-top-12 md:-right-12 w-16 h-16 md:w-24 md:h-24 bg-primary/10 rounded-full backdrop-blur-xl border border-primary/20 flex items-center justify-center group-hover:scale-125 group-hover:bg-primary group-hover:text-white transition-all duration-500"
            >
              <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12 text-primary group-hover:text-white transition-colors duration-500" />
            </motion.div>
          </motion.div>
        </Link>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl text-muted-foreground max-w-lg mb-12 leading-relaxed pointer-events-none"
        >
          Have a project in mind? Click above to create something extraordinary together.
        </motion.p>
      </div>
    </section>
  )
}
