"use client"

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
        const response = await fetch("/data/profile.json")
        const data: ProfileData = await response.json()
        setProfileData(data.personalInfo)
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      }
    }

    fetchProfile()
  }, [])

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-background pt-24 pb-16">
      <div className="absolute inset-0 bg-[radial-gradient(1100px_circle_at_20%_20%,hsl(var(--accent)/0.08),transparent_65%),radial-gradient(900px_circle_at_80%_20%,hsl(var(--primary)/0.12),transparent_65%)]" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-5 md:space-y-7">
              <div className="space-y-2">
                <motion.h2
                  className="text-xs sm:text-sm md:text-base font-semibold text-muted-foreground tracking-[0.4em] uppercase"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Hello, I am
                </motion.h2>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-[-0.04em] leading-[0.95]">
                  <span className="block text-foreground drop-shadow-sm">
                    {profileData?.name || "Karthik Lal"}
                  </span>
                </h1>
              </div>

              <motion.div
                className="flex flex-col space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground/80 tracking-tight">
                  {profileData?.title || "IT Manager & Full Stack Developer"}
                </p>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-[560px] leading-relaxed font-light">
                  {profileData?.bio || "Crafting secure, scalable, and intuitive digital experiences with a focus on performance and user-centric design."}
                </p>
              </motion.div>
            </div>

            <motion.div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <AnimatedButton
                href="/#portfolio-gallery"
                variant="primary"
                className="h-12 px-6 text-base rounded-full shadow-lg shadow-primary/20"
              >
                View My Work <ExternalLink className="ml-2 h-4 w-4" />
              </AnimatedButton>

              <AnimatedButton
                href="https://drive.google.com/uc?export=download&id=1y1PklhkLbM9iFLGCOP4dFPj6DzDIzd7u"
                variant="outline"
                className="h-12 px-6 text-base rounded-full border-foreground/10 hover:bg-foreground/5 backdrop-blur-md"
              >
                Download CV <Download className="ml-2 h-4 w-4" />
              </AnimatedButton>
            </motion.div>

            <motion.div
              className="flex items-center gap-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {[
                { icon: Github, href: "https://github.com/karthik558" },
                { icon: Linkedin, href: "https://linkedin.com/in/karthiklal" },
                { icon: Twitter, href: "https://x.com/_karthiklal" },
                { icon: Mail, href: "mailto:dev@karthiklal.in" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-foreground/5 border border-foreground/10 text-muted-foreground hover:text-foreground hover:bg-foreground/10 hover:scale-110 transition-all duration-300 transform shadow-sm"
                >
                  <social.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-5 relative hidden lg:flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ y }}
          >
            <div className="relative w-[440px] h-[560px]">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 blur-2xl opacity-70" />
              <div className="absolute inset-0 rounded-[2.5rem] border border-foreground/10 bg-background/40 backdrop-blur-md" />

              <div className="absolute inset-0 m-3 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-background/50 backdrop-blur-md group">
                <Image
                  src="/user/hero.jpg"
                  alt="Karthik Lal"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-70" />
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
