"use client"

import { useState, useCallback } from "react"
import Preloader from "@/components/preloader"
import ContentWrapper from "@/components/content-wrapper"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import BackToTop from "@/components/back-to-top"
import { Analytics } from "@/components/analytics"

interface AppWrapperProps {
  children: React.ReactNode
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [showPreloader, setShowPreloader] = useState(true)

  const handleComplete = useCallback(() => {
    setShowPreloader(false)
  }, [])

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
