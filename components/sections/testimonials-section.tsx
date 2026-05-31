"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials"
import { Badge } from "@/components/ui/badge"

export default function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_15%_25%,hsl(var(--primary)/0.08),transparent_65%)]" />
      <div className="absolute inset-0 bg-noise opacity-18 pointer-events-none" />
      <div className="container relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full bg-primary/5 border-primary/20 text-primary text-xs font-semibold tracking-[0.2em] uppercase">
            Testimonials
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
            What Clients <span className="text-gradient">Say</span>
          </h2>
          <p className="text-muted-foreground">
            Feedback from clients and collaborators I've worked with on various projects.
          </p>
        </motion.div>

        <div className="flex w-full justify-center items-center">
          <StaggerTestimonials />
        </div>
      </div>
    </section>
  )
}

