"use client"

import { ScrollSmoother } from "gsap/ScrollSmoother"

export function scrollToElement(targetId: string) {
  try {
    const targetElement = document.getElementById(targetId)
    
    if (!targetElement) {
      console.warn(`Element with id "${targetId}" not found`)
      return false
    }

    console.log(`Scrolling to element: ${targetId}`) // Debug log

    // Try to use ScrollSmoother first
    const smoother = ScrollSmoother.get()
    
    if (smoother && smoother.scrollTo) {
      console.log('Using ScrollSmoother for navigation') // Debug log
      // Use ScrollSmoother for smooth navigation with proper offset for fixed navbar
      smoother.scrollTo(targetElement, true, "top 80px")
      return true
    } else {
      console.log('Using fallback scroll navigation') // Debug log
      // Fallback to regular scrolling with offset for fixed navbar
      const yOffset = -80
      const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      return true
    }
  } catch (error) {
    console.warn("Error in scrollToElement, using fallback", error)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      // Final fallback to basic scroll with navbar offset
      const yOffset = -80
      const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      return true
    }
    return false
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

export function resetScrollPosition() {
  try {
    const smoother = ScrollSmoother.get()
    
    if (smoother) {
      smoother.scrollTo(0, false) // Instant scroll to top
      smoother.refresh()
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  } catch (error) {
    console.warn("Error resetting scroll position", error)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
}
