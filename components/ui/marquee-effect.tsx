"use client"

import { useState, type CSSProperties } from "react"
import { cn } from "@/lib/utils"

type MarqueeAnimationProps = {
  children: string
  className?: string
  direction?: "left" | "right"
  baseVelocity: number
}

function FlowerSeparator() {
  return (
    <span
      aria-hidden="true"
      className="marquee-separator relative mx-6 inline-flex h-[0.6em] w-[0.6em] shrink-0 items-center justify-center select-none rounded-full md:mx-8 lg:mx-10"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-full w-full fill-current"
        aria-hidden="true"
      >
        <g transform="translate(12, 12)">
          <circle cx="0" cy="0" r="2.6" />
          <ellipse cx="0" cy="-6" rx="2.2" ry="3.8" />
          <ellipse cx="0" cy="-6" rx="2.2" ry="3.8" transform="rotate(45)" />
          <ellipse cx="0" cy="-6" rx="2.2" ry="3.8" transform="rotate(90)" />
          <ellipse cx="0" cy="-6" rx="2.2" ry="3.8" transform="rotate(135)" />
          <ellipse cx="0" cy="-6" rx="2.2" ry="3.8" transform="rotate(180)" />
          <ellipse cx="0" cy="-6" rx="2.2" ry="3.8" transform="rotate(225)" />
          <ellipse cx="0" cy="-6" rx="2.2" ry="3.8" transform="rotate(270)" />
          <ellipse cx="0" cy="-6" rx="2.2" ry="3.8" transform="rotate(315)" />
        </g>
      </svg>
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
@keyframes marquee-flower-spin-continuous {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes marquee-flower-hover-spin {
  0% { transform: rotate(0deg) scale(1); border-radius: 40%; }
  50% { transform: rotate(180deg) scale(1.35); border-radius: 50%; }
  100% { transform: rotate(360deg) scale(1.25); border-radius: 50%; }
}
.animate-marquee-left {
  animation: marquee-scroll-left var(--duration) linear infinite;
}
.animate-marquee-right {
  animation: marquee-scroll-right var(--duration) linear infinite;
}

/* Continuous rotation while scrolling, with smooth rounding */
.marquee-separator {
  animation: marquee-flower-spin-continuous 8s linear infinite;
  transform-origin: center center;
  border-radius: 50%;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              background-color 0.25s ease,
              border-radius 0.25s ease;
}

/* Pause applies ONLY to this specific track when hovered or when an item is clicked/active */
.marquee-interactive:hover .animate-marquee-left,
.marquee-interactive:hover .animate-marquee-right,
.marquee-interactive.is-paused .animate-marquee-left,
.marquee-interactive.is-paused .animate-marquee-right {
  animation-play-state: paused;
}

/* Hover over track or flower: round and rotate dynamically */
.marquee-interactive:hover .marquee-separator {
  animation: marquee-flower-hover-spin 750ms cubic-bezier(0.2, 0.9, 0.3, 1.2) forwards;
  border-radius: 50%;
}

.marquee-separator:hover {
  animation: marquee-flower-hover-spin 600ms cubic-bezier(0.2, 0.9, 0.3, 1.2) infinite alternate !important;
  border-radius: 50% !important;
}

@media (prefers-reduced-motion: reduce) {
  .animate-marquee-left,
  .animate-marquee-right,
  .marquee-separator,
  .marquee-interactive:hover .marquee-separator,
  .marquee-separator:hover {
    animation: none !important;
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
  const duration = `${Math.max(5, 50 / Math.abs(baseVelocity))}s`
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
            <FlowerSeparator />
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
