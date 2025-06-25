"use client"

import { motion } from "framer-motion"
import { useState, useCallback } from "react"
import Preloader from "@/components/preloader"

const DemoOne = () => {
  const [showPreloader, setShowPreloader] = useState(true)

  const handleComplete = useCallback(() => {
    setShowPreloader(false)
  }, [])

  const handleReplay = useCallback(() => {
    setShowPreloader(true)
  }, [])

  return (
    <>
      {showPreloader && <Preloader onComplete={handleComplete} />}
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          className="text-center space-y-8 max-w-3xl"
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">Welcome</h1>
          <p className="text-xl text-muted-foreground">
            Your content has loaded successfully. The preloader animation has completed.
          </p>
          <button
            onClick={handleReplay}
            className="px-6 py-3 mt-6 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
          >
            Replay Preloader
          </button>
        </motion.div>
      </main>
    </>
  )
}

export { DemoOne }
