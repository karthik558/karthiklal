"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { scrollToTop } from "@/lib/scroll-utils"

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * .7)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])
  return visible ? <a href="#main-content" className="back-to-top-text" aria-label="Back to top" onClick={event => {
    event.preventDefault()
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (window.lenis) window.lenis.scrollTo(0, { immediate: true })
      else window.scrollTo({ top: 0, behavior: "instant" })
    } else scrollToTop()
    document.getElementById("main-content")?.focus({ preventScroll: true })
  }}><ArrowUp size={16} aria-hidden="true" /><span>BACK TO TOP</span></a> : null
}
