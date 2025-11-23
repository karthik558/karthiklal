"use client"

import { MarqueeAnimation } from "@/components/ui/marquee-effect"
import { PROFILE_DATA } from "@/lib/static-data"

interface PersonalInfo {
  title: string
}

export default function MarqueeSection() {
  const profileData: PersonalInfo = PROFILE_DATA.personalInfo as PersonalInfo
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-background via-secondary/5 to-background">
      {/* Background decoration with parallax effect */}
      <div className="absolute inset-0 opacity-20" data-speed="0.8">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" data-speed="0.9"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} data-speed="1.1"></div>
      </div>
      
      <div className="relative space-y-12" data-speed="0.95">
        {/* First marquee - tilted left, main skills */}
        <div className="transform -rotate-3 origin-center" data-speed="0.98">
          <MarqueeAnimation
            direction="left"
            baseVelocity={2}
            className="bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 text-primary font-black py-6 tracking-widest text-2xl md:text-4xl lg:text-5xl backdrop-blur-md border-y border-primary/30 shadow-lg"
          >
            {profileData.title.toUpperCase().replace(/,/g, ' •')}
          </MarqueeAnimation>
        </div>

        {/* Second marquee - tilted right, technical skills */}
        <div className="transform rotate-3 origin-center" data-speed="1.02">
          <MarqueeAnimation
            direction="right"
            baseVelocity={1.8}
            className="bg-gradient-to-l from-foreground/10 via-foreground/8 to-foreground/5 text-foreground font-black py-6 tracking-widest text-2xl md:text-4xl lg:text-5xl backdrop-blur-md border-y border-border shadow-lg"
          >
            NETWORK SECURITY • WEB DEVELOPMENT • INFRASTRUCTURE MANAGEMENT
          </MarqueeAnimation>
        </div>
      </div>

      {/* Subtle grid overlay with slow parallax */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" data-speed="0.9">
        <div className="w-full h-full bg-grid-pattern"></div>
      </div>
    </section>
  )
}
