"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, ArrowUpRight, Star } from "lucide-react"
import testimonialsData from "@/public/data/testimonials.json"

interface Testimonial {
  id: number
  content: string
  name: string
  company: string
  position: string
  rating: number
  website?: string
}

const testimonials = testimonialsData.testimonials as Testimonial[]

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const reduceMotion = useReducedMotion()
  const activeTestimonial = testimonials[activeIndex]

  useEffect(() => {
    if (isHovered || reduceMotion || testimonials.length < 2) return
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, 9000)
    return () => clearInterval(timer)
  }, [isHovered, reduceMotion])

  if (!activeTestimonial) return null

  const showPrevious = () => setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
  const showNext = () => setActiveIndex((current) => (current + 1) % testimonials.length)

  return (
    <section id="testimonials" className="relative bg-background py-20 md:py-36 border-t border-border">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Section Header */}
        <div className="mb-14 border-b border-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              08 // CLIENT FEEDBACK & REVIEWS
            </div>
            <h2 className="font-display text-4xl font-black uppercase tracking-tight text-foreground sm:text-6xl md:text-7xl">
              TESTIMONIALS
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={showPrevious}
              className="p-3 border-2 border-border bg-card text-foreground hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
              aria-label="Previous Testimonial"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={showNext}
              className="p-3 border-2 border-border bg-card text-foreground hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
              aria-label="Next Testimonial"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Testimonial Box */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="border-2 border-foreground bg-card p-8 md:p-14 shadow-2xl relative transition-all duration-500"
        >
          <div className="flex items-center justify-between border-b border-border pb-6 mb-8 font-mono text-xs uppercase relative z-10">
            {/* Rating Stars with Hover Color Transformation */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: activeTestimonial.rating || 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-foreground text-foreground" />
              ))}
            </div>
            <span className="text-muted-foreground">
              FEEDBACK [{String(activeIndex + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}]
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="relative z-10"
            >
              <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase leading-snug text-foreground mb-10">
                &ldquo;{activeTestimonial.content}&rdquo;
              </blockquote>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-border font-mono text-xs">
                <div>
                  <div className="font-bold text-sm text-foreground uppercase">
                    {activeTestimonial.name}
                  </div>
                  <div className="text-muted-foreground uppercase">
                    {activeTestimonial.position} — {activeTestimonial.company}
                  </div>
                </div>

                {activeTestimonial.website && (
                  <a
                    href={activeTestimonial.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-foreground hover:underline uppercase font-bold"
                  >
                    VISIT WEBSITE <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
