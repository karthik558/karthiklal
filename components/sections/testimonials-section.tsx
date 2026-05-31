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
      <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_15%_25%,hsl(var(--primary)/0.12),transparent_60%),radial-gradient(700px_circle_at_85%_75%,hsl(var(--accent)/0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-noise opacity-25 pointer-events-none" />
      <div className="container relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-[0.2em] uppercase">
            Testimonials
          </Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
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

