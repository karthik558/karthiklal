"use client"

import { useState, useCallback, useEffect } from "react"
import { usePathname } from "next/navigation"
import Preloader from "@/components/preloader"
import ContentWrapper from "@/components/content-wrapper"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import BackToTop from "@/components/back-to-top"
import { Analytics } from "@/components/analytics"
import { scrollToElement } from "@/lib/scroll-utils"

interface AppWrapperProps {
  children: React.ReactNode
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [showPreloader, setShowPreloader] = useState(true)
  const pathname = usePathname()

  const handleComplete = useCallback(() => {
    setShowPreloader(false)
  }, [])

  // Handle hash navigation for cross-page links
  useEffect(() => {
    if (!showPreloader && pathname === '/' && typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash) {
        const targetId = hash.substring(1)
        console.log('Hash detected:', hash, 'Target ID:', targetId) // Debug log

        // Function to attempt scrolling
        const attemptScroll = (retryCount = 0) => {
          const success = scrollToElement(targetId)
          
          if (!success && retryCount < 5) {
            // Retry with exponential backoff
            setTimeout(() => {
              console.log(`Retry attempt ${retryCount + 1} for scrolling to ${targetId}`)
              attemptScroll(retryCount + 1)
            }, 200 * Math.pow(2, retryCount)) // 200ms, 400ms, 800ms, 1600ms, 3200ms
          } else if (success) {
            // Clean up the hash from URL after successful scrolling
            setTimeout(() => {
              window.history.replaceState(null, '', window.location.pathname)
            }, 100)
          }
        }

        // Start attempting to scroll after a short delay
        setTimeout(() => {
          attemptScroll()
        }, 300)
      }
    }
  }, [pathname, showPreloader])

  return (
    <>
      {showPreloader && <Preloader onComplete={handleComplete} />}
      {!showPreloader && (
        <>
          <NavBar />
          <ContentWrapper>
            <main>{children}</main>
            <Footer />
          </ContentWrapper>
          <BackToTop />
          <Analytics />
        </>
      )}
    </>
  )
}
