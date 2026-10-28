"use client"

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"
import { ThemeToggleAnimated } from "@/components/theme-toggle-animated"
import { SoundToggle } from "@/components/ui/sound-toggle"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation'
import SmoothLink from "@/components/smooth-link"
import { useActiveSection } from "@/hooks/use-active-section"

const subscribeToClient = () => () => undefined

export default function NavHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const mounted = useSyncExternalStore(subscribeToClient, () => true, () => false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  const pathname = usePathname()
  const activeSection = useActiveSection(['home', 'about', 'portfolio', 'services', 'portfolio-gallery'])

  const navItems = [
    { number: '01', label: 'HOME', href: '/', sectionId: 'home' },
    { number: '02', label: 'ABOUT', href: '/#about', sectionId: 'about' },
    { number: '03', label: 'PROJECTS', href: '/#portfolio', sectionId: 'portfolio' },
    { number: '04', label: 'DESIGNS', href: '/#portfolio-gallery', sectionId: 'portfolio-gallery' },
    { number: '05', label: 'SERVICES', href: '/#services', sectionId: 'services' },
    { number: '06', label: 'BLOG', href: '/blog', sectionId: '' },
    { number: '07', label: 'CONTACT', href: '/contact', sectionId: '' }
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
    if (!isOpen) return

    const drawer = drawerRef.current
    if (!drawer) return

    const menuButton = menuButtonRef.current
    const previousOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(",")

    const focusFirstControl = () => {
      const firstControl = drawer.querySelector<HTMLElement>(focusableSelector)
        ; (firstControl ?? drawer).focus()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setIsOpen(false)
        return
      }

      if (event.key !== "Tab") return

      const focusableControls = Array.from(
        drawer.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter((element) => !element.hasAttribute("disabled"))

      if (focusableControls.length === 0) {
        event.preventDefault()
        drawer.focus()
        return
      }

      const firstControl = focusableControls[0]
      const lastControl = focusableControls[focusableControls.length - 1]

      if (event.shiftKey && document.activeElement === firstControl) {
        event.preventDefault()
        lastControl.focus()
      } else if (!event.shiftKey && document.activeElement === lastControl) {
        event.preventDefault()
        firstControl.focus()
      }
    }

    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleKeyDown)
    const focusFrame = requestAnimationFrame(focusFirstControl)

    return () => {
      cancelAnimationFrame(focusFrame)
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
        ; (previouslyFocused ?? menuButton)?.focus()
    }
  }, [isOpen])

  return (
    <div className="relative flex w-full items-center justify-center font-mono text-xs uppercase pointer-events-none">
      {/* Unified Desktop Navigation Island (Centered, Paper Style, Compact & Slim) */}
      <div className="studio-navigation pointer-events-auto hidden lg:flex items-center gap-2 px-2 py-0.5">
        <nav aria-label="Desktop navigation">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = isItemActive(item)
              return (
                <li key={item.href}>
                  <SmoothLink
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "nav-item h-[30px] px-3 flex items-center justify-center font-mono text-[10px] font-bold uppercase tracking-wider transition-colors select-none",
                      active
                        ? "bg-foreground text-background shadow-xs font-black"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                    )}
                  >
                    <span className="nav-item-index">{item.number}</span>
                    <span>{item.label}</span>
                  </SmoothLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="h-4 w-px bg-border/80 mx-1" aria-hidden="true" />

        <div className="nav-utilities flex items-center gap-1.5">
          <SoundToggle size="sm" />
          <ThemeToggleAnimated size="sm" />
        </div>
      </div>

      {/* Mobile / Tablet Menu Trigger (Right) */}
      <div className="pointer-events-auto ml-auto lg:hidden">
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsOpen(true)}
          className="mobile-nav-trigger paper-button flex items-center justify-center gap-1.5 h-[34px] px-3 text-foreground font-mono text-[11px] font-bold uppercase tracking-wider hover:border-foreground transition-colors cursor-pointer"
          aria-label="Open menu"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          <Menu className="mobile-nav-icon" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Fullscreen Menu Drawer */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={drawerRef}
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Main navigation"
              tabIndex={-1}
              initial={{ opacity: 0, y: "-100%" }}
              animate={{ opacity: 1, y: "0%" }}
              exit={{ opacity: 0, y: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto fixed inset-0 z-[10000] flex flex-col justify-between bg-background p-6 lg:hidden overflow-y-auto"
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-end border-b border-border/80 pb-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="paper-button p-1.5 border border-border bg-card text-foreground hover:border-foreground transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Links List */}
              <nav className="my-auto py-6 space-y-2.5 font-mono">
                {navItems.map((item, index) => {
                  const active = isItemActive(item)
                  const numStr = String(index + 1).padStart(2, "0")
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.03 * index }}
                    >
                      <SmoothLink
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "group flex items-center justify-between p-3.5 border transition-all",
                          active
                            ? "border-foreground bg-foreground text-background font-bold shadow-xs"
                            : "border-border/80 bg-card/80 text-foreground hover:border-foreground hover:bg-card"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "font-mono text-[10px] font-bold tracking-widest",
                            active ? "text-background/70" : "text-muted-foreground"
                          )}>
                            [{numStr}]
                          </span>
                          <span className="font-display text-xl font-black uppercase tracking-tight">{item.label}</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </SmoothLink>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Bottom Drawer Footer */}
              <div className="border-t border-border/80 pt-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-muted-foreground p-2.5 border border-border/60 bg-card/60">
                  <span className="font-bold uppercase tracking-wider text-[11px]">SOUND FX</span>
                  <SoundToggle size="default" />
                </div>

                <div className="flex items-center justify-between text-muted-foreground p-2.5 border border-border/60 bg-card/60">
                  <span className="font-bold uppercase tracking-wider text-[11px]">THEME MODE</span>
                  <ThemeToggleAnimated size="default" />
                </div>

                <a
                  href="mailto:contact@karthiklal.in"
                  className="paper-button block w-full text-center py-3 bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider border border-foreground hover:bg-background hover:text-foreground transition-colors cursor-pointer"
                >
                  contact@karthiklal.in
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
