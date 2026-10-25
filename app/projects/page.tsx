"use client"

import PageIntro from "@/components/ui/page-intro"
import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Search } from "lucide-react"
import projectsData from "@/public/data/projects.json"
import ProjectTransitionLink from "@/components/projects/project-transition-link"

interface Project {
  id: number
  title: string
  description: string
  image: string
  category: string
  link?: string
  github?: string
  technologies: string[]
  featured: boolean
}

const PROJECT_FILTERS_STORAGE_KEY = "karthiklal_project_filters"

export default function ProjectsPage() {
  const [filter, setFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [filtersReady, setFiltersReady] = useState(false)

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projectsData.projects.map((project) => project.category)))],
    []
  )

  useEffect(() => {
    try {
      const savedFilters = sessionStorage.getItem(PROJECT_FILTERS_STORAGE_KEY)
      if (savedFilters) {
        const parsed = JSON.parse(savedFilters)
        if (parsed.filter && categories.includes(parsed.filter)) {
          setFilter(parsed.filter)
        }
        if (typeof parsed.searchQuery === "string") {
          setSearchQuery(parsed.searchQuery)
        }
      }
    } catch {}
    setFiltersReady(true)
  }, [categories])

  useEffect(() => {
    if (!filtersReady) return
    sessionStorage.setItem(
      PROJECT_FILTERS_STORAGE_KEY,
      JSON.stringify({ filter, searchQuery })
    )
  }, [filter, filtersReady, searchQuery])

  const resetFilters = () => {
    setSearchQuery("")
    setFilter("All")
  }

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    return (projectsData.projects as Project[]).filter((project) => {
      const matchesCategory = filter === "All" || project.category === filter
      const matchesSearch =
        query === "" ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(query))

      return matchesCategory && matchesSearch
    })
  }, [filter, searchQuery])

  const isFiltered = searchQuery.trim() !== "" || filter !== "All"

  return <div className="page-shell project-archive"><div className="section-container">
    <PageIntro label="SELECTED WORK / ENGINEERING" title="Built with purpose." accent="Made to work." description="Software, security, and systems. A closer look at what I build and how it works.">
      <span className="studio-label">{projectsData.projects.length} PROJECTS / THE COLLECTION</span>
    </PageIntro>
    <div className="archive-toolbar">
      <div className="book-filters" aria-label="Project categories">{categories.map(cat => <button key={cat} aria-pressed={filter === cat} onClick={() => setFilter(cat)}>{cat}</button>)}</div>
      <div className="archive-search"><Search size={16} aria-hidden="true" /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search projects or technology" aria-label="Search projects by name or technology" /></div>
    </div>
    <div className="archive-results"><p className="studio-label" aria-live="polite">{filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"} found</p>{isFiltered && <button onClick={resetFilters} className="studio-text-link">Clear filters</button>}</div>
    <div className="work-archive-grid">{filteredProjects.map((project, index) => <article key={project.id} className="archive-entry">
      <ProjectTransitionLink href={`/projects/${project.id}`} projectId={project.id} ariaLabel={`View ${project.title} case study`} className="archive-entry-image">
        <Image src={project.image} alt={project.title} fill priority={index < 2} sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        <span className="archive-image-action" aria-hidden="true"><ArrowUpRight size={22} /></span>
      </ProjectTransitionLink>
      <div className="archive-entry-heading"><div><p className="studio-label">{project.category}</p><h2><Link href={`/projects/${project.id}`}>{project.title}</Link></h2></div><span className="studio-label">{String(index + 1).padStart(2, "0")}</span></div>
      <p className="archive-entry-description">{project.description}</p>
      <div className="archive-entry-footer"><span>{project.technologies.slice(0, 3).join(" / ")}</span><ProjectTransitionLink href={`/projects/${project.id}`} projectId={project.id} shareElement={false} className="studio-text-link">CASE STUDY <ArrowUpRight size={15} /></ProjectTransitionLink>{project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="studio-text-link">LIVE <ArrowUpRight size={15} /></a>}</div>
    </article>)}</div>
    {!filteredProjects.length && <div className="archive-empty"><h2>No projects found.</h2><p>Try another name, technology, or category.</p><button onClick={resetFilters} className="studio-text-link">RESET FILTERS <ArrowUpRight size={16} /></button></div>}
    <div className="page-endnote"><p>Have something in mind?</p><Link href="/contact" className="studio-text-link">LET’S BUILD IT <ArrowUpRight size={18} /></Link></div>
  </div></div>
}
