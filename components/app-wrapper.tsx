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
      let targetId = ''
      
      // Check for hash in URL first
      const hash = window.location.hash
      if (hash) {
        targetId = hash.substring(1)
      } else {
        // Check session storage for pending target
        const pendingTarget = sessionStorage.getItem('pendingScrollTarget')
        if (pendingTarget) {
          targetId = pendingTarget
          sessionStorage.removeItem('pendingScrollTarget')
        }
      }
      
      if (targetId) {
        console.log('Target detected:', targetId) // Debug log

        // Function to attempt scrolling with less aggressive locking
        const attemptScroll = (retryCount = 0) => {
          console.log(`Attempting to scroll to ${targetId}, retry: ${retryCount}`)
          
          // First check if the element exists
          const targetElement = document.getElementById(targetId)
          if (!targetElement && retryCount < 8) {
            // Element not found, retry with reasonable delay
            setTimeout(() => {
              console.log(`Element not found, retry attempt ${retryCount + 1} for ${targetId}`)
              attemptScroll(retryCount + 1)
            }, 300 + (retryCount * 200)) // Progressive delays: 300ms, 500ms, 700ms, etc.
            return
          }

          if (targetElement) {
            // Element found, attempt to scroll without aggressive locking
            setTimeout(() => {
              const success = scrollToElement(targetId)
              
              if (success) {
                console.log(`Successfully scrolled to ${targetId}`)
                
                // Clean up the hash from URL after successful scrolling
                if (hash) {
                  setTimeout(() => {
                    window.history.replaceState(null, '', window.location.pathname)
                  }, 500)
                }
              } else if (retryCount < 8) {
                // Scroll failed, retry
                setTimeout(() => {
                  console.log(`Scroll failed, retry attempt ${retryCount + 1} for ${targetId}`)
                  attemptScroll(retryCount + 1)
                }, 300 + (retryCount * 200))
              } else {
                console.warn(`Failed to scroll to ${targetId} after ${retryCount + 1} attempts`)
              }
            }, 200) // Small delay to ensure element is ready
          } else {
            console.warn(`Element ${targetId} not found after ${retryCount + 1} attempts`)
          }
        }

        // Start attempting to scroll after waiting for page content to load
        setTimeout(() => {
          attemptScroll()
        }, 600) // Reduced initial delay for better responsiveness
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
