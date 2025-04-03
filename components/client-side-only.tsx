"use client"

import type React from "react"
import { useEffect, useState } from "react"

export default function ClientSideOnly({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    // Return a placeholder with the same structure to avoid layout shift
    return <div style={{ visibility: "hidden" }}>{children}</div>
  }

  return <>{children}</>
}

