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
              <motion.article
                key={category.name}
                initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={reducedMotion ? undefined : { y: -4 }}
                className="group relative flex min-w-0 flex-col border border-border bg-card/60 p-5 transition-all duration-300 hover:border-primary/80 hover:shadow-[2px_2px_0px_hsl(var(--primary))] sm:p-6"
              >
                {/* Blueprint Corner Accent */}
                <span className="pointer-events-none absolute -top-[1px] -left-[1px] h-2 w-2 border-t-2 border-l-2 border-transparent transition-colors duration-300 group-hover:border-primary" aria-hidden="true" />
                <span className="pointer-events-none absolute -bottom-[1px] -right-[1px] h-2 w-2 border-b-2 border-r-2 border-transparent transition-colors duration-300 group-hover:border-primary" aria-hidden="true" />

                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center border border-border bg-card transition-colors duration-300 group-hover:border-primary group-hover:bg-primary/10">
                    <Icon className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-115" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-display text-xl font-bold leading-tight tracking-tight">{category.name}</h3>
                </div>
                <ul aria-label={`${category.name} core tools`} className="mb-4 mt-4 flex flex-wrap content-start gap-1.5">
                  {category.skills.slice(0, 4).map(skill => (
                    <li key={skill} className="max-w-full border border-border/40 bg-muted/60 px-2 py-1 text-[13px] leading-snug text-muted-foreground transition-colors group-hover:border-primary/20">{skill}</li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => setExpanded(current => ({ ...current, [category.name]: !current[category.name] }))}
                    className="flex min-h-11 w-full items-center justify-between gap-3 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary cursor-pointer"
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
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

