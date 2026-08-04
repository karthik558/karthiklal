"use client"

import { MarqueeAnimation } from "@/components/ui/marquee-effect"

type MarqueeSectionProps = {
  variant?: "intro" | "closing"
}

const marqueeContent = {
  intro: {
    primary: "CYBERSECURITY • FULL STACK DEVELOPMENT • NETWORK SECURITY • PENETRATION TESTING • SYSTEM ARCHITECTURE • HOTEL IT INFRASTRUCTURE •",
    secondary: "ETHICAL HACKING • REACT & NEXT.JS • LINUX SYSADMIN • THREAT MITIGATION • CLOUD OPS • RUST & PYTHON •",
  },
  closing: {
    primary: "LET'S BUILD SECURE & POWERFUL DIGITAL PRODUCTS • GET IN TOUCH FOR IT CONSULTING & DEVELOPMENT •",
    secondary: "CYBERSECURITY REVIEWS • ENTERPRISE IT MANAGEMENT • FULL STACK ARCHITECTURE • PERF OPTIMIZATION •",
  },
}

export default function MarqueeSection({ variant = "intro" }: MarqueeSectionProps) {
  const content = marqueeContent[variant]
  const isClosing = variant === "closing"

  return (
    <section
      aria-label={isClosing ? "Collaboration services" : "Core capabilities"}
      className="relative my-3 w-full max-w-full overflow-hidden bg-transparent py-3"
    >
      <div className="relative overflow-hidden bg-muted/30 py-5 sm:py-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:18px_18px]"
        />

        <div className="relative z-10 space-y-3">
          <div className="-ml-[1vw] w-[102vw] origin-center -rotate-[0.65deg] transition-transform duration-500 hover:rotate-0">
            <MarqueeAnimation
              direction="left"
              baseVelocity={isClosing ? 1.8 : 2.2}
              className="bg-foreground py-3 font-mono text-xl font-black uppercase tracking-tight text-background shadow-xl sm:text-2xl md:py-4 md:text-3xl lg:text-4xl"
            >
              {content.primary}
            </MarqueeAnimation>
          </div>

          <div className="-ml-[1vw] w-[102vw] origin-center rotate-[0.65deg] transition-transform duration-500 hover:rotate-0">
            <MarqueeAnimation
              direction="right"
              baseVelocity={isClosing ? 2.2 : 1.8}
              className="bg-card py-3 font-mono text-xl font-black uppercase tracking-tight text-foreground shadow-lg ring-1 ring-border/60 sm:text-2xl md:py-4 md:text-3xl lg:text-4xl"
            >
              {content.secondary}
            </MarqueeAnimation>
          </div>
        </div>
      </div>
    </section>
  )
}
