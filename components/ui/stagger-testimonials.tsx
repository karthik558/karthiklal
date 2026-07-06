"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import testimonialsData from "@/public/data/testimonials.json"

interface Testimonial {
  id: number
  content: string
  name: string
  company: string
  position: string
  avatar: string
  rating: number
  website?: string
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

function Rating({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(rating || 5)].map((_, index) => (
        <Star key={index} className="h-4 w-4 fill-[#FFB800] text-[#FFB800]" />
      ))}
    </div>
  )
}

function ClientMark({ name, className }: { name: string; className?: string }) {
  return (
    <div className={cn("grid shrink-0 place-items-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 font-display font-bold text-primary shadow-inner backdrop-blur-md", className)}>
      {getInitials(name)}
    </div>
  )
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial, index: number }) {
  const divRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleFocus = () => {
    setIsFocused(true)
    setOpacity(1)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setOpacity(0)
  }

  const handleMouseEnter = () => setOpacity(1)
  const handleMouseLeave = () => setOpacity(0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="break-inside-avoid mb-6 sm:mb-8"
    >
      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/40 px-6 py-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-background/30 backdrop-blur-xl sm:px-8"
      >
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            opacity,
            background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, hsl(var(--primary)/0.12), transparent 40%)`,
          }}
        />
        
        <div className="absolute -right-4 -top-4 p-6 opacity-10 transition-all duration-500 group-hover:scale-110 group-hover:opacity-30 group-hover:-rotate-6">
          <Quote className="h-32 w-32 text-primary" />
        </div>

        <div className="relative z-10 flex h-full flex-col">
          <div className="mb-6 flex items-center gap-4">
            <ClientMark name={testimonial.name} className="h-14 w-14 text-lg" />
            <div className="min-w-0 flex-1">
              <h4 className="truncate font-display text-lg font-bold text-foreground">{testimonial.name}</h4>
              <p className="truncate text-sm font-medium text-muted-foreground">{testimonial.position} <span className="text-primary/70">@ {testimonial.company}</span></p>
            </div>
          </div>
          
          <blockquote className="mb-8 text-base leading-relaxed text-foreground/85 md:text-[1.05rem]">
            "{testimonial.content}"
          </blockquote>
          
          <div className="mt-auto pt-5 border-t border-border/40">
            <div className="flex items-center justify-between">
              <Rating rating={testimonial.rating} />
              <div className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                Verified
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export const StaggerTestimonials = () => {
  const testimonials = testimonialsData.testimonials as Testimonial[]

  if (!testimonials || testimonials.length === 0) return null

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 sm:gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
        ))}
      </div>
    </div>
  )
}
