"use client"

import PageIntro from "@/components/ui/page-intro"
import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react"
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

  return <article className="page-shell project-case-study">
    <div className="reading-progress" aria-hidden="true"><motion.div style={{ width: `${progress}%` }} /></div>
    <div className="section-container">
      <Link href="/projects" className="studio-text-link page-back"><ArrowLeft size={15} /> ALL PROJECTS</Link>
      <PageIntro label={`CASE STUDY / ${project.category}`} title={project.title} accent="Behind the build." description={project.description} />
      <div className="case-cover" style={{ viewTransitionName: `project-${project.id}` }}><Image src={project.image} alt={project.title} fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" /></div>
      <div className="case-summary"><span className="studio-label">{project.technologies.slice(0, 4).join(" / ")}</span><div>{project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="studio-text-link">VIEW LIVE <ArrowUpRight size={16} /></a>}{project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="studio-text-link">SOURCE <Github size={15} /></a>}</div></div>
      <div className="case-reading-layout">
        <aside><nav aria-label="Case study chapters" className="case-index"><p className="studio-label">IN THIS PROJECT</p>{chapters.map((chapter,index) => <a key={chapter.id} href={`#${chapter.id}`} aria-current={activeChapter === chapter.id ? "location" : undefined}><span>{String(index + 1).padStart(2,"0")}</span>{chapter.label}</a>)}</nav></aside>
        <div className="case-prose">
          <section id="brief"><p className="studio-label">01 / THE BRIEF</p><h2>The problem worth solving.</h2><p>{evidence.challenge}</p><p>{evidence.response}</p>
            <p className="studio-label case-evidence-label">Project evidence / published build</p><div className="case-facts">{evidence.facts.map(fact => <div key={`${fact.value}-${fact.label}`}><strong>{fact.value}</strong><span className="studio-label">{fact.label}</span><p>{fact.detail}</p></div>)}</div>
          </section>
          <section id="system"><p className="studio-label">02 / THE SYSTEM</p><h2>Decisions with purpose.</h2><div className="case-insights">{insights.map(([number,title,copy]) => <div key={title}><span className="studio-label">{number}</span><h3>{title.toLowerCase()}</h3><p>{copy}</p></div>)}</div></section>
          <section id="build"><p className="studio-label">03 / THE BUILD</p><h2>How it comes together.</h2><div className="case-technologies">{project.technologies.map((tech,index) => <div key={tech}><span className="studio-label">{String(index + 1).padStart(2,"0")}</span><span>{tech}</span></div>)}</div>
            <div className="case-notes"><p className="studio-label">DECISIONS / OBSERVATIONS</p><h3>Director&apos;s Notes</h3>{evidence.notes.map((note,index) => <article key={note.decision}><span className="studio-label">{String(index + 1).padStart(2,"0")}</span><div><h4>{note.decision}</h4><p>{note.signal}</p><p>{note.rationale}</p></div></article>)}</div>
          </section>
          <section id="outcome"><p className="studio-label">04 / THE OUTCOME</p><h2>What the work delivers.</h2><p>{evidence.outcome}</p><div className="case-actions">{project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="studio-text-link">LAUNCH PROJECT <ArrowUpRight size={17} /></a>}{project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="studio-text-link">VIEW SOURCE <Github size={16} /></a>}</div></section>
        </div>
      </div>
      <nav className="case-pagination" aria-label="More projects">
        <ProjectTransitionLink href={`/projects/${previousProject.id}`} projectId={previousProject.id} ariaLabel={`Previous case study: ${previousProject.title}`} className="case-pagination-link"><span className="studio-label"><ArrowLeft size={15} /> PREVIOUS PROJECT</span><strong>{previousProject.title}</strong></ProjectTransitionLink>
        <ProjectTransitionLink href={`/projects/${nextProject.id}`} projectId={nextProject.id} ariaLabel={`Next case study: ${nextProject.title}`} className="case-pagination-link"><span className="studio-label">NEXT PROJECT <ArrowRight size={15} /></span><strong>{nextProject.title}</strong></ProjectTransitionLink>
      </nav>
    </div>
  </article>
}
