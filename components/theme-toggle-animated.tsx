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
    return <div className="w-[76px] h-9 border-2 border-border bg-card" />
  }

  const isDark = theme === "dark"

  return (
    <div className="relative flex items-center h-9 w-[76px] p-0.5 border-2 border-border bg-card">
      {/* Animated active background pill */}
      <motion.div
        className="absolute h-7 w-[34px] bg-foreground z-0"
        initial={false}
        animate={{
          x: isDark ? 34 : 0, 
        }}
        transition={{ type: "spring", stiffness: 450, damping: 28 }}
      />

      <button
        onClick={() => setTheme("light")}
        aria-label="Light mode"
        className={`relative z-10 w-[34px] h-7 flex items-center justify-center transition-colors duration-200 ${
          !isDark ? "text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme("dark")}
        aria-label="Dark mode"
        className={`relative z-10 w-[34px] h-7 flex items-center justify-center transition-colors duration-200 ${
          isDark ? "text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  )
}

