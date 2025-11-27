"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Badge } from "@/components/ui/badge"
import { Download, ExternalLink, ArrowUpRight, Mail, MapPin, User, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

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
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0])

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

  return (
    <section id="about" ref={containerRef} className="py-24 md:py-32 relative overflow-hidden bg-background/50">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image Side - GSAP Style Reveal */}
          <div className="relative group order-2 lg:order-1">
            <motion.div 
              style={{ y }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
              className="relative z-10"
            >
              <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4] shadow-2xl shadow-[#74261a]/10 border border-white/10 bg-muted">
                <Image 
                  src="/user/about.jpg" 
                  alt={profileData.personalInfo.name}
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                  priority
                />
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#74261a]/20 to-transparent opacity-40 mix-blend-overlay" />
              </div>
            </motion.div>
            
            {/* Decorative Elements */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
              className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#74261a]/10 rounded-full blur-3xl -z-10" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              viewport={{ once: true }}
              className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10" 
            />
          </div>

          {/* Content Side */}
          <div className="space-y-8 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary rounded-full text-sm font-medium">
                About Me
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                My <span className="text-gradient">Journey</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6 text-muted-foreground leading-relaxed"
            >
              <p>{profileData.personalInfo.bio}</p>
              <p>{profileData.personalInfo.professionalSummary}</p>
            </motion.div>

            {/* Info Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2"
            >
              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Location</p>
                  <p className="font-medium">{profileData.personalInfo.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Email</p>
                  <a href={`mailto:${profileData.personalInfo.email}`} className="font-medium hover:text-primary transition-colors truncate max-w-[180px] block">
                    {profileData.personalInfo.email}
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <AnimatedButton href="/contact" variant="primary" icon={<ArrowUpRight className="h-4 w-4" />}>
                Let's Work Together
              </AnimatedButton>
              
              <AnimatedButton 
                href="https://drive.google.com/uc?export=download&id=1y1PklhkLbM9iFLGCOP4dFPj6DzDIzd7u" 
                variant="outline" 
                icon={<Download className="h-4 w-4" />}
              >
                Download CV
              </AnimatedButton>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

