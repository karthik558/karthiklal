"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function CtaSection() {
  return (
    <section id="cta" className="relative min-h-[40vh] md:min-h-[60vh] flex items-center justify-center py-24 overflow-hidden bg-background">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      </div>
      
      <div className="container relative z-10 flex justify-center text-center">
        <Link href="/contact" className="focus:outline-none">
          <motion.div 
            className="group relative inline-flex overflow-hidden cursor-pointer p-4"
            whileHover="hover"
            initial="initial"
          >
            {/* The Main Text */}
            <motion.h2 
              className="text-6xl md:text-9xl lg:text-[12rem] font-display font-black tracking-[-0.04em] text-primary transition-colors duration-500 group-hover:text-primary/80"
              animate={{ y: [-10, 10, -10], scale: [1, 1.02, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              Let's Talk
            </motion.h2>
            
            {/* The Glitter Slice Effect */}
            <motion.div
              className="absolute top-0 bottom-0 w-[150%] md:w-[80%] bg-gradient-to-r from-transparent via-primary/60 to-transparent -skew-x-12 pointer-events-none mix-blend-screen"
              variants={{
                initial: { x: "-150%" },
                hover: { 
                  x: "200%",
                  transition: { 
                    duration: 0.7, 
                    ease: "easeInOut",
                  }
                }
              }}
            />
            
            {/* Secondary Shimmer for extra "glitter" */}
            <motion.div
              className="absolute top-0 bottom-0 w-[50%] md:w-[30%] bg-gradient-to-r from-transparent via-white/80 to-transparent -skew-x-12 pointer-events-none mix-blend-overlay"
              variants={{
                initial: { x: "-200%" },
                hover: { 
                  x: "400%",
                  transition: { 
                    duration: 0.7, 
                    ease: "easeInOut",
                    delay: 0.1
                  }
                }
              }}
            />
          </motion.div>
        </Link>
      </div>
    </section>
  )
}
