"use client"

import React, { useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Menu, X } from "lucide-react"
import { Button } from "./button"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "./sheet"
import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation'

function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  })
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()
  const pathname = usePathname()
  
  // Navigation items with proper routes in order of sections
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Portfolio', href: '/#portfolio' },
    { label: 'Projects', href: '/projects' },
    { label: 'Services', href: '/#services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' }
  ]

  // Filter navigation items based on current page
  const currentPageItems = pathname === '/' 
    ? navItems.filter(item => item.label !== 'Home')
    : navItems

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
            <Link 
              href={item.href}
              className={cn(
                "transition-colors relative z-10",
                pathname === item.href && "text-primary"
              )}
            >
              {item.label}
            </Link>
          </Tab>
        ))}
        <Cursor position={position} />
      </ul>

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative md:hidden">
                <Menu className={cn("h-5 w-5 transition-all", isOpen && "rotate-90 opacity-0")} />
                <X className={cn("absolute h-5 w-5 transition-all", !isOpen && "-rotate-90 opacity-0")} />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[min(300px,_85vw)] rounded-l-2xl border-l-0 pr-0"
            >
              <SheetTitle className="px-6 py-4 border-b">Navigation Menu</SheetTitle>
              <nav className="flex h-full flex-col">
                <div className="flex-1 overflow-auto">
                  <div className="flex flex-col gap-1 p-6">
                    {currentPageItems.map((item) => (
                      <MenuItem 
                        key={item.href}
                        href={item.href} 
                        onClick={() => setIsOpen(false)}
                        active={pathname === item.href}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Desktop Theme Toggle */}
      <div className="hidden md:block">
        <ThemeToggle />
      </div>
    </div>
  )
}

// Helper component for mobile menu items
const MenuItem = ({ 
  children, 
  href, 
  onClick,
  active
}: { 
  children: React.ReactNode
  href: string
  onClick?: () => void
  active?: boolean
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      "group relative flex items-center rounded-lg p-3 text-muted-foreground transition-all hover:bg-primary/5 hover:text-foreground",
      active && "text-primary bg-primary/5"
    )}
  >
    <span className="relative z-10">{children}</span>
    <motion.div
      initial={false}
      className="absolute inset-0 z-0 rounded-lg bg-background"
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      whileTap={{ scale: 0.95 }}
    />
  </Link>
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