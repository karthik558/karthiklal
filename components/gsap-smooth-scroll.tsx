"use client"

import React, { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
}

interface GSAPSmoothScrollProps {
  children: React.ReactNode
}

export default function GSAPSmoothScroll({ children }: GSAPSmoothScrollProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    if (typeof window === "undefined") return

    const initAnimations = () => {
      // Setup smooth scrolling for anchor links
      const handleAnchorClick = (e: Event) => {
        const target = e.target as HTMLAnchorElement
        if (target.hash && target.hash.length > 1) {
          e.preventDefault()
          const element = document.querySelector(target.hash)
          if (element) {
            gsap.to(window, {
              duration: 1.5,
              scrollTo: {
                y: element,
                offsetY: 100
              },
              ease: "power3.inOut",
            })
          }
        }
      }

      // Add smooth CSS scroll behavior with GSAP override
      document.documentElement.style.scrollBehavior = "smooth"

      // Setup section animations
      setupSectionAnimations()

      // Add event listeners
      document.addEventListener("click", handleAnchorClick)

      return () => {
        document.removeEventListener("click", handleAnchorClick)
      }
    }

    const setupSectionAnimations = () => {
      // Refresh ScrollTrigger
      ScrollTrigger.refresh()

      // Animate sections on scroll with staggered children
      gsap.utils.toArray("section").forEach((section: any, index) => {
        // Set initial state
        gsap.set(section, { opacity: 0, y: 50 })

        // Create main section animation
        const sectionTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
            markers: false,
          },
        })

        sectionTl.to(section, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        })

        // Animate section children with faster stagger
        const children = section.querySelectorAll(
          "h1, h2, h3, h4, h5, h6, p, .card, .animate-item, img, .button"
        )
        
        if (children.length > 0) {
          gsap.set(children, { opacity: 0, y: 30 })
          
          sectionTl.to(
            children,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: {
                amount: 0.3,
                from: "start",
              },
              ease: "power2.out",
            },
            "-=0.6"
          )
        }

        // Special animations for specific classes
        const scaleElements = section.querySelectorAll(".scale-on-scroll")
        if (scaleElements.length > 0) {
          gsap.set(scaleElements, { scale: 0.8, opacity: 0 })
          sectionTl.to(
            scaleElements,
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              ease: "back.out(1.7)",
              stagger: 0.05,
            },
            "-=0.4"
          )
        }

        const slideLeftElements = section.querySelectorAll(".slide-in-left")
        if (slideLeftElements.length > 0) {
          gsap.set(slideLeftElements, { x: -100, opacity: 0 })
          sectionTl.to(
            slideLeftElements,
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.03,
            },
            "-=0.5"
          )
        }

        const slideRightElements = section.querySelectorAll(".slide-in-right")
        if (slideRightElements.length > 0) {
          gsap.set(slideRightElements, { x: 100, opacity: 0 })
          sectionTl.to(
            slideRightElements,
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.03,
            },
            "-=0.5"
          )
        }

        const rotateElements = section.querySelectorAll(".rotate-on-scroll")
        if (rotateElements.length > 0) {
          gsap.set(rotateElements, { rotation: -45, opacity: 0, scale: 0.5 })
          sectionTl.to(
            rotateElements,
            {
              rotation: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "back.out(1.7)",
              stagger: 0.05,
            },
            "-=0.4"
          )
        }
      })

      // Parallax effects for elements with data-speed attribute
      gsap.utils.toArray("[data-speed]").forEach((element: any) => {
        const speed = parseFloat(element.getAttribute("data-speed")) || 1
        gsap.to(element, {
          yPercent: -50 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 1, // Smooth scrubbing
          },
        })
      })

      // Fade in animation for images with lazy loading
      gsap.utils.toArray("img").forEach((img: any) => {
        gsap.set(img, { opacity: 0 })
        ScrollTrigger.create({
          trigger: img,
          start: "top 90%",
          onEnter: () => {
            gsap.to(img, {
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
            })
          },
        })
      })
    }

    // Initialize after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initAnimations()
    }, 100)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [isMounted])

  if (!isMounted) {
    return <div>{children}</div>
  }

  return (
    <div className="gsap-smooth-wrapper">
      {children}
    </div>
  )
}
