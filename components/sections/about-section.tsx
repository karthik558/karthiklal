"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Badge } from "@/components/ui/badge"
import { Download, ArrowUpRight, MapPin, Briefcase, Award } from "lucide-react"
import Image from "next/image"

interface PersonalInfo {
  name: string
  title: string
  dateOfBirth: string
  location: string
  email: string
  linkedin: string
  github: string
  website: string
  avatar: string
  bio: string
  professionalSummary: string
}

interface ProfileData {
  personalInfo: PersonalInfo
  languages: string[]
  interests: string[]
  availability: string
}

export default function AboutSection() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/data/profile.json')
        const data: ProfileData = await response.json()
        setProfileData(data)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    }

    fetchProfile()
  }, [])

  if (!profileData) {
    return null
  }

  const { personalInfo } = profileData

  return (
    <section id="about" ref={containerRef} className="py-24 md:py-32 relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_80%_20%,hsl(var(--accent)/0.08),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      
      <div className="container px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20"
        >
          <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full bg-primary/5 border-primary/20 text-primary text-xs font-semibold tracking-[0.2em] uppercase">
            About Me
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
            My <span className="text-gradient">Journey</span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-auto lg:grid-rows-[auto_200px] gap-6">
          
          {/* Card 1: Portrait Image (Spans 1 col, 2 rows on desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="md:col-span-1 lg:row-span-2 relative rounded-3xl overflow-hidden border border-foreground/10 bg-card/50 shadow-xl group min-h-[400px] lg:min-h-full"
          >
            <Image
              src="/user/about.jpg"
              alt={personalInfo.name}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
            />
            {/* Glassmorphic fade at the bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80" />
            
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-2">
                Creative Technologist
              </p>
              <h3 className="text-3xl font-display font-bold text-foreground">
                {personalInfo.name}
              </h3>
            </div>
          </motion.div>

          {/* Card 2: Bio Text (Spans 2 cols, 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="md:col-span-2 rounded-3xl border border-foreground/10 bg-card/60 backdrop-blur-md p-8 md:p-12 shadow-lg flex flex-col justify-center"
          >
            <div className="space-y-6 text-foreground/80 leading-relaxed text-lg">
              <p>
                I'm <span className="text-foreground font-bold">Karthik Lal</span>, an <span className="text-foreground font-bold">IT Manager</span> and <span className="text-foreground font-bold">Full Stack Developer</span> with <span className="text-foreground font-bold">7.2+ years</span> of experience spanning <span className="text-foreground font-bold">cybersecurity</span>, <span className="text-foreground font-bold">Linux</span>, and <span className="text-foreground font-bold">web architecture</span>. I currently manage IT infrastructure for <span className="text-foreground font-bold">IHCL</span> in Lakshadweep, ensuring secure, high-performance connectivity.
              </p>
              <p>
                I specialize in bridging the gap between <span className="text-primary font-semibold">robust backend systems</span> and <span className="text-primary font-semibold">beautiful, user-centric frontend experiences</span>. From building browser extensions to complex asset management platforms, I enjoy taking projects from absolute concept to scalable deployment.
              </p>
            </div>
            
            {/* Action Buttons inside Bio Card */}
            <div className="flex flex-wrap gap-4 pt-8 mt-auto">
              <AnimatedButton href="/contact" variant="primary" icon={<ArrowUpRight className="h-4 w-4" />}>
                Let's Work Together
              </AnimatedButton>
              <AnimatedButton
                href="https://drive.google.com/uc?export=download&id=1y1PklhkLbM9iFLGCOP4dFPj6DzDIzd7u"
                variant="outline"
                className="bg-background/50"
                icon={<Download className="h-4 w-4" />}
              >
                Download CV
              </AnimatedButton>
            </div>
          </motion.div>

          {/* Card 3: Experience Stats (Spans 1 col, 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="md:col-span-1 rounded-3xl border border-foreground/10 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-md p-8 shadow-lg flex flex-col items-center justify-center text-center group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />
            
            <Briefcase className="w-10 h-10 text-primary mb-4" />
            <h4 className="text-5xl font-display font-bold text-foreground mb-2">7.2+</h4>
            <p className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">Years Experience</p>
          </motion.div>

          {/* Card 4: Location (Spans 1 col, 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="md:col-span-1 rounded-3xl border border-foreground/10 bg-card/60 backdrop-blur-md p-8 shadow-lg flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
            {/* Minimal Map/Globe styling elements */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-foreground via-transparent to-transparent bg-[length:20px_20px]" style={{ backgroundImage: 'radial-gradient(circle at center, currentColor 1px, transparent 1px)' }} />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-background border border-foreground/10 flex items-center justify-center mb-4 shadow-xl">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-1">Lakshadweep</h4>
              <p className="text-sm text-muted-foreground">India</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
