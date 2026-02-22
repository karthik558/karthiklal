"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Download, ExternalLink, Github, Linkedin, Mail, Twitter } from "lucide-react"
import SmoothLink from "@/components/smooth-link"
import { AnimatedButton } from "@/components/ui/animated-button"

interface PersonalInfo {
  name: string
  title: string
  bio: string
}

interface ProfileData {
  personalInfo: PersonalInfo
}

export default function HeroSectionStatic() {
  const { scrollYProgress } = useScroll()
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const [profileData, setProfileData] = useState<PersonalInfo | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/data/profile.json')
        const data: ProfileData = await response.json()
        setProfileData(data.personalInfo)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    }

    fetchProfile()
  }, [])

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-background pt-20 pb-10">
      {/* Awesome Background Effects */}
      <div 
        className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.03]" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z' fill='%239C92AC' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` 
        }} 
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-[100px] opacity-40 animate-pulse-soft" />
      </div>
      <div className="absolute top-1/4 left-1/4 w-[15rem] h-[15rem] bg-orange-500/5 rounded-full blur-[80px] opacity-30 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[20rem] h-[20rem] bg-red-500/5 rounded-full blur-[100px] opacity-30 mix-blend-screen pointer-events-none" />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div 
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-4">
              
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter">
                <span className="block text-foreground">Hi, I'm</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-primary bg-[length:200%_auto] animate-gradient pb-2">
                  {profileData?.name || "Karthik Lal"}
                </span>
              </h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-muted-foreground max-w-[600px] font-medium leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {profileData?.title || "IT Manager & Full Stack Developer"}
              </motion.p>
              
              <motion.p 
                className="text-base md:text-lg text-muted-foreground/80 max-w-[500px] leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {profileData?.bio || "Crafting secure, scalable, and intuitive digital experiences with a focus on performance and user-centric design."}
              </motion.p>
            </div>

            <motion.div 
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <AnimatedButton href="/#portfolio-gallery" variant="primary" className="h-12 px-8 text-base rounded-full">
                View My Work <ExternalLink className="ml-2 h-4 w-4" />
              </AnimatedButton>

              <AnimatedButton 
                href="https://drive.google.com/uc?export=download&id=1y1PklhkLbM9iFLGCOP4dFPj6DzDIzd7u" 
                variant="outline" 
                className="h-12 px-8 text-base rounded-full border-primary/20 hover:bg-primary/10"
              >
                Download CV <Download className="ml-2 h-4 w-4" />
              </AnimatedButton>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              className="flex items-center gap-5 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {[
                { icon: Github, href: "https://github.com/karthik558" },
                { icon: Linkedin, href: "https://linkedin.com/in/karthiklal" },
                { icon: Twitter, href: "https://x.com/_karthiklal" },
                { icon: Mail, href: "mailto:dev@karthiklal.in" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:scale-110 transform"
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* Image Content */}
          <motion.div 
            className="lg:col-span-5 relative hidden lg:flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ y }}
          >
            <div className="relative w-[450px] h-[550px]">
              {/* Decorative elements behind image */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/10 to-transparent transform rotate-3 scale-105 border border-primary/5 backdrop-blur-sm" />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-bl from-orange-500/10 to-transparent transform -rotate-3 scale-105 border border-orange-500/5 backdrop-blur-sm" />
              
              {/* Main Image Container */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-background/50 backdrop-blur-md group">
                <Image 
                  src="/user/hero.jpg" 
                  alt="Karthik Lal" 
                  fill 
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                  priority 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-40" />
              </div>

              {/* Floating Badges */}
              <motion.div 
                className="absolute -right-8 top-12 bg-background/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    6+
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Years</p>
                    <p className="text-xs text-muted-foreground">Experience</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <SmoothLink href="#about" className="flex flex-col items-center gap-2 group">
          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase group-hover:text-primary transition-colors">Scroll</span>
          <div className="w-[1px] h-12 bg-muted-foreground/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-primary animate-scroll-down" />
          </div>
        </SmoothLink>
      </motion.div>
    </section>
  )
}
