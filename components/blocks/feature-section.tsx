"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center animate-item">
          {title}
        </h2>

        {/* Modern Card-based Design */}
        <div className="space-y-6">
          {/* Current Project Display */}
          <motion.div
            key={currentFeature}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-muted/50 to-background border border-border/50 shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Content Side */}
              <div className="p-6 md:p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="inline-block text-primary text-sm font-medium mb-4 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                    {features[currentFeature].step}
                  </span>
                  
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-foreground">
                    {features[currentFeature].title || features[currentFeature].step}
                  </h3>
                  
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                    {features[currentFeature].content}
                  </p>
                  
                  {/* Action Buttons */}
                  {(features[currentFeature].github || features[currentFeature].link) && (
                    <div className="flex flex-wrap gap-3 md:gap-4">
                      {features[currentFeature].github && (
                        <a href={features[currentFeature].github} target="_blank" rel="noreferrer">
                          <Button size="default" variant="outline" className="rounded-full px-4 md:px-6 hover:bg-muted/50 transition-all duration-300">
                            <Github className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                            View Code
                          </Button>
                        </a>
                      )}
                      {features[currentFeature].link && (
                        <a href={features[currentFeature].link} target="_blank" rel="noreferrer">
                          <Button size="default" className="rounded-full px-4 md:px-6 bg-primary hover:bg-primary/90 transition-all duration-300">
                            <ExternalLink className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                            Live Demo
                          </Button>
                        </a>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Image Side */}
              <div className="relative overflow-hidden order-1 lg:order-2 rounded-t-3xl lg:rounded-none lg:rounded-r-3xl h-[300px] md:h-[400px] lg:h-[500px]">
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
                    width={600}
                    height={500}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                </motion.div>
                
                {/* Project Counter */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
                  <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/20">
                    <span className="text-white text-xs md:text-sm font-medium">
                      {currentFeature + 1} of {features.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Project Navigation */}
          <div className="flex flex-col items-center space-y-6">
            {/* Progress Bar */}
            <div className="w-full max-w-md">
              <div className="flex gap-2">
                {features.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300 cursor-pointer flex-1",
                      index === currentFeature 
                        ? "bg-primary" 
                        : "bg-muted hover:bg-muted-foreground/20"
                    )}
                    onClick={() => handleFeatureClick(index)}
                  >
                    {index === currentFeature && (
                      <motion.div
                        className="h-full bg-primary/60 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Project Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-4 w-full justify-center">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300",
                    index === currentFeature 
                      ? "border-primary shadow-lg shadow-primary/25" 
                      : "border-border/50 hover:border-primary/50 opacity-60 hover:opacity-90"
                  )}
                  onClick={() => handleFeatureClick(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    scale: index === currentFeature ? 1.1 : 1,
                    y: index === currentFeature ? -2 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Image
                    src={feature.image}
                    alt={feature.title || feature.step}
                    className="w-full h-full object-cover"
                    width={80}
                    height={80}
                  />
                  {index === currentFeature && (
                    <div className="absolute inset-0 bg-primary/20" />
                  )}
                  {/* Active indicator */}
                  {index === currentFeature && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
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
