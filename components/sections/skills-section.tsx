"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, ChevronDown, Code2, Cpu, Palette, Shield, Terminal, Wrench } from "lucide-react"
import skillsData from "@/public/data/skills.json"

const iconMap = { Code2, Terminal, Shield, Cpu, Palette, Wrench }

export default function SkillsSection() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const reducedMotion = useReducedMotion()
  return (
    <section id="skills" className="section-shell border-t-2 border-border">
      <div className="section-container">
        <div className="section-heading-row">
          <div>
            <div className="mb-3"><span className="paper-stamp">05 // EXPERTISE &amp; TOOLKIT</span></div>
            <h2 className="section-title">SKILLS &amp; EXPERTISE</h2>
          </div>
          <a href="https://github.com/karthik558" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold underline decoration-primary underline-offset-8 hover:text-primary">Explore my GitHub <ArrowUpRight className="h-4 w-4" /></a>
        </div>
        <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {skillsData.skillCategories.map((category, index) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap] || Code2
            const isExpanded = Boolean(expanded[category.name])
            const panelId = `skill-tools-${index}`
            return (
              <article key={category.name} className="relative flex min-w-0 flex-col border border-border bg-card/60 p-5 transition-colors hover:border-primary/60 sm:p-6">
                <div className="flex items-start gap-3">
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
                  <h3 className="font-display text-xl font-bold leading-tight tracking-tight">{category.name}</h3>
                </div>
                <ul aria-label={`${category.name} core tools`} className="mb-4 mt-4 flex flex-wrap content-start gap-1.5">
                  {category.skills.slice(0, 4).map(skill => (
                    <li key={skill} className="max-w-full bg-muted/60 px-2 py-1 text-[13px] leading-snug text-muted-foreground">{skill}</li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => setExpanded(current => ({ ...current, [category.name]: !current[category.name] }))}
                    className="flex min-h-11 w-full items-center justify-between gap-3 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <span>{isExpanded ? "Fewer tools" : "More tools"}<span className="sr-only"> — {category.name}</span></span>
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${isExpanded ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground"}`}>
                      <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}>
                        <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
                      </motion.span>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isExpanded && <motion.div
                    id={panelId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 text-sm leading-7 text-muted-foreground">{category.skills.slice(4).join(" · ")}</p>
                  </motion.div>}
                  </AnimatePresence>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
