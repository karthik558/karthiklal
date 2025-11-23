"use client"

export function scrollToElement(targetId: string) {
  try {
    const targetElement = document.getElementById(targetId)

    if (!targetElement) {
      console.warn(`Element with id "${targetId}" not found`)
      return false
    }

    // @ts-ignore
    if (window.lenis) {
      // @ts-ignore
      window.lenis.scrollTo(targetElement, { offset: -100 })
      return true
    } else {
      const yOffset = -100
      const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      return true
    }
  } catch (error) {
    console.warn("Error in scrollToElement, using fallback", error)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      const yOffset = -100
      const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      return true
    }
    return false
  }
}

export function scrollToTop() {
  try {
    // @ts-ignore
    if (window.lenis) {
      // @ts-ignore
      window.lenis.scrollTo(0)
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
    // @ts-ignore
    if (window.lenis) {
      // @ts-ignore
      return window.lenis.progress
    } else {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
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
    // @ts-ignore
    if (window.lenis) {
      // @ts-ignore
      window.lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  } catch (error) {
    console.warn("Error resetting scroll position", error)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
}
