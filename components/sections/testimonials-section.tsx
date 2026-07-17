"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, ArrowUpRight, Quote, Star } from "lucide-react"
import { SectionHeader } from "@/components/ui/section-header"
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

const initials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase()

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const reduceMotion = useReducedMotion()
  const activeTestimonial = testimonials[activeIndex]

  useEffect(() => {
    if (isPaused || reduceMotion || testimonials.length < 2) return
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [isPaused, reduceMotion])

  if (!activeTestimonial) return null

  const showPrevious = () => setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
  const showNext = () => setActiveIndex((current) => (current + 1) % testimonials.length)

  return (
    <section id="testimonials" className="relative overflow-hidden bg-background py-20 md:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 section-gradient-blend bg-[radial-gradient(900px_circle_at_12%_18%,hsl(var(--primary)/0.11),transparent_62%)]" />
      <div className="container relative z-10">
        <div className="mb-12 grid gap-8 lg:mb-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <SectionHeader
            eyebrow="Client Stories"
            title="What Clients"
            highlight="Say"
            align="responsive"
          />
          <div className="flex items-center gap-3" aria-label="Testimonial controls">
            <button type="button" onClick={showPrevious} className="grid h-12 w-12 place-items-center rounded-full border border-border bg-card transition hover:border-primary/40 hover:text-primary" aria-label="Previous testimonial">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={showNext} className="grid h-12 w-12 place-items-center rounded-full border border-border bg-card transition hover:border-primary/40 hover:text-primary" aria-label="Next testimonial">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/75 shadow-[0_30px_100px_-65px_rgba(0,0,0,0.65)] backdrop-blur-sm"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
          aria-live="polite"
        >
          <div className="grid min-h-[440px] lg:grid-cols-[0.34fr_0.66fr]">
            <div className="relative flex flex-col justify-between overflow-hidden bg-zinc-950 p-7 text-white md:p-10 lg:p-12">
              <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
              <div className="relative">
                <Quote className="h-12 w-12 text-primary" />
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-white/45">Client feedback</p>
              </div>
              <div className="relative mt-12">
                <div className="flex gap-1" aria-label={`${activeTestimonial.rating} out of 5 stars`}>
                  {Array.from({ length: activeTestimonial.rating || 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-4 font-mono text-xs text-white/45">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                </p>
              </div>
            </div>

            <div className="relative flex items-center p-7 md:p-10 lg:p-14">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeTestimonial.id}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -28 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full"
                >
                  <blockquote className="font-display text-2xl font-medium leading-[1.4] tracking-tight text-foreground/90 sm:text-3xl md:text-4xl">
                    “{activeTestimonial.content}”
                  </blockquote>

                  <div className="mt-10 flex flex-col gap-5 border-t border-border/60 pt-7 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-primary/20 bg-primary/10 font-display text-sm font-bold text-primary">
                        {initials(activeTestimonial.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{activeTestimonial.name}</p>
                        <p className="truncate text-sm text-muted-foreground">{activeTestimonial.position} · {activeTestimonial.company}</p>
                      </div>
                    </div>
                    {activeTestimonial.website && (
                      <Link href={activeTestimonial.website} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
                        Visit website <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex gap-2 border-t border-border/60 px-7 py-5 md:px-10">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex ? "w-10 bg-primary" : "w-5 bg-muted-foreground/20 hover:bg-muted-foreground/40"}`}
                aria-label={`Show testimonial ${index + 1} from ${testimonial.name}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
