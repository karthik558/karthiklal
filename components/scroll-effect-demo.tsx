"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface ScrollEffectDemoProps {
  children: React.ReactNode
  speed?: number
  lag?: number
  className?: string
}

export default function ScrollEffectDemo({ 
  children, 
  speed = 1, 
  lag = 0, 
  className = "" 
}: ScrollEffectDemoProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !elementRef.current) return

    // Apply ScrollSmoother data attributes programmatically
    if (speed !== 1) {
      elementRef.current.setAttribute('data-speed', speed.toString())
    }
    
    if (lag !== 0) {
      elementRef.current.setAttribute('data-lag', lag.toString())
    }

    // Optional: Add custom scroll animations
    const element = elementRef.current
    
    // Example of adding a fade-in animation on scroll
    gsap.fromTo(element, 
      { 
        opacity: 0, 
        y: 50 
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    )

    return () => {
      // Cleanup is handled by ScrollSmoother
    }
  }, [speed, lag])

  return (
    <div 
      ref={elementRef}
      className={className}
    >
      {children}
    </div>
  )
}

// Example usage:
// <ScrollEffectDemo speed={0.5} lag={0.2} className="my-section">
//   Your content here
// </ScrollEffectDemo>
