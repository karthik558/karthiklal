"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import SectionHeading from "@/components/sections/section-heading"
import data from "@/public/data/testimonials.json"

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()
  const review = data.testimonials[index]
  if (!review) return null
  return <section id="testimonials" className="section-shell border-t border-border"><div className="section-container">
    <div className="section-heading-row"><SectionHeading number="09" label="CLIENT FEEDBACK" title="Good work starts" accent="with good people." /><p className="studio-section-intro">A few words from the people on the other side of the collaboration.</p></div>
    <div className="testimonial-letter">
      <div className="letter-margin"><span className="studio-label">WORDS THAT MATTER</span><span aria-hidden="true">“</span><span className="studio-label">NOTE {String(index + 1).padStart(2, "0")}</span></div>
      <div className="letter-body" aria-live="polite"><AnimatePresence mode="wait" initial={false}><motion.figure key={review.id} initial={reduced ? false : {opacity:0, y:12}} animate={{opacity:1,y:0}} exit={reduced ? undefined : {opacity:0,y:-8}} transition={{duration:.22}}><blockquote>{review.content}</blockquote><figcaption><span className="letter-monogram" aria-hidden="true">{review.name.split(" ").map(name => name[0]).slice(0,2).join("")}</span><div><strong>{review.name}</strong><p>{review.position} / {review.company}</p></div>{review.website && <a href={review.website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${review.company}`}><ArrowUpRight size={20} /></a>}</figcaption></motion.figure></AnimatePresence></div>
    </div>
    <div className="book-controls"><p className="studio-label">A COLLECTION OF COLLABORATIONS</p><div><button aria-label="Previous Testimonial" onClick={() => setIndex((index - 1 + data.testimonials.length) % data.testimonials.length)}><ArrowLeft size={18}/></button><span>{String(index + 1).padStart(2,"0")} / {String(data.testimonials.length).padStart(2,"0")}</span><button aria-label="Next Testimonial" onClick={() => setIndex((index + 1) % data.testimonials.length)}><ArrowRight size={18}/></button></div></div>
  </div></section>
}
