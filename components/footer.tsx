"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Linkedin, Mail, MapPin, Twitter, Instagram, Facebook, Youtube, MessageCircle, Globe, Palette } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import SmoothLink from "@/components/smooth-link"

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
  const { theme } = useTheme()

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
      <div className="container py-4 md:py-6">
        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="text-center space-y-3">
            {/* Signature */}
            <div className="flex justify-center">
              <Image
                src={theme === 'dark' ? '/signature/signature-dark.png' : '/signature/signature-light.png'}
                alt="Karthik Lal Signature"
                width={200}
                height={60}
                className="h-12 w-auto object-contain"
                priority
              />
            </div>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-3">
              {loading ? (
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

            {/* Quick Links - Horizontal on Mobile */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
              <SmoothLink href="/#about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </SmoothLink>
              <SmoothLink href="/#services" className="text-muted-foreground hover:text-primary transition-colors">
                Services
              </SmoothLink>
              <SmoothLink href="/#portfolio" className="text-muted-foreground hover:text-primary transition-colors">
                Portfolio
              </SmoothLink>
              <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <SmoothLink href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </SmoothLink>
            </div>

            {/* Contact Info */}
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mail className="h-3 w-3" />
                <a href="mailto:dev@karthiklal.in" className="hover:text-primary transition-colors">dev@karthiklal.in</a>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>Kerala, India</span>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex justify-center gap-4 text-xs">
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

            {/* Copyright */}
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                © {currentYear} Karthik Lal. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {/* Brand Section */}
          <div className="space-y-3">
            <div>
              <Image
                src={theme === 'dark' ? '/signature/signature-dark.png' : '/signature/signature-light.png'}
                alt="Karthik Lal Signature"
                width={180}
                height={50}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>

            {/* Social Links */}
            <div className="flex space-x-2">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full bg-muted animate-pulse"
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
                      className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300"
                      title={social.name}
                    >
                      <IconComponent className="h-3.5 w-3.5" />
                      <span className="sr-only">{social.name}</span>
                    </Link>
                  )
                })
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h4>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <SmoothLink href="/#about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </SmoothLink>
              <SmoothLink href="/#services" className="text-muted-foreground hover:text-primary transition-colors">
                Services
              </SmoothLink>
              <SmoothLink href="/#portfolio" className="text-muted-foreground hover:text-primary transition-colors">
                Portfolio
              </SmoothLink>
              <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <SmoothLink href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </SmoothLink>
            </div>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Contact</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                <a href="mailto:dev@karthiklal.in" className="hover:text-primary transition-colors">dev@karthiklal.in</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>Kerala, India</span>
              </div>
            </div>
            
            {/* Legal Links */}
            <div className="pt-1">
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

          {/* Desktop Bottom Section */}
          <div className="col-span-3 mt-6 pt-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              © {currentYear} Karthik Lal. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

