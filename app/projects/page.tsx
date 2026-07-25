"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ExternalLink, Grid, List, Search, ArrowUpRight } from "lucide-react"
import projectsData from "@/public/data/projects.json"

const PROJECT_FILTERS_STORAGE_KEY = "project-directory-filters"

export default function ProjectsPage() {
  const [filter, setFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filtersReady, setFiltersReady] = useState(false)

  const categories = useMemo(() => ["All", ...Array.from(new Set(projectsData.projects.map((project) => project.category)))], [])

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    return projectsData.projects.filter((project) => {
      const matchesCategory = filter === "All" || project.category === filter
      const matchesSearch =
        query === "" ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(query))

      return matchesCategory && matchesSearch
    })
  }, [filter, searchQuery])

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(PROJECT_FILTERS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as {
          filter?: string
          searchQuery?: string
          viewMode?: "grid" | "list"
        }
        if (parsed.filter && categories.includes(parsed.filter)) setFilter(parsed.filter)
        if (typeof parsed.searchQuery === "string") setSearchQuery(parsed.searchQuery)
        if (parsed.viewMode === "grid" || parsed.viewMode === "list") setViewMode(parsed.viewMode)
      }
    } catch {
      sessionStorage.removeItem(PROJECT_FILTERS_STORAGE_KEY)
    } finally {
      setFiltersReady(true)
    }
  }, [categories])

  useEffect(() => {
    if (!filtersReady) return
    sessionStorage.setItem(
      PROJECT_FILTERS_STORAGE_KEY,
      JSON.stringify({ filter, searchQuery, viewMode })
    )
  }, [filter, filtersReady, searchQuery, viewMode])

  const resetFilters = () => {
    setSearchQuery("")
    setFilter("All")
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 border-t border-border">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Page Hero Header */}
        <div className="mb-14 border-b border-border pb-10">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            DIRECTORY // 02
          </div>
          <h1 className="font-display text-5xl font-black uppercase tracking-tight text-foreground sm:text-7xl md:text-8xl">
            PROJECT ARCHIVE
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-base md:text-lg text-muted-foreground font-light leading-relaxed">
            A comprehensive directory of full stack web applications, penetration testing frameworks, security tools, and systems projects.
          </p>
        </div>

        {/* Toolbar: Search, Filters, Grid/List */}
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
              className="w-full bg-card border border-border pl-10 pr-4 py-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
            />
          </div>

          {/* Category Pills & Layout Toggle */}
          <div className="flex min-w-0 items-center gap-3 justify-between">
            <div className="-mx-1 flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  aria-pressed={filter === cat}
                  className={`shrink-0 font-mono text-xs uppercase tracking-wider px-3 py-2 border transition-all duration-200 ${
                    filter === cat
                      ? "border-foreground bg-foreground text-background font-bold"
                      : "border-border bg-card text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="hidden items-center gap-1 border border-border bg-card p-1 sm:flex">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="-mt-8 mb-8 flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <p aria-live="polite">
            <span className="font-bold text-foreground">{filteredProjects.length}</span>{" "}
            {filteredProjects.length === 1 ? "project" : "projects"} found
          </p>
          {(filter !== "All" || searchQuery) && (
            <button
              type="button"
              onClick={resetFilters}
              className="font-bold text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Projects Display */}
        {filteredProjects.length > 0 ? (
          <div className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {filteredProjects.map((project, index) => {
              const numStr = String(index + 1).padStart(2, "0")
              const detailUrl = `/projects/${project.id}`

              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className={`group border border-border/80 bg-card/70 transition-all duration-300 hover:border-foreground/60 hover:shadow-lg flex flex-col justify-between ${
                    viewMode === "list" ? "md:grid md:grid-cols-12 md:items-center" : ""
                  }`}
                >
                  {/* Image Box */}
                  <Link
                    href={detailUrl}
                    prefetch={false}
                    aria-label={`View ${project.title} case study`}
                    className={`relative block aspect-[16/10] overflow-hidden bg-muted border-b border-border ${
                    viewMode === "list" ? "md:col-span-4 md:border-b-0 md:border-r" : ""
                  }`}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover grayscale contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:saturate-100 group-hover:contrast-100"
                    />
                    <div className="absolute top-3 left-3 bg-foreground text-background font-mono text-xs font-bold px-3 py-1 uppercase tracking-widest border border-foreground">
                      {numStr}
                    </div>
                  </Link>

                  {/* Text Details */}
                  <div className={`p-6 flex flex-col justify-between flex-1 ${viewMode === "list" ? "md:col-span-8" : ""}`}>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                        {project.category}
                      </div>
                      <h3 className="mb-3 font-display text-2xl font-black text-foreground">
                        <Link href={detailUrl} prefetch={false} className="hover:underline underline-offset-4">
                          {project.title}
                        </Link>
                      </h3>
                      <p className="mb-6 line-clamp-3 font-sans text-sm leading-relaxed text-muted-foreground">
                        {project.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-6 pt-4 border-t border-border/60 font-mono text-[10px]">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="rounded-full bg-muted px-2.5 py-1 text-foreground">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between font-mono text-xs font-bold uppercase">
                        <Link
                          href={detailUrl}
                          prefetch={false}
                          className="inline-flex items-center gap-1.5 text-foreground hover:underline"
                        >
                          VIEW CASE STUDY <ArrowUpRight className="w-4 h-4" />
                        </Link>

                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                          >
                            LIVE LINK <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        ) : (
          <div className="border border-border bg-card/70 p-12 text-center font-mono">
            <p className="text-muted-foreground uppercase text-sm mb-4">NO MATCHING PROJECTS FOUND</p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-foreground text-background font-bold text-xs uppercase tracking-wider"
            >
              RESET ALL FILTERS
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
