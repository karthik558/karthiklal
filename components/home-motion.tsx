"use client"

import { useEffect } from "react"
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"

/** Enhance server-rendered sections without transforming modal or sticky ancestors. */
export default function HomeMotion() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30 })

  useEffect(() => {
    if (reduced) return
    const headings = document.querySelectorAll<HTMLElement>(".home-experience .section-heading-row")
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add("heading-arrived")
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.15 })
    headings.forEach(heading => {
      heading.classList.add("heading-reveal")
      observer.observe(heading)
    })
    return () => {
      observer.disconnect()
      headings.forEach(heading => heading.classList.remove("heading-reveal", "heading-arrived"))
    }
  }, [reduced])

  return <motion.div aria-hidden="true" className="reading-progress" style={{ scaleX: reduced ? scrollYProgress : progress }} />
}
