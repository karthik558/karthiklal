"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, ArrowUpRight, LayoutGrid, Rows, Star } from "lucide-react"
import testimonialsData from "@/public/data/testimonials.json"
import { playClickSound } from "@/lib/sound-fx"

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

/* Minimal metallic pushpin pinned to the top of the paper memo */
function PushPin({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none flex flex-col items-center ${className}`} aria-hidden="true">
      <div className="relative">
        <div className="h-4 w-4 rounded-full border-2 border-background bg-foreground shadow-[0_2px_4px_rgba(0,0,0,0.35)] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
          <div className="h-1.5 w-1.5 rounded-full bg-background/90" />
        </div>
        <div className="absolute top-3 left-2 h-3 w-1.5 -rotate-45 rounded-full bg-black/20 blur-[0.5px] -z-10" />
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel")
  const reduceMotion = useReducedMotion()
  const activeTestimonial = testimonials[activeIndex]

  useEffect(() => {
    if (isHovered || reduceMotion || viewMode === "grid" || testimonials.length < 2) return
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, 9000)
    return () => clearInterval(timer)
  }, [isHovered, reduceMotion, viewMode])

  if (!activeTestimonial) return null

  const showPrevious = () => {
    playClickSound()
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
  }

  const showNext = () => {
    playClickSound()
    setActiveIndex((current) => (current + 1) % testimonials.length)
  }

  const switchView = (mode: "carousel" | "grid") => {
    playClickSound()
    setViewMode(mode)
  }

  return (
    <section id="testimonials" className="section-shell border-t-2 border-border overflow-hidden">
      <div className="section-container">
        
        {/* Section Header */}
        <div className="section-heading-row">
          <div>
            <div className="mb-3">
              <span className="paper-stamp">
                08 // CLIENT FEEDBACK &amp; REVIEWS
              </span>
            </div>
            <h2 className="section-title">
              TESTIMONIALS
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle Button */}
            <div className="flex items-center border-2 border-border bg-card p-1">
              <button
                type="button"
                onClick={() => switchView("carousel")}
                className={`paper-button flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                  viewMode === "carousel" ? "bg-foreground text-background font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Slideshow View"
              >
                <Rows className="w-3.5 h-3.5" /> SLIDES
              </button>
              <button
                type="button"
                onClick={() => switchView("grid")}
                className={`paper-button flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                  viewMode === "grid" ? "bg-foreground text-background font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
                title="All Reviews Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" /> ALL ({testimonials.length})
              </button>
            </div>

            {viewMode === "carousel" && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={showPrevious}
                  className="paper-button p-3 border-2 border-border bg-card text-foreground hover:border-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer"
                  aria-label="Previous Testimonial"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="paper-button p-3 border-2 border-border bg-card text-foreground hover:border-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer"
                  aria-label="Next Testimonial"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Carousel View: Stacked Paper Sheet Memo */}
        {viewMode === "carousel" ? (
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative pt-6 pb-2"
          >
            {/* Stacked physical paper sheets on desk */}
            <div className="paper-sheet-stacked relative border-2 border-foreground bg-card transition-all duration-300">
              
              {/* PushPin pinned at the top center */}
              <PushPin className="absolute -top-2 left-1/2 -translate-x-1/2 z-20" />

              {/* Clean Top Bar: Rating & Counter */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-10">
                <div className="flex items-center gap-1" aria-label={`Rating: ${activeTestimonial.rating || 5} out of 5 stars`}>
                  {Array.from({ length: activeTestimonial.rating || 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-foreground text-foreground"
                    />
                  ))}
                </div>

                <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                </span>
              </div>

              {/* Memo Body: Pure Editorial Quote & Attribution */}
              <div className="p-6 sm:p-12 md:p-16">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <blockquote className="font-sans text-xl sm:text-2xl md:text-3xl font-medium leading-relaxed sm:leading-relaxed text-foreground tracking-tight">
                      &ldquo;{activeTestimonial.content}&rdquo;
                    </blockquote>

                    {/* Clean dashed paper rule */}
                    <div className="border-t border-dashed border-border/80 my-8" />

                    {/* Author Attribution */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                      <div>
                        <div className="font-display font-black text-lg sm:text-xl text-foreground uppercase tracking-tight">
                          {activeTestimonial.name}
                        </div>
                        <div className="text-muted-foreground uppercase text-xs mt-1">
                          {activeTestimonial.position}
                          <span className="mx-2 text-border font-normal">|</span>
                          <span className="text-foreground font-bold">{activeTestimonial.company}</span>
                        </div>
                      </div>

                      {activeTestimonial.website && (
                        <a
                          href={activeTestimonial.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="paper-button inline-flex items-center gap-1.5 border-2 border-foreground bg-foreground px-4 py-2 text-background font-mono text-xs font-bold uppercase tracking-wider hover:bg-background hover:text-foreground transition-colors cursor-pointer self-start sm:self-auto"
                        >
                          VISIT WEBSITE <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive slide indicator pills */}
            <div className="mt-8 flex items-center justify-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    playClickSound()
                    setActiveIndex(idx)
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx ? "w-8 bg-foreground" : "w-2 bg-border hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Grid View: Clean Paper Sheets Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-4">
            {testimonials.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="paper-sheet group flex flex-col justify-between border-2 border-border bg-card p-6 sm:p-8 hover:border-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  {/* Top Bar: Stars & Number */}
                  <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-5">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-foreground text-foreground"
                        />
                      ))}
                    </div>
                    <span className="font-mono text-xs font-bold text-muted-foreground">
                      #{String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Quote */}
                  <blockquote className="font-sans text-base sm:text-lg font-medium leading-relaxed text-foreground">
                    &ldquo;{item.content}&rdquo;
                  </blockquote>
                </div>

                {/* Attribution Footer */}
                <div className="mt-6 pt-4 border-t border-dashed border-border/80 flex items-center justify-between gap-3 font-mono text-xs">
                  <div>
                    <div className="font-display font-black text-sm uppercase text-foreground">
                      {item.name}
                    </div>
                    <div className="text-muted-foreground text-[11px] uppercase mt-0.5">
                      {item.position} <span className="text-border">|</span> <span className="font-bold text-foreground">{item.company}</span>
                    </div>
                  </div>

                  {item.website && (
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="paper-button inline-flex items-center justify-center h-8 w-8 border border-border bg-background text-foreground hover:border-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer"
                      title={`Visit ${item.company}`}
                      aria-label={`Visit ${item.company}`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

