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

        // Prevent any auto-scroll to top behaviors
        let scrollLocked = false
        const lockScroll = () => {
          if (!scrollLocked) {
            scrollLocked = true
            window.addEventListener('scroll', preventScroll, { passive: false })
          }
        }
        
        const unlockScroll = () => {
          if (scrollLocked) {
            scrollLocked = false
            window.removeEventListener('scroll', preventScroll)
          }
        }

        const preventScroll = (e: Event) => {
          if (scrollLocked) {
            e.preventDefault()
            return false
          }
        }

        // Function to attempt scrolling
        const attemptScroll = (retryCount = 0) => {
          console.log(`Attempting to scroll to ${targetId}, retry: ${retryCount}`)
          
          // First check if the element exists
          const targetElement = document.getElementById(targetId)
          if (!targetElement && retryCount < 10) {
            // Element not found, retry with longer delay
            setTimeout(() => {
              console.log(`Element not found, retry attempt ${retryCount + 1} for ${targetId}`)
              attemptScroll(retryCount + 1)
            }, 200 * (retryCount + 1)) // Progressive delays: 200ms, 400ms, 600ms, etc.
            return
          }

          if (targetElement) {
            // Lock scroll temporarily to prevent interference
            lockScroll()
            
            // Wait a moment then scroll
            setTimeout(() => {
              const success = scrollToElement(targetId)
              
              if (success) {
                console.log(`Successfully scrolled to ${targetId}`)
                
                // Keep scroll locked for a moment to ensure position is maintained
                setTimeout(() => {
                  unlockScroll()
                  // Clean up the hash from URL after successful scrolling
                  if (hash) {
                    setTimeout(() => {
                      window.history.replaceState(null, '', window.location.pathname)
                    }, 300)
                  }
                }, 800)
              } else if (retryCount < 10) {
                unlockScroll()
                // Scroll failed, retry
                setTimeout(() => {
                  console.log(`Scroll failed, retry attempt ${retryCount + 1} for ${targetId}`)
                  attemptScroll(retryCount + 1)
                }, 200 * (retryCount + 1))
              } else {
                unlockScroll()
                console.warn(`Failed to scroll to ${targetId} after ${retryCount + 1} attempts`)
              }
            }, 100)
          } else {
            console.warn(`Element ${targetId} not found after ${retryCount + 1} attempts`)
          }
        }

        // Start attempting to scroll after waiting for page content to load
        setTimeout(() => {
          attemptScroll()
        }, 1000) // Increased initial delay to ensure all components are loaded
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
