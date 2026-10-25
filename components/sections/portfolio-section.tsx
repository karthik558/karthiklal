"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import SectionHeading from "@/components/sections/section-heading"
import PortfolioStack from "@/components/ui/portfolio-stack"
import data from "@/public/data/projects.json"

export default function PortfolioSection() {
  const [showAll, setShowAll] = useState(false)
  const [filter, setFilter] = useState("All")
  const projects = data.projects.filter(project => filter === "All" ? project.featured : project.category.toLowerCase().includes(filter.toLowerCase()) || project.technologies.some(tech => tech.toLowerCase().includes(filter.toLowerCase())))
  return <section id="portfolio" className="section-shell border-t border-border"><div className="section-container">
    <div className="section-heading-row"><SectionHeading number="03" label="ENGINEERING PROJECTS" title="Systems and tools." accent="Built to perform." /></div>
    <div className="book-filters">{["All", "Web Development", "Security", "Systems"].map(category => <button key={category} aria-pressed={filter === category} onClick={() => { setFilter(category); setShowAll(false) }}>{category}</button>)}</div>
    <PortfolioStack key={filter} label="Selected work" entries={(showAll ? projects : projects.slice(0, 4)).map(project => ({
      id: String(project.id),
      title: project.title,
      category: project.category,
      image: project.image,
      href: `/projects/${project.id}`,
      live: project.link,
      repository: project.github,
    }))} />
    {projects.length > 4 && <div className="collection-expand"><p className="studio-label">Showing {showAll ? projects.length : 4} of {projects.length} projects</p><button className="collection-expand-button" onClick={() => {
      if (!showAll) { setShowAll(true); return }
      setShowAll(false)
      requestAnimationFrame(() => {
        const section = document.getElementById("portfolio")
        section?.querySelector<HTMLButtonElement>('.book-filters button[aria-pressed="true"]')?.focus({ preventScroll: true })
        if (section && window.lenis) window.lenis.scrollTo(section, { immediate: true, offset: -80 })
        else if (section) window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - 80, behavior: "instant" })
      })
    }}>{showAll ? "SHOW FEWER" : `SHOW ALL ${projects.length} PROJECTS`} <ArrowUpRight size={16} /></button></div>}
    <Link href="/projects" className="studio-text-link mt-10">EXPLORE ALL PROJECTS <ArrowUpRight size={18} /></Link>
  </div></section>
}
