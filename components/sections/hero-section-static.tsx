"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Download, ExternalLink, Github, Linkedin, Mail, Twitter, Share2, Instagram, Facebook, Youtube, MessageCircle, Globe, Palette, Heart } from "lucide-react"
import { XIcon } from "@/components/ui/icons"
import { PROFILE_DATA, SOCIALS_DATA } from "@/lib/static-data"

// Icon mapping for dynamic icon rendering
const iconMap = {
  Github,
  Linkedin,
  Mail,
  Twitter: XIcon,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Globe,
  Palette,
}

interface Social {
  id: number
  name: string
  icon: keyof typeof iconMap
  url: string
  username: string
  active: boolean
  priority: number
}
import SmoothLink from "@/components/smooth-link"
import { AnimatedButton } from "@/components/ui/animated-button"

interface PersonalInfo {
  name: string
  title: string
  bio?: string
}

interface ProfileData {
  personalInfo: PersonalInfo
}

export default function HeroSectionStatic() {
  const { scrollYProgress } = useScroll()
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const profileData: PersonalInfo = PROFILE_DATA.personalInfo
  const socials: Social[] = (SOCIALS_DATA.socials as Social[])
    .filter((social: Social) => social.active)
    .sort((a: Social, b: Social) => a.priority - b.priority)
  
  // State for the social hideaway dynamic island (removed)

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-background pt-24 pb-16">
      <div className="absolute inset-0 bg-[radial-gradient(1100px_circle_at_20%_20%,hsl(var(--accent)/0.08),transparent_65%),radial-gradient(900px_circle_at_80%_20%,hsl(var(--primary)/0.12),transparent_65%)]" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      
      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <motion.div
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* The extremely clean, typography-driven intro (Subtitles Removed) */}
            <div className="space-y-4 mb-10">
              <motion.h2
                className="text-xs sm:text-sm md:text-base font-semibold text-muted-foreground tracking-[0.4em] uppercase ml-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Hello, I am
              </motion.h2>
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-display font-extrabold tracking-[-0.04em] leading-[0.9]">
                <span className="block text-foreground drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                  {profileData?.name || "Karthik Lal"}
                </span>
              </h1>
            </div>

            {/* Actions + Dynamic Social Hideaway */}
            <motion.div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <AnimatedButton
                href="/#portfolio-gallery"
                variant="primary"
                className="h-14 px-8 text-base rounded-full shadow-lg shadow-primary/20"
              >
                View My Work <ExternalLink className="ml-2 h-4 w-4" />
              </AnimatedButton>

              <AnimatedButton
                href="https://drive.google.com/uc?export=download&id=1y1PklhkLbM9iFLGCOP4dFPj6DzDIzd7u"
                variant="outline"
                className="h-14 px-8 text-base rounded-full border-foreground/10 hover:bg-foreground/5 backdrop-blur-md"
              >
                Download CV <Download className="ml-2 h-4 w-4" />
              </AnimatedButton>

              {/* Social Links Pill Dock */}
              <motion.div 
                className="flex items-center p-1.5 rounded-full bg-background/50 border border-foreground/10 backdrop-blur-lg shadow-xl ml-0 lg:ml-2 mt-4 lg:mt-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 25 }}
              >
                {socials.map((social) => {
                  const IconComponent = iconMap[social.icon]
                  if (!IconComponent) return null

                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target={social.name !== 'Email' ? "_blank" : undefined}
                      rel={social.name !== 'Email' ? "noopener noreferrer" : undefined}
                      className="relative group flex items-center justify-center w-12 h-12 rounded-full text-muted-foreground transition-all duration-300 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      title={social.name}
                      aria-label={social.name}
                    >
                      {/* Smooth hover background expansion */}
                      <span className="absolute inset-0 rounded-full bg-primary/10 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out" />
                      {/* Icon scale on hover */}
                      <IconComponent className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </a>
                  )
                })}
              </motion.div>

            </motion.div>
          </motion.div>

          {/* Hero Image Side */}
          <motion.div
            className="lg:col-span-5 relative hidden lg:flex justify-end items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ y }}
          >
            <div className="relative w-[480px] h-[600px]">
              <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 blur-3xl opacity-70" />
              <div className="absolute inset-0 rounded-[3rem] border border-foreground/10 bg-background/40 backdrop-blur-md" />

              <div className="absolute inset-0 m-4 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-background/50 backdrop-blur-md group">
                <Image
                  src="/user/hero.jpg"
                  alt="Karthik Lal"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-50" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <SmoothLink href="#about" className="flex flex-col items-center gap-2 group">
          <span className="text-[10px] font-semibold tracking-[0.35em] text-muted-foreground uppercase group-hover:text-primary transition-colors">
            Scroll
          </span>
          <div className="w-[1px] h-12 bg-muted-foreground/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-primary animate-scroll-down" />
          </div>
        </SmoothLink>
      </motion.div>
    </section>
  )
}
