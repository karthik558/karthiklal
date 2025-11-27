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
    <footer className="bg-background border-t border-border/40 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="container py-16 md:py-20 relative z-10"
      >
        <div className="flex flex-col items-center text-center space-y-10">
          
          {/* Brand Signature */}
          <motion.div variants={item} className="relative group">
            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image
              src="/hero_name.svg"
              alt="Karthik Lal"
              width={200}
              height={60}
              className="h-10 w-auto object-contain dark:invert relative z-10 opacity-90 group-hover:opacity-100 transition-opacity"
              priority
            />
          </motion.div>

          {/* Navigation Links */}
          <motion.nav variants={item} className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground">
            {[
              { name: "About", href: "/#about", isSmooth: true },
              { name: "Services", href: "/#services", isSmooth: true },
              { name: "Portfolio", href: "/#portfolio", isSmooth: true },
              { name: "Blog", href: "/blog", isSmooth: false },
              { name: "Contact", href: "/contact", isSmooth: true },
            ].map((link) => (
              link.isSmooth ? (
                <SmoothLink 
                  key={link.name} 
                  href={link.href} 
                  className="hover:text-primary transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </SmoothLink>
              ) : (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="hover:text-primary transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              )
            ))}
          </motion.nav>

          {/* Social Icons */}
          <motion.div variants={item} className="flex gap-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              ))
            ) : (
              socials.map((social) => {
                const IconComponent = iconMap[social.icon]
                if (!IconComponent) return null
                
                return (
                  <motion.div
                    key={social.id}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={social.url}
                      target={social.name !== 'Email' ? "_blank" : undefined}
                      rel={social.name !== 'Email' ? "noopener noreferrer" : undefined}
                      className="w-10 h-10 rounded-full bg-secondary/50 hover:bg-primary hover:text-primary-foreground border border-border/50 hover:border-primary flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
                      title={social.name}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="sr-only">{social.name}</span>
                    </Link>
                  </motion.div>
                )
              })
            )}
          </motion.div>

          {/* Divider */}
          <motion.div variants={item} className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Bottom Section */}
          <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-center w-full gap-6 text-xs text-muted-foreground max-w-4xl px-4">
            <div className="flex items-center gap-2">
              <span>© {currentYear} Karthik Lal. All rights reserved.</span>
            </div>

            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-foreground transition-colors hover:underline underline-offset-4">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors hover:underline underline-offset-4">Terms</Link>
              <Link href="/cookies" className="hover:text-foreground transition-colors hover:underline underline-offset-4">Cookies</Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  )
}

