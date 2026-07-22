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

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
        setIsScrolled(currentScrollY > 40)
        lastScrollY.current = currentScrollY
      } else {
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolled(currentScrollY > 40)
          lastScrollY.current = currentScrollY
        }, 40)
      }
    }

    setIsScrolled(window.scrollY > 40)
    lastScrollY.current = window.scrollY

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setIsScrolled(window.scrollY > 40)
    lastScrollY.current = window.scrollY
  }, [pathname])

  return (
    <nav className="fixed left-0 right-0 top-0 z-[9999] w-full isolate pointer-events-none">
      <div 
        className={`pointer-events-auto w-full transition-all duration-300 ${
          isScrolled 
            ? "border-b-2 border-border bg-background/90 py-3.5 backdrop-blur-xl shadow-md" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <NavHeader />
        </div>
      </div>
    </nav>
  )
}

