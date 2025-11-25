"use client"

import { useEffect, useState, useRef } from "react"
import NavHeader from "@/components/ui/nav-header"

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Immediate update for significant scroll changes
      if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
        setIsScrolled(currentScrollY > 50)
        lastScrollY.current = currentScrollY
      } else {
        // Debounced update for small scroll changes
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolled(currentScrollY > 50)
          lastScrollY.current = currentScrollY
        }, 50)
      }
    }

    // Initial check
    setIsScrolled(window.scrollY > 50)
    lastScrollY.current = window.scrollY

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ease-in-out ${isScrolled
        ? "py-2 bg-background/60 backdrop-blur-3xl border-b border-primary/5 shadow-sm supports-[backdrop-filter]:bg-background/60"
        : "py-4 bg-transparent"
        }`}
      style={{ position: 'fixed' }}
    >
      <div className="container flex items-center justify-center">
        <NavHeader />
      </div>
    </nav>
  )
}

