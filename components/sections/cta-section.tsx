"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Copy, Check, Mail } from "lucide-react"
import Link from "next/link"
import { AnimatedButton } from "@/components/ui/animated-button"

export default function CtaSection() {
  const [copied, setCopied] = useState(false)
  const email = "dev@karthiklal.in"

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="cta" className="relative bg-background py-28 md:py-36 border-t-2 border-foreground">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <div className="border-2 border-foreground bg-card p-8 sm:p-12 md:p-16 text-center">
          
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
            INITIATE COLLABORATION // CONTACT
          </div>

          <h2 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] font-black uppercase tracking-tighter leading-none text-foreground mb-8">
            HAVE A PROJECT IN MIND?
          </h2>

          <p className="max-w-2xl mx-auto font-sans text-base sm:text-lg text-muted-foreground font-light leading-relaxed mb-10">
            Whether you need enterprise IT management, a thorough security audit, or a high-performance web platform — let's work together.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <AnimatedButton
              href="/contact"
              variant="primary"
            >
              GET IN TOUCH DIRECTLY <ArrowUpRight className="w-4 h-4" />
            </AnimatedButton>

            <AnimatedButton
              onClick={copyEmail}
              variant="outline"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "EMAIL COPIED!" : "COPY EMAIL"}</span>
            </AnimatedButton>
          </div>
        </div>
      </div>
    </section>
  )
}

