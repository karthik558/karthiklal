"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { TestimonialCard } from "@/components/ui/testimonial-card"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    author: {
      name: "Hotel Management Team",
      handle: "@ihcl_management",
      avatar: "/placeholder-user.jpg"
    },
    text: "Karthik's expertise in IT infrastructure management has been invaluable to our operations. His proactive approach to security and system optimization has significantly improved our guest experience and operational efficiency."
  },
  {
    author: {
      name: "IT Director",
      handle: "@tamara_tech",
      avatar: "/placeholder-user.jpg"
    },
    text: "Working with Karthik was exceptional. His deep knowledge of network security and penetration testing helped us identify and resolve critical vulnerabilities. His technical skills are matched by his professionalism."
  },
  {
    author: {
      name: "Development Team",
      handle: "@tech_startup",
      avatar: "/placeholder-user.jpg"
    },
    text: "Karthik delivered a comprehensive web application that exceeded our expectations. His expertise in React, TypeScript, and modern web technologies resulted in a scalable and secure solution."
  },
  {
    author: {
      name: "Operations Manager",
      handle: "@pauljohn_ops",
      avatar: "/placeholder-user.jpg"
    },
    text: "Karthik's IT support and infrastructure management transformed our daily operations. His ability to troubleshoot complex issues and implement efficient solutions saved us significant time and resources."
  },
  {
    author: {
      name: "Security Consultant",
      handle: "@cybersec_expert",
      avatar: "/placeholder-user.jpg"
    },
    text: "Karthik's penetration testing and security auditing skills are impressive. His CEH certification and practical experience make him a valuable asset for any cybersecurity initiative."
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

