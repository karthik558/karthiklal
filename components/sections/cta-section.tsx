"use client"

import { useState } from "react"
import { ArrowUpRight, Copy, Check } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"

export default function CtaSection() {
  const [copied, setCopied] = useState(false)
  const email = "contact@karthiklal.in"

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="cta" className="section-shell">
      <div className="section-container">
        <div className="border-2 border-foreground bg-card p-8 sm:p-12 md:p-16 text-center">
          
          <div className="mb-4">
            <span className="paper-stamp">
              11 // INITIATE COLLABORATION
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] font-black uppercase tracking-tighter leading-none text-foreground mb-10">
            HAVE A PROJECT IN MIND?
          </h2>

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
