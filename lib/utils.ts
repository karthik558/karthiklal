import type React from "react"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function lerp(start: number, end: number, t: number) {
  return start * (1 - t) + end * t
}

export function calculateMousePosition(e: React.MouseEvent | MouseEvent | TouchEvent, target?: HTMLElement) {
  let x = 0
  let y = 0

  if (e instanceof MouseEvent) {
    x = e.clientX
    y = e.clientY
  } else if (e instanceof TouchEvent) {
    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX
      y = e.touches[0].clientY
    }
  } else if ("clientX" in e && "clientY" in e) {
    x = e.clientX
    y = e.clientY
  }

  if (target) {
    const rect = target.getBoundingClientRect()
    const mouseX = x - rect.left
    const mouseY = y - rect.top
    return { x: mouseX, y: mouseY }
  }

  return { x, y }
}

