"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ArrowRight, Pointer } from "lucide-react"

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [hoverType, setHoverType] = useState<'default' | 'link' | 'external' | 'button'>('default')
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([])

  // Raw coordinates for the instant dot
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Super smooth physics for the single elegant trailing ring
  const cursorXSpring = useSpring(cursorX, { damping: 28, stiffness: 250, mass: 0.1 })
  const cursorYSpring = useSpring(cursorY, { damping: 28, stiffness: 250, mass: 0.1 })

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches

    if (!hasFinePointer || window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window) {
      setIsTouchDevice(true)
      return
    }

    const resetHover = () => {
      setIsHovering(false)
      setHoverType("default")
    }

    const updateHoverState = (target: EventTarget | null) => {
      if (!(target instanceof Element)) {
        resetHover()
        return
      }

      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, summary, [data-cursor="pointer"], [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement | null

      if (!interactive) {
        resetHover()
        return
      }

      if (interactive instanceof HTMLAnchorElement) {
        const isExternal =
          interactive.target === "_blank" ||
          (interactive.href.startsWith("http") && !interactive.href.includes(window.location.host))
        setHoverType(isExternal ? "external" : "link")
      } else {
        setHoverType("button")
      }

      setIsHovering(true)
    }

    const moveCursor = (e: PointerEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setIsVisible(true)
      updateHoverState(e.target)
    }

    const hideCursor = () => {
      setIsVisible(false)
      resetHover()
    }

    const handleClick = (e: PointerEvent) => {
      const id = Date.now()
      setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id))
      }, 500)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) hideCursor()
    }

    window.addEventListener("pointermove", moveCursor, { passive: true })
    window.addEventListener("pointerdown", handleClick, { passive: true })
    window.addEventListener("pointerleave", hideCursor)
    window.addEventListener("pointercancel", hideCursor)
    window.addEventListener("blur", hideCursor)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("pointermove", moveCursor)
      window.removeEventListener("pointerdown", handleClick)
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
      
      {/* Subtle Ripple Effects on Click */}
      <div className="fixed inset-0 pointer-events-none z-[10040] mix-blend-difference overflow-hidden">
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.div
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.5, borderWidth: "2px" }}
              animate={{ scale: 1.5, opacity: 0, borderWidth: "0px" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute w-12 h-12 rounded-full border-white"
              style={{ left: ripple.x - 24, top: ripple.y - 24 }}
            />
          ))}
        </AnimatePresence>
      </div>

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
