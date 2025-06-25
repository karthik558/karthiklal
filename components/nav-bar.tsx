"use client"

import { useEffect, useState } from "react"
import NavHeader from "@/components/ui/nav-header"

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "py-2 bg-background/60 backdrop-blur-xl border-b border-primary/10 shadow-lg shadow-primary/5" 
          : "py-4 bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-center">
        <NavHeader />
      </div>
    </nav>
  )
}

