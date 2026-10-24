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
    <div className="section-heading-row"><SectionHeading number="03" label="SELECTED WORK" title="Built with purpose." accent="Made to work." /><p className="studio-section-intro">A working collection of ideas made real. Scroll through the projects and the thinking behind them.</p></div>
    <div className="book-filters">{["All", "Web Development", "Security", "Systems"].map(category => <button key={category} aria-pressed={filter === category} onClick={() => { setFilter(category); setShowAll(false) }}>{category}</button>)}</div>
    <PortfolioStack key={filter} label="Selected work" entries={(showAll ? projects : projects.slice(0, 4)).map(project => ({ id: String(project.id), title: project.title, description: project.description, category: project.category, image: project.image, tags: project.technologies, href: `/projects/${project.id}`, repository: project.github }))} />
    {!showAll && projects.length > 4 && <div className="collection-expand"><p className="studio-label">Showing 4 of {projects.length} projects</p><button className="collection-expand-button" onClick={() => setShowAll(true)}>SHOW ALL {projects.length} PROJECTS <ArrowUpRight size={16} /></button></div>}
    <Link href="/projects" className="studio-text-link mt-10">EXPLORE ALL PROJECTS <ArrowUpRight size={18} /></Link>
  </div></section>
}
