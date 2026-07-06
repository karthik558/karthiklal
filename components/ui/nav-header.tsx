"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggleAnimated } from "@/components/theme-toggle-animated"
import { Menu, X, Github, Linkedin, Mail, Instagram, Facebook, Youtube, MessageCircle, Palette, User, Home, Briefcase, FolderOpen, Phone } from "lucide-react"
import { Button } from "./button"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation'
import SmoothLink from "@/components/smooth-link"
import { SOCIALS_DATA } from "@/lib/static-data"
import { XIcon } from "@/components/ui/icons"
import { useActiveSection } from "@/hooks/use-active-section"

// Icon mapping for social links
const iconMap = {
  Github,
  Linkedin,
  Mail,
  Twitter: XIcon,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
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

function NavHeader({ isScrolled }: { isScrolled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const isMobile = useIsMobile()
  const pathname = usePathname()
  const socialLinks = ((SOCIALS_DATA.socials ?? []) as Social[]).sort(
    (a, b) => a.priority - b.priority
  )
  // Navigation items with proper routes and icons - simplified to essential sections
  const allNavItems = [
    { label: 'Home', href: '/', icon: Home, sectionId: '' },
    { label: 'About', href: '/#about', icon: User, sectionId: 'about' },
    { label: 'Services', href: '/#services', icon: Briefcase, sectionId: 'services' },
    { label: 'Portfolio', href: '/#portfolio', icon: FolderOpen, sectionId: 'portfolio' },
    { label: 'Blog', href: '/blog', icon: User, sectionId: '' },
    { label: 'Testimonials', href: '/#testimonials', icon: MessageCircle, sectionId: 'testimonials' },
    { label: 'Contact', href: '/contact', icon: Phone, sectionId: '' }
  ]

  // Filter navigation items based on current page
  const getNavigationItems = () => {
    return allNavItems
  }

  const currentPageItems = getNavigationItems()

  // Filter active social links
  const activeSocials = socialLinks.filter(social => social.active)

  // Track active section for anchor links
  const activeSection = useActiveSection(['about', 'services', 'portfolio', 'testimonials'])

  // Helper to determine if a nav item is active
  const isItemActive = (item: typeof allNavItems[0]) => {
    if (pathname === '/') {
      if (item.sectionId && activeSection === item.sectionId) return true;
      if (!activeSection && item.href === '/') return true;
      return false;
    }
    return pathname === item.href;
  }

  useEffect(() => {
    if (!isMobile) return

    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"

      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen, isMobile])

  return (
    <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
      {/* Logo */}
      <SmoothLink href="/" className={cn("group flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-300 hover:bg-foreground/5", isOpen && "opacity-0 pointer-events-none")}>
        <div className="relative transform transition-transform duration-300 group-hover:scale-105">
          <Image
            src="/logo-light.png"
            alt="Logo"
            width={36}
            height={36}
            className="dark:hidden drop-shadow-lg"
            priority
          />
          <Image
            src="/logo-dark.png"
            alt="Logo"
            width={36}
            height={36}
            className="hidden dark:block drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            priority
          />
        </div>
      </SmoothLink>

      {/* Desktop Navigation */}
      <ul
        className={cn(
          "relative isolate mx-auto hidden w-fit items-center gap-1 rounded-full border border-border/60 bg-background/55 p-1 transition-all duration-300 md:flex",
          isScrolled
            ? "shadow-none"
            : "shadow-inner backdrop-blur-md"
        )}
      >
        {currentPageItems.map((item) => (
          <li key={item.href} className="relative z-10">
            <SmoothLink
              href={item.href}
              className={cn(
                "relative z-10 flex h-9 items-center rounded-full px-3.5 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:px-4",
                isItemActive(item)
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/15"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
              )}
            >
              {item.label}
            </SmoothLink>
          </li>
        ))}
      </ul>

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className={cn(
              "relative z-50 h-10 w-10 rounded-full border border-border/60 bg-background/60 transition-all duration-300 hover:bg-primary/10 hover:text-primary md:hidden",
              isOpen && "opacity-0 pointer-events-none"
            )}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {mounted && createPortal(
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  key="mobile-menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="fixed inset-0 z-[10000] flex flex-col bg-background/96 backdrop-blur-2xl overflow-hidden"
              >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-[-10%] right-[-10%] w-[28rem] h-[28rem] bg-primary/8 rounded-full blur-[140px]" />
                </div>
                <div className="absolute inset-0 bg-noise opacity-12 pointer-events-none" />

                <div className="relative flex h-full flex-col z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between p-5">
                    <motion.span 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-xs font-semibold text-muted-foreground tracking-[0.3em] uppercase"
                    >
                      Menu
                    </motion.span>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsOpen(false)}
                        className="rounded-xl border border-border/70 bg-foreground/5 hover:bg-foreground/10"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  </div>

                  {/* Navigation Menu */}
                  <div className="flex-1 overflow-y-auto px-5 py-4">
                    <nav className="grid gap-3">
                      {currentPageItems.map((item, index) => {
                        const Icon = item.icon
                        return (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ 
                              delay: 0.1 + index * 0.1,
                              type: "spring",
                              stiffness: 300,
                              damping: 30
                            }}
                          >
                            <SmoothLink
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                "group flex items-center gap-4 rounded-xl border border-border/70 bg-card/70 px-4 py-3.5 backdrop-blur-md transition-all duration-300",
                                isItemActive(item)
                                  ? "text-primary border-primary/30 bg-primary/10"
                                  : "text-muted-foreground hover:text-foreground hover:border-foreground/20"
                              )}
                            >
                              <div className={cn(
                                "p-2 rounded-lg transition-all duration-300 group-hover:scale-105",
                                isItemActive(item) ? "bg-primary text-primary-foreground" : "bg-foreground/5 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                              )}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className={cn(
                                "text-xl sm:text-2xl font-display font-semibold tracking-tight transition-all duration-300 group-hover:translate-x-1",
                                isItemActive(item) ? "text-foreground" : ""
                              )}>
                                {item.label}
                              </span>
                            </SmoothLink>
                          </motion.div>
                        )
                      })}
                    </nav>
                  </div>

                  {/* Footer Section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="border-t border-border/70 bg-background/60 p-5 backdrop-blur-xl"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Theme</span>
                      <ThemeToggleAnimated />
                    </div>
                    
                    <div className="flex flex-wrap gap-4 justify-center">
                      {activeSocials.map((social, index) => {
                        const Icon = iconMap[social.icon]
                        return (
                          <motion.div
                            key={social.id}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: 0.7 + index * 0.05,
                              type: "spring",
                              stiffness: 300,
                              damping: 20
                            }}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <a
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-foreground/5 transition-all duration-300 hover:border-primary/30 hover:bg-primary/15"
                              onClick={() => setIsOpen(false)}
                              title={`${social.name}`}
                            >
                              <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </a>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                </div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
        </div>
      )}

      {/* Desktop Theme Toggle - Only show on desktop */}
      {!isMobile && (
        <div className="hidden md:block">
          <ThemeToggleAnimated />
        </div>
      )}
    </div>
  )
}

export default NavHeader
