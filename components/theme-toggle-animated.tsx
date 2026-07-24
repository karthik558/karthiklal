"use client"

import { flushSync } from "react-dom"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => {
    finished: Promise<void>
  }
}

export function ThemeToggleAnimated() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-9 w-[76px] border-2 border-border bg-card" aria-hidden="true" />
  }

  const isDark = resolvedTheme === "dark"

  const changeTheme = (nextTheme: "light" | "dark") => {
    if ((nextTheme === "dark") === isDark) return

    const root = document.documentElement
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const viewTransitionDocument = document as ViewTransitionDocument

    if (prefersReducedMotion || !viewTransitionDocument.startViewTransition) {
      setTheme(nextTheme)
      return
    }

    root.classList.add("theme-transitioning")
    const transition = viewTransitionDocument.startViewTransition(() => {
      flushSync(() => setTheme(nextTheme))
    })

    void transition.finished.finally(() => {
      root.classList.remove("theme-transitioning")
    })
  }

  return (
    <div
      className="relative flex h-9 w-[76px] items-center overflow-hidden border-2 border-border bg-card p-0.5"
      role="group"
      aria-label="Color theme"
    >
      <motion.div
        className="absolute left-0.5 top-0.5 z-0 h-7 w-[34px] bg-foreground"
        initial={false}
        animate={{ x: isDark ? 34 : 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      />

      <button
        type="button"
        onClick={() => changeTheme("light")}
        aria-label="Light mode"
        aria-pressed={!isDark}
        className={`relative z-10 grid h-7 w-[34px] place-items-center ${
          !isDark ? "text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <motion.span
          initial={false}
          animate={{ rotate: isDark ? -55 : 0, scale: isDark ? 0.78 : 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Sun className="h-4 w-4" />
        </motion.span>
      </button>

      <button
        type="button"
        onClick={() => changeTheme("dark")}
        aria-label="Dark mode"
        aria-pressed={isDark}
        className={`relative z-10 grid h-7 w-[34px] place-items-center ${
          isDark ? "text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <motion.span
          initial={false}
          animate={{ rotate: isDark ? 0 : 55, scale: isDark ? 1 : 0.78 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Moon className="h-4 w-4" />
        </motion.span>
      </button>
    </div>
  )
}
