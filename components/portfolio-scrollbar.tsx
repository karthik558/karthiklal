"use client"

import { useEffect, useRef } from "react"

const stops = [
  ["home", "Hello"],
  ["about", "About me"],
  ["portfolio", "Selected work"],
  ["skills", "Toolkit"],
  ["experience", "Experience"],
  ["journal", "Journal"],
  ["portfolio-gallery", "Design archive"],
] as const

const point = (p: number) => ({ x: 28 + 9 * Math.sin(p * Math.PI * 4), y: 20 + p * 360 })
const path = Array.from({ length: 121 }, (_, i) => {
  const { x, y } = point(i / 120)
  return `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`
}).join(" ")

const distances = [0]
for (let i = 1; i <= 120; i++) {
  const a = point((i - 1) / 120), b = point(i / 120)
  distances.push(distances[i - 1] + Math.hypot(b.x - a.x, b.y - a.y))
}

/** One passive scroll listener; no React renders or layout reads on scroll. */
export default function PortfolioScrollbar() {
  const root = useRef<HTMLElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const flower = useRef<SVGGElement>(null)
  const ink = useRef<SVGPathElement>(null)
  const counter = useRef<HTMLOutputElement>(null)
  const slider = useRef<HTMLDivElement>(null)
  const positions = useRef<number[]>([])
  const limit = useRef(1)

  const go = (top: number, immediate = false) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (window.lenis) window.lenis.scrollTo(top, { immediate: immediate || reduced })
    else window.scrollTo({ top, behavior: immediate || reduced ? "instant" : "smooth" })
  }

  useEffect(() => {
    let frame = 0
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => {
      frame = 0
      const scroll = Math.max(0, Math.min(window.scrollY, limit.current))
      const percent = scroll / limit.current
      const offsets = positions.current
      let segment = 0
      while (segment < offsets.length - 2 && scroll >= offsets[segment + 1]) segment++
      const local = Math.min(1, Math.max(0, (scroll - offsets[segment]) / Math.max(1, offsets[segment + 1] - offsets[segment])))
      const progress = (segment + local) / (offsets.length - 1)
      const { x, y } = point(progress)
      flower.current?.setAttribute("transform", `translate(${x} ${y}) rotate(${reduced.matches ? 0 : progress * 540})`)
      const sample = Math.min(119, Math.floor(progress * 120))
      const travelled = distances[sample] + (distances[sample + 1] - distances[sample]) * (progress * 120 - sample)
      if (ink.current) ink.current.style.strokeDashoffset = `${1 - travelled / distances[120]}`
      root.current?.style.setProperty("--journey-progress", String(percent))
      slider.current?.setAttribute("aria-valuenow", String(Math.round(percent * 100)))
      if (counter.current) counter.current.textContent = `${String(Math.round(percent * 100)).padStart(2, "0")}%`
      root.current?.querySelectorAll<HTMLAnchorElement>(".journey-stop").forEach((link, i) => {
        if (i === Math.min(segment, stops.length - 1)) link.setAttribute("aria-current", "location")
        else link.removeAttribute("aria-current")
        link.dataset.passed = String(scroll >= offsets[i] - 1)
      })
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const measure = () => {
      limit.current = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      positions.current = [...stops.map(([id]) => Math.min(limit.current, Math.max(0, (document.getElementById(id)?.getBoundingClientRect().top ?? 0) + window.scrollY - 100))), limit.current]
      schedule()
    }
    const resize = new ResizeObserver(measure)
    resize.observe(document.body)
    window.addEventListener("resize", measure)
    window.addEventListener("scroll", schedule, { passive: true })
    reduced.addEventListener("change", schedule)
    measure()
    return () => {
      resize.disconnect()
      window.removeEventListener("resize", measure)
      window.removeEventListener("scroll", schedule)
      reduced.removeEventListener("change", schedule)
      cancelAnimationFrame(frame)
    }
  }, [])

  const scrub = (clientY: number) => {
    const bounds = rail.current?.getBoundingClientRect()
    if (!bounds) return
    const p = Math.max(0, Math.min(1, ((clientY - bounds.top) / bounds.height * 400 - 20) / 360))
    const index = Math.min(stops.length - 1, Math.floor(p * stops.length))
    const offsets = positions.current
    go(offsets[index] + (offsets[index + 1] - offsets[index]) * (p * stops.length - index), true)
  }

  return <aside ref={root} className="portfolio-journey" aria-label="Portfolio reading progress">
    <span className="journey-caption" aria-hidden="true">EXPLORE</span>
    <div ref={rail} className="journey-rail">
      <svg viewBox="0 0 56 400" preserveAspectRatio="none" aria-hidden="true" className="journey-art">
        <path d={path} className="journey-track" />
        <path ref={ink} d={path} pathLength="1" className="journey-ink" />
        <g ref={flower} transform="translate(28 20)" className="journey-flower">
          <circle r="15" className="journey-flower-halo" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => <ellipse key={angle} cx="0" cy="-7" rx="2.6" ry="4.4" transform={`rotate(${angle})`} />)}
          <circle r="3" />
        </g>
      </svg>
      <div ref={slider} className="journey-scrubber" role="slider" tabIndex={0} aria-label="Scroll through portfolio" aria-orientation="vertical" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}
        onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); scrub(event.clientY) }}
        onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) scrub(event.clientY) }}
        onPointerUp={event => { event.currentTarget.releasePointerCapture(event.pointerId) }}
        onKeyDown={event => {
          const actions: Record<string, number> = { Home: 0, End: limit.current, ArrowDown: window.scrollY + 100, ArrowUp: window.scrollY - 100, PageDown: window.scrollY + window.innerHeight * .8, PageUp: window.scrollY - window.innerHeight * .8 }
          if (event.key in actions) { event.preventDefault(); go(actions[event.key], true) }
        }} />
      <nav aria-label="Portfolio chapters">
        {stops.map(([id, label], i) => {
          const { x, y } = point(i / stops.length)
          return <a key={id} href={`#${id}`} className="journey-stop" style={{ left: `${x / 56 * 100}%`, top: `${y / 400 * 100}%` }} aria-label={label}
            onClick={event => { event.preventDefault(); go(positions.current[i] ?? 0) }}>
            <span className="journey-dot" />
            <span className="journey-label"><b>{String(i + 1).padStart(2, "0")}</b>{label}</span>
          </a>
        })}
      </nav>
    </div>
    <output ref={counter} className="journey-counter" aria-label="Page read" aria-live="off">00%</output>
  </aside>
}
