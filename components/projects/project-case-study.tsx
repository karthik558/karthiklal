"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  Braces,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Github,
  Layers3,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { getProjectEvidence } from "@/lib/project-evidence"
import ProjectTransitionLink from "@/components/projects/project-transition-link"

export interface CaseStudyProject {
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

type Props = {
  project: CaseStudyProject
  previousProject: CaseStudyProject
  nextProject: CaseStudyProject
}

const chapters = [
  { id: "brief", label: "The brief" },
  { id: "system", label: "The system" },
  { id: "build", label: "The build" },
  { id: "outcome", label: "The outcome" },
]

export default function ProjectCaseStudy({ project, previousProject, nextProject }: Props) {
  const [xray, setXray] = useState(false)
  const [activeChapter, setActiveChapter] = useState("brief")
  const [progress, setProgress] = useState(0)
  const evidence = useMemo(() => getProjectEvidence(project), [project])

  const projectType = useMemo(() => {
    const searchable = `${project.category} ${project.technologies.join(" ")}`.toLowerCase()
    if (/security|rust|python|network/.test(searchable)) return "security"
    if (/extension|javascript/.test(searchable)) return "product"
    return "platform"
  }, [project])

  useEffect(() => {
    const updateProgress = () => {
      const root = document.documentElement
      const distance = root.scrollHeight - window.innerHeight
      setProgress(distance > 0 ? Math.min(100, (window.scrollY / distance) * 100) : 0)
    }
    updateProgress()
    window.addEventListener("scroll", updateProgress, { passive: true })
    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActiveChapter(visible.target.id)
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0.1, 0.35, 0.65] }
    )
    chapters.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])

  const insights =
    projectType === "security"
      ? [
          ["01", "MINIMIZE TRUST", "Every boundary is treated as a verification point, with explicit input handling and constrained access."],
          ["02", "SURFACE SIGNAL", "Important system state remains visible so operators can diagnose behavior without unnecessary friction."],
          ["03", "FAIL SAFELY", "Recovery paths and guarded defaults protect the experience when data, networks, or dependencies fail."],
        ]
      : [
          ["01", "REDUCE FRICTION", "The primary task is brought forward, while secondary complexity is disclosed only when it becomes useful."],
          ["02", "MAKE STATE CLEAR", "Responsive feedback, meaningful empty states, and legible hierarchy keep people oriented."],
          ["03", "BUILD FOR CHANGE", "Modular components and typed data structures allow the product to grow without visual drift."],
        ]

  return (
    <article className="min-h-screen bg-background pb-28 pt-28">
      <div className="fixed inset-x-0 top-0 z-[9998] h-[2px] bg-border">
        <motion.div className="h-full origin-left bg-foreground" style={{ width: `${progress}%` }} />
      </div>

      <header className="container mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="mb-9 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
          <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Project directory
          </Link>
          <button
            type="button"
            onClick={() => setXray((current) => !current)}
            aria-pressed={xray}
            className={`inline-flex min-h-11 items-center gap-2 border-2 px-4 font-mono text-[10px] font-black uppercase tracking-widest transition-colors ${
              xray ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:border-foreground"
            }`}
          >
            {xray ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            X-Ray process {xray ? "on" : "off"}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="mb-5 flex flex-wrap items-center gap-3 font-mono text-[10px] font-black uppercase tracking-[0.18em]">
              <span className="bg-foreground px-3 py-1.5 text-background">{project.category}</span>
              <span className="text-muted-foreground">CASE STUDY // {String(project.id).padStart(2, "0")}</span>
            </div>
            <h1 className="max-w-5xl font-display text-5xl font-black uppercase leading-[0.85] tracking-[-0.045em] sm:text-7xl md:text-8xl lg:text-[7rem]">
              {project.title}
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="border-l-2 border-foreground pl-5 text-base font-light leading-relaxed text-muted-foreground md:text-lg">
              {project.description}
            </p>
          </div>
        </div>
      </header>

      <div
        className="relative mx-auto max-w-[1600px] border-y-2 border-foreground bg-muted"
        style={{ viewTransitionName: `project-${project.id}` }}
      >
        <div className="relative aspect-[16/9] min-h-[340px] w-full overflow-hidden">
          <Image src={project.image} alt={project.title} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white sm:bottom-8 sm:left-8 sm:right-8">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em]">PRIMARY EXPERIENCE / PRODUCTION VIEW</span>
            <span className="font-display text-5xl font-black sm:text-7xl">{String(project.id).padStart(2, "0")}</span>
          </div>
          {xray && (
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.2)_1px,transparent_1px)] bg-[size:8.333%_12.5%]" />
              <div className="absolute left-[8.3%] top-[12.5%] border border-white bg-black/80 px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-widest text-white">
                12-column responsive frame
              </div>
              <div className="absolute bottom-[12.5%] right-[8.3%] border border-white bg-black/80 px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-widest text-white">
                Content-safe boundary
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-28">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <div className="mb-4 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-muted-foreground">CASE STUDY INDEX</div>
            <nav className="border-l border-t border-border">
              {chapters.map((chapter, index) => (
                <a
                  key={chapter.id}
                  href={`#${chapter.id}`}
                  className={`flex items-center justify-between border-b border-r px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    activeChapter === chapter.id ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:border-foreground"
                  }`}
                >
                  <span>{String(index + 1).padStart(2, "0")} / {chapter.label}</span>
                </a>
              ))}
            </nav>
            <div className="mt-7 flex flex-wrap gap-2">
              {project.technologies.slice(0, 7).map((tech) => (
                <span key={tech} className="border border-border px-2 py-1 font-mono text-[9px] font-bold uppercase">{tech}</span>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <section id="brief" className="scroll-mt-32 border-b border-border pb-20">
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="h-4 w-4" /> 01 / THE BRIEF
            </div>
            <h2 className="max-w-4xl font-display text-4xl font-black uppercase leading-tight sm:text-6xl">
              TURN A COMPLEX WORKFLOW INTO A CLEAR, RELIABLE EXPERIENCE.
            </h2>
            <div className="mt-9 grid gap-6 md:grid-cols-2">
              <p className="text-base font-light leading-relaxed text-muted-foreground">
                {evidence.challenge}
              </p>
              <p className="text-base font-light leading-relaxed text-muted-foreground">
                {evidence.response}
              </p>
            </div>

            <div className="mt-12">
              <div className="mb-4 flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" /> Project evidence / sourced from the published build
              </div>
              <div className="grid border-l border-t border-border sm:grid-cols-3">
                {evidence.facts.map((fact) => (
                  <div key={`${fact.value}-${fact.label}`} className="min-h-44 border-b border-r border-border bg-card p-5 sm:p-6">
                    <div className="font-display text-3xl font-black uppercase sm:text-4xl">{fact.value}</div>
                    <div className="mt-5 font-mono text-[9px] font-black uppercase tracking-widest">{fact.label}</div>
                    <p className="mt-2 text-xs font-light leading-relaxed text-muted-foreground">{fact.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="system" className="scroll-mt-32 border-b border-border py-20">
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <Layers3 className="h-4 w-4" /> 02 / THE SYSTEM
            </div>
            <h2 className="font-display text-4xl font-black uppercase sm:text-6xl">DECISIONS, NOT DECORATION.</h2>
            <div className="mt-10 grid border-l border-t border-border md:grid-cols-3">
              {insights.map(([number, title, copy]) => (
                <div key={title} className="min-h-64 border-b border-r border-border bg-card p-6 sm:p-8">
                  <div className="font-mono text-[10px] font-black text-muted-foreground">{number} {"//"}</div>
                  <h3 className="mt-8 font-display text-2xl font-black uppercase">{title}</h3>
                  <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">{copy}</p>
                </div>
              ))}
            </div>
            {xray && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 border-2 border-dashed border-foreground bg-muted/50 p-6 sm:p-8">
                <div className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest">
                  <Blocks className="h-4 w-4" /> X-RAY / COMPONENT LOGIC
                </div>
                <div className="mt-6 grid gap-3 font-mono text-[10px] sm:grid-cols-4">
                  {["INPUT + INTENT", "VALIDATION", "SYSTEM ACTION", "VISIBLE FEEDBACK"].map((item, index) => (
                    <div key={item} className="relative border border-border bg-background p-4">
                      <span className="text-muted-foreground">0{index + 1}</span>
                      <div className="mt-3 font-bold">{item}</div>
                      {index < 3 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 bg-background md:block" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </section>

          <section id="build" className="scroll-mt-32 border-b border-border py-20">
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <Braces className="h-4 w-4" /> 03 / THE BUILD
            </div>
            <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
              <div>
                <h2 className="font-display text-4xl font-black uppercase sm:text-6xl">ENGINEERED AS A SYSTEM.</h2>
                <p className="mt-6 text-base font-light leading-relaxed text-muted-foreground">
                  A modular architecture keeps visual rules, data, and interaction states consistent. Responsive behavior is designed at component level instead of patched at page level.
                </p>
              </div>
              <div className="border-2 border-foreground bg-foreground p-6 font-mono text-[10px] leading-loose text-background sm:p-8">
                <div className="mb-4 flex items-center justify-between border-b border-background/30 pb-3">
                  <span>STACK.MANIFEST</span><span>PRODUCTION</span>
                </div>
                {project.technologies.map((tech, index) => (
                  <div key={tech} className="flex justify-between border-b border-background/15 py-2">
                    <span>{String(index + 1).padStart(2, "0")} / {tech.toUpperCase()}</span>
                    <span>ACTIVE</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 border-2 border-foreground">
              <div className="flex flex-col justify-between gap-4 border-b-2 border-foreground bg-foreground p-5 text-background sm:flex-row sm:items-center sm:p-6">
                <div>
                  <div className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-background/60">Decision record</div>
                  <h3 className="mt-2 font-display text-3xl font-black uppercase">Director&apos;s Notes</h3>
                </div>
                <MessageSquareQuote className="h-8 w-8" />
              </div>
              <div className="grid lg:grid-cols-3">
                {evidence.notes.map((note, index) => (
                  <article key={note.decision} className="border-b border-foreground p-5 last:border-b-0 sm:p-6 lg:min-h-72 lg:border-b-0 lg:border-r lg:last:border-r-0">
                    <div className="font-mono text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      {String(index + 1).padStart(2, "0")} / observed signal
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{note.signal}</p>
                    <h4 className="mt-8 font-display text-2xl font-black uppercase">{note.decision}</h4>
                    <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">{note.rationale}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="outcome" className="scroll-mt-32 pt-20">
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <ShieldCheck className="h-4 w-4" /> 04 / THE OUTCOME
            </div>
            <h2 className="max-w-4xl font-display text-4xl font-black uppercase leading-tight sm:text-6xl">
              A FASTER, CLEARER AND MORE RESILIENT PRODUCT FOUNDATION.
            </h2>
            <p className="mt-7 max-w-3xl text-base font-light leading-relaxed text-muted-foreground">{evidence.outcome}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 border-2 border-foreground bg-foreground px-5 font-mono text-[10px] font-black uppercase tracking-widest text-background hover:bg-background hover:text-foreground">
                  Launch project <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 border-2 border-border bg-card px-5 font-mono text-[10px] font-black uppercase tracking-widest hover:border-foreground">
                  View source <Github className="h-4 w-4" />
                </a>
              )}
            </div>
          </section>
        </div>
      </div>

      <nav className="container mx-auto grid max-w-7xl gap-4 border-t-2 border-foreground px-4 pt-10 md:grid-cols-2 md:px-6">
        <ProjectTransitionLink
          href={`/projects/${previousProject.id}`}
          projectId={previousProject.id}
          ariaLabel={`Previous case study: ${previousProject.title}`}
          className="group grid min-h-48 grid-cols-[112px_minmax(0,1fr)] overflow-hidden border border-border bg-card transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
        >
          <span className="relative block overflow-hidden border-r border-border">
            <Image src={previousProject.image} alt="" fill sizes="112px" className="object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
          </span>
          <span className="p-5 sm:p-6">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-background/65"><ArrowLeft className="mr-2 inline h-4 w-4" />Previous case</span>
            <span className="mt-5 block font-display text-2xl font-black uppercase">{previousProject.title}</span>
          </span>
        </ProjectTransitionLink>
        <ProjectTransitionLink
          href={`/projects/${nextProject.id}`}
          projectId={nextProject.id}
          ariaLabel={`Next case study: ${nextProject.title}`}
          className="group grid min-h-48 grid-cols-[minmax(0,1fr)_112px] overflow-hidden border border-border bg-card text-right transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
        >
          <span className="p-5 sm:p-6">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-background/65">Next case<ArrowRight className="ml-2 inline h-4 w-4" /></span>
            <span className="mt-5 block font-display text-2xl font-black uppercase">{nextProject.title}</span>
          </span>
          <span className="relative block overflow-hidden border-l border-border">
            <Image src={nextProject.image} alt="" fill sizes="112px" className="object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
          </span>
        </ProjectTransitionLink>
      </nav>
    </article>
  )
}
