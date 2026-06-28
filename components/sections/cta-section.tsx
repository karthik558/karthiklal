"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

export default function CtaSection() {
  return (
    <section id="cta" className="relative flex min-h-[34vh] items-center justify-center overflow-hidden bg-background py-16 md:min-h-[42vh] md:py-24">
      <div className="absolute inset-0 section-gradient-blend bg-[radial-gradient(760px_circle_at_50%_48%,hsl(var(--primary)/0.04),transparent_62%)]" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="container relative z-10 mx-auto px-4"
      >
        <Link
          href="/contact"
          className="group relative mx-auto flex w-fit items-center gap-4 px-2 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:gap-6"
        >
          <span className="absolute -inset-x-8 top-1/2 h-20 -translate-y-1/2 rounded-full bg-primary/0 blur-3xl transition duration-500 group-hover:scale-110 group-hover:bg-primary/16" />

          <span className="relative overflow-hidden">
            <h2 className="font-display text-5xl font-black leading-none tracking-tight text-foreground transition duration-500 group-hover:-translate-y-0.5 sm:text-6xl md:text-8xl lg:text-[8rem]">
              Let&apos;s <span className="text-primary transition-colors duration-500 group-hover:text-accent">Connect</span>
            </h2>
            <span className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 rounded-full bg-primary transition duration-500 group-hover:scale-x-100" />
          </span>

          <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-primary/25 bg-primary/10 text-primary transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:bg-primary group-hover:text-primary-foreground md:h-16 md:w-16">
            <ArrowUpRight className="h-5 w-5 md:h-7 md:w-7" />
          </span>
          <span className="sr-only">Open contact page</span>
        </Link>
      </motion.div>
    </section>
  )
}
