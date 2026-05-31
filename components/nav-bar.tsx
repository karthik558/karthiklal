"use client"

import { useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"
import NavHeader from "@/components/ui/nav-header"

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollY = useRef(0)
  const pathname = usePathname()

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

  // Explicitly check scroll position on route change in case Next.js scroll-to-top bypasses the event
  useEffect(() => {
    setIsScrolled(window.scrollY > 50)
    lastScrollY.current = window.scrollY
  }, [pathname])

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] px-4 pointer-events-none flex justify-center">
      {/* Floating Island Wrapper */}
      <div 
        className={`pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center w-full mx-auto ${
          isScrolled 
            ? "max-w-5xl mt-4 px-6 py-3 bg-background/80 backdrop-blur-2xl border border-foreground/10 shadow-2xl rounded-full" 
            : "max-w-6xl mt-6 px-4 py-2 bg-transparent border-transparent"
        }`}
      >
        <NavHeader isScrolled={isScrolled} />
      </div>
    </nav>
  )
}
