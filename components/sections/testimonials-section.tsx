"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight, ArrowUpRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"
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

const CONFETTI_COLORS = ["#fbbf24", "#f59e0b", "#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#ffffff"]

function ConfettiParticles() {
  const particles = Array.from({ length: 22 })
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 select-none">
      {particles.map((_, i) => {
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
        const left = `${(i * 19 + 7) % 86 + 7}%`
        const size = (i % 3) * 3 + 5
        const rotate = (i * 45) % 360

        return (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              y: 20,
              x: 0,
              scale: 0.2,
              rotate: 0,
            }}
            animate={{
              opacity: [0, 1, 0.9, 0],
              y: [-10, -50 - (i % 5) * 15, -110],
              x: (i % 2 === 0 ? 1 : -1) * (20 + (i * 9) % 50),
              scale: [0.2, 1.2, 1, 0.3],
              rotate: [0, rotate, rotate + 180],
            }}
            transition={{
              duration: 1.6 + (i % 4) * 0.3,
              repeat: Infinity,
              repeatDelay: (i % 3) * 0.3,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              bottom: "15%",
              left,
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: i % 2 === 0 ? "50%" : "2px",
            }}
          />
        )
      })}
    </div>
  )
}

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const activeTestimonial = testimonials[activeIndex]

  useEffect(() => {
    if (isHovered || testimonials.length < 2) return
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isHovered])

  if (!activeTestimonial) return null

  const showPrevious = () => setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
  const showNext = () => setActiveIndex((current) => (current + 1) % testimonials.length)

  return (
    <section id="testimonials" className="relative bg-background py-28 md:py-36 border-t border-border">
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
          className="border-2 border-foreground bg-card p-8 md:p-14 shadow-2xl relative transition-all duration-500 hover:border-amber-400/50"
        >
          {/* Confetti Animation Layer */}
          <AnimatePresence>
            {isHovered && <ConfettiParticles />}
          </AnimatePresence>

          <div className="flex items-center justify-between border-b border-border pb-6 mb-8 font-mono text-xs uppercase relative z-10">
            {/* Rating Stars with Hover Color Transformation */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: activeTestimonial.rating || 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: isHovered ? [1, 1.25, 1] : 1 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                >
                  <Star
                    className={cn(
                      "w-4 h-4 transition-all duration-300",
                      isHovered
                        ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                        : "fill-foreground text-foreground"
                    )}
                  />
                </motion.div>
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
                "{activeTestimonial.content}"
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

