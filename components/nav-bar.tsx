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
    <nav className="fixed left-0 right-0 top-0 z-[9999] flex justify-center pointer-events-none isolate px-0 md:px-3 sm:px-4">
      <div 
        className={`pointer-events-auto mx-auto flex w-full items-center justify-center transition-all duration-500 ease-out md:w-auto ${
          isScrolled 
            ? "border-b border-border/40 bg-background/80 px-4 py-2.5 shadow-sm backdrop-blur-xl md:mt-3 md:rounded-full md:border md:border-border/70 md:bg-background/86 md:px-6 md:py-2 md:shadow-lg md:shadow-black/5 dark:md:shadow-black/25" 
            : "bg-transparent px-4 py-4 md:mt-4 md:rounded-full md:border md:border-border/60 md:bg-background/58 md:px-6 md:py-2 md:shadow-sm md:backdrop-blur-xl"
        }`}
      >
        <NavHeader />
      </div>
    </nav>
  )
}
