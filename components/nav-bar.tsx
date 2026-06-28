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
    <nav className="fixed left-0 right-0 top-0 z-[9999] flex justify-center px-4 pointer-events-none isolate">
      <div 
        className={`pointer-events-auto mx-auto flex w-full items-center justify-center transition-all duration-500 ease-out ${
          isScrolled 
            ? "mt-4 max-w-5xl rounded-full border border-foreground/10 bg-background/85 px-5 py-2.5 shadow-xl shadow-black/5 backdrop-blur-2xl dark:shadow-black/30" 
            : "mt-5 max-w-6xl rounded-full border border-foreground/10 bg-background/35 px-4 py-2 shadow-lg shadow-black/5 backdrop-blur-xl"
        }`}
      >
        <NavHeader isScrolled={isScrolled} />
      </div>
    </nav>
  )
}
