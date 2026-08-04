"use client"

import { useTheme } from "next-themes"
import { type MouseEvent, useSyncExternalStore } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Moon, Sun } from "lucide-react"

const subscribeToClient = () => () => undefined

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => {
    finished: Promise<void>
  }
}

export function ThemeToggleAnimated() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(subscribeToClient, () => true, () => false)
  const prefersReducedMotion = useReducedMotion()

  if (!mounted) {
    return <div className="h-9 w-[76px] border-2 border-border bg-card" aria-hidden="true" />
  }

  const isDark = resolvedTheme === "dark"

  const changeTheme = (nextTheme: "light" | "dark", event: MouseEvent<HTMLButtonElement>) => {
    if ((nextTheme === "dark") === isDark) return

    const root = document.documentElement
    const documentWithTransitions = document as ViewTransitionDocument
    const applyTheme = () => {
      setTheme(nextTheme)
      root.classList.toggle("dark", nextTheme === "dark")
      root.style.colorScheme = nextTheme
    }

    if (prefersReducedMotion) {
      applyTheme()
      return
    }

    root.style.setProperty("--theme-transition-x", `${event.clientX}px`)
    root.style.setProperty("--theme-transition-y", `${event.clientY}px`)

    if (!documentWithTransitions.startViewTransition) {
      root.classList.add("theme-transition-fallback")
      applyTheme()
      window.setTimeout(() => root.classList.remove("theme-transition-fallback"), 1200)
      return
    }

    root.classList.add("theme-transitioning")

    try {
      const transition = documentWithTransitions.startViewTransition(applyTheme)
      void transition.finished.finally(() => {
        root.classList.remove("theme-transitioning")
      })
    } catch {
      root.classList.remove("theme-transitioning")
      applyTheme()
    }
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
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />

      <button
        type="button"
        onClick={(event) => changeTheme("light", event)}
        aria-label="Light mode"
        aria-pressed={!isDark}
        className={`relative z-10 grid h-7 w-[34px] place-items-center ${
          !isDark ? "text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <motion.span
          initial={false}
          animate={{ rotate: isDark ? -55 : 0, scale: isDark ? 0.78 : 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Sun className="h-4 w-4" />
        </motion.span>
      </button>

      <button
        type="button"
        onClick={(event) => changeTheme("dark", event)}
        aria-label="Dark mode"
        aria-pressed={isDark}
        className={`relative z-10 grid h-7 w-[34px] place-items-center ${
          isDark ? "text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <motion.span
          initial={false}
          animate={{ rotate: isDark ? 0 : 55, scale: isDark ? 1 : 0.78 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Moon className="h-4 w-4" />
        </motion.span>
      </button>
    </div>
  )
}
