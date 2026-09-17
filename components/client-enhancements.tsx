"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import {
  playClickSound,
  playProfileHoverSound,
  playProfileTypingSound,
  playProfileCopySound,
  getAudioContext,
} from "@/lib/sound-fx"

const CustomCursor = dynamic(() => import("@/components/custom-cursor"), {
  ssr: false,
})
const SmoothScroll = dynamic(() => import("@/components/smooth-scroll"), {
  ssr: false,
})

export default function ClientEnhancements() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const enable = () => setEnabled(true)
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(enable, { timeout: 1500 })
      return () => window.cancelIdleCallback(id)
    }

    const id = globalThis.setTimeout(enable, 500)
    return () => globalThis.clearTimeout(id)
  }, [])

  // Global click audio interceptor
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      const interactive = target.closest(
        'a, button, label, input[type="button"], input[type="submit"], [role="button"], [tabindex]:not([tabindex="-1"])'
      )
      if (interactive) {
        playClickSound()
      }
    }

    window.addEventListener("click", handleGlobalClick, { capture: true, passive: true })
    return () => window.removeEventListener("click", handleGlobalClick, { capture: true })
  }, [])

  // Global typing audio interceptor with 55ms cooldown and ±4% pitch jitter
  useEffect(() => {
    let lastKeyTime = 0
    const ignoredKeys = new Set([
      "Shift",
      "Control",
      "Alt",
      "Meta",
      "CapsLock",
      "Tab",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Escape",
      "Home",
      "End",
      "PageUp",
      "PageDown",
    ])

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) return
      if (ignoredKeys.has(event.key)) return

      const target = event.target as HTMLElement | null
      if (!target) return

      const isTextInput =
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable ||
        (target instanceof HTMLInputElement &&
          !["checkbox", "radio", "range", "color", "file", "submit", "button", "reset"].includes(target.type))

      if (isTextInput) {
        const now = performance.now()
        if (now - lastKeyTime >= 55) {
          lastKeyTime = now
          // Jitter pitch between 0.96 and 1.04 for organic keystrokes
          const pitchOffset = 0.96 + Math.random() * 0.08
          playProfileTypingSound(pitchOffset)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown, { capture: true, passive: true })
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true })
  }, [])

  // Throttled hover audio on interactive elements (desktop only)
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    if (!finePointer) return

    let lastHoverTime = 0
    let lastHoverTarget: Element | null = null

    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target as Element | null
      if (!target) return

      const interactive = target.closest(
        'a, button, [role="button"], input[type="button"], input[type="submit"], [data-cursor-type="button"], [data-cursor-type="link"]'
      )
      if (!interactive || interactive === lastHoverTarget) return
      lastHoverTarget = interactive

      const now = performance.now()
      if (now - lastHoverTime >= 90) {
        lastHoverTime = now
        playProfileHoverSound()
      }
    }

    window.addEventListener("pointerover", handlePointerOver, { capture: true, passive: true })
    return () => window.removeEventListener("pointerover", handlePointerOver, { capture: true })
  }, [])

  // Global clipboard copy audio interceptor
  useEffect(() => {
    const handleCopy = () => {
      playProfileCopySound()
    }

    window.addEventListener("copy", handleCopy, { passive: true })
    return () => window.removeEventListener("copy", handleCopy)
  }, [])

  // Suspend/resume AudioContext on tab visibility change
  useEffect(() => {
    const handleVisibility = () => {
      const ctx = getAudioContext()
      if (!ctx) return
      if (document.hidden && ctx.state === "running") {
        ctx.suspend().catch(() => {})
      } else if (!document.hidden && ctx.state === "suspended") {
        ctx.resume().catch(() => {})
      }
    }

    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  return (
    <>
      <CustomCursor />
      {enabled && <SmoothScroll />}
    </>
  )
}
