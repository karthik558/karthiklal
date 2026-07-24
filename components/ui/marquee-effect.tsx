"use client"

import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

type MarqueeAnimationProps = {
  children: string
  className?: string
  direction?: "left" | "right"
  baseVelocity: number
}

function SignalSeparator() {
  return (
    <span aria-hidden="true" className="marquee-separator relative mx-6 h-[0.6em] w-[0.6em] shrink-0 md:mx-8 lg:mx-10">
      <span className="absolute inset-0 rotate-45 border-[0.08em] border-current opacity-60" />
      <span className="absolute left-1/2 top-1/2 h-[0.16em] w-[0.16em] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
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
  from { transform: rotate(0deg) scale(0.8); }
  to { transform: rotate(180deg) scale(1); }
}
.animate-marquee-left {
  animation: marquee-scroll-left var(--duration) linear infinite;
}
.animate-marquee-right {
  animation: marquee-scroll-right var(--duration) linear infinite;
}
.marquee-interactive:hover .animate-marquee-left,
.marquee-interactive:hover .animate-marquee-right,
.marquee-interactive:focus .animate-marquee-left,
.marquee-interactive:focus .animate-marquee-right {
  animation-play-state: paused;
}
.marquee-item {
  transition: opacity 240ms ease, transform 240ms ease, letter-spacing 240ms ease;
}
.marquee-interactive:hover .marquee-item {
  opacity: 0.42;
}
.marquee-interactive:hover .marquee-item:hover {
  opacity: 1;
  transform: translateY(-0.08em) scale(1.025);
  letter-spacing: 0.02em;
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
  const items = children.split("•").map((item) => item.trim()).filter(Boolean)
  const duration = `${Math.max(5, 50 / Math.abs(baseVelocity))}s`
  const animationClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right"

  const sequence = (
    <div className="flex shrink-0 flex-row flex-nowrap items-center">
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="inline-flex shrink-0 items-center">
          <span className="marquee-item whitespace-nowrap">{item}</span>
          <SignalSeparator />
        </span>
      ))}
    </div>
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: marqueeStyles }} />
      <div
        aria-label={items.join(", ")}
        aria-description="Moving text pauses when hovered or focused"
        tabIndex={0}
        className={cn(
          "marquee-interactive relative flex w-full cursor-default select-none flex-nowrap items-center overflow-hidden text-nowrap outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-current",
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
