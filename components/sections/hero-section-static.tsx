"use client"

import * as React from "react"
import { motion, HTMLMotionProps, Variants, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown, Download, ExternalLink } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

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
  
  const images = [
    { src: "/1.jpg", alt: "Portfolio Image 1" },
    { src: "/2.jpg", alt: "Portfolio Image 2" },
    { src: "/1.jpg", alt: "Portfolio Image 3" },
    { src: "/2.jpg", alt: "Portfolio Image 4" },
  ]

  return (
    <div className="relative">
      {/* Extended background that covers hero and bleeds into next section */}
      <div className="absolute inset-0 h-[120vh] bg-gradient-to-br from-primary/3 via-background to-background" data-speed="0.8"></div>
      
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Content */}
        <div className="container relative z-10 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[80vh] lg:min-h-0">
            <div className="space-y-6 text-center lg:text-left flex flex-col justify-center" data-speed="0.9">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold animate-item">
                <span className="text-2xl md:text-3xl lg:text-4xl block mb-2">Hi there, I'm</span>
                <span className="text-6xl md:text-7xl lg:text-8xl hero-name block">Karthik Lal</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-xl animate-item mx-auto lg:mx-0">
                Creative Technologist | Web & Linux Developer
              </p>

              <div className="flex flex-wrap gap-4 pt-4 animate-item justify-center lg:justify-start">
                <Button asChild size="lg" className="rounded-full glass hover:shadow-primary/20 hover:shadow-lg">
                  <Link href="#portfolio">
                    View My Work
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="group relative rounded-full glass border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 hover:border-primary/50 transition-all duration-300 overflow-hidden">
                  <Link href="#" download>
                    <span className="relative z-10 flex items-center">
                      <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                      Download CV
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="hidden lg:block" data-speed="1.1">
              {/* Gallery Grid */}
              <ContainerStagger className="max-w-lg mx-auto">
                <GalleryGrid>
                  {images.map((image, index) => (
                    <GalleryGridCell key={index} index={index}>
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </GalleryGridCell>
                  ))}
                </GalleryGrid>
              </ContainerStagger>
            </div>
          </div>
        </div>

        {/* Scroll indicator - positioned at bottom center */}
        <motion.div 
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          data-speed="1.0"
        >
          <Link href="#about" className="block group">
            <ArrowDown className="h-6 w-6 text-primary/70 group-hover:text-primary animate-bounce transition-colors duration-300" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

