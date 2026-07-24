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
      className="relative my-3 w-full max-w-full overflow-hidden bg-background py-2"
    >
      <div className="relative z-10 space-y-2">
        <div className="w-[102vw] -ml-[1vw] origin-center -rotate-[0.5deg]">
          <MarqueeAnimation
            direction="left"
            baseVelocity={isClosing ? 1.8 : 2.2}
            className="border-y-2 border-foreground bg-foreground py-3 font-mono text-xl font-black uppercase tracking-tight text-background sm:text-2xl md:py-4 md:text-3xl lg:text-4xl"
          >
            {content.primary}
          </MarqueeAnimation>
        </div>

        <div className="w-[102vw] -ml-[1vw] origin-center rotate-[0.5deg]">
          <MarqueeAnimation
            direction="right"
            baseVelocity={isClosing ? 2.2 : 1.8}
            className="border-y-2 border-border bg-card py-3 font-mono text-xl font-black uppercase tracking-tight text-foreground sm:text-2xl md:py-4 md:text-3xl lg:text-4xl"
          >
            {content.secondary}
          </MarqueeAnimation>
        </div>
      </div>
    </section>
  )
}
