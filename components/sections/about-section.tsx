"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { AnimatedButton } from "@/components/ui/animated-button"
import { SectionHeader } from "@/components/ui/section-header"
import {
  Download,
  ArrowUpRight,
  MapPin,
  Briefcase,
  Clock,
  Languages,
  Terminal,
} from "lucide-react"
import Image from "next/image"
import { PROFILE_DATA } from "@/lib/static-data"

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 })

  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState("")
  const [experienceCount, setExperienceCount] = useState(0)

  // Avoid hydration mismatch by running clock only on client
  useEffect(() => {
    setMounted(true)

    const updateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
      setTime(new Intl.DateTimeFormat("en-US", options).format(now))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Experience stat counter animation
  useEffect(() => {
    if (statsInView && mounted) {
      let start = 0
      const end = 7.2
      const duration = 1200
      const startTime = performance.now()

      const animate = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing out quadratic
        const easeProgress = progress * (2 - progress)
        const currentCount = Number((easeProgress * end).toFixed(1))
        setExperienceCount(currentCount)

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [statsInView, mounted])

  const profileData = PROFILE_DATA
  const { personalInfo } = profileData
  const interests = profileData.interests || []

  return (
    <section id="about" ref={containerRef} className="py-24 md:py-32 relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute inset-0 section-gradient-blend bg-[radial-gradient(900px_circle_at_12%_18%,hsl(var(--primary)/0.11),transparent_62%)] pointer-events-none" />

      <div className="container max-w-7xl relative z-10 mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20"
        >
          <SectionHeader eyebrow="About Me" title="My" highlight="Journey" />
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Card 1: Portrait Image (Col 1, Row 1-2 on desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="interactive-surface group relative min-h-[400px] overflow-hidden rounded-3xl border border-foreground/10 bg-card/70 shadow-lg md:col-span-1 md:row-span-2 md:min-h-full"
          >
            <div className="absolute inset-0 z-0">
              <Image
                src="/user/about.jpg"
                alt={personalInfo.name}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                priority
              />
              {/* Vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent transition-opacity duration-500 group-hover:via-background/20 z-10" />
            </div>

            <div className="absolute bottom-0 left-0 p-8 w-full z-20">
              <h3 className="text-2xl font-display font-extrabold text-foreground group-hover:text-primary transition-colors duration-300">
                {personalInfo.name}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {profileData.availability}
              </p>
            </div>
          </motion.div>

          {/* Card 2: Minimal Bio Text (Col 2-3, Row 1 on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
            className="interactive-surface group relative overflow-hidden rounded-3xl border border-foreground/10 bg-card/70 p-8 shadow-lg md:col-span-2 md:p-10"
          >
            <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full blur-2xl transition-opacity duration-300 pointer-events-none" />
            
            <div className="flex flex-col justify-between h-full relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Overview</span>
                  <div className="h-px flex-1 bg-foreground/10" />
                </div>
                
                <h3 className="text-2xl font-bold font-display text-foreground mb-4 leading-tight">
                  Engineering secure systems & beautiful interfaces
                </h3>
                
                <p className="text-foreground/80 leading-relaxed text-base md:text-lg">
                  I am <span className="text-foreground font-bold border-b-2 border-primary/20 pb-0.5">Karthik Lal</span>, an IT Manager and Full-Stack Developer with over <span className="text-foreground font-bold">7 years</span> of experience. I specialize in Linux systems architecture, cybersecurity audits, and modern web applications, currently leading IT operations at <span className="text-foreground font-bold">IHCL</span>, Lakshadweep.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-6 mt-6 border-t border-foreground/5">
                <AnimatedButton href="/#contact" variant="primary" className="h-10 px-5 text-xs" icon={<ArrowUpRight className="h-3.5 w-3.5" />}>
                  Let's Connect
                </AnimatedButton>
                <AnimatedButton
                  href="https://drive.google.com/uc?export=download&id=1y1PklhkLbM9iFLGCOP4dFPj6DzDIzd7u"
                  variant="outline"
                  className="h-10 px-5 text-xs border-foreground/10 bg-background/30 hover:border-primary/50"
                  icon={<Download className="h-3.5 w-3.5" />}
                >
                  Download CV
                </AnimatedButton>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Metrics & Time Card (Col 2, Row 2 on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="interactive-surface group relative overflow-hidden rounded-3xl border border-foreground/10 bg-card/70 p-6 shadow-lg md:col-span-1 md:p-8"
          >
            <div className="absolute bottom-0 right-0 -mr-12 -mb-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500 pointer-events-none" />

            <div className="flex flex-col justify-between h-full relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Stats & Time</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Live</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 items-center divide-x divide-foreground/10 h-full py-2">
                <div ref={statsRef} className="flex flex-col justify-center">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-4xl md:text-5xl font-extrabold font-display tracking-tight text-foreground">
                      {mounted ? experienceCount : "7.2"}
                    </span>
                    <span className="text-lg font-bold text-primary">+</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">Years Exp</p>
                </div>
                
                <div className="flex flex-col justify-center pl-4">
                  <div className="text-xl font-mono font-bold tracking-tight text-foreground">
                    {mounted ? time.split(" ")[0] : "00:00:00"}
                  </div>
                  <div className="text-[9px] font-semibold text-muted-foreground tracking-wider uppercase mt-1">
                    {mounted ? time.split(" ")[1] : "AM"} IST
                  </div>
                  <p className="text-[9px] text-muted-foreground/75 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-accent" /> Lakshadweep
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Focus & Languages (Col 3, Row 2 on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            viewport={{ once: true }}
            className="interactive-surface group relative overflow-hidden rounded-3xl border border-foreground/10 bg-card/70 p-6 shadow-lg md:col-span-1 md:p-8"
          >
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-all duration-500 pointer-events-none" />

            <div className="flex flex-col justify-between h-full relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Focus & Talk</span>
              </div>
              
              <div className="space-y-4">
                {/* Tech tags */}
                <div>
                  <div className="flex flex-wrap gap-1.5">
                    {interests.slice(0, 4).map((interest) => {
                      let tagText = interest
                      if (interest.includes("Development")) tagText = interest.replace(" Development", "")
                      if (interest.includes("Security")) tagText = interest.replace(" Security", "")
                      
                      return (
                        <span
                          key={interest}
                          className="px-2.5 py-1 rounded-lg border border-foreground/5 bg-background/40 text-[10px] font-semibold text-foreground/80 hover:text-primary hover:border-primary/20 transition-colors duration-300 cursor-default"
                        >
                          {tagText}
                        </span>
                      )
                    })}
                  </div>
                </div>

                {/* Languages */}
                <div className="border-t border-foreground/5 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <Languages className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>English</span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Malayalam</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
