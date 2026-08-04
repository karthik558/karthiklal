"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useInView } from "framer-motion"

interface TextScrambleProps {
  text: string
  className?: string
  speed?: number
  trigger?: "hover" | "viewport" | "both"
  characterSet?: string
  as?: React.ElementType
}

const DEFAULT_CHARS = "0123456789ABCDEF!@#$%^&*()_+-=[]{}|;:,.<>?"

export function TextScramble({
  text,
  className = "",
  speed = 40,
  trigger = "both",
  characterSet = DEFAULT_CHARS,
  as: Component = "span",
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text)
  const containerRef = useRef<HTMLElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.5 })
  const isRunningRef = useRef(false)
  const hasTriggeredViewRef = useRef(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const scramble = useCallback(() => {
    if (isRunningRef.current) return
    isRunningRef.current = true

    const length = text.length
    let iteration = 0
    const maxIterations = length * 3

    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " "
            if (index < iteration / 3) {
              return text[index]
            }
            return characterSet[Math.floor(Math.random() * characterSet.length)]
          })
          .join("")
      )

      iteration += 1

      if (iteration >= maxIterations) {
        if (timerRef.current) clearInterval(timerRef.current)
        setDisplayText(text)
        isRunningRef.current = false
      }
    }, speed)
  }, [text, speed, characterSet])

  // Trigger ONCE on Viewport entry
  useEffect(() => {
    if (hasTriggeredViewRef.current) return
    if ((trigger === "viewport" || trigger === "both") && isInView) {
      hasTriggeredViewRef.current = true
      scramble()
    }
  }, [isInView, trigger, scramble])

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handleMouseEnter = () => {
    if ((trigger === "hover" || trigger === "both") && !isRunningRef.current) {
      scramble()
    }
  }

  return (
    <Component
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`inline-block font-mono select-none cursor-default ${className}`}
    >
      {displayText}
    </Component>
  )
}
