"use client"

import { useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useInView } from "framer-motion"
import {
  BriefcaseBusiness,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Landmark,
} from "lucide-react"

import { AnimatedButton } from "@/components/ui/animated-button"
import { SectionHeader } from "@/components/ui/section-header"
import { cn } from "@/lib/utils"
import experiencesData from "@/public/data/experiences.json"

type ExperienceType = "work" | "education"

type ExperienceItem = {
  id: number
  title: string
  company: string
  duration: string
  type: ExperienceType
}

type TimelineFilter = "work" | "education" | "all"

const INITIAL_ITEMS = 4

export default function ExperienceSection() {
  const [showAll, setShowAll] = useState(false)
  const [filter, setFilter] = useState<TimelineFilter>("work")
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.12 })

  const experiences = experiencesData.experiences as ExperienceItem[]
  const filteredExperiences = useMemo(() => {
    if (filter === "all") return experiences
    return experiences.filter((item) => item.type === filter)
  }, [experiences, filter])
  const visibleItems = showAll ? filteredExperiences : filteredExperiences.slice(0, INITIAL_ITEMS)
  const hiddenCount = filteredExperiences.length - visibleItems.length

  const stats = useMemo(() => {
    const workCount = experiences.filter((item) => item.type === "work").length
    const educationCount = experiences.filter((item) => item.type === "education").length

    return [
      { label: "Roles", value: `${workCount}+`, icon: BriefcaseBusiness },
      { label: "Education", value: `${educationCount}`, icon: GraduationCap },
      { label: "Current", value: "2025", icon: Calendar },
    ]
  }, [experiences])

  return (
    <section id="experience" ref={containerRef} className="relative overflow-hidden bg-background py-16 md:py-24">
      <div className="absolute inset-0 section-gradient-blend bg-[radial-gradient(900px_circle_at_16%_20%,hsl(var(--primary)/0.07),transparent_62%),radial-gradient(760px_circle_at_92%_76%,hsl(var(--accent)/0.06),transparent_62%)]" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <SectionHeader
              eyebrow="Career Path"
              title="Experience &"
              highlight="Education"
              align="responsive"
            />

            <div className="mt-7 grid grid-cols-3 overflow-hidden rounded-lg border border-border/70 bg-card/70 shadow-sm backdrop-blur">
              {stats.map((stat, index) => {
                const Icon = stat.icon

                return (
                  <div key={stat.label} className={cn("p-3 text-center md:p-4", index > 0 && "border-l border-border/70")}>
                    <Icon className="mx-auto mb-2 h-4 w-4 text-primary" />
                    <div className="font-display text-2xl font-bold leading-none text-foreground">{stat.value}</div>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-lg border border-border/70 bg-card/65 p-3 shadow-sm backdrop-blur"
          >
            <div className="mb-3 flex items-center justify-between gap-3 px-2 py-1">
              <p className="text-sm font-semibold text-foreground">Timeline</p>
              <p className="text-xs font-medium text-muted-foreground">{filteredExperiences.length} milestones</p>
            </div>

            <TimelineToggle
              value={filter}
              onChange={(nextFilter) => {
                setFilter(nextFilter)
                setShowAll(false)
              }}
            />

            <AnimatePresence mode="popLayout">
              <motion.div layout className="mt-4 space-y-3">
                {visibleItems.map((item, index) => (
                  <CareerItem key={item.id} item={item} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>

            {hiddenCount > 0 || showAll ? (
              <motion.div layout className="mt-5 flex justify-center border-t border-border/70 pt-4">
                <AnimatedButton onClick={() => setShowAll((current) => !current)} variant="outline" className="h-10">
                  {showAll ? "Show Less" : `Show ${hiddenCount} More`}
                  {showAll ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                </AnimatedButton>
              </motion.div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function TimelineToggle({ value, onChange }: { value: TimelineFilter; onChange: (value: TimelineFilter) => void }) {
  const options: Array<{ label: string; value: TimelineFilter }> = [
    { label: "Experience", value: "work" },
    { label: "Education", value: "education" },
    { label: "All", value: "all" },
  ]

  return (
    <div className="grid grid-cols-3 gap-1 rounded-md border border-border/70 bg-background/70 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-md px-3.5 py-2.5 text-sm font-medium transition",
            value === option.value ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function CareerItem({ item, index }: { item: ExperienceItem; index: number }) {
  const isWork = item.type === "work"
  const TypeIcon = isWork ? BriefcaseBusiness : GraduationCap
  const OrgIcon = isWork ? Building2 : Landmark
  const isCurrent = item.duration.includes("Present") || item.duration.includes("Pursuing")

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.36, delay: Math.min(index * 0.04, 0.18) }}
      className="group relative rounded-lg border border-border/70 bg-background/70 p-4 transition hover:border-primary/30 hover:bg-background md:p-5"
    >
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
          <TypeIcon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
                isWork ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
              )}
            >
              {isWork ? "Work" : "Education"}
            </span>
            {isCurrent && (
              <span className="rounded-md bg-green-500/10 px-2 py-1 text-[11px] font-semibold text-green-600 dark:text-green-400">
                Current
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold leading-snug text-foreground transition group-hover:text-primary md:text-xl">
            {item.title}
          </h3>

          <div className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex min-w-0 items-start gap-2">
              <OrgIcon className="mt-1 h-4 w-4 shrink-0 text-primary/70" />
              <span className="min-w-0">{item.company}</span>
            </div>
            <div className="flex items-center gap-2 font-medium text-foreground/75">
              <Calendar className="h-4 w-4 shrink-0 text-primary/70" />
              <span>{item.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
