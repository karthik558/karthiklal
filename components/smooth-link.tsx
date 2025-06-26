"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { scrollToElement } from "@/lib/scroll-utils"

interface SmoothLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function SmoothLink({ href, children, className, onClick }: SmoothLinkProps) {
  const pathname = usePathname()
  
  const handleClick = (e: React.MouseEvent) => {
    // Check if it's an anchor link to home page
    if (href.startsWith('/#')) {
      const targetId = href.substring(2) // Remove /#
      
      if (pathname === '/') {
        // Same page - prevent default and scroll smoothly
        e.preventDefault()
        scrollToElement(targetId)
      }
      // For cross-page navigation, let Next.js handle navigation with hash
      // The global hash handler in app-wrapper will handle scrolling after navigation
      if (onClick) onClick()
    } else if (href.startsWith('#') && pathname === '/') {
      // Same page anchor link
      e.preventDefault()
      const targetId = href.substring(1) // Remove #
      scrollToElement(targetId)
      if (onClick) onClick()
    }
    // For regular links, let Next.js handle them normally
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
