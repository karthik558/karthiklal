"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggleAnimated } from "@/components/theme-toggle-animated"
import { Menu, X, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation'
import SmoothLink from "@/components/smooth-link"
import { useActiveSection } from "@/hooks/use-active-section"

export default function NavHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const pathname = usePathname()
  const activeSection = useActiveSection(['home', 'about', 'portfolio', 'services'])

  const navItems = [
    { label: 'HOME', href: '/', sectionId: 'home', num: '00' },
    { label: 'ABOUT', href: '/#about', sectionId: 'about', num: '01' },
    { label: 'PROJECTS', href: '/projects', sectionId: 'portfolio', num: '02' },
    { label: 'SERVICES', href: '/#services', sectionId: 'services', num: '03' },
    { label: 'BLOG', href: '/blog', sectionId: '', num: '04' },
    { label: 'CONTACT', href: '/contact', sectionId: '', num: '05' }
  ]

  const isItemActive = (item: typeof navItems[0]) => {
    if (pathname === '/') {
      if (item.sectionId && activeSection === item.sectionId) return true
      if (!activeSection && item.href === '/') return true
      return false
    }
    return pathname === item.href
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "unset"
      }
    }
  }, [isOpen])

  return (
    <div className="flex w-full items-center justify-end md:justify-between font-mono text-xs uppercase">
      
      {/* Desktop Navigation Links */}
      <ul className="hidden md:flex items-center gap-1.5 border-2 border-border bg-card p-1">
        {navItems.map((item) => {
          const active = isItemActive(item)
          return (
            <li key={item.href}>
              <SmoothLink
                href={item.href}
                className={cn(
                  "px-3.5 py-2 transition-all font-bold tracking-wider block",
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-background"
                )}
              >
                {item.label}
              </SmoothLink>
            </li>
          )
        })}
      </ul>

      {/* Right Tools: Theme Toggle & Mobile Trigger */}
      <div className="flex items-center gap-3">
        <ThemeToggleAnimated />

        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden flex items-center justify-center gap-1 px-3.5 h-9 border-2 border-foreground bg-foreground text-background font-bold"
          aria-label="Open menu"
        >
          <Menu className="w-4 h-4" />
          <span>MENU</span>
        </button>
      </div>

      {/* Mobile Fullscreen Menu Drawer */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: "-100%" }}
              animate={{ opacity: 1, y: "0%" }}
              exit={{ opacity: 0, y: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[10000] flex flex-col justify-between bg-background p-6 md:hidden overflow-y-auto"
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-end border-b-2 border-foreground pb-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 border-2 border-foreground bg-foreground text-background font-bold"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links List */}
              <nav className="my-auto py-10 space-y-4 font-mono">
                {navItems.map((item, index) => {
                  const active = isItemActive(item)
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <SmoothLink
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center justify-between p-4 border-2 transition-all",
                          active
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-card text-foreground hover:border-foreground"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-muted-foreground font-bold">{item.num} //</span>
                          <span className="font-display text-2xl font-black tracking-tight">{item.label}</span>
                        </div>
                        <ArrowUpRight className="w-5 h-5" />
                      </SmoothLink>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Bottom Drawer Footer */}
              <div className="border-t-2 border-foreground pt-6 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>THEME MODE</span>
                  <ThemeToggleAnimated />
                </div>

                <a
                  href="mailto:dev@karthiklal.in"
                  className="block w-full text-center py-3 bg-foreground text-background font-bold uppercase tracking-wider border border-foreground"
                >
                  dev@karthiklal.in
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}

