"use client"

import { useTheme } from "next-themes"
import { type MouseEvent, useSyncExternalStore } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { playProfileThemeToggleSound } from "@/lib/sound-fx"

const subscribeToClient = () => () => undefined

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => {
    finished: Promise<void>
  }
}

import { cn } from "@/lib/utils"

interface ThemeToggleAnimatedProps {
  size?: "default" | "sm"
  className?: string
}

export function ThemeToggleAnimated({ size = "default", className }: ThemeToggleAnimatedProps = {}) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(subscribeToClient, () => true, () => false)
  const prefersReducedMotion = useReducedMotion()

  const isSm = size === "sm"

  if (!mounted) {
    return (
      <div
        className={cn(
          isSm ? "h-[30px] w-[58px] border border-border bg-card" : "h-11 w-[84px] border border-border bg-card",
          className
        )}
        aria-hidden="true"
      />
    )
  }

  const isDark = resolvedTheme === "dark"

  const changeTheme = (nextTheme: "light" | "dark", event: MouseEvent<HTMLButtonElement>) => {
    if ((nextTheme === "dark") === isDark) return
    playProfileThemeToggleSound()

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
      className={cn(
        "relative flex items-center overflow-hidden transition-colors select-none",
        isSm ? "h-[30px] w-[58px] shrink-0 border border-border bg-card p-px" : "h-11 w-[84px] shrink-0 border border-border bg-card p-px",
        className
      )}
      role="group"
      aria-label="Color theme"
    >
      <motion.div
        className={cn(
          "absolute left-px top-px z-0 bg-foreground",
          isSm ? "h-[28px] w-[28px] shrink-0" : "h-10 w-10 shrink-0"
        )}
        initial={false}
        animate={{ x: isDark ? (isSm ? 28 : 40) : 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />

      <button
        type="button"
        onClick={(event) => changeTheme("light", event)}
        aria-label="Light mode"
        aria-pressed={!isDark}
        className={cn(
          "relative z-10 grid place-items-center transition-colors cursor-pointer",
          isSm ? "h-[28px] w-[28px] shrink-0" : "h-10 w-10 shrink-0",
          !isDark ? "text-background" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <motion.span
          initial={false}
          animate={{ rotate: isDark ? -55 : 0, scale: isDark ? 0.78 : 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Sun className={isSm ? "h-3 w-3" : "h-4 w-4"} />
        </motion.span>
      </button>

      <button
        type="button"
        onClick={(event) => changeTheme("dark", event)}
        aria-label="Dark mode"
        aria-pressed={isDark}
        className={cn(
          "relative z-10 grid place-items-center transition-colors cursor-pointer",
          isSm ? "h-[28px] w-[28px] shrink-0" : "h-10 w-10 shrink-0",
          isDark ? "text-background" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <motion.span
          initial={false}
          animate={{ rotate: isDark ? 0 : 55, scale: isDark ? 1 : 0.78 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Moon className={isSm ? "h-3 w-3" : "h-4 w-4"} />
        </motion.span>
      </button>
    </div>
  )
}
