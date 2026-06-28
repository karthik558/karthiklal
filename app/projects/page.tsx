"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ExternalLink, Github, Grid, List } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState, FilterPills, PageHero, PageShell, PageToolbar, SearchField } from "@/components/ui/page-layout"
import { cn } from "@/lib/utils"
import projectsData from "@/public/data/projects.json"

export default function ProjectsPage() {
  const [filter, setFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

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

  const clearSearch = () => {
    setSearchQuery("")
    setFilter("All")
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="My Portfolio"
        title="Selected"
        gradientText="Work"
        description="A focused collection of web, product, and technical projects with the stack and outcomes kept easy to scan."
      />

      <PageToolbar>
        <SearchField value={searchQuery} onChange={setSearchQuery} onClear={() => setSearchQuery("")} placeholder="Search projects..." />
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <FilterPills items={categories} activeItem={filter} onSelect={setFilter} layoutId="projectFilter" />
          <div className="flex w-max items-center gap-1 rounded-md border border-border/70 bg-background/60 p-1">
            <Button
              type="button"
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              aria-label="Grid view"
              onClick={() => setViewMode("grid")}
              className="h-9 w-9 rounded-md"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              aria-label="List view"
              onClick={() => setViewMode("list")}
              className="h-9 w-9 rounded-md"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </PageToolbar>

      <AnimatePresence mode="wait">
        {filteredProjects.length > 0 ? (
          <motion.div
            layout
            key={viewMode}
            className={cn("grid gap-6", viewMode === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.article
                  layout
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.45, delay: index * 0.03 }}
                  className={cn(
                    "group overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-md",
                    viewMode === "list" && "grid md:grid-cols-[360px_1fr]"
                  )}
                >
                  <div className={cn("relative aspect-[16/10] overflow-hidden bg-muted", viewMode === "list" && "md:aspect-auto md:min-h-[270px]")}>
                    <Image src={project.image} alt={project.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <Badge className="rounded-md bg-background/90 px-3 py-1 text-foreground backdrop-blur hover:bg-background/90">{project.category}</Badge>
                      {project.featured && <Badge className="rounded-md bg-primary px-3 py-1 text-primary-foreground">Featured</Badge>}
                    </div>
                  </div>

                  <div className="flex min-h-full flex-col p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-2xl font-bold tracking-tight transition group-hover:text-primary">{project.title}</h3>
                      <div className="flex shrink-0 gap-2">
                        {project.link && (
                          <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-md" aria-label={`Open ${project.title}`}>
                            <Link href={project.link} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        {project.github && (
                          <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-md" aria-label={`${project.title} source code`}>
                            <Link href={project.github} target="_blank">
                              <Github className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-4 text-sm leading-6 text-muted-foreground md:text-base">{project.description}</p>

                    <div className="mt-auto flex flex-wrap gap-2 pt-6">
                      {project.technologies.slice(0, viewMode === "list" ? 8 : 5).map((tech) => (
                        <span key={tech} className="rounded-md border border-border/70 bg-secondary/50 px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > (viewMode === "list" ? 8 : 5) && (
                        <span className="rounded-md border border-border/70 bg-secondary/50 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          +{project.technologies.length - (viewMode === "list" ? 8 : 5)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState title="No projects found" description="Try a different search term, technology, or category to find more work." actionLabel="Clear all filters" onAction={clearSearch} />
        )}
      </AnimatePresence>
    </PageShell>
  )
}
