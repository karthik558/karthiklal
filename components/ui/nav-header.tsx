"use client"

import React, { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggleAnimated } from "@/components/theme-toggle-animated"
import { Menu, X, Github, Linkedin, Mail, Twitter, Instagram, Facebook, Youtube, MessageCircle, Palette, User, Home, Briefcase, FolderOpen, Code, Phone } from "lucide-react"
import { Button } from "./button"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetTrigger } from "./sheet"
import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation'
import { Separator } from "./separator"
import SmoothLink from "@/components/smooth-link"

// Icon mapping for social links
const iconMap = {
  Github,
  Linkedin,
  Mail,
  Twitter,
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

interface SocialsData {
  socials: Social[]
}

interface PersonalInfo {
  name: string
  title: string
}

interface ProfileData {
  personalInfo: PersonalInfo
}

function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  })
  const [isOpen, setIsOpen] = useState(false)
  const [socialLinks, setSocialLinks] = useState<Social[]>([])
  const [profileData, setProfileData] = useState<PersonalInfo | null>(null)
  const isMobile = useIsMobile()
  const pathname = usePathname()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch social links
        const socialsResponse = await fetch('/data/socials.json')
        const socialsData: SocialsData = await socialsResponse.json()
        setSocialLinks(socialsData.socials)

        // Fetch profile data
        const profileResponse = await fetch('/data/profile.json')
        const profileData: ProfileData = await profileResponse.json()
        setProfileData(profileData.personalInfo)
      } catch (error) {
        console.error('Failed to fetch navigation data:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch social links
        const socialsResponse = await fetch('/data/socials.json')
        const socialsData: SocialsData = await socialsResponse.json()
        setSocialLinks(socialsData.socials)

        // Fetch profile data
        const profileResponse = await fetch('/data/profile.json')
        const profileData: ProfileData = await profileResponse.json()
        setProfileData(profileData.personalInfo)
      } catch (error) {
        console.error('Failed to fetch navigation data:', error)
      }
    }

    fetchData()
  }, [])
  // Navigation items with proper routes and icons - simplified to essential sections
  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'About', href: '/#about', icon: User },
    { label: 'Services', href: '/#services', icon: Briefcase },
    { label: 'Portfolio', href: '/#portfolio', icon: FolderOpen },
    { label: 'Blog', href: '/blog', icon: User }
  ]

  // Filter navigation items based on current page
  const currentPageItems = pathname === '/' 
    ? navItems.filter(item => item.label !== 'Home')
    : navItems

  // Filter active social links
  const activeSocials = socialLinks.filter(social => social.active)

  return (
    <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/logo-light.png"
          alt="Logo"
          width={40}
          height={40}
          className="dark:hidden"
        />
        <Image
          src="/logo-dark.png"
          alt="Logo"
          width={40}
          height={40}
          className="hidden dark:block"
        />
      </Link>

      {/* Desktop Navigation */}
      <ul
        className="relative mx-auto hidden md:flex w-fit rounded-full border border-primary/20 bg-background/40 backdrop-blur-md p-1"
        onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
      >
        {currentPageItems.map((item) => (
          <Tab key={item.href} setPosition={setPosition}>
            <SmoothLink 
              href={item.href}
              className={cn(
                "transition-colors relative z-10",
                pathname === item.href && "text-primary"
              )}
            >
              {item.label}
            </SmoothLink>
          </Tab>
        ))}
        <Cursor position={position} />
      </ul>

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative md:hidden hover:bg-primary/10 transition-colors"
              >
                <AnimatePresence mode="wait">
                  {!isOpen ? (
                    <motion.div
                      key="menu"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="close"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[min(320px,_85vw)] rounded-l-2xl border-l-0 pr-0 bg-background backdrop-blur-xl border border-border overflow-hidden [&>button]:hidden"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="px-6 py-6 border-b border-border flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{profileData?.name || 'Loading...'}</h3>
                      <p className="text-sm text-muted-foreground">{profileData?.title || 'Loading...'}</p>
                    </div>
                  </div>
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                  <div className="p-6 space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                      Navigation
                    </h4>
                    {currentPageItems.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.08 }}
                        >
                          <MenuItem 
                            href={item.href} 
                            onClick={() => setIsOpen(false)}
                            active={pathname === item.href}
                            icon={Icon}
                          >
                            {item.label}
                          </MenuItem>
                        </motion.div>
                      )
                    })}
                  </div>

                  <Separator className="mx-6" />

                  {/* Theme Toggle Section */}
                  <div className="p-6 pb-4">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                      Theme
                    </h4>
                    <div className="flex justify-center">
                      <ThemeToggleAnimated />
                    </div>
                  </div>

                  <Separator className="mx-6" />

                  {/* Social Links */}
                  <div className="p-6 pb-4">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                      Connect
                    </h4>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {activeSocials.map((social, index) => {
                        const Icon = iconMap[social.icon]
                        return (
                          <motion.div
                            key={social.id}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ 
                              delay: 0.1 + index * 0.05,
                              type: "spring",
                              stiffness: 300,
                              damping: 20
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <a
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border border-border hover:border-primary/40 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 overflow-hidden"
                              onClick={() => setIsOpen(false)}
                              title={`${social.name} - ${social.username}`}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <Icon className="w-5 h-5 text-primary relative z-10 transition-transform duration-200 group-hover:scale-110" />
                            </a>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-4 border-t border-border flex-shrink-0">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      © 2025 Karthik Lal. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
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

// Helper component for mobile menu items
const MenuItem = ({ 
  children, 
  href, 
  onClick,
  active,
  icon: Icon
}: { 
  children: React.ReactNode
  href: string
  onClick?: () => void
  active?: boolean
  icon?: React.ComponentType<{ className?: string }>
}) => (
  <SmoothLink
    href={href}
    onClick={onClick}
    className={cn(
      "group relative flex items-center gap-3 rounded-xl p-3 transition-all hover:bg-muted/50",
      active 
        ? "text-primary bg-primary/10 dark:bg-primary/10" 
        : "text-foreground hover:text-foreground"
    )}
  >
    {Icon && (
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
        active 
          ? "bg-primary/20 text-primary" 
          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
      )}>
        <Icon className="w-4 h-4 transition-colors" />
      </div>
    )}
    <span className="relative z-10 font-medium">{children}</span>
    <motion.div
      initial={false}
      className="absolute inset-0 z-0 rounded-xl"
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      whileTap={{ scale: 0.95 }}
    />
  </SmoothLink>
)

const Tab = ({
  children,
  setPosition,
}: {
  children: React.ReactNode
  setPosition: React.Dispatch<React.SetStateAction<{
    left: number
    width: number
    opacity: number
  }>>
}) => {
  const ref = useRef<HTMLLIElement>(null)
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return
        const { width } = ref.current.getBoundingClientRect()
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        })
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs font-medium normal-case md:px-4 md:py-2 md:text-sm"
    >
      {children}
    </li>
  )
}

const Cursor = ({
  position,
}: {
  position: { left: number; width: number; opacity: number }
}) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-7 rounded-full bg-primary/10 backdrop-blur-sm md:h-9"
    />
  )
}

export default NavHeader