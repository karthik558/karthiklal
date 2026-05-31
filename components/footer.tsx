"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Linkedin, Mail, MapPin, Instagram, Facebook, Youtube, MessageCircle, Globe, Palette, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import SmoothLink from "@/components/smooth-link"
import { XIcon } from "@/components/ui/icons"

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

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [socials, setSocials] = useState<Social[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load socials from JSON
    fetch('/data/socials.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        // Filter active socials and sort by priority
        const activeSocials = data.socials
          .filter((social: Social) => social.active)
          .sort((a: Social, b: Social) => a.priority - b.priority)
        setSocials(activeSocials)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to load socials:', error)
        setLoading(false)
        // Fallback to hardcoded socials
        setSocials([
          {
            id: 1,
            name: "GitHub",
            icon: "Github",
            url: "https://github.com/karthik558",
            username: "@karthik558",
            active: true,
            priority: 1
          },
          {
            id: 2,
            name: "LinkedIn",
            icon: "Linkedin",
            url: "https://linkedin.com/in/karthiklal",
            username: "Karthik Lal",
            active: true,
            priority: 2
          },
          {
            id: 3,
            name: "Email",
            icon: "Mail",
            url: "mailto:contact@karthiklal.in",
            username: "contact@karthiklal.in",
            active: true,
            priority: 3
          }
        ])
      })
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20
      }
    }
  }

  return (
    <div className="px-4 md:px-8 pb-4 md:pb-8 pt-20">
      <motion.footer 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="relative bg-secondary/20 backdrop-blur-3xl border border-white/5 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-2xl"
      >
        {/* Ambient background glow within the card */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />

        <div className="relative z-10 px-6 py-12 md:px-12 md:py-16">
          {/* Top Section: Logo & Status */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border/40 pb-10">
            <motion.div variants={item}>
              <Link href="/" className="inline-block relative group">
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Image
                  src="/hero_name.svg"
                  alt="Karthik Lal"
                  width={160}
                  height={45}
                  className="h-8 w-auto object-contain relative z-10 opacity-90 group-hover:opacity-100 transition-opacity dark:invert"
                  priority
                />
              </Link>
            </motion.div>
            
            <motion.div variants={item} className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-background border border-border/50 text-foreground shadow-sm">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              Available for new opportunities
            </motion.div>
          </div>

          {/* Middle Section: Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12">
            <motion.div variants={item} className="flex flex-col space-y-5">
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Navigation</h4>
              <nav className="flex flex-col space-y-3 text-sm font-medium">
                {[
                  { name: "About", href: "/#about", isSmooth: true },
                  { name: "Services", href: "/#services", isSmooth: true },
                  { name: "Portfolio", href: "/#portfolio", isSmooth: true },
                  { name: "Blog", href: "/blog", isSmooth: false },
                  { name: "Contact", href: "/contact", isSmooth: true },
                ].map((link) => {
                  const LinkComponent = link.isSmooth ? SmoothLink : Link;
                  return (
                    <LinkComponent 
                      key={link.name} 
                      href={link.href} 
                      className="hover:text-primary transition-colors w-fit relative group"
                    >
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                    </LinkComponent>
                  )
                })}
              </nav>
            </motion.div>

            <motion.div variants={item} className="flex flex-col space-y-5">
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Legal</h4>
              <nav className="flex flex-col space-y-3 text-sm font-medium">
                <Link href="/privacy-policy" className="hover:text-primary transition-colors w-fit group relative">
                  Privacy Policy
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link href="/terms" className="hover:text-primary transition-colors w-fit group relative">
                  Terms of Service
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link href="/cookies" className="hover:text-primary transition-colors w-fit group relative">
                  Cookies Policy
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              </nav>
            </motion.div>

            <motion.div variants={item} className="flex flex-col space-y-5">
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Connect</h4>
              <div className="flex flex-wrap gap-3">
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="w-11 h-11 rounded-[1rem] bg-background animate-pulse" />
                  ))
                ) : (
                  socials.map((social) => {
                    const IconComponent = iconMap[social.icon]
                    if (!IconComponent) return null
                    
                    return (
                      <motion.div
                        key={social.id}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          href={social.url}
                          target={social.name !== 'Email' ? "_blank" : undefined}
                          rel={social.name !== 'Email' ? "noopener noreferrer" : undefined}
                          className="w-11 h-11 rounded-[1rem] bg-background border border-border/30 hover:bg-primary hover:border-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 shadow-sm"
                          title={social.name}
                        >
                          <IconComponent className="h-[18px] w-[18px]" />
                          <span className="sr-only">{social.name}</span>
                        </Link>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </motion.div>
          </div>

          {/* Bottom Section: Copyright */}
          <motion.div variants={item} className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-medium text-muted-foreground">
              © {currentYear} Karthik Lal.
            </p>
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/50">
              All rights reserved
            </p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}
