"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion"
import { ArrowRight, ArrowUpRight } from "lucide-react"

type HoverType = "default" | "link" | "external" | "button"

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [hoverType, setHoverType] = useState<HoverType>("default")
  const [isFinePointer, setIsFinePointer] = useState(false)
  const visibleRef = useRef(false)
  const hoverKeyRef = useRef("default:false")
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const trailingX = useSpring(x, { stiffness: 420, damping: 32, mass: 0.18 })
  const trailingY = useSpring(y, { stiffness: 420, damping: 32, mass: 0.18 })

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)").matches
    if (!finePointer) return

    setIsFinePointer(true)
    document.documentElement.classList.add("has-custom-cursor")

    const setHoverState = (hovering: boolean, type: HoverType = "default") => {
      const key = `${type}:${hovering}`
      if (hoverKeyRef.current === key) return
      hoverKeyRef.current = key
      setIsHovering(hovering)
      setHoverType(type)
    }

    const detectTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return setHoverState(false)
      const interactive = target.closest('a, button, [role="button"], input, textarea, select, summary, [data-cursor], [tabindex]:not([tabindex="-1"])') as HTMLElement | null
      if (!interactive) return setHoverState(false)

      if (interactive instanceof HTMLAnchorElement) {
        const external = interactive.target === "_blank" || (interactive.href.startsWith("http") && !interactive.href.includes(window.location.host))
        return setHoverState(true, external ? "external" : "link")
      }
      setHoverState(true, "button")
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
      setHoverState(false)
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

  return (
    <div className="pointer-events-none fixed inset-0 z-[10050] overflow-hidden" aria-hidden="true">
      <motion.div className="absolute left-0 top-0 will-change-transform" style={{ x: trailingX, y: trailingY }}>
        <motion.div
          animate={{
            width: isHovering ? 48 : 30,
            height: isHovering ? 48 : 30,
            x: isHovering ? -24 : -15,
            y: isHovering ? -24 : -15,
            opacity: isVisible ? 1 : 0,
            scale: isPressed ? 0.82 : 1,
          }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className={`grid place-items-center rounded-full border backdrop-blur-sm transition-colors duration-200 ${isHovering ? "border-primary bg-primary text-primary-foreground shadow-[0_8px_30px_hsl(var(--primary)/0.28)]" : "border-primary/60 bg-background/10 text-primary"}`}
        >
          <AnimatePresence mode="wait">
            {isHovering && (
              <motion.span key={hoverType} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.14 }}>
                {hoverType === "external" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div className="absolute left-0 top-0 will-change-transform" style={{ x, y }}>
        <motion.span animate={{ opacity: isVisible ? 1 : 0, scale: isHovering || isPressed ? 0 : 1 }} className="block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.7)]" />
      </motion.div>
    </div>
  )
}
