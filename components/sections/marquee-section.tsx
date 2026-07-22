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
    <section className="relative my-6 w-full max-w-full overflow-hidden bg-background py-4">
      <div className="relative z-10 space-y-4">
        <div className="w-[105vw] -ml-[2vw] origin-center -rotate-[1deg]">
          <MarqueeAnimation
            direction="left"
            baseVelocity={isClosing ? 1.8 : 2.2}
            className="border-y-2 border-foreground bg-foreground py-4 font-mono text-2xl font-black uppercase text-background sm:text-3xl md:py-6 md:text-5xl lg:text-6xl tracking-tight"
          >
            {content.primary}
          </MarqueeAnimation>
        </div>

        <div className="w-[105vw] -ml-[2vw] origin-center rotate-[1deg]">
          <MarqueeAnimation
            direction="right"
            baseVelocity={isClosing ? 2.2 : 1.8}
            className="border-y-2 border-border bg-card py-4 font-mono text-2xl font-black uppercase text-foreground sm:text-3xl md:py-6 md:text-5xl lg:text-6xl tracking-tight"
          >
            {content.secondary}
          </MarqueeAnimation>
        </div>
      </div>
    </section>
  )
}

