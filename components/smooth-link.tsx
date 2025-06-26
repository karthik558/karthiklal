"use client"

import React from "react"
import Link from "next/link"
import { scrollToElement } from "@/lib/scroll-utils"

interface SmoothLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function SmoothLink({ href, children, className, onClick }: SmoothLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Check if it's an anchor link to current page
    if (href.startsWith('/#')) {
      e.preventDefault()
      const targetId = href.substring(2) // Remove /#
      scrollToElement(targetId)
      if (onClick) onClick()
    } else if (href.startsWith('#')) {
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
