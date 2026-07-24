import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Github, ExternalLink } from "lucide-react"
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

const projects = projectsData.projects as Project[]

export const dynamicParams = false

export function generateStaticParams() {
  return projects.map((project) => ({ id: String(project.id) }))
}

export default async function SingleProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const projectId = parseInt(id, 10)
  
  const projectIndex = projects.findIndex((p) => p.id === projectId)
  const project = projects[projectIndex]

  if (!project) {
    return (
      <main className="min-h-screen bg-background pt-32 pb-24 text-center">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="font-display text-4xl font-black uppercase text-foreground mb-4">PROJECT NOT FOUND</h1>
          <Link href="/projects" className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-mono text-xs uppercase font-bold">
            <ArrowLeft className="w-4 h-4" /> RETURN TO PROJECTS
          </Link>
        </div>
      </main>
    )
  }

  const prevProject = projects[projectIndex - 1] || projects[projects.length - 1]
  const nextProject = projects[projectIndex + 1] || projects[0]

  return (
    <main className="min-h-screen bg-background pt-32 pb-28 border-t border-border">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> BACK TO ALL PROJECTS
          </Link>
        </div>

        {/* Case Study Header */}
        <div className="border-b-2 border-border pb-10 mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4 font-mono text-xs uppercase">
            <span className="bg-foreground text-background px-3 py-1 font-bold">
              {project.category}
            </span>
            <span className="text-muted-foreground">
              PROJECT ID // #{String(project.id).padStart(2, "0")}
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-foreground mb-6">
            {project.title}
          </h1>

          <p className="font-sans text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-4xl">
            {project.description}
          </p>
        </div>

        {/* Project Image & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 items-start">
          
          {/* Main Hero Image */}
          <div className="lg:col-span-8 border-2 border-foreground bg-card overflow-hidden">
            <div className="relative aspect-[16/10] w-full bg-muted">
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          {/* Metadata Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border-2 border-border bg-card p-6 md:p-8 space-y-6 font-mono text-xs">
              
              <div>
                <div className="uppercase tracking-widest text-muted-foreground mb-1">
                  CATEGORY
                </div>
                <div className="font-bold text-foreground text-sm uppercase">
                  {project.category}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="uppercase tracking-widest text-muted-foreground mb-2">
                  TECHNOLOGY STACK
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="border border-foreground bg-foreground text-background px-2.5 py-1 font-bold uppercase">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between px-4 py-3 bg-foreground text-background font-bold uppercase tracking-wider hover:bg-foreground/90 transition-colors"
                  >
                    <span>LAUNCH LIVE SITE</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between px-4 py-3 border border-border bg-background text-foreground font-bold uppercase tracking-wider hover:border-foreground transition-colors"
                  >
                    <span>SOURCE REPOSITORY</span>
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Project Breakdown Sections */}
        <div className="border-2 border-border bg-card p-8 md:p-12 mb-16 space-y-8 font-sans">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
              OVERVIEW & ARCHITECTURE
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-black uppercase text-foreground mb-4">
              TECHNICAL SCOPE & IMPLEMENTATION
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Designed with a security-first mindset, this project integrates modern front-end reactivity with robust backend API services. Built using <strong className="text-foreground">{project.technologies.join(", ")}</strong> to deliver minimal latency, optimal SEO performance, and responsive UI states across device viewports.
            </p>
          </div>
        </div>

        {/* Next / Previous Project Footer Navigation */}
        <div className="border-t-2 border-border pt-12 grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          
          <Link
            href={`/projects/${prevProject.id}`}
            prefetch={false}
            className="group border-2 border-border bg-card p-6 flex flex-col justify-between hover:border-foreground transition-all"
          >
            <div className="text-muted-foreground uppercase flex items-center gap-1 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> PREVIOUS PROJECT
            </div>
            <div className="font-display text-2xl font-black uppercase text-foreground group-hover:underline">
              {prevProject.title}
            </div>
          </Link>

          <Link
            href={`/projects/${nextProject.id}`}
            prefetch={false}
            className="group border-2 border-border bg-card p-6 flex flex-col justify-between text-right hover:border-foreground transition-all"
          >
            <div className="text-muted-foreground uppercase flex items-center justify-end gap-1 mb-2">
              NEXT PROJECT <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <div className="font-display text-2xl font-black uppercase text-foreground group-hover:underline">
              {nextProject.title}
            </div>
          </Link>

        </div>
      </div>
    </main>
  )
}
