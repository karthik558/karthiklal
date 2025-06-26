"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function useScrollTriggerAnimation(
  trigger: string | HTMLElement,
  animation: gsap.TweenVars,
  options?: ScrollTrigger.Vars
) {
  const triggerRef = useRef<ScrollTrigger | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const element = typeof trigger === "string" ? document.querySelector(trigger) : trigger
    
    if (!element) return

    triggerRef.current = ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      end: "bottom 20%",
      ...options,
      onEnter: () => gsap.fromTo(element, animation.from || {}, animation.to || animation),
      onLeave: () => gsap.to(element, animation.leave || {}),
      onEnterBack: () => gsap.to(element, animation.to || animation),
      onLeaveBack: () => gsap.to(element, animation.from || {}),
    })

    return () => {
      if (triggerRef.current) {
        triggerRef.current.kill()
      }
    }
  }, [trigger, animation, options])

  return triggerRef.current
}

export function useParallaxEffect(
  element: HTMLElement | null,
  speed: number = 0.5
) {
  useEffect(() => {
    if (typeof window === "undefined" || !element) return

    const parallaxTrigger = ScrollTrigger.create({
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const y = self.progress * speed * 100
        gsap.set(element, { yPercent: y })
      },
    })

    return () => {
      parallaxTrigger.kill()
    }
  }, [element, speed])
}

export function useFadeInOnScroll(
  element: HTMLElement | null,
  options?: ScrollTrigger.Vars
) {
  useEffect(() => {
    if (typeof window === "undefined" || !element) return

    gsap.fromTo(
      element,
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
          ...options,
        },
      }
    )
  }, [element, options])
}
