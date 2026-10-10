"use client"

import { useEffect, useState, useRef } from "react"
import NavHeader from "@/components/ui/nav-header"
import { cn } from "@/lib/utils"

export default function NavBar() {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Always visible near top of the page
      if (currentScrollY < 50) {
        setIsVisible(true)
        lastScrollY.current = currentScrollY
        return
      }

      const diff = currentScrollY - lastScrollY.current

      // Require meaningful scroll to prevent jitter
      if (Math.abs(diff) > 6) {
        if (diff > 0 && currentScrollY > 70) {
          // Scrolling down -> hide navbar
          setIsVisible(false)
        } else if (diff < 0) {
          // Scrolling up -> show navbar
          setIsVisible(true)
        }
        lastScrollY.current = currentScrollY
      }
    }

    lastScrollY.current = window.scrollY
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 top-0 z-[9999] w-full isolate pointer-events-none pt-2.5 sm:pt-3.5 transition-all duration-300 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6 flex justify-center">
        <NavHeader />
      </div>
    </nav>
  )
}
