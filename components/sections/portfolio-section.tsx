"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, FolderOpen, Github, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/animated-button"
import { cn } from "@/lib/utils"

// Define the project type
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

const ProjectCard = ({ project, className, index }: { project: Project, className?: string, index: number }) => {
  const isLarge = className?.includes("md:col-span-2")

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 15,
        delay: index * 0.15,
      }}
      className={cn(
        "group relative flex flex-col rounded-3xl bg-card border border-border/80 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden h-full",
        isLarge ? "md:flex-row" : "flex-col",
        className
      )}
    >
      {isLarge ? (
        // Side-by-Side Layout for Large Card
        <>
          {/* Left: Image / Screenshot */}
          <div className="relative w-full md:w-3/5 h-48 md:h-full shrink-0 overflow-hidden bg-muted/10 border-r border-border/20">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-102"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
          </div>

          {/* Right: Browser Window Mock & Content */}
          <div className="flex flex-col flex-grow h-full">
            {/* Mock Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border-b border-border/50 select-none">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/40 group-hover:bg-red-500/80 transition-colors duration-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40 group-hover:bg-yellow-500/80 transition-colors duration-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/40 group-hover:bg-green-500/80 transition-colors duration-300" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground/60">
                {project.title.toLowerCase().replace(/\s+/g, "-")}.dev
              </span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-mono text-muted-foreground/40">live</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex flex-col justify-between flex-grow p-6 md:p-8">
              <div>
                <div className="mb-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5">
                    {project.category}
                  </Badge>
                </div>
                <h3 className="text-xl md:text-3xl font-display font-bold text-foreground leading-tight">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm mt-3 leading-relaxed md:line-clamp-4 line-clamp-3">
                  {project.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-4 md:mt-0">
                <div className="flex flex-wrap gap-1.5 max-w-[75%]">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-[10px] py-0 px-2 bg-muted/40 text-muted-foreground border-border/40 font-normal">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 shrink-0">
                  {project.github && (
                    <Link
                      href={project.github}
                      target="_blank"
                      className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300"
                      title="View GitHub"
                    >
                      <Github className="h-4 w-4" />
                    </Link>
                  )}
                  {project.link && (
                    <Link
                      href={project.link}
                      target="_blank"
                      className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300"
                      title="Visit Site"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Standard Card Layout
        <>
          {/* Mock Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/20 border-b border-border/50 select-none shrink-0">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/40 group-hover:bg-red-500/80 transition-colors duration-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40 group-hover:bg-yellow-500/80 transition-colors duration-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/40 group-hover:bg-green-500/80 transition-colors duration-300" />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground/60">
              {project.title.toLowerCase().replace(/\s+/g, "-")}.dev
            </span>
            <div className="w-8" />
          </div>

          {/* Image Area */}
          <div className="relative w-full h-44 shrink-0 overflow-hidden bg-muted/10">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
          </div>

          {/* Content Body */}
          <div className="flex flex-col justify-between flex-grow p-5">
            <div>
              <div className="mb-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[9px] font-semibold tracking-wider uppercase px-2 py-0">
                  {project.category}
                </Badge>
              </div>
              <h3 className="text-lg md:text-xl font-display font-bold text-foreground leading-tight">
                {project.title}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed mt-2 line-clamp-3">
                {project.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-3">
              <div className="flex flex-wrap gap-1 max-w-[70%]">
                {project.technologies.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="outline" className="text-[9px] py-0 px-1.5 bg-muted/40 text-muted-foreground/90 border-border/30 font-normal">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-1.5 shrink-0">
                {project.github && (
                  <Link
                    href={project.github}
                    target="_blank"
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300"
                    title="View GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </Link>
                )}
                {project.link && (
                  <Link
                    href={project.link}
                    target="_blank"
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300"
                    title="Visit Site"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}

export default function PortfolioSection() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch('/data/projects.json', { cache: 'no-store' })
        const data = await res.json()
        const filtered = data.projects.filter((project: Project) => project.featured)
        setFeaturedProjects(filtered)
      } catch (error) {
        console.error('Error loading projects:', error)
        setFeaturedProjects([])
      } finally {
        setIsLoading(false)
      }
    }
    loadProjects()
  }, [])

  if (isLoading) {
    return (
      <section className="py-32 bg-background">
        <div className="container">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/3 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[420px] bg-muted rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="portfolio" className="py-32 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden section-gradient-blend">
        <div className="absolute top-[15%] right-[-10%] w-[520px] h-[520px] bg-primary/6 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] left-[-8%] w-[420px] h-[420px] bg-accent/6 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 rounded-full mb-6">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Selected Works</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
            Featured <span className="text-gradient">Projects</span>
          </h2>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[420px]">
          {featuredProjects.slice(0, 3).map((project, index) => {
            // Logic for Bento Grid sizing
            // First item spans 2 cols and 1 row
            // Others are 1x1
            const isLarge = index === 0
            const spanClass = isLarge ? "md:col-span-2" : "md:col-span-1"

            return (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                className={spanClass}
              />
            )
          })}

          {/* "See More" Card */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 15,
              delay: 3 * 0.15,
            }}
            className="md:col-span-2 flex flex-col items-center justify-center rounded-3xl bg-card/40 border border-dashed border-foreground/20 hover:border-primary/40 hover:bg-secondary/10 transition-all duration-500 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(400px_circle_at_var(--x,50%)_var(--y,50%),hsl(var(--primary)/0.05),transparent_80%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="text-center p-8 relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-background flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300 shadow-md border border-foreground/5">
                <FolderOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">View All Projects</h3>
              <p className="text-muted-foreground mb-6 max-w-[240px] mx-auto text-sm">
                Explore the full archive of my work and experiments.
              </p>
              <AnimatedButton href="/projects">
                Open Portfolio <ArrowRight className="ml-2 h-4 w-4" />
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
