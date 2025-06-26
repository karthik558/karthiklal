"use client"

import { ScrollSmoother } from "gsap/ScrollSmoother"

export function scrollToElement(targetId: string) {
  try {
    const targetElement = document.getElementById(targetId)
    
    if (!targetElement) {
      console.warn(`Element with id "${targetId}" not found`)
      return
    }

    // Try to use ScrollSmoother first
    const smoother = ScrollSmoother.get()
    
    if (smoother && smoother.scrollTo) {
      // Use ScrollSmoother for smooth navigation
      smoother.scrollTo(targetElement, true, "top 100px")
    } else {
      // Fallback to regular scrolling with offset
      const yOffset = -100
      const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  } catch (error) {
    console.warn("Error in scrollToElement, using fallback", error)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      // Final fallback to basic scroll
      const yOffset = -100
      const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }
}

export function scrollToTop() {
  try {
    const smoother = ScrollSmoother.get()
    
    if (smoother) {
      smoother.scrollTo(0, true)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } catch (error) {
    console.warn("Error in scrollToTop, using fallback", error)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

export function getCurrentScrollProgress(): number {
  try {
    const smoother = ScrollSmoother.get()
    
    if (smoother && typeof smoother.progress === 'number') {
      return smoother.progress
    } else {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1 // Prevent division by zero
      )
      return Math.min(scrollTop / scrollHeight, 1)
    }
  } catch (error) {
    console.warn('Error getting scroll progress, falling back to window scroll', error)
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    )
    return Math.min(scrollTop / scrollHeight, 1)
  }
}
