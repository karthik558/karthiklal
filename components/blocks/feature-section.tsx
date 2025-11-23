"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import { cn } from "@/lib/utils"

interface Feature {
  step: string
  title?: string
  content: string
  image: string
  github?: string
  link?: string
}

interface FeatureStepsProps {
  features: Feature[]
  className?: string
  title?: string
  autoPlayInterval?: number
  imageHeight?: string
}

export function FeatureSteps({
  features,
  className,
  title = "How to get Started",
  autoPlayInterval = 3000,
  imageHeight = "h-[400px]",
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // 3D Tilt Effect Logic
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 })

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    x.set(clientX - left - width / 2)
    y.set(clientY - top - height / 2)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  const rotateX = useTransform(mouseY, [-100, 100], [5, -5])
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5])

  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100))
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length)
        setProgress(0)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [progress, features.length, autoPlayInterval, isPaused])

  const handleFeatureClick = (index: number) => {
    setCurrentFeature(index)
    setProgress(0)
  }

  return (
    <div
      className={cn("p-4 md:p-8", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-10 text-center animate-item">
          {title}
        </h2>

        {/* Modern Card-based Design */}
        <div className="space-y-8">
          {/* Current Project Display */}
          <motion.div
            key={currentFeature}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-muted/30 to-background/50 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col lg:block"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ perspective: 1000 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image Side - Top on Mobile, Right on Desktop */}
              <motion.div
                className="relative overflow-hidden order-1 lg:order-2 h-[250px] md:h-[400px] lg:h-[500px] w-full cursor-grab active:cursor-grabbing"
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              >
                <motion.div
                  key={`image-${currentFeature}`}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <Image
                    src={features[currentFeature].image}
                    alt={features[currentFeature].title || features[currentFeature].step}
                    className="w-full h-full object-cover"
                    width={800}
                    height={600}
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-background/20" />

                  {/* Glassmorphism Overlay on Image - Hidden on small mobile */}
                  <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-2 md:p-4 opacity-0 md:opacity-100 transition-opacity duration-300 hidden md:block">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-white/90 text-xs font-medium tracking-wide">Featured Project</span>
                    </div>
                  </div>
                </motion.div>

                {/* Project Counter */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
                  <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
                    <span className="text-white text-xs md:text-sm font-medium">
                      {currentFeature + 1} / {features.length}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Content Side - Bottom on Mobile, Left on Desktop */}
              <div className="p-5 md:p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1 relative z-10">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <span className="inline-flex items-center justify-center px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-medium shadow-sm whitespace-nowrap">
                      {features[currentFeature].step}
                    </span>
                    {/* Progress Bar for Auto-play */}
                    <div className="h-1.5 flex-1 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${progress}%` }}
                        transition={{ ease: "linear", duration: 0.1 }}
                      />
                    </div>
                  </div>

                  <h3 className="text-xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-6 text-foreground leading-tight">
                    {features[currentFeature].title || features[currentFeature].step}
                  </h3>

                  <p className="text-muted-foreground text-sm md:text-lg leading-relaxed mb-6 md:mb-8 line-clamp-3 md:line-clamp-none">
                    {features[currentFeature].content}
                  </p>

                  {/* Action Buttons */}
                  {(features[currentFeature].github || features[currentFeature].link) && (
                    <div className="flex flex-wrap gap-3 md:gap-4">
                      {features[currentFeature].github && (
                        <a href={features[currentFeature].github} target="_blank" rel="noreferrer" className="flex-1 md:flex-none">
                          <Button size="default" variant="outline" className="w-full md:w-auto rounded-full px-4 md:px-6 hover:bg-muted/50 transition-all duration-300 border-primary/20 hover:border-primary/50 group">
                            <Github className="h-4 w-4 md:h-5 md:w-5 mr-2 group-hover:scale-110 transition-transform" />
                            <span className="text-sm md:text-base">View Code</span>
                          </Button>
                        </a>
                      )}
                      {features[currentFeature].link && (
                        <a href={features[currentFeature].link} target="_blank" rel="noreferrer" className="flex-1 md:flex-none">
                          <Button size="default" className="w-full md:w-auto rounded-full px-4 md:px-6 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 group">
                            <ExternalLink className="h-4 w-4 md:h-5 md:w-5 mr-2 group-hover:scale-110 transition-transform" />
                            <span className="text-sm md:text-base">Live Demo</span>
                          </Button>
                        </a>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Project Navigation */}
          <div className="flex flex-col items-center space-y-6">
            {/* Project Thumbnails */}
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-6 pt-2 px-4 w-full justify-start md:justify-center scrollbar-hide snap-x">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "relative flex-shrink-0 w-14 h-14 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 snap-center",
                    index === currentFeature
                      ? "border-primary shadow-lg shadow-primary/25 scale-110 z-10"
                      : "border-transparent opacity-50 hover:opacity-80 hover:scale-105 grayscale hover:grayscale-0"
                  )}
                  onClick={() => handleFeatureClick(index)}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={feature.image}
                    alt={feature.title || feature.step}
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                  />
                  {index === currentFeature && (
                    <motion.div
                      layoutId="active-border"
                      className="absolute inset-0 border-2 border-primary rounded-xl md:rounded-2xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
