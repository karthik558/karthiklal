"use client"

import { useRef, useState } from "react"
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
import experiencesData from "@/public/data/experiences.json"
import { cn } from "@/lib/utils"

type ExperienceType = "work" | "education"

type ExperienceItem = {
  id: number
  title: string
  company: string
  duration: string
  type: ExperienceType
}

const INITIAL_ITEMS = 6

export default function ExperienceSection() {
  const [showAll, setShowAll] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.12 })

  const experiences = experiencesData.experiences as ExperienceItem[]
  const workCount = experiences.filter((item) => item.type === "work").length
  const educationCount = experiences.filter((item) => item.type === "education").length
  const visibleItems = showAll ? experiences : experiences.slice(0, INITIAL_ITEMS)
  const hiddenCount = experiences.length - visibleItems.length

  return (
    <section id="experience" ref={containerRef} className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="absolute inset-0 section-gradient-blend bg-[radial-gradient(1200px_circle_at_15%_20%,hsl(var(--primary)/0.08),transparent_65%),radial-gradient(1000px_circle_at_85%_78%,hsl(var(--accent)/0.08),transparent_65%)]" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-16 md:mb-20"
        >
          <SectionHeader eyebrow="Career Path" title="Experience &" highlight="Education" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <CareerSummary
            icon={<BriefcaseBusiness className="h-5 w-5" />}
            value={`${workCount}+`}
            label="Professional Roles"
          />
          <CareerSummary
            icon={<GraduationCap className="h-5 w-5" />}
            value={`${educationCount}`}
            label="Education Milestones"
          />
          <CareerSummary
            icon={<Calendar className="h-5 w-5" />}
            value="2025"
            label="Current Growth"
          />
        </motion.div>

        <div className="relative">
          <div className="absolute bottom-10 left-6 top-4 w-px bg-border/70 md:left-1/2 md:-translate-x-1/2" />
          <div className="absolute left-6 top-4 h-40 w-px bg-gradient-to-b from-primary via-accent to-transparent md:left-1/2 md:-translate-x-1/2" />

          <AnimatePresence mode="popLayout">
            <motion.div layout className="space-y-8 md:space-y-10">
              {visibleItems.map((item, index) => (
                <CareerTimelineItem key={item.id} item={item} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {hiddenCount > 0 || showAll ? (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 flex justify-center"
          >
            <AnimatedButton onClick={() => setShowAll((current) => !current)} variant="outline">
              {showAll ? "Show Less Timeline" : `Show ${hiddenCount} More Milestones`}
              {showAll ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </AnimatedButton>
          </motion.div>
        ) : null}
      </div>
    </section>
  )
}

function CareerSummary({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card/40 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(var(--primary-rgb),0.12)]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner">
          {icon}
        </div>
        <div>
          <div className="font-display text-3xl font-bold leading-none text-foreground">{value}</div>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  )
}

function CareerTimelineItem({ item, index }: { item: ExperienceItem; index: number }) {
  const isWork = item.type === "work"
  const isRight = index % 2 === 1
  const TypeIcon = isWork ? BriefcaseBusiness : GraduationCap
  const OrgIcon = isWork ? Building2 : Landmark

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.96 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3), type: "spring", bounce: 0.25 }}
      className={cn(
        "relative grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-4 md:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] md:gap-0",
        isRight ? "md:[&_.career-card]:col-start-3" : "md:[&_.career-card]:col-start-1"
      )}
    >
      <div className="relative z-20 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-background text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.25)] md:col-start-2 md:mx-auto">
        <TypeIcon className="h-5 w-5" />
      </div>

      <div className="career-card min-w-0 md:row-start-1">
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card/40 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(var(--primary-rgb),0.15)] md:p-8">
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/30 via-transparent to-accent/30 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
          <div className="absolute -right-12 -bottom-12 opacity-[0.03] transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 group-hover:opacity-[0.08] pointer-events-none">
            <TypeIcon className="h-48 w-48 text-primary" />
          </div>

          <div className="relative z-10">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]",
                  isWork
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-accent/25 bg-accent/10 text-accent"
                )}
              >
                <TypeIcon className="h-3.5 w-3.5" />
                {isWork ? "Experience" : "Education"}
              </span>
              {(item.duration.includes("Present") || item.duration.includes("Pursuing")) && (
                <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                  Current
                </span>
              )}
            </div>

            <h3 className="mb-4 text-xl font-display font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary md:text-2xl">
              {item.title}
            </h3>

            <div className="space-y-3 text-sm font-medium leading-relaxed text-muted-foreground md:text-base">
              <div className="flex items-start gap-2">
                <OrgIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                <span>{item.company}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/80">
                <Calendar className="h-4 w-4 shrink-0 text-primary/70" />
                <span>{item.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
