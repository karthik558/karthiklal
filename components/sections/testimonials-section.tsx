"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials"
import { SectionHeader } from "@/components/ui/section-header"

export default function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 section-gradient-blend bg-[radial-gradient(900px_circle_at_15%_25%,hsl(var(--primary)/0.08),transparent_65%)]" />
      <div className="absolute inset-0 bg-noise opacity-18 pointer-events-none" />
      <div className="container relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <SectionHeader eyebrow="Testimonials" title="What Clients" highlight="Say" />
        </motion.div>
      </div>

      <div className="relative z-10 w-full overflow-hidden">
        <StaggerTestimonials />
      </div>
    </section>
  )
}
