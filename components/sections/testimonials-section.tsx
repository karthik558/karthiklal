"use client"

import { type CSSProperties, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import SectionHeading from "@/components/sections/section-heading"
import data from "@/public/data/testimonials.json"

const previewCount = 4

export default function TestimonialsSection() {
  const [expanded, setExpanded] = useState(false)
  const reviews = data.testimonials
  if (!reviews.length) return null
  const visibleReviews = expanded ? reviews : reviews.slice(0, previewCount)

  return (
    <section id="testimonials" className="section-shell border-t border-border">
      <div className="section-container review-layout">
        <div className="review-intro">
          <SectionHeading title="Good work starts" accent="with good people." />
          {reviews.length > previewCount && (
            <button type="button" className="review-toggle" aria-expanded={expanded} aria-controls="client-reviews"
              onClick={() => setExpanded(value => !value)}>
              {expanded ? "Show fewer" : "View all"} <span>{expanded ? "−" : `(${reviews.length})`}</span>
            </button>
          )}
        </div>
        <div className="review-cards" id="client-reviews">
          {visibleReviews.map((review, index) => (
            <figure className="review-card" key={review.id} style={{
              "--deck-order": visibleReviews.length - index,
              "--deck-edge": `${Math.max(0, 3 - index) * 8}px`,
            } as CSSProperties}>
              <figcaption>
                <span className="letter-monogram" aria-hidden="true">{review.name.split(" ").slice(0, 2).map(word => word[0]).join("")}</span>
                <div><strong>{review.name}</strong><p>{review.position} · {review.company}</p></div>
                {review.website && <a href={review.website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${review.company}`}><ArrowUpRight size={19} /></a>}
              </figcaption>
              <blockquote>“{review.content}”</blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
