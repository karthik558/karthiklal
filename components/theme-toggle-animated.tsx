"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"

export function ThemeToggleAnimated() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-[72px] h-9" />
  }

  const isDark = theme === "dark"

  return (
    <div className="relative flex items-center p-1 rounded-full bg-foreground/5 border border-foreground/10 backdrop-blur-md">
      {/* Animated active background pill */}
      <motion.div
        className="absolute w-8 h-7 bg-background rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-foreground/5 z-0"
        initial={false}
        animate={{
          x: isDark ? 32 : 0, 
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />

      <button
        onClick={() => setTheme("light")}
        aria-label="Light mode"
        className={`relative z-10 w-8 h-7 flex items-center justify-center rounded-full transition-colors duration-300 ${
          !isDark ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme("dark")}
        aria-label="Dark mode"
        className={`relative z-10 w-8 h-7 flex items-center justify-center rounded-full transition-colors duration-300 ${
          isDark ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  )
}
