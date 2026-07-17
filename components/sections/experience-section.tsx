"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { BriefcaseBusiness, ChevronDown, ChevronUp, GraduationCap } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { SectionHeader } from "@/components/ui/section-header"
import { cn } from "@/lib/utils"
import experiencesData from "@/public/data/experiences.json"

type ExperienceType = "work" | "education"
type TimelineFilter = "work" | "education" | "all"
type ExperienceItem = { id: number; title: string; company: string; duration: string; type: ExperienceType }

const INITIAL_ITEMS = 5
const experiences = experiencesData.experiences as ExperienceItem[]
const filterOptions: Array<{ label: string; value: TimelineFilter }> = [
  { label: "Experience", value: "work" },
  { label: "Education", value: "education" },
  { label: "View all", value: "all" },
]

function TimelineRow({ item, index }: { item: ExperienceItem; index: number }) {
  const isWork = item.type === "work"
  const isCurrent = item.duration.includes("Present") || item.duration.includes("Pursuing")
  const [startDate, endDate] = item.duration.split(" - ")

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.16) }}
      className="group grid gap-4 border-b border-border/70 py-7 first:border-t sm:grid-cols-[140px_minmax(0,1fr)_auto] sm:items-start sm:gap-7 md:py-9"
    >
      <div>
        <p className="font-display text-lg font-bold text-foreground">{startDate}</p>
        <p className={cn("mt-1 text-xs font-semibold", isCurrent ? "text-primary" : "text-muted-foreground")}>{endDate || "Current"}</p>
      </div>

      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{isWork ? "Professional" : "Education"}</span>
          {isCurrent && <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">Current</span>}
        </div>
        <h3 className="font-display text-xl font-bold leading-tight tracking-tight transition-colors group-hover:text-primary md:text-2xl">{item.title}</h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{item.company}</p>
      </div>

      <div className="hidden h-11 w-11 place-items-center rounded-full border border-border/70 text-primary sm:grid">
        {isWork ? <BriefcaseBusiness className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
      </div>
    </motion.article>
  )
}

export default function ExperienceSection() {
  const [filter, setFilter] = useState<TimelineFilter>("work")
  const [showAll, setShowAll] = useState(false)
  const filtered = useMemo(() => filter === "all" ? experiences : experiences.filter((item) => item.type === filter), [filter])
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_ITEMS)
  const hiddenCount = filtered.length - visible.length
  const roleCount = experiences.filter((item) => item.type === "work").length
  const educationCount = experiences.filter((item) => item.type === "education").length

  return (
    <section id="experience" className="relative overflow-hidden bg-background py-20 md:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 section-gradient-blend bg-[radial-gradient(900px_circle_at_12%_18%,hsl(var(--primary)/0.11),transparent_62%)]" />
      <div className="container relative z-10">
        <div className="mb-12 lg:mb-16">
          <SectionHeader eyebrow="Career Journey" title="Experience &" highlight="Education" align="left" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Browse timeline</p>
            <div className="mt-4 flex flex-wrap gap-2 lg:flex-col">
              {filterOptions.map((option) => (
                <button key={option.value} type="button" onClick={() => { setFilter(option.value); setShowAll(false) }} className={cn("flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition lg:w-full", filter === option.value ? "border-primary bg-primary text-primary-foreground" : "border-border/70 bg-card/45 text-muted-foreground hover:border-primary/30 hover:text-foreground")}>
                  {option.label}<span className="ml-4 text-xs opacity-60">{option.value === "work" ? roleCount : option.value === "education" ? educationCount : experiences.length}</span>
                </button>
              ))}
            </div>
            <div className="mt-7 hidden border-t border-border/70 pt-6 lg:block">
              <p className="font-display text-4xl font-bold">7+</p>
              <p className="mt-1 text-sm text-muted-foreground">Years of professional growth</p>
            </div>
          </aside>

          <div>
            <div className="mb-3 flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Chronology</p><p className="text-xs text-muted-foreground">{filtered.length} milestones</p></div>
            <AnimatePresence mode="popLayout">
              <motion.div layout>{visible.map((item, index) => <TimelineRow key={item.id} item={item} index={index} />)}</motion.div>
            </AnimatePresence>
            {(hiddenCount > 0 || showAll) && <motion.div layout className="mt-8"><AnimatedButton onClick={() => setShowAll((current) => !current)} variant="outline">{showAll ? "Show less" : `Show ${hiddenCount} more`}{showAll ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}</AnimatedButton></motion.div>}
          </div>
        </div>
      </div>
    </section>
  )
}
