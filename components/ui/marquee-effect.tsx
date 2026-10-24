"use client"

import { useState, type CSSProperties } from "react"
import { cn } from "@/lib/utils"

type MarqueeAnimationProps = {
  children: string
  className?: string
  direction?: "left" | "right"
  baseVelocity: number
}

function SignalSeparator() {
  return (
    <span aria-hidden="true" className="marquee-separator relative mx-6 h-[0.55em] w-[0.55em] shrink-0 select-none md:mx-8 lg:mx-10">
      <span className="absolute inset-0 rotate-45 border-[0.09em] border-current opacity-60" />
      <span className="absolute left-1/2 top-1/2 h-[0.18em] w-[0.18em] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
    </span>
  )
}

const marqueeStyles = `
@keyframes marquee-scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
@keyframes marquee-scroll-right {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0); }
}
@keyframes marquee-signal-spin {
  from { transform: rotate(0deg) scale(0.85); }
  to { transform: rotate(180deg) scale(1); }
}
.animate-marquee-left {
  animation: marquee-scroll-left var(--duration) linear infinite;
}
.animate-marquee-right {
  animation: marquee-scroll-right var(--duration) linear infinite;
}

/* Pause applies ONLY to this specific track when hovered or when an item is clicked/active */
.marquee-interactive:hover .animate-marquee-left,
.marquee-interactive:hover .animate-marquee-right,
.marquee-interactive.is-paused .animate-marquee-left,
.marquee-interactive.is-paused .animate-marquee-right {
  animation-play-state: paused;
}

.marquee-interactive:hover .marquee-separator {
  animation: marquee-signal-spin 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .animate-marquee-left,
  .animate-marquee-right,
  .marquee-interactive:hover .marquee-separator {
    animation: none;
  }
}
`

export function MarqueeAnimation({
  children,
  className,
  direction = "left",
  baseVelocity = 10,
}: MarqueeAnimationProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const items = children.split("•").map((item) => item.trim()).filter(Boolean)
  const duration = `${Math.max(5, 52 / Math.abs(baseVelocity))}s`
  const animationClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right"

  const sequence = (
    <div className="flex shrink-0 flex-row flex-nowrap items-center">
      {items.map((item, index) => {
        const isActive = activeItem === item
        return (
          <span key={`${item}-${index}`} className="inline-flex shrink-0 items-center">
            <span
              data-marquee-item={item}
              data-active={isActive ? "true" : undefined}
              className="marquee-item whitespace-nowrap"
              title={isActive ? "Click to resume" : "Click to emphasize and pause"}
            >
              {item}
            </span>
            <SignalSeparator />
          </span>
        )
      })}
    </div>
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: marqueeStyles }} />
      <div
        aria-label={items.join(", ")}
        aria-description="Click a phrase to pause and emphasize it. Click again or click the track to resume."
        role="region"
        tabIndex={0}
        onClick={event => {
          const item = (event.target as Element).closest<HTMLElement>("[data-marquee-item]")?.dataset.marqueeItem
          if (item) {
            setActiveItem(current => current === item ? null : item)
          } else {
            setActiveItem(null)
          }
        }}
        onKeyDown={event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            setActiveItem(current => current ? null : items[0])
          }
          if (event.key === "Escape") {
            setActiveItem(null)
            event.currentTarget.blur()
          }
        }}
        className={cn(
          "marquee-interactive relative flex w-full cursor-default select-none flex-nowrap items-center overflow-hidden text-nowrap outline-none",
          activeItem ? "is-paused" : "",
          className
        )}
        style={{ "--duration": duration } as CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden="true"
            className={cn("flex shrink-0 flex-row flex-nowrap items-center whitespace-nowrap", animationClass)}
          >
            {sequence}
            {sequence}
            {sequence}
          </div>
        ))}
      </div>
    </>
  )
}
