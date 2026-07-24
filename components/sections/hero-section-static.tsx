"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  ArrowDownRight,
  Download,
  ExternalLink,
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Palette,
  Twitter,
  Youtube,
} from "lucide-react"

import { AnimatedButton } from "@/components/ui/animated-button"
import { XIcon } from "@/components/ui/icons"
import { PROFILE_DATA, SOCIALS_DATA } from "@/lib/static-data"

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

export default function HeroSectionStatic() {
  const { scrollY } = useScroll()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlaying = () => setIsVideoPlaying(true)

    video.addEventListener("playing", handlePlaying)
    video.addEventListener("canplay", handlePlaying)
    video.addEventListener("canplaythrough", handlePlaying)

    if (video.readyState >= 3) {
      setIsVideoPlaying(true)
    }

    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsVideoPlaying(true))
        .catch((err) => {
          console.warn("Autoplay attempt failed/deferred:", err)
        })
    }

    return () => {
      video.removeEventListener("playing", handlePlaying)
      video.removeEventListener("canplay", handlePlaying)
      video.removeEventListener("canplaythrough", handlePlaying)
    }
  }, [])

  const socials: Social[] = (SOCIALS_DATA.socials as Social[])
    .filter((social: Social) => social.active)
    .sort((a: Social, b: Social) => a.priority - b.priority)

  const contentY = useTransform(scrollY, [0, 500], ["0px", "-60px"])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4])

  const nameString = "KARTHIK LAL"
  const letterVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.04,
        duration: 0.8,
        ease: "easeOut" as const,
      },
    }),
  }

  return (
    <section id="home" className="relative flex min-h-[100svh] flex-col justify-center items-center overflow-hidden bg-background pt-28 pb-20 md:pt-36 md:pb-24">
      {/* Black & White Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        {/* Fallback image: visible ONLY until video starts playing (on slow internet) */}
        <div
          className={`absolute inset-0 bg-[url('/user/hero.jpg')] bg-cover bg-center grayscale transition-opacity duration-700 ${
            isVideoPlaying ? "opacity-0" : "opacity-25 dark:opacity-30"
          }`}
        />
        {/* Forced video playback */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/user/hero.jpg"
          onPlaying={() => setIsVideoPlaying(true)}
          onCanPlay={() => setIsVideoPlaying(true)}
          className={`h-full w-full object-cover grayscale contrast-150 transition-opacity duration-700 motion-reduce:hidden ${
            isVideoPlaying ? "opacity-25 dark:opacity-30" : "opacity-0"
          }`}
        >
          <source src="/user/hero_video.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background z-[1]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl px-4 md:px-6 my-auto">
        <motion.div style={{ y: contentY, opacity: heroOpacity }} className="flex flex-col items-center text-center">
          
          {/* Main Title - KARTHIK LAL (Single Line, KARTHIK Solid, LAL Stroke) */}
          <div className="py-4 text-center w-full select-none overflow-hidden">
            <h1 className="flex flex-nowrap items-center justify-center whitespace-nowrap font-display text-[9vw] sm:text-7xl md:text-9xl lg:text-[11.5rem] font-black uppercase tracking-tighter leading-none">
              {/* KARTHIK - Solid Bold */}
              <span className="flex text-foreground">
                {"KARTHIK".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    custom={index}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block transition-transform duration-300 hover:scale-105 hover:-translate-y-2"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>

              {/* Space */}
              <span className="inline-block w-[0.25em]" />

              {/* LAL - Crisp Visible Stroke Outline */}
              <span
                className="flex transition-all duration-300 hover:!text-foreground"
                style={{
                  WebkitTextStroke: "2px hsl(var(--foreground))",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                {"LAL".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    custom={index + 7}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block transition-transform duration-300 hover:scale-105 hover:-translate-y-2"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </h1>
          </div>

          {/* Subtitle Statement & Tech Domain Pills - Centered */}
          <div className="mt-6 sm:mt-10 flex flex-col items-center text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col items-center text-center"
            >
              <p className="font-sans text-base font-light leading-relaxed text-muted-foreground sm:text-xl md:text-2xl max-w-3xl">
                Specialized in <strong className="font-semibold text-foreground underline decoration-foreground/30 underline-offset-4">Cybersecurity</strong>, <strong className="font-semibold text-foreground underline decoration-foreground/30 underline-offset-4">IT Infrastructure</strong>, and high-performance <strong className="font-semibold text-foreground underline decoration-foreground/30 underline-offset-4">Full Stack Development</strong>, with enterprise experience since 2019.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2 font-mono text-[10px] sm:text-xs">
                {["IT MANAGER", "CYBERSECURITY SPECIALIST", "SECURE SYSTEMS"].map((badge, idx) => (
                  <span key={idx} className="border border-border bg-card px-3 py-1 sm:px-3.5 sm:py-1.5 text-foreground font-medium uppercase tracking-wider">
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons & Social Links - Centered */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-8 sm:mt-10 flex flex-col items-center gap-6"
            >
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                <AnimatedButton
                  href="/#portfolio"
                  variant="primary"
                  className="h-12 px-6 sm:h-14 sm:px-8"
                >
                  EXPLORE WORK <ArrowDownRight className="ml-2 h-4 w-4" />
                </AnimatedButton>

                <AnimatedButton
                  href="https://drive.google.com/file/d/1y1PklhkLbM9iFLGCOP4dFPj6DzDIzd7u/view?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  className="h-12 px-6 sm:h-14 sm:px-8 border-foreground bg-background/80 backdrop-blur-sm"
                >
                  DOWNLOAD CV <Download className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                </AnimatedButton>
              </div>

              {/* Social Icon Grid - Centered */}
              <div className="flex items-center justify-center gap-2 pt-2">
                {socials.map((social) => {
                  const IconComponent = iconMap[social.icon]
                  if (!IconComponent) return null

                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target={social.name !== "Email" ? "_blank" : undefined}
                      rel={social.name !== "Email" ? "noopener noreferrer" : undefined}
                      className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center border border-border bg-card text-foreground transition-all duration-200 hover:bg-foreground hover:text-background"
                      title={social.name}
                      aria-label={social.name}
                    >
                      <IconComponent className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                    </a>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Hero Bottom Bar */}
      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6 pt-4 border-t border-border/80 flex items-center justify-between font-mono text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">
        <span>00 // INTRODUCTION</span>
        <a href="#about" className="flex items-center gap-2 hover:text-foreground transition-colors">
          <span>SCROLL DOWN</span>
          <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-bounce" />
        </a>
      </div>
    </section>
  )
}
