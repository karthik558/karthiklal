"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import Image from "next/image"
import { ArrowDownRight, ArrowUpRight, Download, Facebook, Github, Instagram, Linkedin } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { SOCIALS_DATA } from "@/lib/static-data"

const icons = { Github, Linkedin, Instagram, Facebook }

export default function HeroSectionStatic() {
  const heroRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const orbitProgress = useSpring(scrollYProgress, { stiffness: 35, damping: 22, mass: 1.1 })
  // The ellipse and marker share coordinates, so resizing never detaches the star.
  const starX = useTransform(orbitProgress, value => 250 + 245 * Math.cos((145 + value * 150) * Math.PI / 180))
  const starY = useTransform(orbitProgress, value => 300 + 270 * Math.sin((145 + value * 150) * Math.PI / 180))

  return (
    <section ref={heroRef} id="home" className="studio-hero">
      <div className="section-container">
        <div className="studio-hero-grid">
          <div className="studio-copy">
            <p className="studio-label">IT MANAGER · ETHICAL HACKER · BUILDER</p>
            <h1>KARTHIK<br /><span>LAL</span></h1>
            <div className="studio-statement"><span aria-hidden="true">↳</span><p>I build things that <em>work beautifully.</em><br />And systems you can trust.</p></div>
            <div className="hero-actions">
              <AnimatedButton href="/#portfolio" variant="primary">EXPLORE WORK <ArrowUpRight className="h-4 w-4" /></AnimatedButton>
              <AnimatedButton href="https://drive.google.com/file/d/1y1PklhkLbM9iFLGCOP4dFPj6DzDIzd7u/view?usp=drive_link" target="_blank" rel="noopener noreferrer" variant="outline">DOWNLOAD CV <Download className="h-4 w-4" /></AnimatedButton>
            </div>
            <div className="studio-disciplines"><a href="#services">01 / SECURITY</a><a href="#portfolio">02 / DEVELOPMENT</a><a href="#portfolio-gallery">03 / DESIGN</a></div>
          </div>
          <div className="studio-portrait-wrap">
            <svg className="studio-orbit" viewBox="0 0 500 600" preserveAspectRatio="none" aria-hidden="true"><ellipse cx="250" cy="300" rx="245" ry="270" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" /></svg>
            <figure className="studio-portrait">
              <Image src="/user/hero.jpg" alt="Karthik Lal, IT manager and ethical hacker" fill priority sizes="(min-width: 900px) 40vw, 100vw" className="object-cover" />
            </figure>
            <svg className="studio-orbit-marker" viewBox="0 0 500 600" preserveAspectRatio="none" aria-hidden="true">
              <motion.g style={{ x: reducedMotion ? 49.3 : starX, y: reducedMotion ? 454.9 : starY }}>
                <path d="M0-28V28M-28 0H28M-20-20L20 20M-20 20L20-20M-11-26L11 26M-26-11L26 11M-26 11L26-11M-11 26L11-26" fill="none" stroke="currentColor" strokeWidth="2.5" />
              </motion.g>
            </svg>
          </div>
        </div>
        <div className="studio-baseline">
          <a href="#about" className="studio-scroll-link">
            SCROLL TO EXPLORE <ArrowDownRight size={15} className="studio-scroll-arrow" />
          </a>
          <span className="studio-baseline-badge">BUILDING & SECURING SINCE 2019</span>
          <div className="studio-social-group">
            {SOCIALS_DATA.socials.filter(s => s.active).sort((a,b) => a.priority-b.priority).map(s => {
              const Icon = icons[s.icon as keyof typeof icons];
              return Icon ? (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="studio-social-link"
                >
                  <Icon size={17} />
                </a>
              ) : null
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
