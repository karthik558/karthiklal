"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CtaSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section id="contact" className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="container relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Main CTA Text */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-tighter mb-4"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            <span className="text-foreground">
              Let's Talk
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground font-medium mb-12 tracking-wide"
          >
            Get in Touch
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative group">
              {/* Animated background */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Button */}
              <Button 
                asChild 
                size="lg" 
                className="relative bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary rounded-full px-8 py-6 font-semibold transition-all duration-300 group-hover:scale-105"
              >
                <Link href="/contact" className="flex items-center gap-2">
                  <span>Start a Conversation</span>
                  <div className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1">
                    →
                  </div>
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
