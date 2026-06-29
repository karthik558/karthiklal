"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ArrowRight, Pointer } from "lucide-react"

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [hoverType, setHoverType] = useState<'default' | 'link' | 'external' | 'button'>('default')
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const visibleRef = useRef(false)
  const hoverKeyRef = useRef("default:false")

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const cursorXSpring = useSpring(cursorX, { damping: 28, stiffness: 250, mass: 0.1 })
  const cursorYSpring = useSpring(cursorY, { damping: 28, stiffness: 250, mass: 0.1 })

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches

    if (!hasFinePointer || window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window) {
      setIsTouchDevice(true)
      return
    }

    const setHoverState = (nextHovering: boolean, nextType: typeof hoverType = "default") => {
      const nextKey = `${nextType}:${nextHovering}`
      if (hoverKeyRef.current === nextKey) return

      hoverKeyRef.current = nextKey
      setIsHovering(nextHovering)
      setHoverType(nextType)
    }

    const updateHoverState = (target: EventTarget | null) => {
      if (!(target instanceof Element)) {
        setHoverState(false)
        return
      }

      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, summary, [data-cursor="pointer"], [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement | null

      if (!interactive) {
        setHoverState(false)
        return
      }

      if (interactive instanceof HTMLAnchorElement) {
        const isExternal =
          interactive.target === "_blank" ||
          (interactive.href.startsWith("http") && !interactive.href.includes(window.location.host))
        setHoverState(true, isExternal ? "external" : "link")
      } else {
        setHoverState(true, "button")
      }
    }

    const moveCursor = (e: PointerEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)

      if (!visibleRef.current) {
        visibleRef.current = true
        setIsVisible(true)
      }

      updateHoverState(e.target)
    }

    const hideCursor = () => {
      visibleRef.current = false
      setIsVisible(false)
      setHoverState(false)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) hideCursor()
    }

    window.addEventListener("pointermove", moveCursor, { passive: true })
    window.addEventListener("pointerleave", hideCursor)
    window.addEventListener("pointercancel", hideCursor)
    window.addEventListener("blur", hideCursor)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("pointermove", moveCursor)
      window.removeEventListener("pointerleave", hideCursor)
      window.removeEventListener("pointercancel", hideCursor)
      window.removeEventListener("blur", hideCursor)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [cursorX, cursorY])

  if (isTouchDevice) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (pointer: fine) {
          body, a, button, input, select, textarea, summary, [role="button"] {
            cursor: none !important;
          }
        }
      `}} />
      
      <div className="fixed top-0 left-0 pointer-events-none z-[10050] mix-blend-difference">
        {/* Single Elegant Trailing Ring & Hover State */}
        <motion.div
          className="absolute top-0 left-0 flex items-center justify-center"
          style={{ x: cursorXSpring, y: cursorYSpring }}
        >
          <motion.div
            animate={{
              width: isHovering ? 64 : 36,
              height: isHovering ? 64 : 36,
              opacity: isVisible ? (isHovering ? 1 : 0.6) : 0,
              x: isHovering ? -32 : -18,
              y: isHovering ? -32 : -18,
              backgroundColor: isHovering ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.05)',
            }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="rounded-full border border-white/50 backdrop-blur-[2px] flex items-center justify-center relative overflow-hidden shadow-sm shadow-white/10"
          >
            {/* Context Icons Inside Cursor */}
            <AnimatePresence>
              {isHovering && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                  transition={{ duration: 0.2 }}
                  className="absolute text-black flex items-center justify-center w-full h-full"
                >
                  {hoverType === 'external' ? (
                    <ArrowUpRight className="w-5 h-5" />
                  ) : hoverType === 'link' ? (
                    <ArrowRight className="w-5 h-5" />
                  ) : (
                    <Pointer className="w-4 h-4" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Inner Dot (Instant) */}
        <motion.div
          className="absolute top-0 left-0"
          style={{ x: cursorX, y: cursorY }}
        >
          <motion.div
            animate={{
              opacity: isVisible ? 1 : 0,
              scale: isHovering ? 0 : 1,
              x: -3, y: -3,
            }}
            transition={{ duration: 0.1 }}
            className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]"
          />
        </motion.div>
      </div>
    </>
  )
}
