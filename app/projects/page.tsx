"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, ExternalLink, Search } from "lucide-react"
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

  const featuredProject = useMemo(() => {
    return filteredProjects.find((project) => project.featured) || filteredProjects[0] || null
  }, [filteredProjects])

  const regularProjects = useMemo(() => {
    if (!featuredProject) return []
    return filteredProjects.filter((project) => project.id !== featuredProject.id)
  }, [filteredProjects, featuredProject])

  const isFiltered = searchQuery.trim() !== "" || filter !== "All"
  const visibleProjects = isFiltered ? filteredProjects : regularProjects

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 border-t border-border">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Page Hero Header */}
        <div className="mb-14 border-b border-border pb-10">
          <div className="mb-3">
            <span className="paper-stamp">
              PROJECT DOSSIERS // ARCHIVE &amp; SPECIMENS
            </span>
          </div>
          <h1 className="font-display text-5xl font-black uppercase tracking-tight text-foreground sm:text-7xl md:text-8xl">
            PROJECT ARCHIVE
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-base md:text-lg text-muted-foreground font-light leading-relaxed">
            A comprehensive directory of full stack web applications, penetration testing frameworks, security tools, and systems engineering specimens.
          </p>
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="mb-12 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 border-b border-border pb-8">
          {/* Search Box */}
          <div className="relative min-w-[280px] lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH PROJECTS OR TECH..."
              aria-label="Search projects by name or technology"
              className="w-full bg-card border-2 border-border pl-10 pr-4 py-3 font-mono text-xs text-foreground uppercase placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                aria-pressed={filter === cat}
                className={`paper-button px-3.5 py-2 border transition-all duration-200 cursor-pointer ${
                  filter === cat
                    ? "border-foreground bg-foreground text-background font-bold shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter & Reset */}
        <div className="-mt-6 mb-8 flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          <p aria-live="polite">
            <span className="font-bold text-foreground">{filteredProjects.length}</span>{" "}
            {filteredProjects.length === 1 ? "project" : "projects"} found
          </p>
          {(filter !== "All" || searchQuery) && (
            <button
              type="button"
              onClick={resetFilters}
              className="paper-button font-bold text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Content Section */}
        {filteredProjects.length > 0 ? (
          <div className="space-y-12">
            
            {/* Featured Flagship Project Card - Mirroring Stories and Blog Lead Layout */}
            {featuredProject && !isFiltered && (
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="paper-sheet-stacked group border-2 border-foreground grid grid-cols-1 lg:grid-cols-12 items-stretch"
              >
                <ProjectTransitionLink
                  href={`/projects/${featuredProject.id}`}
                  projectId={featuredProject.id}
                  ariaLabel={`View ${featuredProject.title} case study`}
                  className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-muted border-b-2 lg:border-b-0 lg:border-r-2 border-foreground cursor-pointer min-h-[300px] lg:min-h-[420px] block"
                >
                  <Image
                    src={featuredProject.image}
                    alt={featuredProject.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover grayscale contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:saturate-100 group-hover:contrast-100"
                  />
                  <div className="absolute top-4 left-4 bg-foreground text-background font-mono text-xs font-bold px-3 py-1 uppercase tracking-widest border border-foreground shadow-sm">
                    FLAGSHIP SPECIMEN
                  </div>
                </ProjectTransitionLink>

                <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="paper-tag border border-border">{featuredProject.category}</span>
                      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">ENGINEERING // SECURITY</span>
                    </div>

                    <Link href={`/projects/${featuredProject.id}`} className="block">
                      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-foreground group-hover:underline underline-offset-4 mb-4 cursor-pointer leading-tight">
                        {featuredProject.title}
                      </h2>
                    </Link>

                    <p className="font-sans text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                      {featuredProject.description}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-2 mb-6 font-mono text-xs">
                      {featuredProject.technologies.slice(0, 6).map((tech) => (
                        <span key={tech} className="border border-border bg-background px-2.5 py-1 text-foreground uppercase font-bold text-[10px]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs font-bold uppercase">
                    <ProjectTransitionLink
                      href={`/projects/${featuredProject.id}`}
                      projectId={featuredProject.id}
                      ariaLabel={`View ${featuredProject.title} case study`}
                      className="paper-button inline-flex h-11 items-center gap-2 border-2 border-foreground bg-foreground px-6 font-mono text-xs font-bold uppercase tracking-wider text-background transition-colors hover:bg-background hover:text-foreground cursor-pointer shadow-sm"
                    >
                      FULL CASE STUDY <ArrowUpRight className="w-4 h-4" />
                    </ProjectTransitionLink>

                    {featuredProject.link && (
                      <a
                        href={featuredProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="paper-button h-11 px-5 inline-flex items-center gap-2 border-2 border-border bg-card text-foreground font-mono text-xs font-bold uppercase tracking-wider hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                      >
                        LIVE PLATFORM <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            )}

            {/* Projects Grid */}
            {visibleProjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleProjects.map((project, index) => {
                  const numStr = String(index + 1).padStart(2, "0")
                  const detailUrl = `/projects/${project.id}`

                  return (
                    <motion.article
                      key={project.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.04 }}
                      className="paper-sheet paper-folded-corner group border-2 border-border hover:border-foreground transition-all duration-300 flex flex-col justify-between"
                    >
                      <ProjectTransitionLink
                        href={detailUrl}
                        projectId={project.id}
                        ariaLabel={`View ${project.title} case study`}
                        className="relative aspect-[16/10] overflow-hidden bg-muted border-b-2 border-border cursor-pointer block"
                      >
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="object-cover grayscale contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:saturate-100 group-hover:contrast-100"
                        />
                        <div className="absolute top-3 left-3 bg-foreground text-background font-mono text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider shadow-sm">
                          {project.category}
                        </div>
                        <div className="absolute top-3 right-3 bg-background/90 text-foreground font-mono text-[10px] font-bold px-2 py-0.5 uppercase border border-border">
                          [{numStr}]
                        </div>
                      </ProjectTransitionLink>

                      <div className="p-6 flex flex-col justify-between flex-1">
                        <div>
                          <div className="font-mono text-[10px] uppercase text-muted-foreground mb-2 flex items-center gap-2">
                            <span>DOSSIER // {numStr}</span>
                            <span>{"//"}</span>
                            <span>{project.technologies[0] || "SYSTEM"}</span>
                          </div>

                          <Link href={detailUrl} prefetch={false}>
                            <h3 className="font-display text-2xl font-black uppercase text-foreground group-hover:underline underline-offset-4 mb-2 line-clamp-2 cursor-pointer">
                              {project.title}
                            </h3>
                          </Link>

                          <p className="font-sans text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                            {project.description}
                          </p>

                          <div className="mb-6 flex flex-wrap gap-1.5 border-t border-border/60 pt-4 font-mono text-[9px]">
                            {project.technologies.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="border border-border bg-background px-2 py-0.5 font-bold uppercase tracking-wider text-foreground"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border/60 flex items-center justify-between font-mono text-xs font-bold uppercase">
                          <ProjectTransitionLink
                            href={detailUrl}
                            projectId={project.id}
                            className="paper-button inline-flex h-10 items-center gap-2 border-2 border-foreground bg-foreground px-4 font-mono text-xs font-bold uppercase tracking-wider text-background transition-colors hover:bg-background hover:text-foreground cursor-pointer shadow-sm"
                          >
                            CASE STUDY <ArrowUpRight className="w-3.5 h-3.5" />
                          </ProjectTransitionLink>

                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-mono text-[11px] uppercase font-bold"
                            >
                              LIVE <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            )}

          </div>
        ) : (
          <div className="paper-sheet border-2 border-border p-12 text-center font-mono">
            <p className="text-muted-foreground uppercase text-sm mb-4">NO MATCHING PROJECTS FOUND</p>
            <button
              onClick={() => { setSearchQuery(""); setFilter("All") }}
              className="paper-button px-6 py-3 bg-foreground text-background font-bold text-xs uppercase tracking-wider"
            >
              RESET FILTERS
            </button>
          </div>
        )}

        {/* Bottom Section: About Karthik Lal's Engineering Archive */}
        <div className="paper-sheet paper-index-card mt-16 border-2 border-foreground p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-mono text-xs uppercase">
          <div className="space-y-1.5 max-w-2xl">
            <div className="font-bold text-foreground text-sm tracking-wider">
              ABOUT KARTHIK LAL&apos;S ENGINEERING ARCHIVE
            </div>
            <p className="text-muted-foreground normal-case font-sans text-sm leading-relaxed">
              All codebases, architectures, and penetration testing methodologies are verified across production deployments, enterprise security audits, and mission-critical networks.
            </p>
          </div>
          <div className="shrink-0 font-mono text-[10px] text-muted-foreground uppercase tracking-widest border border-border px-3 py-1.5 bg-background">
            ENGINEERING ARCHIVE // 2019–2026
          </div>
        </div>

      </div>
    </div>
  )
}
