"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import {
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

interface PersonalInfo {
  name: string
  title: string
}

export default function HeroSectionStatic() {
  const { scrollY } = useScroll()
  const profileData: PersonalInfo = PROFILE_DATA.personalInfo
  const socials: Social[] = (SOCIALS_DATA.socials as Social[])
    .filter((social: Social) => social.active)
    .sort((a: Social, b: Social) => a.priority - b.priority)

  const contentY = useTransform(scrollY, [0, 420], ["0px", "-72px"])
  const imageY = useTransform(scrollY, [0, 480], ["0px", "96px"])
  const imageScale = useTransform(scrollY, [0, 480], [1.04, 1])
  const wordY = useTransform(scrollY, [0, 520], ["0px", "-150px"])
  const heroOpacity = useTransform(scrollY, [0, 360], [1, 0.55])
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 140], [1, 0])

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden bg-background pt-24 pb-16">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{ y: imageY, scale: imageScale }}
      >
        <div className="absolute inset-0 lg:left-auto lg:right-0 lg:w-[58%] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_100%)]">
          <Image
            src="/user/hero.jpg"
            alt=""
            fill
            className="object-cover object-center opacity-20 saturate-[0.82] lg:opacity-95"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-background/70 to-background lg:bg-gradient-to-t lg:from-background/90 lg:via-transparent lg:to-background/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/18" />
        </div>
      </motion.div>

      <div className="absolute inset-0 z-0 bg-[radial-gradient(900px_circle_at_18%_20%,hsl(var(--primary)/0.12),transparent_58%),radial-gradient(700px_circle_at_84%_18%,hsl(var(--accent)/0.10),transparent_60%)]" />
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.12] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_76%,transparent)]" />
      <div className="absolute inset-0 z-0 bg-noise opacity-20 pointer-events-none" />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{ y: wordY, opacity: heroOpacity }}
      >
        <motion.div
          className="absolute bottom-[18%] right-[12%] hidden h-px w-80 bg-gradient-to-r from-transparent via-accent/35 to-transparent md:block"
          animate={{ x: [42, -30, 42], opacity: [0.2, 0.7, 0.2] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div
        className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6"
        style={{ y: contentY, opacity: heroOpacity }}
      >
        <div className="max-w-4xl text-center lg:max-w-3xl lg:text-left">
          <motion.p
            className="mb-5 text-sm font-semibold text-primary md:text-base"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            Hello, I&apos;m
          </motion.p>

          <motion.h1
            className="font-display text-6xl font-extrabold leading-[0.9] text-foreground sm:text-7xl md:text-8xl lg:text-[8rem]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.7, ease: "easeOut" }}
          >
            {profileData?.name || "Karthik Lal"}
          </motion.h1>

          <motion.div
            className="mt-6 flex flex-col items-center gap-3 text-base font-medium text-muted-foreground sm:text-lg lg:flex-row lg:items-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.6, ease: "easeOut" }}
          >
            <span className="hidden h-px w-12 bg-primary/55 lg:block" />
            <span>IT Manager & Full Stack Developer</span>
          </motion.div>

          <motion.div
            className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.55, ease: "easeOut" }}
          >
            <AnimatedButton
              href="/#portfolio-gallery"
              variant="primary"
              className="h-14 px-8 text-base shadow-lg shadow-primary/20"
            >
              View My Work <ExternalLink className="ml-2 h-4 w-4" />
            </AnimatedButton>

            <AnimatedButton
              href="https://drive.google.com/uc?export=download&id=1y1PklhkLbM9iFLGCOP4dFPj6DzDIzd7u"
              variant="outline"
              className="h-14 px-8 text-base border-foreground/10 bg-background/35 backdrop-blur-md hover:bg-background/55"
            >
              Download CV <Download className="ml-2 h-4 w-4" />
            </AnimatedButton>
          </motion.div>

          <motion.div
            className="mt-7 flex items-center justify-center gap-2 lg:justify-start"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex items-center rounded-full border border-foreground/10 bg-background/45 p-1.5 shadow-xl backdrop-blur-xl">
              {socials.map((social) => {
                const IconComponent = iconMap[social.icon]
                if (!IconComponent) return null

                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target={social.name !== "Email" ? "_blank" : undefined}
                    rel={social.name !== "Email" ? "noopener noreferrer" : undefined}
                    className="group relative flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    title={social.name}
                    aria-label={social.name}
                  >
                    <span className="absolute inset-0 rounded-full bg-primary/10 opacity-0 scale-75 transition duration-300 group-hover:scale-100 group-hover:opacity-100" />
                    <IconComponent className="relative z-10 h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110" />
                  </a>
                )
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2"
      >
        <a href="#about" className="group flex flex-col items-center gap-2">
          <span className="text-[10px] font-semibold uppercase text-muted-foreground transition-colors group-hover:text-primary">
            Scroll
          </span>
          <span className="relative h-12 w-px overflow-hidden bg-muted-foreground/30">
            <span className="absolute left-0 top-0 h-full w-full bg-primary animate-scroll-down" />
          </span>
        </a>
      </motion.div>
    </section>
  )
}
