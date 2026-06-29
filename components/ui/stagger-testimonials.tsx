"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Quote, Star } from "lucide-react"
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
        <Star key={index} className="h-4 w-4 fill-primary text-primary" />
      ))}
    </div>
  )
}

function ClientMark({ name, className }: { name: string; className?: string }) {
  return (
    <div className={cn("grid shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary/10 font-display font-bold text-primary", className)}>
      {getInitials(name)}
    </div>
  )
}

export const StaggerTestimonials = () => {
  const testimonials = testimonialsData.testimonials as Testimonial[]
  const [activeId, setActiveId] = useState(testimonials[0]?.id)

  const activeTestimonial = useMemo(
    () => testimonials.find((testimonial) => testimonial.id === activeId) || testimonials[0],
    [activeId, testimonials]
  )

  if (!testimonials || testimonials.length === 0) return null

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-lg border border-border/70 bg-card/75 p-4 shadow-sm md:p-6 lg:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)/0.08),transparent_42%,hsl(var(--accent)/0.05))]" />
          <div className="relative z-10 grid gap-5 lg:grid-cols-[0.58fr_0.42fr]">
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42 }}
              className="relative min-h-[380px] overflow-hidden rounded-lg border border-border/70 bg-background/75 p-5 text-left shadow-sm md:p-7"
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)/0.14),transparent_42%)]" />
              <div className="pointer-events-none absolute -bottom-16 -right-12 h-40 w-40 rounded-full bg-accent/8 blur-2xl" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-7 flex items-start justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <ClientMark name={activeTestimonial.name} className="h-14 w-14 text-lg" />
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{activeTestimonial.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {activeTestimonial.position} / {activeTestimonial.company}
                      </p>
                    </div>
                  </div>
                  <Quote className="h-10 w-10 shrink-0 text-primary/25" />
                </div>

                <blockquote className="font-display text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-3xl">
                  "{activeTestimonial.content}"
                </blockquote>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-5">
                  <Rating rating={activeTestimonial.rating} />
                  <span className="text-sm font-semibold text-primary">Selected feedback</span>
                </div>
              </div>
            </motion.div>

            <div className="grid gap-3">
              <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-border/70 bg-background/70">
                <ProofStat value={`${testimonials.length}`} label="Clients" />
                <ProofStat value="5.0" label="Rating" />
                <ProofStat value="100%" label="Trust" />
              </div>

              <div
                className="scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent grid max-h-[342px] gap-3 overflow-y-auto overscroll-contain pr-2"
              >
                {testimonials.map((testimonial, index) => {
                  const isActive = testimonial.id === activeTestimonial.id

                  return (
                    <motion.button
                      key={testimonial.id}
                      type="button"
                      onClick={() => setActiveId(testimonial.id)}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      className={cn(
                        "group w-full min-w-0 max-w-full rounded-lg border p-4 text-left transition",
                        isActive
                          ? "border-primary/40 bg-primary/10 shadow-sm"
                          : "border-border/70 bg-background/55 hover:border-primary/25 hover:bg-background/80"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <ClientMark name={testimonial.name} className="h-11 w-11 text-sm" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="truncate font-semibold text-foreground">{testimonial.name}</h4>
                            <ArrowRight className={cn("h-4 w-4 shrink-0 transition", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                          </div>
                          <p className="mt-1 truncate text-sm text-muted-foreground">
                            {testimonial.position} / {testimonial.company}
                          </p>
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-foreground/75">{testimonial.content}</p>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

function ProofStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r border-border/70 p-4 text-center last:border-r-0">
      <div className="font-display text-2xl font-bold text-foreground">{value}</div>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
    </div>
  )
}
