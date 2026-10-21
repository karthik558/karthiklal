"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import { ArrowDownRight, ArrowUpRight, Download, Facebook, Github, Instagram, Linkedin, Mail } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { XIcon } from "@/components/ui/icons"
import { SOCIALS_DATA } from "@/lib/static-data"

const iconMap = { Github, Linkedin, Mail, Twitter: XIcon, Instagram, Facebook }

export default function HeroSectionStatic() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 35,
    damping: 20,
    mass: 1.2,
    restDelta: 0.0001,
    restSpeed: 0.0001,
  })
  const orbitRotate = useTransform(smoothProgress, [0, 1], [-18, 48])
  // Use scroll position so retracing the scroll always retraces the same orbit.
  const starX = useTransform(smoothProgress, value => `${50 + 50 * Math.cos((-180 + value * 120) * Math.PI / 180)}%`)
  const starY = useTransform(smoothProgress, value => `${50 + 50 * Math.sin((-180 + value * 120) * Math.PI / 180)}%`)
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const portraitY = useTransform(smoothProgress, [0, 1], [0, 65])
  const socials = [...SOCIALS_DATA.socials].filter(s => s.active).sort((a, b) => a.priority - b.priority)

  return (
    <section ref={ref} id="home" className="kinetic-hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="section-container relative z-10">
        <div className="hero-composition">
          <div className="hero-copy">
            <motion.div className="hero-title-block" style={{ y: reduced ? 0 : titleY }}>
              <p className="hero-intro">IT manager. Ethical hacker. Builder.</p>
              <h1 className="hero-name" aria-label="Karthik Lal">
                <span className="hero-word" aria-hidden="true"><span>KARTHIK</span></span>
                <span className="hero-word hero-name-outline" aria-hidden="true"><span>LAL<span className="hero-period" /></span></span>
              </h1>
            </motion.div>
            <p className="hero-description">Secure systems.<br /><span>Thoughtful digital experiences.</span><br />I bring both worlds together.</p>
            <div className="hero-actions">
              <AnimatedButton href="/#portfolio" variant="primary">EXPLORE WORK <ArrowUpRight className="h-4 w-4" /></AnimatedButton>
              <AnimatedButton href="https://drive.google.com/file/d/1y1PklhkLbM9iFLGCOP4dFPj6DzDIzd7u/view?usp=drive_link" target="_blank" rel="noopener noreferrer" variant="outline">DOWNLOAD CV <Download className="h-4 w-4" /></AnimatedButton>
            </div>
          </div>
          <div className="hero-art">
            <motion.div className="hero-orbit-track" style={{ y: reduced ? 0 : portraitY }} aria-hidden="true">
              <motion.div className="hero-orbit" style={{ rotate: reduced ? -18 : orbitRotate }} />
            </motion.div>
            <motion.div className="hero-orbit-track hero-orbit-star-track" style={{ y: reduced ? 0 : portraitY }} aria-hidden="true">
              <motion.div className="hero-orbit-star-plane" style={{ rotate: reduced ? -18 : orbitRotate }}>
                <motion.div className="hero-orbit-star-position" style={{ x: reduced ? "0%" : starX, y: reduced ? "50%" : starY }}>
                  <span className="hero-orbit-star">
                    <svg viewBox="0 0 40 40" fill="currentColor"><path d="M20 0 24 14 36 4 26 16 40 20 26 24 36 36 24 26 20 40 16 26 4 36 14 24 0 20 14 16 4 4 16 14Z" /></svg>
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div className="hero-portrait" style={{ y: reduced ? 0 : portraitY }}>
              <Image src="/user/hero.jpg" alt="Karthik Lal, IT manager and ethical hacker" fill priority sizes="(min-width: 1024px) 38vw, (min-width: 640px) 55vw, 100vw" className="object-cover" />
              <div className="hero-portrait-shade" />
            </motion.div>
            <div className="hero-note"><span className="hero-note-icon">✳</span><span>BUILT WITH CURIOSITY.<br />BACKED BY EXPERIENCE.</span></div>
            <div className="hero-experience"><strong>2019</strong><span>BUILDING & SECURING<br />SINCE</span></div>
          </div>
        </div>
        <div className="hero-baseline">
          <a href="#about" className="hero-scroll">SCROLL TO DISCOVER <ArrowDownRight className="h-5 w-5" /></a>
          <span className="hidden lg:block">CYBERSECURITY / INFRASTRUCTURE / DEVELOPMENT</span>
          <div className="flex gap-2">{socials.map(social => {
            const Icon = iconMap[social.icon as keyof typeof iconMap]
            return Icon ? <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name} className="hero-social"><Icon className="h-4 w-4" /></a> : null
          })}</div>
        </div>
      </div>
    </section>
  )
}
