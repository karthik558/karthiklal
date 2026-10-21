"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

export default function ParallaxImage({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"])
  return <div ref={ref} className="absolute inset-0 overflow-hidden">
    <motion.div className="absolute -inset-y-[10%] inset-x-0" style={{ y: reduced ? 0 : y }}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0" />
    </motion.div>
  </div>
}
