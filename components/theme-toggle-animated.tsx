"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Cloud } from "lucide-react"

export function ThemeToggleAnimated() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-10 h-10" />
  }

  const isDark = theme === "dark"

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative w-16 h-9 rounded-full p-1 transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-primary/50 ${isDark ? "bg-slate-950 border border-slate-800" : "bg-sky-200 border border-sky-300"
        }`}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {/* Stars for Dark Mode */}
        <motion.div
          initial={false}
          animate={{ opacity: isDark ? 1 : 0, y: isDark ? 0 : 10 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                top: `${Math.random() * 60 + 20}%`,
                left: `${Math.random() * 50 + 40}%`,
                width: Math.random() * 2 + 1 + "px",
                height: Math.random() * 2 + 1 + "px",
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </motion.div>

        {/* Clouds for Light Mode */}
        <motion.div
          initial={false}
          animate={{ opacity: isDark ? 0 : 1, x: isDark ? 20 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          <Cloud className="absolute top-1 left-8 w-4 h-4 text-white/80 fill-white/80" />
          <Cloud className="absolute bottom-0 left-5 w-3 h-3 text-white/60 fill-white/60" />
        </motion.div>
      </div>

      {/* Toggle Handle (Sun/Moon) */}
      <motion.div
        className="relative w-7 h-7 rounded-full shadow-md z-10 flex items-center justify-center overflow-hidden"
        initial={false}
        animate={{
          x: isDark ? 28 : 0,
          backgroundColor: isDark ? "#fbbf24" : "#ffffff", // Moon color (yellowish) vs Sun color (white) - wait, usually Sun is yellow. Let's swap.
          // Actually, let's make Sun yellow/orange and Moon white/silver
          background: isDark
            ? "linear-gradient(to bottom right, #e2e8f0, #94a3b8)" // Moon: Slate/Silver
            : "linear-gradient(to bottom right, #fcd34d, #f59e0b)" // Sun: Amber/Orange
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-4 h-4 text-slate-700 fill-slate-700" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-4 h-4 text-white fill-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  )
}
