"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { User, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    position: "CTO, TechFirm",
    content:
      "Karthik delivered exceptional results for our website redesign project. His technical expertise and creative vision transformed our online presence. The interactive elements and performance optimizations have significantly improved user engagement.",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Sarah Williams",
    position: "Marketing Director, CreativeAgency",
    content:
      "Working with Karthik was a pleasure. He understood our design requirements perfectly and implemented them with precision. The 3D elements he added to our portfolio site have received numerous compliments from our clients.",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Michael Chen",
    position: "Founder, StartupX",
    content:
      "Karthik helped us build our MVP from scratch, and the results exceeded our expectations. His full-stack expertise enabled us to launch quickly while maintaining high code quality. I highly recommend him for any web development project.",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    position: "UI/UX Designer, DesignWorks",
    content:
      "As a designer, I appreciate working with developers who respect the design process. Karthik's attention to detail and commitment to pixel-perfect implementation made our collaboration seamless and productive.",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 5,
    name: "David Thompson",
    position: "Product Manager, SoftTech",
    content:
      "Karthik's technical skills and problem-solving abilities are outstanding. He tackled complex challenges with innovative solutions that enhanced our product's functionality and user experience.",
    avatar: "/placeholder.svg?height=80&width=80",
  },
]

export default function TestimonialsSection() {
  const ref = useRef(null)
  // Update useInView configuration
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [activeIndex, setActiveIndex] = useState(0)

  const showPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const showNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  return (
    <section id="testimonials" className="py-20 md:py-32">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-medium mb-2">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Clients Say</h2>
          <p className="text-muted-foreground">
            Feedback from clients and collaborators I've worked with on various projects.
          </p>
        </motion.div>

        <div className="relative">
          {/* Carousel controls for larger screens */}
          <div className="hidden md:block">
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
              onClick={showPrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
              onClick={showNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Testimonial Carousel */}
          <div className="overflow-hidden px-4 md:px-12">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="md:px-8"
                >
                  <Card className="border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                        <div className="relative shrink-0">
                          <div className="absolute -left-2 -top-2 w-6 h-6 bg-primary/20 rounded-full"></div>
                          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20">
                            {testimonials[activeIndex].avatar ? (
                              <Image
                                src={testimonials[activeIndex].avatar || "/placeholder.svg"}
                                alt={testimonials[activeIndex].name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-secondary flex items-center justify-center">
                                <User className="h-10 w-10 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="mb-6 text-primary">
                            <Quote className="h-10 w-10 opacity-30" />
                          </div>
                          <p className="text-lg italic mb-6">"{testimonials[activeIndex].content}"</p>
                          <div>
                            <h4 className="text-lg font-semibold">{testimonials[activeIndex].name}</h4>
                            <p className="text-sm text-muted-foreground">{testimonials[activeIndex].position}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Indicator dots for mobile */}
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex ? "w-8 bg-primary" : "w-2 bg-primary/30"
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation buttons for mobile */}
          <div className="flex justify-center gap-4 mt-6 md:hidden">
            <Button variant="outline" size="icon" className="h-10 w-10" onClick={showPrevious}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10" onClick={showNext}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

