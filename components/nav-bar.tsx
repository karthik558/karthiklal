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
    <nav className="fixed left-0 right-0 top-0 z-[9999] flex justify-center px-3 pointer-events-none isolate sm:px-4">
      <div 
        className={`pointer-events-auto mx-auto flex w-full items-center justify-center border transition-all duration-500 ease-out ${
          isScrolled 
            ? "mt-3 max-w-5xl rounded-2xl border-border/70 bg-background/86 px-3 py-2 shadow-lg shadow-black/5 backdrop-blur-2xl dark:shadow-black/25 sm:px-4" 
            : "mt-4 max-w-6xl rounded-2xl border-border/60 bg-background/58 px-3 py-2 shadow-sm backdrop-blur-xl sm:px-4"
        }`}
      >
        <NavHeader isScrolled={isScrolled} />
      </div>
    </nav>
  )
}
