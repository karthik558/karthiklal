"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { TestimonialCard } from "@/components/ui/testimonial-card"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    author: {
      name: "Alex Johnson",
      handle: "@alextech",
      avatar: "/placeholder.svg?height=80&width=80"
    },
    text: "Karthik delivered exceptional results for our website redesign project. His technical expertise and creative vision transformed our online presence."
  },
  {
    author: {
      name: "Sarah Williams",
      handle: "@sarahcreates",
      avatar: "/placeholder.svg?height=80&width=80"
    },
    text: "Working with Karthik was a pleasure. He understood our design requirements perfectly and implemented them with precision."
  },
  {
    author: {
      name: "Michael Chen",
      handle: "@michaeldev",
      avatar: "/placeholder.svg?height=80&width=80"
    },
    text: "Karthik helped us build our MVP from scratch, and the results exceeded our expectations. His full-stack expertise enabled us to launch quickly."
  },
  {
    author: {
      name: "Emily Rodriguez",
      handle: "@emilydesign",
      avatar: "/placeholder.svg?height=80&width=80"
    },
    text: "As a designer, I appreciate working with developers who respect the design process. Karthik's attention to detail made our collaboration seamless."
  },
  {
    author: {
      name: "David Thompson",
      handle: "@davidpm",
      avatar: "/placeholder.svg?height=80&width=80"
    },
    text: "Karthik's technical skills and problem-solving abilities are outstanding. He tackled complex challenges with innovative solutions."
  }
]

export default function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="testimonials" className="py-20 md:py-32 overflow-hidden">
      <div className="container relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-medium mb-2">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
            What Clients Say
          </h2>
          <p className="text-muted-foreground">
            Feedback from clients and collaborators I've worked with on various projects.
          </p>
        </motion.div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row [--duration:40s]">
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
              {[...Array(2)].map((_, setIndex) => (
                testimonials.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`${setIndex}-${i}`}
                    {...testimonial}
                  />
                ))
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-background sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-background sm:block" />
        </div>
      </div>
    </section>
  )
}

