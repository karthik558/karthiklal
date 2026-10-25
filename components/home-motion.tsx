"use client"

import { useEffect } from "react"
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"

const revealSelector = [
  ".about-profile-facts > div",
  ".about-linkedin",
  ".about-practice-grid > article",
  ".principle-grid > article",
  "#portfolio .studio-section-intro",
  "#portfolio .book-filters",
  "#portfolio .stack-intro",
  "#services .studio-section-intro",
  "#experience .registry-intro",
  "#certifications .registry-intro",
  "#testimonials .studio-section-intro",
  "#testimonials .testimonial-letter",
  "#testimonials .book-controls",
  "#journal .journal-card",
  "#portfolio-gallery .book-filters",
  "#portfolio-gallery .stack-intro",
  ".footer-columns > *",
  ".footer-bottom",
].join(",")

/** Enhance server-rendered sections without transforming modal or sticky ancestors. */
export default function HomeMotion() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30 })

  useEffect(() => {
    if (reduced) return
    const observedHeadings = new Set<HTMLElement>()
    const observedElements = new Set<HTMLElement>()
    const headingObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add("heading-arrived")
        headingObserver.unobserve(entry.target)
      })
    }, { threshold: 0.08, rootMargin: "0px 0px 12% 0px" })

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add("reveal-arrived")
        revealObserver.unobserve(entry.target)
      })
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" })

    const registerElements = () => {
      document.querySelectorAll<HTMLElement>(".home-experience .section-heading-row").forEach(heading => {
        if (observedHeadings.has(heading)) return
        observedHeadings.add(heading)
        heading.classList.add("heading-reveal")
        headingObserver.observe(heading)
      })

      document.querySelectorAll<HTMLElement>(revealSelector).forEach((element, index) => {
        if (observedElements.has(element)) return
        observedElements.add(element)
        element.classList.add("scroll-reveal")
        if (element.matches(".about-profile-facts > div,.about-practice-grid > article,.principle-grid > article,.journal-card")) {
          element.classList.add("reveal-card")
        } else if (element.matches(".stack-card,.testimonial-letter")) {
          element.classList.add("reveal-feature")
        } else if (element.matches(".footer-columns > *,.footer-bottom")) {
          element.classList.add("reveal-side")
        }
        element.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`)
        revealObserver.observe(element)
      })
    }

    registerElements()
    const contentObserver = new MutationObserver(registerElements)
    contentObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      contentObserver.disconnect()
      headingObserver.disconnect()
      revealObserver.disconnect()
      observedHeadings.forEach(heading => heading.classList.remove("heading-reveal", "heading-arrived"))
      observedElements.forEach(element => {
        element.classList.remove("scroll-reveal", "reveal-arrived", "reveal-card", "reveal-feature", "reveal-side")
        element.style.removeProperty("--reveal-delay")
      })
    }
  }, [reduced])

  return <>
    <motion.div aria-hidden="true" className="reading-progress" style={{ scaleX: reduced ? scrollYProgress : progress }} />
  </>
}
