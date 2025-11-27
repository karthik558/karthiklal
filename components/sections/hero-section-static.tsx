"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, HTMLMotionProps, Variants, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowDown, Download, ExternalLink } from "lucide-react"
import Link from "next/link"
import SmoothLink from "@/components/smooth-link"
import { cn } from "@/lib/utils"
import { AnimatedButton } from "@/components/ui/animated-button"

interface PersonalInfo {
  name: string
  title: string
  bio: string
}

interface ProfileData {
  personalInfo: PersonalInfo
}

// Add Google Fonts for Dancing Script
if (typeof window !== 'undefined') {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

interface GalleryGridCellProps extends HTMLMotionProps<"div"> {
  index: number
}

const SPRING_TRANSITION_CONFIG = {
  type: "spring" as const,
  stiffness: 100,
  damping: 16,
  mass: 0.75,
  restDelta: 0.005,
}

const filterVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
  },
}

const areaClasses = [
  "col-start-2 col-end-3 row-start-1 row-end-3", // .div1
  "col-start-1 col-end-2 row-start-2 row-end-4", // .div2
  "col-start-1 col-end-2 row-start-4 row-end-6", // .div3
  "col-start-2 col-end-3 row-start-3 row-end-5", // .div4
]

export const ContainerStagger = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ transition, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate="visible"
      transition={{
        staggerChildren: 0.2,
        delayChildren: 0.2,
        duration: 0.3,
      }}
      {...props}
    />
  )
})
ContainerStagger.displayName = "ContainerStagger"

export const ContainerAnimated = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ transition, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      variants={filterVariants}
      transition={{
        duration: 0.3,
      }}
      {...props}
    />
  )
})
ContainerAnimated.displayName = "ContainerAnimated"

export const GalleryGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-2 grid-rows-[80px_200px_80px_200px_80px] gap-6",
        className
      )}
      {...props}
    />
  )
})
GalleryGrid.displayName = "GalleryGrid"

export const GalleryGridCell = React.forwardRef<
  HTMLDivElement,
  GalleryGridCellProps
>(({ className, index, children, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.2,
      }}
      className={`relative overflow-hidden rounded-xl shadow-xl border-2 border-primary/60 ${areaClasses[index]}`}
      {...props}
    >
      {children}
    </motion.div>
  )
})
GalleryGridCell.displayName = "GalleryGridCell"

export default function HeroSectionStatic() {
  const { scrollYProgress } = useScroll()
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const [profileData, setProfileData] = useState<PersonalInfo | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/data/profile.json')
        const data: ProfileData = await response.json()
        setProfileData(data.personalInfo)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    }

    fetchProfile()
  }, [])

  // Mouse movement for 3D tilt effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - left) / width - 0.5
    const y = (e.clientY - top) / height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 20 })
  
  // Parallax movement
  const moveX1 = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), { stiffness: 150, damping: 20 })
  const moveY1 = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), { stiffness: 150, damping: 20 })
  
  const moveX2 = useSpring(useTransform(mouseX, [-0.5, 0.5], [20, -20]), { stiffness: 150, damping: 20 })
  const moveY2 = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, -20]), { stiffness: 150, damping: 20 })

  // Glare effect
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"])

  const images = [
    { src: "/user/3.jpg", alt: "Portfolio Image 1" },
    { src: "/user/2.jpg", alt: "Portfolio Image 2" },
    { src: "/user/4.jpg", alt: "Portfolio Image 3" },
    { src: "/user/5.jpg", alt: "Portfolio Image 4" },
  ]

  return (
    <div className="relative">
      {/* Extended background that covers hero and bleeds into next section */}
      <div className="absolute inset-0 h-[120vh] bg-gradient-to-br from-primary/5 via-primary/2 to-background" data-speed="0.8"></div>
      {/* Additional subtle radial gradient for depth */}
      <div className="absolute inset-0 h-[120vh] bg-gradient-radial from-primary/3 via-transparent to-transparent opacity-60"></div>
      
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Content */}
        <div className="container relative z-10 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[80vh] lg:min-h-0">
            <div className="space-y-6 text-center lg:text-left flex flex-col justify-center" data-speed="0.9">
              <div className="animate-item flex flex-col items-center lg:items-start">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <span className="text-sm md:text-base font-semibold tracking-[0.2em] text-primary uppercase">
                    Hi there, I&apos;m
                  </span>
                </motion.div>

                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold hero-name mb-6 tracking-tight">
                  {profileData?.name || "Loading..."}
                </h1>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex items-center gap-2 text-lg md:text-xl font-mono text-muted-foreground"
                >
                  <span className="text-primary">&gt;</span>
                  {profileData?.title || "Loading..."}
                  <span className="animate-pulse text-primary">_</span>
                </motion.div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4 animate-item justify-center lg:justify-start">
                <AnimatedButton href="/#portfolio-gallery" variant="primary" icon={<ExternalLink className="h-4 w-4" />}>
                  View Portfolio
                </AnimatedButton>

                {/* Download CV Button */}
                <AnimatedButton 
                  href="https://drive.google.com/uc?export=download&id=1y1PklhkLbM9iFLGCOP4dFPj6DzDIzd7u" 
                  variant="outline" 
                  icon={<Download className="h-4 w-4" />}
                >
                  Download CV
                </AnimatedButton>
              </div>
            </div>

            <div 
              className="hidden lg:flex items-center justify-center perspective-1000" 
              data-speed="1.1"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <motion.div 
                className="relative w-[500px] h-[600px]"
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Animated Background Blob */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#74261a]/40 via-[#963e30]/30 to-[#b55242]/40 blur-[100px] animate-pulse" />

                {/* Main Hero Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: [0, -10, 0] 
                  }}
                  transition={{ 
                    opacity: { duration: 1, delay: 0.2 },
                    scale: { duration: 1, delay: 0.2 },
                    y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                  }}
                  style={{
                    x: moveX1,
                    y: moveY1,
                    z: 50,
                  }}
                  whileHover={{ scale: 1.02, z: 80 }}
                  className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl shadow-[#74261a]/30 border border-white/10 bg-background/5 backdrop-blur-sm group"
                >
                  <Image src="/user/hero.jpg" alt="Hero art" fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
                  
                  {/* Glare Overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.2) 25%, transparent 30%)",
                      backgroundSize: "200% 100%",
                      backgroundPositionX: glareX
                    }}
                  />
                </motion.div>

                {/* Decorative Elements - Clean & Minimal */}
                <motion.div 
                  style={{ x: moveX2, y: moveY2, z: 20 }}
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full border border-white/10 bg-[#74261a]/10 backdrop-blur-md"
                />
                <motion.div 
                  style={{ x: moveX1, y: moveY1, z: 30 }}
                  className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-[#963e30]/20 blur-2xl"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator - positioned at bottom center */}
        <motion.div 
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          data-speed="1.0"
        >
          <SmoothLink href="#about" className="block group">
            <ArrowDown className="h-6 w-6 text-primary/70 group-hover:text-primary animate-bounce transition-colors duration-300" />
          </SmoothLink>
        </motion.div>
      </section>
    </div>
  )
}

