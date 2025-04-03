"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { ThemeToggleSimple } from "./theme-toggle-simple"
import Image from "next/image"
import { useTheme } from "next-themes"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const navLinks = [
  { href: "/", label: "Home" },
  {
    label: "About",
    items: [
      { href: "/#about", label: "Overview" },
      { href: "/#experience", label: "Experience" },
      { href: "/#certifications", label: "Certifications" },
      { href: "/#skills", label: "Skills" },
    ],
  },
  {
    label: "Work",
    items: [
      { href: "/#portfolio", label: "Portfolio" },
      { href: "/#services", label: "Services" },
      { href: "/#testimonials", label: "Testimonials" },
    ],
  },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Prevent hydration mismatch by rendering a placeholder during SSR
  if (!mounted) {
    return (
      <header className="fixed top-0 z-40 w-full bg-background/80 backdrop-blur-md shadow-lg py-2">
        <div className="container flex items-center justify-between">
          <div className="h-12">
            <div className="block">
              <div className="h-12 w-[180px]" />
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-1">
            <div className="pl-2">
              <div className="w-10 h-10" />
            </div>
          </nav>
        </div>
      </header>
    )
  }

  return (
    <header className="fixed top-0 z-40 w-full bg-background/80 backdrop-blur-md shadow-lg py-2">
      <div className="container flex items-center justify-between">
        <div className="h-12">
          <Link href="/" className="block">
            <Image
              src={theme === "dark" ? "/logo-dark.png" : "/logo-light.png"}
              alt="Logo"
              width={180}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.label}>
                  {link.items ? (
                    <>
                      <NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4">
                          {link.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                className={cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                  pathname === item.href ? "text-primary" : "text-foreground/80"
                                )}
                                onClick={closeMobileMenu}
                              >
                                <div className="text-sm font-medium leading-none">{item.label}</div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                        pathname === link.href ? "text-primary" : "text-foreground/80 hover:text-primary hover:bg-primary/10"
                      )}
                      onClick={link.href.startsWith("#") ? closeMobileMenu : undefined}
                    >
                      {link.label}
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <div className="pl-2">
            <ThemeToggleSimple />
          </div>
        </div>

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
              <div key={link.label}>
                {link.items ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm font-semibold text-foreground">{link.label}</div>
                    <div className="pl-4 space-y-1">
                      {link.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                            pathname === item.href
                              ? "text-primary"
                              : "text-foreground/80 hover:text-primary hover:bg-primary/10"
                          )}
                          onClick={closeMobileMenu}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200",
                      pathname === link.href
                        ? "text-primary"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/10"
                    )}
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

