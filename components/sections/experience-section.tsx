"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Briefcase, GraduationCap, ChevronDown, ChevronUp } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import experiencesData from "@/public/data/experiences.json"

type ExperienceType = "work" | "education"
type TimelineFilter = "work" | "education" | "all"
type ExperienceItem = { id: number; title: string; company: string; duration: string; type: ExperienceType }

const INITIAL_ITEMS = 3
const experiences = experiencesData.experiences as ExperienceItem[]

export default function ExperienceSection() {
  const [filter, setFilter] = useState<TimelineFilter>("all")
  const [showAll, setShowAll] = useState(false)

  const filtered = useMemo(
    () => (filter === "all" ? experiences : experiences.filter((item) => item.type === filter)),
    [filter]
  )

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_ITEMS)
  const hiddenCount = filtered.length - visible.length

  return (
    <section id="experience" className="relative bg-background py-20 md:py-36 border-t border-border">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Section Header */}
        <div className="mb-14 border-b border-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              06 // CAREER TIMELINE
            </div>
            <h2 className="font-display text-4xl font-black uppercase tracking-tight text-foreground sm:text-6xl md:text-7xl">
              EXPERIENCE & ROLES
            </h2>
          </div>

          {/* Timeline Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "ALL TRACKS", value: "all" },
              { label: "PROFESSIONAL", value: "work" },
              { label: "EDUCATION", value: "education" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setFilter(option.value as TimelineFilter)
                  setShowAll(false)
                }}
                className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-all duration-200 ${
                  filter === option.value
                    ? "border-foreground bg-foreground text-background font-bold"
                    : "border-border bg-card text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Grid Rows */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {visible.map((item, index) => {
              const isWork = item.type === "work"
              const isCurrent = item.duration.includes("Present") || item.duration.includes("Pursuing")
              const numStr = String(index + 1).padStart(2, "0")

              return (
                <motion.article
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="group relative border-2 border-border bg-card p-6 md:p-8 transition-all duration-300 hover:border-foreground hover:shadow-xl overflow-hidden"
                >
                  {/* Background Giant Stroke Number Watermark */}
                  <div className="absolute right-2 -bottom-2 pointer-events-none select-none overflow-hidden opacity-[0.06] dark:opacity-[0.1] z-0 transition-opacity duration-300 group-hover:opacity-20">
                    <span
                      className="font-display text-7xl sm:text-8xl font-black uppercase tracking-tighter text-transparent leading-none block"
                      style={{
                        WebkitTextStroke: "2.5px hsl(var(--foreground))",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {numStr}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
                    
                    {/* Left: Duration & Num */}
                    <div className="md:col-span-3 flex md:flex-col justify-between md:justify-center border-b md:border-b-0 md:border-r border-border pb-4 md:pb-0 md:pr-6">
                      <div className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        [{numStr}] // {isWork ? "WORK" : "EDU"}
                      </div>
                      <div className="font-mono text-sm font-bold text-foreground mt-1">
                        {item.duration}
                      </div>
                    </div>

                    {/* Middle: Title & Company */}
                    <div className="md:col-span-8">
                      <div className="flex flex-wrap items-center gap-3 mb-1 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <span className="text-foreground font-semibold">{item.company}</span>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 text-[10px] border border-emerald-500/80 text-emerald-500 px-2 py-0.5 font-bold">
                            <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse inline-block" />
                            CURRENT
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-foreground group-hover:underline underline-offset-4">
                        {item.title}
                      </h3>
                    </div>

                    {/* Right: Icon Badge */}
                    <div className="md:col-span-1 hidden md:flex justify-end">
                      <div className="p-3 border border-border bg-background text-foreground group-hover:border-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        {isWork ? <Briefcase className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Load More Button */}
        {(hiddenCount > 0 || showAll) && (
          <div className="mt-12 text-center">
            <AnimatedButton
              onClick={() => setShowAll((curr) => !curr)}
              variant="outline"
              className="h-12 px-8 font-mono text-xs uppercase tracking-wider border-border hover:border-foreground"
            >
              {showAll ? "SHOW FEWER ROLES" : `LOAD ${hiddenCount} MORE ROLES`}
              {showAll ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </AnimatedButton>
          </div>
        )}
      </div>
    </section>
  )
}
