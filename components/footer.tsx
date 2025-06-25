"use client"

import Link from "next/link"
import { Github, Linkedin, Mail, MapPin, Twitter, Instagram, Facebook, Youtube, MessageCircle, Globe, Palette } from "lucide-react"
import { useState, useEffect } from "react"

// Icon mapping for dynamic icon rendering
const iconMap = {
  Github,
  Linkedin,
  Mail,
  Twitter,
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
        console.log('Loaded socials data:', data) // Debug log
        // Filter active socials and sort by priority
        const activeSocials = data.socials
          .filter((social: Social) => social.active)
          .sort((a: Social, b: Social) => a.priority - b.priority)
        console.log('Active socials:', activeSocials) // Debug log
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
            url: "mailto:dev@karthiklal.in",
            username: "dev@karthiklal.in",
            active: true,
            priority: 3
          }
        ])
      })
  }, [])

  return (
    <footer className="bg-secondary/5 border-t border-border">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">
                KARTHIK <span className="text-gradient">LAL</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                IT Manager & Cybersecurity Expert
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-9 h-9 rounded-full bg-muted animate-pulse"
                  />
                ))
              ) : (
                socials.map((social) => {
                  const IconComponent = iconMap[social.icon]
                  if (!IconComponent) {
                    console.warn(`Icon not found for ${social.icon}`)
                    return null
                  }
                  return (
                    <Link
                      key={social.id}
                      href={social.url}
                      target={social.name !== 'Email' ? "_blank" : undefined}
                      rel={social.name !== 'Email' ? "noopener noreferrer" : undefined}
                      className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300"
                      title={social.name}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="sr-only">{social.name}</span>
                    </Link>
                  )
                })
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h4>
            <div className="grid grid-cols-2 gap-1">
              <Link href="/#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Projects
              </Link>
              <Link href="/#services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Services
              </Link>
              <Link href="/#experience" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Experience
              </Link>
              <Link href="/#skills" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Skills
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span>dev@karthiklal.in</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>Lakshadweep, India</span>
              </div>
            </div>
            
            {/* Legal Links */}
            <div className="pt-2">
              <div className="flex flex-wrap gap-3 text-xs">
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms
                </Link>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Karthik Lal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

