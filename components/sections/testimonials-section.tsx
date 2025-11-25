"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials"
import { Badge } from "@/components/ui/badge"

export default function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-secondary/10">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary">
            Testimonials
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
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

