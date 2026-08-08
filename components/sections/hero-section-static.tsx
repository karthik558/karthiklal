"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import {
  ArrowDownRight,
  Download,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react"

import { AnimatedButton } from "@/components/ui/animated-button"
import { TextScramble } from "@/components/ui/text-scramble"
import { XIcon } from "@/components/ui/icons"
import { SOCIALS_DATA } from "@/lib/static-data"
import ScrollVideo from "@/components/scroll-video"

const iconMap = {
  Github,
  Linkedin,
  Mail,
  Twitter: XIcon,
  Instagram,
  Facebook,
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

  const socials: Social[] = (SOCIALS_DATA.socials as Social[])
    .filter((social: Social) => social.active)
    .sort((a: Social, b: Social) => a.priority - b.priority)

  const contentY = useTransform(scrollY, [0, 500], ["0px", "-60px"])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4])

  return (
    <section id="home" className="relative flex min-h-[100svh] flex-col justify-center items-center overflow-hidden bg-transparent pt-28 pb-20 md:pt-36 md:pb-24">
      {/* Background Video - Hero Section Only */}
      <ScrollVideo />

      {/* Hero Section Gradient Overlay for optimal readability */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background z-[1]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl px-4 md:px-6 my-auto">
        <motion.div style={{ y: contentY, opacity: heroOpacity }} className="flex flex-col items-center text-center">
          
          {/* Main Title - KARTHIK LAL (Single Line, KARTHIK Solid, LAL Stroke) */}
          <div className="py-4 text-center w-full select-none overflow-hidden">
            <h1 className="flex flex-nowrap items-center justify-center whitespace-nowrap font-display text-[clamp(2.25rem,8.5vw,11.5rem)] font-black uppercase tracking-tighter leading-none">
              {/* KARTHIK - Solid Bold */}
              <span className="flex text-foreground">
                {"KARTHIK".split("").map((char, index) => (
                  <span
                    key={index}
                    className="inline-block transition-transform duration-300 hover:scale-105 hover:-translate-y-2"
                  >
                    {char}
                  </span>
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
                  <span
                    key={index}
                    className="inline-block transition-transform duration-300 hover:scale-105 hover:-translate-y-2"
                  >
                    {char}
                  </span>
                ))}
              </span>
            </h1>
          </div>

          {/* Subtitle Statement & Tech Domain Pills - Centered */}
          <div className="mt-6 sm:mt-10 flex flex-col items-center text-center max-w-4xl">
            <div className="flex flex-col items-center text-center">
              <p className="max-w-sm px-1 font-sans text-base font-light leading-relaxed text-muted-foreground sm:hidden">
                Specialized in <strong className="font-semibold text-foreground underline decoration-foreground/30 underline-offset-4">Cybersecurity</strong>, <strong className="font-semibold text-foreground underline decoration-foreground/30 underline-offset-4">IT Infrastructure</strong>, and high-performance <strong className="font-semibold text-foreground underline decoration-foreground/30 underline-offset-4">Full Stack Development</strong>, with enterprise experience since 2019.
              </p>
              <p className="hidden max-w-3xl font-sans text-xl font-light leading-relaxed text-muted-foreground sm:block md:text-2xl">
                Specialized in <strong className="font-semibold text-foreground underline decoration-foreground/30 underline-offset-4">Cybersecurity</strong>, <strong className="font-semibold text-foreground underline decoration-foreground/30 underline-offset-4">IT Infrastructure</strong>, and high-performance <strong className="font-semibold text-foreground underline decoration-foreground/30 underline-offset-4">Full Stack Development</strong>, with enterprise experience since 2019.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2 font-mono text-[10px] sm:mt-6 sm:text-xs">
                {["IT MANAGER", "CYBERSECURITY SPECIALIST", "SECURE SYSTEMS"].map((badge, idx) => (
                  <span key={idx} className="border border-border bg-card px-3 py-1 sm:px-3.5 sm:py-1.5 text-foreground font-medium uppercase tracking-wider">
                    <TextScramble text={badge} trigger="both" speed={30} />
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons & Social Links - Centered */}
            <div className="mt-8 sm:mt-10 flex flex-col items-center gap-6">
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
                      className="flex h-10 w-10 items-center justify-center border border-border bg-card text-foreground transition-all duration-200 hover:bg-foreground hover:text-background sm:h-11 sm:w-11"
                      title={social.name}
                      aria-label={social.name}
                    >
                      <IconComponent className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hero Bottom Bar */}
      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6 pt-4 border-t border-border/80 flex items-center justify-between font-mono text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">
        <span>00 // INTRODUCTION</span>
        <Link href="/projects/1" className="flex items-center gap-2 text-foreground transition-colors hover:underline sm:hidden">
          <span>FEATURED // GITHUB BURNER</span>
          <ArrowDownRight className="h-3.5 w-3.5 -rotate-90" />
        </Link>
        <a href="#about" className="hidden items-center gap-2 hover:text-foreground transition-colors sm:flex">
          <span>SCROLL DOWN</span>
          <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-bounce" />
        </a>
      </div>
    </section>
  )
}
