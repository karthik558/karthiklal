"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ArrowUpRight, Github } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { SectionHeader } from "@/components/ui/section-header"
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

function ProjectActions({ project, inverse = false }: { project: Project; inverse?: boolean }) {
  const href = project.link || project.github || "/projects"

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Link
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${inverse ? "text-white hover:text-primary" : "text-foreground hover:text-primary"}`}
      >
        View project <ArrowUpRight className="h-4 w-4" />
      </Link>
      {project.github && (
        <Link href={project.github} target="_blank" rel="noreferrer" className={inverse ? "text-white/50 hover:text-white" : "text-muted-foreground hover:text-foreground"} aria-label={`View ${project.title} source code`}>
          <Github className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

function TopFeaturedProject({ project }: { project: Project }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative mb-8 overflow-hidden rounded-[2rem] bg-zinc-950 text-white shadow-[0_35px_100px_-55px_rgba(0,0,0,0.85)]"
    >
      <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="grid md:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)]">
        <div className="relative flex min-w-0 flex-col justify-between p-7 sm:p-9 md:min-h-[520px] md:p-8 lg:min-h-[580px] lg:p-10 xl:min-h-[620px] xl:p-12">
          <div>
            <div className="inline-flex rounded-full border border-primary/35 bg-primary/15 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Top featured project
            </div>
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.22em] text-white/45 lg:mt-10 lg:text-xs">{project.category}</p>
            <h3 className="mt-4 break-words font-display text-4xl font-bold leading-[0.98] tracking-tight sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">{project.title}</h3>
            <p className="mt-5 max-w-lg text-sm leading-6 text-white/62 lg:mt-6 lg:text-base lg:leading-7">{project.description}</p>
          </div>

          <div className="mt-8 lg:mt-10">
            <div className="mb-6 flex flex-wrap gap-2 lg:mb-7">
              {project.technologies.slice(0, 5).map((technology) => (
                <span key={technology} className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs text-white/65">{technology}</span>
              ))}
            </div>
            <ProjectActions project={project} inverse />
          </div>
        </div>

        <div className="relative min-h-[340px] min-w-0 bg-white/5 p-4 sm:min-h-[400px] sm:p-6 md:min-h-0 md:p-5 lg:p-7 xl:p-8">
          <div className="relative h-full min-h-[310px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl sm:min-h-[352px] md:min-h-0">
            <div className="absolute inset-x-0 top-0 z-10 flex h-11 items-center gap-1.5 border-b border-white/10 bg-zinc-950/90 px-4 backdrop-blur-md">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-4 rounded-full bg-white/5 px-4 py-1 font-mono text-[9px] text-white/35">live preview</span>
            </div>
            <Image src={project.image} alt={`Preview of ${project.title}`} fill priority sizes="(min-width: 1280px) 54vw, (min-width: 768px) 54vw, 100vw" className="object-cover pt-11" />
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function SupportingProject({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border/70 bg-card/70 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_70px_-50px_hsl(var(--primary)/0.4)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image src={project.image} alt={`Preview of ${project.title}`} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-white backdrop-blur-md">0{index + 2}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{project.category}</p>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">{project.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{project.description}</p>
        <div className="mt-auto pt-6"><ProjectActions project={project} /></div>
      </div>
    </motion.article>
  )
}

export default function PortfolioSection() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>(
    (projectsData.projects as Project[]).filter((project) => project.featured)
  )

  useEffect(() => {
    fetch("/data/projects.json", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setFeaturedProjects((data.projects as Project[]).filter((project) => project.featured)))
      .catch(() => undefined)
  }, [])

  if (featuredProjects.length === 0) return null

  const [topProject, ...remainingProjects] = featuredProjects

  return (
    <section id="portfolio" className="relative overflow-hidden bg-background py-20 md:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 section-gradient-blend bg-[radial-gradient(800px_circle_at_90%_4%,hsl(var(--primary)/0.1),transparent_62%)]" />
      <div className="container relative z-10">
        <div className="mb-12 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader eyebrow="Built & Shipped" title="Featured" highlight="Projects" description="The first project marked as featured gets the spotlight, followed by a focused selection of recent work." align="responsive" />
          <AnimatedButton href="/projects" variant="outline" className="w-fit shrink-0">View all projects <ArrowRight className="ml-2 h-4 w-4" /></AnimatedButton>
        </div>

        <TopFeaturedProject project={topProject} />

        {remainingProjects.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {remainingProjects.slice(0, 3).map((project, index) => <SupportingProject key={project.id} project={project} index={index} />)}
          </div>
        )}
      </div>
    </section>
  )
}
