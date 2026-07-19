"use client"

import { MarqueeAnimation } from "@/components/ui/marquee-effect"

type MarqueeSectionProps = {
  variant?: "intro" | "closing"
}

const marqueeContent = {
  intro: {
    primary: "IT MANAGEMENT • CYBERSECURITY • WEB ARCHITECTURE • LINUX SYSTEMS",
    secondary: "SECURE NETWORKS • FULL STACK PRODUCTS • CLOUD OPS • DESIGN SYSTEMS",
  },
  closing: {
    primary: "CONSULTING • SECURITY REVIEWS • WEB BUILDS • INFRASTRUCTURE",
    secondary: "HARDEN SYSTEMS • SHIP INTERFACES • IMPROVE OPERATIONS",
  },
}

export default function MarqueeSection({ variant = "intro" }: MarqueeSectionProps) {
  const content = marqueeContent[variant]
  const isClosing = variant === "closing"

  return (
    <section className="relative -my-2 w-full max-w-full overflow-hidden bg-transparent py-4 md:-my-4 md:py-8">
      <div className="relative z-10 space-y-5 md:space-y-8">
        <div className="origin-center -rotate-[1.5deg] md:-rotate-[2.4deg] w-[110vw] -ml-[5vw]">
          <MarqueeAnimation
            direction="left"
            baseVelocity={isClosing ? 1.8 : 2}
            className="border-y border-primary/25 bg-primary/10 py-5 font-display text-3xl font-black text-primary shadow-[0_18px_54px_hsl(var(--primary)/0.08)] backdrop-blur-sm sm:text-4xl md:py-8 md:text-6xl lg:text-7xl"
          >
            {content.primary}
          </MarqueeAnimation>
        </div>

        <div className="origin-center rotate-[1.5deg] md:rotate-[2.4deg] w-[110vw] -ml-[5vw]">
          <MarqueeAnimation
            direction="right"
            baseVelocity={isClosing ? 2.1 : 1.8}
            className="border-y border-border/70 bg-background/25 py-5 font-display text-3xl font-black text-foreground shadow-[0_18px_54px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:text-4xl md:py-8 md:text-6xl lg:text-7xl"
          >
            {content.secondary}
          </MarqueeAnimation>
        </div>
      </div>
    </section>
  )
}
