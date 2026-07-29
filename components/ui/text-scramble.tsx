"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, useInView } from "framer-motion"

interface TextScrambleProps {
  text: string
  className?: string
  speed?: number
  trigger?: "hover" | "viewport" | "both"
  characterSet?: string
  as?: any
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
  const [isScrambling, setIsScrambling] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.5 })
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const scramble = useCallback(() => {
    if (isScrambling) return
    setIsScrambling(true)

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
        setIsScrambling(false)
      }
    }, speed)
  }, [text, speed, characterSet, isScrambling])

  // Trigger on Viewport entry
  useEffect(() => {
    if ((trigger === "viewport" || trigger === "both") && isInView) {
      scramble()
    }
  }, [isInView, trigger, scramble])

  const handleMouseEnter = () => {
    if (trigger === "hover" || trigger === "both") {
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
