"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Briefcase, CalendarRange, GraduationCap } from "lucide-react"
import experiencesData from "@/public/data/experiences.json"

type Track = "all" | "work" | "education"
type TimelineItem = {
  id: string
  title: string
  organization: string
  duration: string
  type: Exclude<Track, "all">
  startYear: number
  endYear: number
  current?: boolean
}

const years = Array.from({ length: 10 }, (_, index) => 2018 + index)

const timeline: TimelineItem[] = experiencesData.experiences.map((item) => {
  const yearMatches = item.duration.match(/\b20\d{2}\b/g)?.map(Number) ?? [2019]
  return {
    id: `experience-${item.id}`,
    title: item.title,
    organization: item.company,
    duration: item.duration,
    type: item.type === "education" ? "education" : "work",
    startYear: yearMatches[0],
    endYear: item.duration.includes("Present") ? 2027 : yearMatches.at(-1) ?? yearMatches[0],
    current: item.duration.includes("Present") || item.duration.includes("Pursuing"),
  }
})

const trackOptions: { value: Track; label: string }[] = [
  { value: "all", label: "All roles" },
  { value: "work", label: "Professional" },
  { value: "education", label: "Education" },
]

export default function ExperienceSection() {
  const [track, setTrack] = useState<Track>("all")
  const [selectedYear, setSelectedYear] = useState<number | null>(2026)

  const filtered = useMemo(
    () =>
      timeline
        .filter((item) => (track === "all" ? true : item.type === track))
        .sort((a, b) => {
          const order = { work: 0, education: 1 }
          return order[a.type] - order[b.type] || b.startYear - a.startYear
        }),
    [track]
  )

  const visible = useMemo(
    () =>
      selectedYear === null
        ? filtered
        : filtered.filter((item) => selectedYear >= item.startYear && selectedYear <= item.endYear),
    [filtered, selectedYear]
  )

  const activeYears = useMemo(
    () =>
      new Set(
        filtered.flatMap((item) =>
          years.filter((year) => year >= item.startYear && year <= item.endYear)
        )
      ),
    [filtered]
  )

  const selectYear = (year: number) => {
    setSelectedYear((current) => (current === year ? null : year))
  }

  return (
    <section id="experience" className="section-shell overflow-hidden border-t-2 border-border">
      <div className="section-container">
        <div className="section-heading-row">
          <div>
            <div className="mb-3">
              <span className="paper-stamp">
                06 // CAREER REGISTRY
              </span>
            </div>
            <h2 className="section-title">EXPERIENCE &amp; ROLES</h2>
          </div>
        </div>

        {/* Paper Controls Sheet */}
        <div className="paper-sheet border-2 border-foreground bg-card p-5 sm:p-7 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-2 border-border">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-1 hidden sm:inline">
                TRACK:
              </span>
              {trackOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTrack(option.value)}
                  aria-pressed={track === option.value}
                  className={`paper-button font-mono text-xs uppercase tracking-wider px-4 py-2 border-2 transition-all duration-150 cursor-pointer ${
                    track === option.value
                      ? "border-foreground bg-foreground text-background font-bold"
                      : "border-border bg-background text-foreground hover:border-foreground"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Selected Year Display */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                FILTER:
              </span>
              <span className="font-display text-2xl sm:text-3xl font-black uppercase text-foreground">
                {selectedYear ?? "ALL YEARS"}
              </span>
            </div>
          </div>

          {/* Timeline Years Ruler */}
          <div className="pt-6">
            <div className="flex items-center justify-between text-muted-foreground font-mono text-[10px] uppercase tracking-wider mb-3">
              <span>SELECT YEAR (SELECT ACTIVE AGAIN TO RESET)</span>
              <span>2018 — 2027</span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {years.map((year) => {
                const selected = selectedYear === year
                const available = activeYears.has(year)

                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => selectYear(year)}
                    aria-pressed={selected}
                    aria-label={`${year}${selected ? ", selected; activate to show all years" : ""}`}
                    className={`paper-button font-mono text-xs font-bold py-2.5 border-2 transition-all duration-150 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      selected
                        ? "border-foreground bg-foreground text-background font-black shadow-sm"
                        : available
                          ? "border-border bg-background text-foreground hover:border-foreground"
                          : "border-border/40 bg-muted/30 text-muted-foreground/30 hover:border-border"
                    }`}
                  >
                    <span>{year}</span>
                    <span
                      className={`h-1 w-1 rounded-full ${
                        selected
                          ? "bg-background"
                          : available
                            ? "bg-foreground"
                            : "bg-transparent"
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Roles List */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {visible.length > 0 ? (
              <motion.div
                key={`${track}-${selectedYear ?? "all"}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {visible.map((item, index) => {
                  const Icon = item.type === "work" ? Briefcase : GraduationCap
                  const numStr = String(index + 1).padStart(2, "0")

                  return (
                    <article
                      key={item.id}
                      className="paper-sheet paper-folded-corner border-2 border-foreground bg-card p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:shadow-md group"
                    >
                      <div>
                        {/* Card Top Metadata Bar */}
                        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="paper-tag font-bold">
                              {numStr}{" // "}{item.type}
                            </span>
                            {item.current && (
                              <span className="border border-foreground bg-foreground text-background font-mono text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
                                CURRENT
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {item.duration}
                          </span>
                        </div>

                        {/* Title & Organization */}
                        <div className="flex items-start gap-3.5">
                          <div className="grid h-10 w-10 shrink-0 place-items-center border-2 border-foreground bg-background text-foreground group-hover:bg-foreground group-hover:text-background transition-colors mt-0.5">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-foreground leading-snug group-hover:underline underline-offset-4 transition-all">
                              {item.title}
                            </h3>
                            <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">
                              {item.organization}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="paper-sheet border-2 border-dashed border-border bg-card p-12 text-center"
              >
                <CalendarRange className="mx-auto h-8 w-8 text-muted-foreground" />
                <h3 className="mt-4 font-display text-2xl font-black uppercase text-foreground">
                  NO ROLES RECORDED IN {selectedYear}
                </h3>
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  Select another year from the ruler or choose all roles.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
