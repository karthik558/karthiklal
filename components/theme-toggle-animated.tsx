"use client"

import { useTheme } from "next-themes"
import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon } from "lucide-react"

export function ThemeToggleAnimated() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = useCallback(() => {
    setIsTransitioning(true)
    
    // Add a subtle screen flash effect
    document.body.style.transition = 'filter 0.1s ease-out'
    document.body.style.filter = 'brightness(1.2) contrast(1.1)'
    
    setTimeout(() => {
      document.body.style.filter = 'none'
    }, 100)
    
    // Start the theme change after a short delay to allow animation to begin
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark")
    }, 300)
    
    // End transition after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
      document.body.style.transition = ''
    }, 1000)
  }, [theme, setTheme])

  if (!mounted) {
    return <div className="w-10 h-10" />
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={handleThemeChange}
        disabled={isTransitioning}
        className="relative h-10 w-10 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors duration-200 disabled:cursor-not-allowed"
        aria-label="Toggle theme"
      >
        <motion.div
          initial={false}
          animate={{
            rotate: theme === "dark" ? 0 : 180,
            scale: isTransitioning ? 1.2 : 1,
          }}
          transition={{ 
            duration: isTransitioning ? 0.3 : 0.5, 
            type: "spring",
            stiffness: 200
          }}
          className="absolute overflow-hidden"
        >
          {theme === "dark" ? (
            <Moon className="h-5 w-5 text-foreground" />
          ) : (
            <Sun className="h-5 w-5 text-foreground" />
          )}
        </motion.div>
      </motion.button>

      {/* Elegant theme transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-[99999] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Main transition circle */}
            <motion.div
              className="absolute inset-0 z-0"
              style={{
                background: theme === "dark" 
                  ? "hsl(var(--background))"
                  : "hsl(var(--background))"
              }}
              initial={{
                clipPath: "circle(0% at 50% 50%)",
              }}
              animate={{
                clipPath: "circle(150% at 50% 50%)",
              }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.23, 1, 0.32, 1]
              }}
            />

            {/* Subtle gradient overlay */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: theme === "dark" 
                  ? "radial-gradient(circle at center, hsl(var(--background)) 0%, hsl(var(--muted) / 0.5) 50%, hsl(var(--background)) 100%)"
                  : "radial-gradient(circle at center, hsl(var(--background)) 0%, hsl(var(--muted) / 0.3) 50%, hsl(var(--background)) 100%)"
              }}
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0.8, 1.2, 1],
              }}
              transition={{
                duration: 1,
                ease: "easeInOut"
              }}
            />

            {/* Minimal particle effect */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute z-10 rounded-full bg-primary/60"
                style={{
                  left: `${45 + Math.random() * 10}%`,
                  top: `${45 + Math.random() * 10}%`,
                  width: `${2 + Math.random() * 3}px`,
                  height: `${2 + Math.random() * 3}px`,
                }}
                initial={{
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  scale: [0, 1.5, 1, 0],
                  opacity: [0, 1, 0.8, 0],
                  x: [0, (Math.random() - 0.5) * 120],
                  y: [0, (Math.random() - 0.5) * 120],
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.1 + (i * 0.08),
                  ease: "easeOut"
                }}
              />
            ))}

            {/* Night mode stars */}
            {theme === "dark" && [...Array(15)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute z-10"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: '4px',
                  height: '4px',
                }}
                initial={{
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  opacity: [0, 1, 0.8, 1, 0.7],
                  scale: [0, 1.5, 1.2, 1.5],
                }}
                transition={{
                  duration: 2.5,
                  delay: 0.1 + (i * 0.05),
                  repeat: 2,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              >
                <div 
                  className="w-full h-full bg-primary" 
                  style={{
                    clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
                    boxShadow: '0 0 8px hsl(var(--primary) / 0.8)',
                  }}
                />
              </motion.div>
            ))}

            {/* Day mode light particles */}
            {theme === "light" && [...Array(12)].map((_, i) => (
              <motion.div
                key={`light-${i}`}
                className="absolute z-10 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${3 + Math.random() * 4}px`,
                  height: `${3 + Math.random() * 4}px`,
                  background: 'radial-gradient(circle, hsl(var(--primary)), hsl(var(--primary) / 0.3))',
                  boxShadow: '0 0 12px hsl(var(--primary) / 0.6)',
                }}
                initial={{
                  opacity: 0,
                  scale: 0,
                  y: 30,
                }}
                animate={{
                  opacity: [0, 1, 0.8, 0.4, 0],
                  scale: [0, 2, 1.5, 1, 0],
                  y: [30, -40 - Math.random() * 60],
                  x: [0, (Math.random() - 0.5) * 50],
                }}
                transition={{
                  duration: 2.2,
                  delay: 0.1 + (i * 0.06),
                  ease: "easeOut"
                }}
              />
            ))}

            {/* Final smooth wash */}
            <motion.div
              className="absolute inset-0 bg-background/90"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 0.6,
                delay: 0.8,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
