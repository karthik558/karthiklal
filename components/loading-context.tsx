"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type LoadingContextType = {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set a timeout to simulate loading resources
    setTimeout(() => {
      setIsLoading(false)
    }, 2500)
  }, [])

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}