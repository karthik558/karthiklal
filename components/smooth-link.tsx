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
    // Always call onClick callback first (for closing mobile menu, etc.)
    if (onClick) onClick()
    
    console.log(`SmoothLink clicked: href=${href}, currentPath=${pathname}`) // Debug log
    
    // Check if it's an anchor link to home page sections
    if (href.startsWith('/#')) {
      const targetId = href.substring(2) // Remove /#
      
      if (pathname === '/') {
        // Same page - prevent default and scroll smoothly
        console.log(`Same page navigation to: ${targetId}`)
        e.preventDefault()
        scrollToElement(targetId)
      } else {
        // Cross-page navigation - let Next.js handle it with hash
        console.log(`Cross-page navigation from ${pathname} to ${href}`)
        
        // Disable scroll restoration temporarily to prevent auto-scroll to top
        if (typeof window !== 'undefined') {
          // Store the intended scroll target
          sessionStorage.setItem('pendingScrollTarget', targetId)
        }
        
        // Next.js Link will handle this automatically
      }
    } else if (href.startsWith('#')) {
      // Same page anchor link without the leading slash
      if (pathname === '/') {
        e.preventDefault()
        const targetId = href.substring(1) // Remove #
        console.log(`Same page anchor navigation to: ${targetId}`)
        scrollToElement(targetId)
      } else {
        // Convert to full path for cross-page navigation
        console.log(`Converting anchor to full path: ${href} -> /${href}`)
        e.preventDefault()
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('pendingScrollTarget', href.substring(1))
        }
        window.location.href = `/${href}`
      }
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
