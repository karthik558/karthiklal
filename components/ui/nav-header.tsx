"use client"

import React, { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggleAnimated } from "@/components/theme-toggle-animated"
import { Menu, X, Github, Linkedin, Mail, Twitter, Instagram, Facebook, Youtube, MessageCircle, Palette, User, Home, Briefcase, FolderOpen, Phone } from "lucide-react"
import { Button } from "./button"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetTrigger } from "./sheet"
import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation'
import { Separator } from "./separator"
import SmoothLink from "@/components/smooth-link"
import { SOCIALS_DATA } from "@/lib/static-data"

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

function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  })
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const socialLinks = ((SOCIALS_DATA.socials ?? []) as Social[]).sort(
    (a, b) => a.priority - b.priority
  )
  // Navigation items with proper routes and icons - simplified to essential sections
  const allNavItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'About', href: '/#about', icon: User },
    { label: 'Services', href: '/#services', icon: Briefcase },
    { label: 'Portfolio', href: '/#portfolio', icon: FolderOpen },
    { label: 'Blog', href: '/blog', icon: User },
    { label: 'Testimonials', href: '/#testimonials', icon: MessageCircle },
    { label: 'Contact', href: '/#contact', icon: Phone }
  ]

  // Filter navigation items based on current page
  const getNavigationItems = () => {
    if (pathname === '/') {
      // Home page: show all items except Home itself
      return allNavItems.filter(item => item.label !== 'Home')
    } else if (pathname.startsWith('/blog')) {
      // Blog page and blog posts: show only Home and Contact
      return allNavItems.filter(item => item.label === 'Home' || item.label === 'Contact')
    } else if (pathname === '/contact') {
      // Contact page: show only Home and Blog
      return allNavItems.filter(item => item.label === 'Home' || item.label === 'Blog')
    } else {
      // Other pages: show only Home and Blog
      return allNavItems.filter(item => item.label === 'Home' || item.label === 'Blog')
    }
  }

  const currentPageItems = getNavigationItems()

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
                className={cn(
                  "relative md:hidden hover:bg-primary/10 transition-colors",
                  isOpen && "opacity-0 pointer-events-none"
                )}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            
            <SheetContent 
              side="right" 
              className="w-[min(320px,_85vw)] rounded-l-2xl border-l-0 pr-0 bg-background border border-border overflow-hidden"
            >
              <div className="flex h-full flex-col">
                {/* Navigation Menu */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                  <div className="p-6 space-y-2 pt-12">
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
