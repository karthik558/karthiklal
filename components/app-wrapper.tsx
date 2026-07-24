"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Preloader from "@/components/preloader"
import ContentWrapper from "@/components/content-wrapper"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import BackToTop from "@/components/back-to-top"
import ClientEnhancements from "@/components/client-enhancements"
import { Analytics } from "@/components/analytics"
import { scrollToElement } from "@/lib/scroll-utils"

interface AppWrapperProps {
  children: React.ReactNode
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [showPreloader, setShowPreloader] = useState(true)
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin') ?? false
  const handlePreloaderComplete = useCallback(() => setShowPreloader(false), [])

  // Handle hash navigation for cross-page links
  useEffect(() => {
    if (pathname === '/' && typeof window !== 'undefined') {
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
        // Function to attempt scrolling with less aggressive locking
        const attemptScroll = (retryCount = 0) => {
          // First check if the element exists
          const targetElement = document.getElementById(targetId)
          if (!targetElement && retryCount < 8) {
            // Element not found, retry with reasonable delay
            setTimeout(() => {
              attemptScroll(retryCount + 1)
            }, 300 + (retryCount * 200)) // Progressive delays: 300ms, 500ms, 700ms, etc.
            return
          }

          if (targetElement) {
            // Element found, attempt to scroll without aggressive locking
            setTimeout(() => {
              const success = scrollToElement(targetId)
              
              if (success) {
                // Clean up the hash from URL after successful scrolling
                if (hash) {
                  setTimeout(() => {
                    window.history.replaceState(null, '', window.location.pathname)
                  }, 500)
                }
              } else if (retryCount < 8) {
                // Scroll failed, retry
                setTimeout(() => {
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
  }, [pathname])

  return (
    <>
      {!isAdmin && (
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100000000] -translate-y-24 border-2 border-foreground bg-background px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
      )}
      {showPreloader && !isAdmin && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}
      {!isAdmin && <NavBar />}
          
      {isAdmin ? (
        <main>{children}</main>
      ) : (
        <ContentWrapper>
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
        </ContentWrapper>
      )}

      {!isAdmin && <BackToTop />}
      {!isAdmin && <ClientEnhancements />}
      <Analytics />
    </>
  )
}
