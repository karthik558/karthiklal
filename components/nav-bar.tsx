"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { ThemeToggleSimple } from "./theme-toggle-simple"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#services", label: "Services" },
  { href: "#experience", label: "Experience" },
  { href: "#certifications", label: "Certifications" },
  { href: "#skills", label: "Skills" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
]

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 z-40 w-full bg-background/80 backdrop-blur-md shadow-lg py-2">
      <div className="container flex items-center justify-between">
        <div className="text-2xl font-bold">
          <Link href="/" className="text-primary">
            Karthik<span className="text-foreground">Lal</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                  pathname === link.href ? "text-primary" : "text-foreground/80 hover:text-primary hover:bg-primary/10",
                )}
                onClick={link.href.startsWith("#") ? closeMobileMenu : undefined}
              >
                {link.label}
              </Link>
            </div>
          ))}
          <div className="pl-2">
            <ThemeToggleSimple />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <ThemeToggleSimple />
          <button onClick={toggleMobileMenu} className="ml-2 p-2 rounded-md text-foreground hover:text-primary">
            <span className="sr-only">Open menu</span>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md shadow-lg">
          <div className="container py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200",
                    pathname === link.href
                      ? "text-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/10",
                  )}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

