"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Linkedin, Mail, Instagram, Facebook, Youtube, MessageCircle, Globe, Palette, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
    fetch('/data/socials.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        const activeSocials = data.socials
          .filter((social: Social) => social.active)
          .sort((a: Social, b: Social) => a.priority - b.priority)
        setSocials(activeSocials)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to load socials:', error)
        setLoading(false)
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
    hidden: { opacity: 0, y: 15 },
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
    <div className="px-4 md:px-8 pb-4 md:pb-8 pt-12">
      <motion.footer 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="relative bg-secondary/15 backdrop-blur-2xl border border-border/40 rounded-[2rem] overflow-hidden shadow-xl"
      >
        {/* Ambient background glow inside the card */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />

        <div className="relative z-10 px-8 py-10 md:px-12 md:py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            
            {/* Left: Logo & Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <motion.div variants={item} className="shrink-0">
                <Link href="/" className="inline-block relative group">
                  <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Image
                    src="/hero_name.svg"
                    alt="Karthik Lal"
                    width={120}
                    height={32}
                    className="h-6 w-auto object-contain relative z-10 opacity-90 group-hover:opacity-100 transition-opacity dark:invert"
                    priority
                  />
                </Link>
              </motion.div>
              
              <div className="hidden sm:block h-4 w-px bg-border/40" />
              
              <motion.div variants={item} className="text-xs text-muted-foreground font-medium">
                <span>© {currentYear} Karthik Lal. </span>
                <span className="ml-1 text-muted-foreground/45">All rights reserved.</span>
              </motion.div>
            </div>



            {/* Right: Connect Social Links */}
            <motion.div variants={item} className="flex flex-wrap gap-2.5">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="w-10 h-10 rounded-xl bg-background animate-pulse" />
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
                        className="w-10 h-10 rounded-xl bg-background border border-border/30 hover:bg-primary hover:border-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 shadow-sm"
                        title={social.name}
                      >
                        <IconComponent className="h-[18px] w-[18px]" />
                        <span className="sr-only">{social.name}</span>
                      </Link>
                    </motion.div>
                  )
                })
              )}
            </motion.div>

          </div>
        </div>
      </motion.footer>
    </div>
  )
}
