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
      className={cn("p-8 md:p-12", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 text-center animate-item">
          {title}
        </h2>

        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 md:gap-10 animate-item">
          <div className="order-2 lg:order-1 lg:col-span-2 space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-6 md:gap-8 cursor-pointer scale-on-scroll"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: index === currentFeature ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
                onClick={() => handleFeatureClick(index)}
              >
                <motion.div
                  className={cn(
                    "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 relative",
                    index === currentFeature
                      ? "bg-primary border-primary text-primary-foreground scale-110"
                      : "bg-muted border-muted-foreground",
                  )}
                >
                  {index === currentFeature && (
                    <div 
                      className="absolute inset-0 rounded-full border-2 border-primary/30"
                      style={{
                        background: `conic-gradient(from 0deg, transparent ${360 - (progress * 3.6)}deg, hsl(var(--primary)) ${360 - (progress * 3.6)}deg)`
                      }}
                    />
                  )}
                  {index <= currentFeature ? (
                    <span className="text-lg font-bold relative z-10">✓</span>
                  ) : (
                    <span className="text-lg font-semibold relative z-10">{index + 1}</span>
                  )}
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold">
                    {feature.title || feature.step}
                  </h3>
                  <p className="text-sm md:text-lg text-muted-foreground mb-4">
                    {feature.content}
                  </p>
                  {(feature.github || feature.link) && (
                    <div className="flex gap-2">
                      {feature.github && (
                        <a href={feature.github} target="_blank" rel="noreferrer">
                          <Button size="sm" variant="outline" className="text-xs">
                            <Github className="h-3 w-3 mr-1" />
                            Code
                          </Button>
                        </a>
                      )}
                      {feature.link && (
                        <a href={feature.link} target="_blank" rel="noreferrer">
                          <Button size="sm" className="text-xs">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Demo
                          </Button>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: Single image */}
          <div className="order-1 lg:hidden relative h-[200px] md:h-[300px] overflow-hidden rounded-lg">
            <AnimatePresence mode="wait">
              {features.map(
                (feature, index) =>
                  index === currentFeature && (
                    <motion.div
                      key={index}
                      className="absolute inset-0 rounded-lg overflow-hidden"
                      initial={{ y: 100, opacity: 0, rotateX: -20 }}
                      animate={{ y: 0, opacity: 1, rotateX: 0 }}
                      exit={{ y: -100, opacity: 0, rotateX: 20 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <Image
                        src={feature.image}
                        alt={feature.step}
                        className="w-full h-full object-cover transition-transform transform"
                        width={1000}
                        height={500}
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    </motion.div>
                  ),
              )}
            </AnimatePresence>
          </div>

          {/* Desktop: Grid of project cards */}
          <div className="hidden lg:block order-1 lg:order-2 lg:col-span-3">
            <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300",
                    index === currentFeature 
                      ? "ring-2 ring-primary scale-105 z-10" 
                      : "hover:scale-102",
                    // Center the third item by placing it in the middle of the second row
                    features.length === 3 && index === 2 ? "col-start-1 col-end-3 max-w-md mx-auto" : ""
                  )}
                  onClick={() => handleFeatureClick(index)}
                  whileHover={{ scale: index === currentFeature ? 1.05 : 1.02 }}
                >
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={feature.image}
                      alt={feature.title || feature.step}
                      className="w-full h-full object-cover"
                      width={400}
                      height={300}
                    />
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent",
                      index !== currentFeature && "opacity-60"
                    )} />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-white font-semibold text-sm mb-1">
                        {feature.title || feature.step}
                      </h4>
                      {index === currentFeature && (
                        <div className="flex gap-2 mt-2">
                          {feature.github && (
                            <a href={feature.github} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                              <Button size="sm" variant="secondary" className="text-xs h-6">
                                <Github className="h-3 w-3" />
                              </Button>
                            </a>
                          )}
                          {feature.link && (
                            <a href={feature.link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                              <Button size="sm" className="text-xs h-6">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    {index === currentFeature && (
                      <div className="absolute top-2 right-2">
                        <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
