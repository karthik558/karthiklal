"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion"

type CursorState = "default" | "link" | "external" | "button" | "select" | "text" | "disabled"

const textInputTypes = new Set([
  "date",
  "datetime-local",
  "email",
  "month",
  "number",
  "password",
  "search",
  "tel",
  "text",
  "time",
  "url",
  "week",
])

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [cursorState, setCursorState] = useState<CursorState>("default")
  const [isFinePointer, setIsFinePointer] = useState(false)
  const visibleRef = useRef(false)
  const cursorStateRef = useRef<CursorState>("default")
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const trailingX = useSpring(x, { stiffness: 460, damping: 34, mass: 0.2 })
  const trailingY = useSpring(y, { stiffness: 460, damping: 34, mass: 0.2 })

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)").matches
    if (!finePointer) return

    const enableFrame = requestAnimationFrame(() => setIsFinePointer(true))
    document.documentElement.classList.add("has-custom-cursor")

    const updateCursorState = (next: CursorState) => {
      if (cursorStateRef.current === next) return
      cursorStateRef.current = next
      setCursorState(next)
    }

    const detectTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return updateCursorState("default")

      const interactive = target.closest(
        'a, button, label, input, textarea, select, summary, [contenteditable="true"], [role="button"], [data-cursor-type], [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement | null

      if (interactive) {
        if (
          interactive.matches(":disabled") ||
          interactive.getAttribute("aria-disabled") === "true"
        ) {
          return updateCursorState("disabled")
        }

        const override = interactive.dataset.cursorType as CursorState | undefined
        if (override) return updateCursorState(override)

        if (
          interactive instanceof HTMLTextAreaElement ||
          interactive.isContentEditable ||
          (interactive instanceof HTMLInputElement && textInputTypes.has(interactive.type))
        ) {
          return updateCursorState("text")
        }

        if (interactive instanceof HTMLSelectElement) {
          return updateCursorState("select")
        }

        if (interactive instanceof HTMLAnchorElement) {
          const external =
            interactive.target === "_blank" ||
            (interactive.href.startsWith("http") &&
              !interactive.href.includes(window.location.host))
          return updateCursorState(external ? "external" : "link")
        }

        return updateCursorState("button")
      }

      const selectableText = target.closest(
        "p, h1, h2, h3, h4, h5, h6, blockquote, li, code, pre, dt, dd"
      )
      updateCursorState(selectableText ? "text" : "default")
    }

    const handleMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      detectTarget(event.target)
      if (!visibleRef.current) {
        visibleRef.current = true
        setIsVisible(true)
      }
    }

    const hide = () => {
      visibleRef.current = false
      setIsVisible(false)
      setIsPressed(false)
      updateCursorState("default")
    }

    const press = () => setIsPressed(true)
    const release = () => setIsPressed(false)
    const visibility = () => document.hidden && hide()

    window.addEventListener("pointermove", handleMove, { passive: true })
    window.addEventListener("pointerdown", press, { passive: true })
    window.addEventListener("pointerup", release, { passive: true })
    window.addEventListener("pointerleave", hide)
    window.addEventListener("pointercancel", hide)
    window.addEventListener("blur", hide)
    document.addEventListener("visibilitychange", visibility)

    return () => {
      cancelAnimationFrame(enableFrame)
      document.documentElement.classList.remove("has-custom-cursor")
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerdown", press)
      window.removeEventListener("pointerup", release)
      window.removeEventListener("pointerleave", hide)
      window.removeEventListener("pointercancel", hide)
      window.removeEventListener("blur", hide)
      document.removeEventListener("visibilitychange", visibility)
    }
  }, [x, y])

  if (!isFinePointer) return null

  const hasHalo = ["link", "external", "button", "select"].includes(cursorState)
  const isText = cursorState === "text"
  const isDisabled = cursorState === "disabled"
  const isAngular = cursorState === "button" || cursorState === "select"
  const isExternal = cursorState === "external"

  return (
    <div
      className="custom-cursor-layer pointer-events-none fixed inset-0 z-[10050] overflow-hidden"
      data-cursor-state={cursorState}
      data-pressed={isPressed}
      aria-hidden="true"
    >
      <motion.div
        className="absolute left-0 top-0 will-change-transform"
        style={{ x: trailingX, y: trailingY }}
      >
        <motion.span
          data-testid="cursor-halo"
          animate={{
            width: hasHalo ? (isAngular ? 36 : 42) : 14,
            height: hasHalo ? (isAngular ? 36 : 42) : 14,
            x: hasHalo ? (isAngular ? -10 : -13) : -3,
            y: hasHalo ? (isAngular ? -10 : -13) : -3,
            opacity: isVisible && hasHalo ? 1 : 0,
            rotate: isAngular ? 45 : isExternal ? 120 : 0,
            scale: isPressed ? 0.72 : 1,
            borderRadius: isAngular ? 8 : 999,
          }}
          transition={{
            width: { duration: 0.2 },
            height: { duration: 0.2 },
            opacity: { duration: 0.14 },
            rotate: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 0.12 },
            borderRadius: { duration: 0.2 },
          }}
          className={`block border bg-background/20 shadow-sm backdrop-blur-[2px] ${
            isExternal ? "border-dashed border-foreground/80" : "border-solid border-foreground/70"
          }`}
        />
      </motion.div>

      <motion.div className="absolute left-0 top-0 will-change-transform" style={{ x, y }}>
        <AnimatePresence>
          {isVisible && isPressed && (
            <motion.span
              key="press-ripple"
              initial={{ opacity: 0.65, scale: 0.35 }}
              animate={{ opacity: 0, scale: 1.55 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.34, ease: "easeOut" }}
              className="absolute -left-3 -top-3 h-9 w-9 rounded-full border border-foreground"
            />
          )}
        </AnimatePresence>

        <motion.span
          data-testid="svg-cursor"
          animate={{
            opacity: isVisible ? (isText ? 0.46 : isDisabled ? 0.38 : 1) : 0,
            scale: isPressed ? 0.76 : isText ? 0.72 : hasHalo ? 1.05 : 1,
            rotate: isPressed ? -5 : 0,
          }}
          transition={{ duration: 0.13, ease: [0.22, 1, 0.36, 1] }}
          className="block h-8 w-8 origin-top-left bg-contain bg-left-top bg-no-repeat drop-shadow-md"
          style={{ backgroundImage: "url('/cursor/cursor.svg')" }}
        />

        <motion.span
          data-testid="cursor-text-indicator"
          animate={{
            opacity: isVisible && isText ? 1 : 0,
            scaleY: isPressed ? 0.72 : 1,
          }}
          transition={{ duration: 0.14 }}
          className="absolute -top-1 left-1 h-7 w-[2px] bg-foreground shadow-[0_0_0_1px_hsl(var(--background)/.45)]"
        >
          <span className="absolute -left-[3px] top-0 h-[2px] w-2 bg-foreground" />
          <span className="absolute bottom-0 -left-[3px] h-[2px] w-2 bg-foreground" />
        </motion.span>

        <motion.span
          animate={{
            opacity: isVisible && cursorState === "select" ? 1 : 0,
            y: isPressed ? 1 : 0,
          }}
          className="absolute left-[9px] top-[11px] h-2 w-2 rotate-45 border-b-2 border-r-2 border-foreground"
        />

        <motion.span
          animate={{
            opacity: isVisible && isDisabled ? 1 : 0,
            scale: isPressed ? 0.8 : 1,
          }}
          className="absolute -left-1 top-2 h-[2px] w-8 -rotate-45 bg-foreground"
        />
      </motion.div>
    </div>
  )
}
