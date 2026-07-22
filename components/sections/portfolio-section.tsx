"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, Github, Eye, X, ExternalLink, Sparkles } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import projectsData from "@/public/data/projects.json"

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

export default function PortfolioSection() {
  const [projects, setProjects] = useState<Project[]>(projectsData.projects as Project[])
  const [filter, setFilter] = useState<string>("All")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    fetch("/data/projects.json", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setProjects(data.projects as Project[]))
      .catch(() => undefined)
  }, [])

  const categories = ["All", "Web Development", "Security", "Systems"]

  const filteredProjects = projects.filter((p) => {
    if (filter === "All") return p.featured
    return p.category.toLowerCase().includes(filter.toLowerCase()) || p.technologies.some(t => t.toLowerCase().includes(filter.toLowerCase()))
  })

  return (
    <section id="portfolio" className="relative bg-background py-28 md:py-36 border-t border-border">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Header Row */}
        <div className="mb-14 border-b border-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              02 // SELECTED WORK
            </div>
            <h2 className="font-display text-4xl font-black uppercase tracking-tight text-foreground sm:text-6xl md:text-7xl">
              FEATURED PROJECTS
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-all duration-200 ${
                  filter === cat
                    ? "border-foreground bg-foreground text-background font-bold"
                    : "border-border bg-card text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.slice(0, 6).map((project, index) => {
            const numStr = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`
            const projectUrl = `/projects/${project.id}`

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative flex flex-col justify-between border-2 border-border bg-card transition-all duration-300 hover:border-foreground hover:shadow-2xl"
              >
                {/* Top Image Box */}
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b-2 border-border bg-muted">
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

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="absolute bottom-3 right-3 bg-background/90 text-foreground hover:bg-foreground hover:text-background p-2.5 border border-border backdrop-blur-md transition-colors"
                    title="Quick Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Content Details */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                      {project.category}
                    </div>
                    <h3 className="font-display text-2xl font-black uppercase text-foreground group-hover:underline decoration-foreground underline-offset-4 mb-3">
                      {project.title}
                    </h3>
                    <p className="font-sans text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6 pt-4 border-t border-border/60 font-mono text-[10px]">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="border border-border bg-background px-2 py-0.5 text-foreground uppercase">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center justify-between font-mono text-xs font-bold uppercase">
                      <Link
                        href={projectUrl}
                        className="inline-flex items-center gap-1.5 text-foreground hover:underline decoration-2"
                      >
                        CASE STUDY <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>

                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                        >
                          LIVE DEMO <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* View All Projects Footer Trigger */}
        <div className="mt-16 text-center">
          <AnimatedButton
            href="/projects"
            variant="primary"
            className="h-14 px-10 font-mono text-sm uppercase tracking-wider bg-foreground text-background border border-foreground hover:bg-foreground/90"
          >
            EXPLORE ALL PROJECTS DIRECTORY <ArrowUpRight className="ml-2 h-4 w-4" />
          </AnimatedButton>
        </div>
      </div>

      {/* Quick View Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl border-2 border-foreground bg-card p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 border border-border bg-background text-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                PROJECT PREVIEW // {selectedProject.category}
              </div>
              <h3 className="font-display text-3xl md:text-4xl font-black uppercase text-foreground mb-4">
                {selectedProject.title}
              </h3>

              <div className="relative aspect-video w-full border-2 border-border mb-6 overflow-hidden bg-muted">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
              </div>

              <p className="font-sans text-sm md:text-base text-foreground/90 leading-relaxed mb-6">
                {selectedProject.description}
              </p>

              <div className="mb-6">
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  TECHNOLOGY STACK
                </div>
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  {selectedProject.technologies.map((tech) => (
                    <span key={tech} className="border border-foreground bg-foreground text-background px-3 py-1 uppercase font-bold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-6 border-t border-border">
                <Link
                  href={`/projects/${selectedProject.id}`}
                  onClick={() => setSelectedProject(null)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider border border-foreground hover:bg-foreground/90"
                >
                  FULL CASE STUDY <ArrowUpRight className="w-4 h-4" />
                </Link>

                {selectedProject.link && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-border bg-background text-foreground font-mono text-xs font-bold uppercase tracking-wider hover:bg-foreground hover:text-background"
                  >
                    LIVE SITE <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-border bg-background text-foreground font-mono text-xs font-bold uppercase tracking-wider hover:bg-foreground hover:text-background"
                  >
                    GITHUB REPO <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

