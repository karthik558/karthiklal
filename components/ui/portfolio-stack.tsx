"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowUpRight, Maximize2, X } from "lucide-react"

export interface BookEntry {
  id: string
  title: string
  category: string
  image: string
  href?: string
  live?: string
  repository?: string
}

export default function PortfolioStack({ entries, label }: { entries: BookEntry[]; label: string }) {
  const stack = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const [preview, setPreview] = useState<BookEntry | null>(null)

  useEffect(() => {
    const cards = Array.from(stack.current?.querySelectorAll<HTMLElement>(".stack-card") ?? [])
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0
    let geometry: { top: number; height: number; pin: number; sticky: boolean }[] = []
    const update = () => {
      frame = 0
      const scroll = window.scrollY
      cards.forEach((card, index) => {
        const current = geometry[index]
        const next = geometry[index + 1]
        const nextTop = next ? Math.max(next.sticky ? next.pin : -Infinity, next.top - scroll) : Infinity
        const progress = next && current.sticky
          ? Math.max(0, Math.min(1, 1 - (nextTop - current.pin) / (current.height + 64)))
          : 0
        card.style.setProperty("--stack-shade", String(progress * 0.24))
      })
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    // Measure normal-flow geometry only when layout changes, never during scrolling.
    const measure = () => {
      if (!stack.current) return
      const baseTop = window.innerWidth < 900 ? 76 : 96
      const gap = parseFloat(getComputedStyle(stack.current).rowGap) || 0
      let top = stack.current.getBoundingClientRect().top + window.scrollY
      geometry = cards.map((card, index) => {
        const height = card.offsetHeight
        const pin = baseTop + Math.min(index, 3) * 10
        const sticky = height + pin + 16 <= window.innerHeight && !motion.matches
        const result = { top, height, pin, sticky }
        top += height + gap
        return result
      })
      cards.forEach((card, index) => {
        const { pin, sticky } = geometry[index]
        card.style.setProperty("--stack-position", sticky ? "sticky" : "relative")
        card.style.setProperty("--stack-top", `${sticky ? pin : 0}px`)
      })
      schedule()
    }
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    cards.forEach(card => observer.observe(card))
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", measure)
    motion.addEventListener("change", measure)
    measure()
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", measure)
      motion.removeEventListener("change", measure)
      cancelAnimationFrame(frame)
    }
  }, [entries])

  if (!entries.length) return <p className="py-12">No entries in this collection.</p>

  return (
    <div className="portfolio-stack">
      <div className="stack-intro"><span>{entries.length} {label.toLowerCase()}</span><span>SCROLL TO EXPLORE <ArrowDown size={14} /></span></div>
      <div ref={stack} className="stack-stage" role="region" aria-label={label}>
        {entries.map((entry, index) => (
          <article className="stack-card" key={entry.id} aria-label={`${index + 1}: ${entry.title}`} style={{ zIndex: index + 1 }}>
            <div className="stack-card-surface">
              <div className="book-art">
                <Image src={entry.image} alt={entry.title} fill sizes="(min-width: 1440px) 1200px, 100vw" className="object-cover" />
                <button className="book-view" onClick={() => { setPreview(entry); dialog.current?.showModal() }} aria-label={`View ${entry.title} full screen`}>
                  <span className="art-preview-label"><Maximize2 size={14} /> FULL VIEW</span>
                </button>
              </div>
              <div className="stack-card-caption">
                <div className="stack-card-heading">
                  <span className="stack-card-index">{String(index + 1).padStart(2, "0")}</span>
                  <div><p className="studio-label">{entry.category}</p><h3>{entry.title}</h3></div>
                </div>
                {(entry.href || entry.live || entry.repository) && <div className="book-links">
                  {entry.href && <Link href={entry.href} className="studio-text-link">CASE STUDY <ArrowUpRight size={16} /></Link>}
                  {entry.live && <a href={entry.live} target="_blank" rel="noopener noreferrer" className="studio-text-link">LIVE <ArrowUpRight size={16} /></a>}
                  {entry.repository && <a href={entry.repository} target="_blank" rel="noopener noreferrer" className="studio-text-link">SOURCE <ArrowUpRight size={16} /></a>}
                </div>}
              </div>
            </div>
          </article>
        ))}
      </div>
      <dialog ref={dialog} className="book-preview" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
        <div className="book-preview-inner"><div className="book-controls"><span>{preview?.title}</span><button onClick={() => dialog.current?.close()} aria-label="Close preview"><X size={22} /></button></div>{preview && <div className="book-preview-image"><Image src={preview.image} alt={preview.title} fill sizes="95vw" className="object-contain" /></div>}</div>
      </dialog>
    </div>
  )
}
