"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowUpRight, Maximize2, X } from "lucide-react"

export interface BookEntry {
  id: string
  title: string
  description: string
  category: string
  image: string
  tags?: string[]
  href?: string
  repository?: string
}

export default function PortfolioStack({ entries, label }: { entries: BookEntry[]; label: string }) {
  const stack = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const [preview, setPreview] = useState<BookEntry | null>(null)

  useEffect(() => {
    const cards = Array.from(stack.current?.querySelectorAll<HTMLElement>(".stack-card") ?? [])
    // On phones, pin tall cards only after their lower content reaches the viewport.
    const update = () => cards.forEach((card, index) => {
      const mobile = window.innerWidth < 900
      const baseTop = (mobile ? 72 : 96) + Math.min(index, 3) * 8
      const top = mobile ? Math.min(baseTop, window.innerHeight - card.offsetHeight - 24) : baseTop
      const fits = mobile || card.offsetHeight + top + 24 < window.innerHeight
      card.style.setProperty("--stack-position", fits ? "sticky" : "relative")
      card.style.setProperty("--stack-top", `${fits ? top : 0}px`)
    })
    const observer = new ResizeObserver(update)
    cards.forEach(card => observer.observe(card))
    window.addEventListener("resize", update)
    update()
    return () => { observer.disconnect(); window.removeEventListener("resize", update) }
  }, [entries])

  if (!entries.length) return <p className="py-12">No entries in this collection.</p>

  return (
    <div className="portfolio-stack">
      <div className="stack-intro"><span>{entries.length} {label.toLowerCase()}</span><span>SCROLL TO EXPLORE <ArrowDown size={14} /></span></div>
      <div ref={stack} className="stack-stage" role="region" aria-label={label}>
        {entries.map((entry, index) => (
          <article className="stack-card" key={entry.id} aria-label={`${index + 1}: ${entry.title}`} style={{ zIndex: index + 1 }}>
            <div className="book-image-page">
              <div className="book-art group/art">
                <Image src={entry.image} alt={entry.title} fill sizes="(min-width: 900px) 50vw, 100vw" className="object-cover grayscale contrast-125 transition-all duration-700 group-hover/art:grayscale-0 group-hover/art:contrast-100 group-hover/art:scale-105" />
                <button className="book-view" onClick={() => { setPreview(entry); dialog.current?.showModal() }} aria-label={`View ${entry.title} full screen`}>
                  <span className="art-preview-label"><Maximize2 size={14} /> FULL VIEW</span>
                </button>
              </div>
            </div>
            <div className="book-copy-page">
              <p className="studio-label">{entry.category}</p>
              <h3>{entry.title}</h3>
              <p className="book-description">{entry.description}</p>
              {entry.tags && <ul className="book-tags">{entry.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>}
              <div className="book-links">
                {entry.href && <Link href={entry.href} className="studio-text-link">READ THE CASE STUDY <ArrowUpRight size={16} /></Link>}
                {entry.repository && <a href={entry.repository} target="_blank" rel="noopener noreferrer" className="studio-text-link">SOURCE CODE <ArrowUpRight size={16} /></a>}
              </div>
              <div className="book-page-footer"><span>CRAFT / DETAIL / PURPOSE</span><span>{String(index * 2 + 2).padStart(2, "0")}</span></div>
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
