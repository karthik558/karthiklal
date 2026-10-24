"use client"

import { useRef, useState, type UIEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2, X } from "lucide-react"

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

export default function PortfolioBook({ entries, label }: { entries: BookEntry[]; label: string }) {
  const rail = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const [page, setPage] = useState(0)
  const [preview, setPreview] = useState<BookEntry | null>(null)
  const reduced = useReducedMotion()

  function turnTo(index: number) {
    const element = rail.current
    if (!element) return
    element.scrollTo({ left: index * element.clientWidth, behavior: reduced ? "instant" : "smooth" })
  }

  function onScroll(event: UIEvent<HTMLDivElement>) {
    const element = event.currentTarget
    setPage(Math.round(element.scrollLeft / element.clientWidth))
    for (const child of Array.from(element.children) as HTMLElement[]) {
      const distance = (child.offsetLeft - element.scrollLeft) / element.clientWidth
      child.style.setProperty("--page-angle", reduced ? "0deg" : `${Math.max(-1, Math.min(1, distance)) * -8}deg`)
    }
  }

  if (!entries.length) return <p className="py-12">No entries in this collection.</p>

  return (
    <div className="portfolio-book">
      <div className="book-binding"><span>{label}</span><span>AN OPEN COLLECTION</span></div>
      <div ref={rail} className="book-rail" onScroll={onScroll} role="region" aria-label={label} tabIndex={0} data-lenis-prevent onKeyDown={event => {
        if (event.target !== event.currentTarget) return
        if (event.key === "ArrowRight") { event.preventDefault(); turnTo(Math.min(entries.length - 1, page + 1)) }
        if (event.key === "ArrowLeft") { event.preventDefault(); turnTo(Math.max(0, page - 1)) }
      }}>
        {entries.map((entry, index) => (
          <article className="book-spread" key={entry.id} aria-label={`Page ${index + 1}: ${entry.title}`}>
            <div className="book-image-page">
              <span className="book-running-head">{label} / PLATE {String(index + 1).padStart(2, "0")}</span>
              <div className="book-art"><Image src={entry.image} alt={entry.title} fill sizes="(min-width: 900px) 50vw, 100vw" className="object-contain" /></div>
              <button className="book-view" onClick={() => { setPreview(entry); dialog.current?.showModal() }} aria-label={`View ${entry.title} full screen`}><Maximize2 size={14} /> FULL VIEW</button>
              <span className="book-folio">{String(index * 2 + 1).padStart(2, "0")}</span>
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
      <div className="book-controls">
        <p className="studio-label">SWIPE OR TURN THE PAGE</p>
        <div><button onClick={() => turnTo(page - 1)} disabled={page === 0} aria-label={`Previous ${label.toLowerCase()} page`}><ArrowLeft size={18} /></button><span role="status" aria-live="polite">{String(page + 1).padStart(2, "0")} / {String(entries.length).padStart(2, "0")}</span><button onClick={() => turnTo(page + 1)} disabled={page === entries.length - 1} aria-label={`Next ${label.toLowerCase()} page`}><ArrowRight size={18} /></button></div>
      </div>
      <dialog ref={dialog} className="book-preview" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
        <div className="book-preview-inner"><div className="book-controls"><span>{preview?.title}</span><button onClick={() => dialog.current?.close()} aria-label="Close preview"><X size={22} /></button></div>{preview && <div className="book-preview-image"><Image src={preview.image} alt={preview.title} fill sizes="95vw" className="object-contain" /></div>}</div>
      </dialog>
    </div>
  )
}
