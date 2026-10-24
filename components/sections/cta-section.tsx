"use client"

import { useRef, useState } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight, Copy, Check } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"

export default function CtaSection() {
  const [copied, setCopied] = useState(false)
  const email = "contact@karthiklal.in"
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const watermarkY = useTransform(scrollYProgress, [0, 1], [-40, 45])
  const watermarkRotate = useTransform(scrollYProgress, [0, 1], [-4, 4])

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section ref={sectionRef} id="cta" className="section-shell">
      <div className="section-container">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 30, scale: 0.98 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="paper-sheet border-2 border-border/80 bg-card p-8 sm:p-12 md:p-16 text-center hover:border-foreground/80 transition-all duration-300 relative overflow-hidden"
        >
          {/* Background Giant Stroke Number Watermark with Parallax Drift */}
          <motion.div
            style={{
              y: reduced ? 0 : watermarkY,
              rotate: reduced ? 0 : watermarkRotate,
            }}
            className="absolute right-4 -bottom-6 pointer-events-none select-none overflow-hidden opacity-[0.05] dark:opacity-[0.09] z-0 will-change-transform"
          >
            <span
              className="font-display text-[12rem] sm:text-[16rem] font-black uppercase tracking-tighter text-transparent leading-none block"
              style={{
                WebkitTextStroke: "3px hsl(var(--foreground))",
                WebkitTextFillColor: "transparent",
              }}
            >
              11
            </span>
          </motion.div>

          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="studio-label section-heading-label">
                11 / INITIATE COLLABORATION
              </span>
            </div>

            <motion.h2
              initial={reduced ? undefined : { opacity: 0, y: 16 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="section-title mb-10"
            >
              Have something in mind?<br /><span className="studio-serif">Let’s build it.</span>
            </motion.h2>

            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
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
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

