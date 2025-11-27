"use client"

import React, { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggleAnimated } from "@/components/theme-toggle-animated"
import { Menu, X, Github, Linkedin, Mail, Instagram, Facebook, Youtube, MessageCircle, Palette, User, Home, Briefcase, FolderOpen, Phone, ArrowRight } from "lucide-react"
import { Button } from "./button"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetTrigger } from "./sheet"
import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation'
import { Separator } from "./separator"
import SmoothLink from "@/components/smooth-link"
import { SOCIALS_DATA } from "@/lib/static-data"
import { XIcon } from "@/components/ui/icons"

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

function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
    height: 0,
    top: 0,
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
      <Link href="/" className={cn("flex items-center group transition-opacity duration-300", isOpen && "opacity-0 pointer-events-none")}>
        <div className="relative transform transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
          <Image
            src="/logo-light.png"
            alt="Logo"
            width={40}
            height={40}
            className="dark:hidden drop-shadow-lg"
          />
          <Image
            src="/logo-dark.png"
            alt="Logo"
            width={40}
            height={40}
            className="hidden dark:block drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          />
        </div>
      </Link>

      {/* Desktop Navigation */}
      <ul
        className="relative mx-auto hidden md:flex w-fit rounded-full border border-primary/10 bg-secondary/20 backdrop-blur-md p-1"
        onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
      >
        {currentPageItems.map((item) => (
          <Tab key={item.href} setPosition={setPosition}>
            <SmoothLink
              href={item.href}
              className={cn(
                "transition-all duration-300 relative z-10 px-2",
                pathname === item.href
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
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
                  "relative md:hidden hover:bg-primary/10 hover:text-primary transition-all duration-300 z-50",
                  isOpen && "opacity-0 pointer-events-none"
                )}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full sm:w-[400px] p-0 border-l border-white/10 bg-background/80 backdrop-blur-3xl shadow-2xl overflow-hidden"
            >
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
              </div>

              <div className="relative flex h-full flex-col z-10">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                  <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase">Menu</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-white/10 rounded-full -mr-2"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col justify-center">
                  <nav className="space-y-2">
                    {currentPageItems.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: 0.1 + index * 0.05,
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                          }}
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
                  </nav>
                </div>

                {/* Footer Section */}
                <div className="p-6 border-t border-white/5 bg-background/20 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Theme</span>
                    <ThemeToggleAnimated />
                  </div>
                  
                  <div className="flex flex-wrap gap-3 justify-center">
                    {activeSocials.map((social, index) => {
                      const Icon = iconMap[social.icon]
                      return (
                        <motion.div
                          key={social.id}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.3 + index * 0.05,
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
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/30 flex items-center justify-center transition-all duration-300 group"
                            onClick={() => setIsOpen(false)}
                            title={`${social.name}`}
                          >
                            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </a>
                        </motion.div>
                      )
                    })}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                      © 2025 Karthik Lal
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
      "group relative flex items-center gap-5 px-6 py-5 transition-all duration-500",
      active
        ? "text-primary"
        : "text-muted-foreground hover:text-foreground"
    )}
  >
    {/* Hover Background */}
    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    {/* Active Indicator Line */}
    {active && (
      <motion.div
        layoutId="activeMenuLine"
        className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(116,38,26,0.5)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    )}

    {/* Icon */}
    {Icon && (
      <div className={cn(
        "relative z-10 p-2 rounded-lg transition-all duration-300 group-hover:scale-110",
        active ? "bg-primary/10 text-primary" : "bg-white/5 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
      )}>
        <Icon className="w-6 h-6" />
      </div>
    )}
    
    {/* Text */}
    <div className="relative z-10 flex flex-col">
      <span className={cn(
        "text-2xl font-light tracking-tight transition-all duration-300 group-hover:translate-x-1",
        active ? "font-normal" : ""
      )}>
        {children}
      </span>
    </div>
    
    {/* Arrow */}
    <div className="ml-auto opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary">
      <ArrowRight className="w-5 h-5" />
    </div>
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
    height: number
    top: number
  }>>
}) => {
  const ref = useRef<HTMLLIElement>(null)
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return
        setPosition({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
          opacity: 1,
          left: ref.current.offsetLeft,
          top: ref.current.offsetTop,
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
  position: { left: number; width: number; opacity: number; height: number; top: number }
}) => {
  return (
    <motion.li
      animate={position}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      className="absolute z-0 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] backdrop-blur-sm"
    />
  )
}

export default NavHeader
