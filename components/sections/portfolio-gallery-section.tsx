"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import SectionHeading from "@/components/sections/section-heading"
import PortfolioStack from "@/components/ui/portfolio-stack"
import { getBehanceUrl } from "@/lib/static-data"
import data from "@/public/data/featured-designs.json"

function category(discipline: string) {
  if (/interface|ui|mobile/i.test(discipline)) return "INTERFACE"
  if (/logo|identity|brand|emblem/i.test(discipline)) return "IDENTITY"
  if (/illustration|character|vector|3d|poster/i.test(discipline)) return "ILLUSTRATION"
  return "CAMPAIGNS"
}

export default function PortfolioGallerySection() {
  const [filter, setFilter] = useState("ALL")
  const designs = data.featuredDesigns.filter(item => filter === "ALL" || category(item.discipline) === filter)
  return <section id="portfolio-gallery" className="section-shell border-t border-border"><div className="section-container">
    <div className="section-heading-row"><SectionHeading number="04" label="THE VISUAL SIDE" title="A different" accent="kind of thinking." /><a href={getBehanceUrl("#")} target="_blank" rel="noopener noreferrer" className="studio-text-link">VIEW BEHANCE <ArrowUpRight size={18} /></a></div>
    <div className="book-filters">{["ALL", "CAMPAIGNS", "ILLUSTRATION", "IDENTITY", "INTERFACE"].map(item => <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div>
    <PortfolioStack key={filter} label="Visual studies" entries={designs.map(item => ({id:item.image, title:item.title, description:item.description, image:item.image, category:item.discipline}))} />
  </div></section>
}
