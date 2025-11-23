"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Linkedin, Mail, MapPin, Twitter, Instagram, Facebook, Youtube, MessageCircle, Globe, Palette } from "lucide-react"
import SmoothLink from "@/components/smooth-link"
import { SOCIALS_DATA } from "@/lib/static-data"

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
  const socials = ((SOCIALS_DATA.socials ?? []) as Social[])
    .filter((social) => social.active)
    .sort((a, b) => a.priority - b.priority)

  return (
    <footer className="bg-secondary/5 border-t border-border">
      <div className="container py-4 md:py-6">
        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="text-center space-y-3">
            {/* Signature */}
            <div className="flex justify-center">
              <Image
                src="/signature.svg"
                alt="Karthik Lal Signature"
                width={160}
                height={48}
                className="h-8 w-auto object-contain filter dark:invert"
                priority
              />
            </div>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-3">
              {socials.map((social) => {
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
              })}
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
                <a href="mailto:contact@karthiklal.in" className="hover:text-primary transition-colors">contact@karthiklal.in</a>
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
                src="/signature.svg"
                alt="Karthik Lal Signature"
                width={140}
                height={40}
                className="h-7 w-auto object-contain filter dark:invert"
                priority
              />
            </div>

            {/* Social Links */}
            <div className="flex space-x-2">
              {socials.map((social) => {
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
              })}
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
                <a href="mailto:contact@karthiklal.in" className="hover:text-primary transition-colors">contact@karthiklal.in</a>
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
