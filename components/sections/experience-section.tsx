"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
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
    <section id="experience" className="section-shell overflow-hidden border-t border-border">
      <div className="section-container">
        <div className="section-heading-row">
          <div>
            <div className="section-kicker">06 // CAREER TIMELINE</div>
            <h2 className="section-title">EXPERIENCE & ROLES</h2>
          </div>
          <p className="max-w-md text-sm font-light leading-relaxed text-muted-foreground">
            Explore a verified chronology of professional roles and education from 2018 to the present.
          </p>
        </div>

        <div className="mb-7 flex flex-wrap gap-2">
          {trackOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTrack(option.value)}
              aria-pressed={track === option.value}
              className={`border px-4 py-2 font-mono text-[10px] font-black uppercase tracking-widest transition-colors ${
                track === option.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="border-2 border-foreground bg-card">
          <div className="border-b-2 border-foreground p-5 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  SELECT YEAR
                </div>
                <div className="mt-1 font-mono text-[8px] font-bold uppercase tracking-wider text-muted-foreground/65">
                  Select the active year again to show all dates
                </div>
              </div>
              <div className="font-display text-3xl font-black sm:text-4xl">
                {selectedYear ?? "ALL YEARS"}
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-4 right-4 top-4 h-px bg-border" aria-hidden="true" />
              <div className="relative grid grid-cols-5 gap-y-5 sm:grid-cols-10">
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
                      className="group flex flex-col items-center gap-2 font-mono text-[9px] font-bold"
                    >
                      <span
                        className={`z-10 grid h-8 w-8 place-items-center border-2 transition-colors ${
                          selected
                            ? "border-foreground bg-foreground text-background"
                            : available
                              ? "border-foreground bg-background group-hover:bg-foreground group-hover:text-background"
                              : "border-border bg-muted text-muted-foreground/40"
                        }`}
                      >
                        {available && <span className="h-1.5 w-1.5 bg-current" />}
                      </span>
                      <span
                        className={
                          selected
                            ? "text-foreground"
                            : available
                              ? "text-muted-foreground group-hover:text-foreground"
                              : "text-muted-foreground/45"
                        }
                      >
                        {year}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="grid min-h-[430px] lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="border-b-2 border-foreground bg-foreground p-6 text-background lg:border-b-0 lg:border-r-2 lg:p-8">
              <CalendarRange className="h-6 w-6" />
              <div className="mt-14 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-background/60">
                Timeline snapshot
              </div>
              <div className="mt-3 font-display text-6xl font-black">
                {String(visible.length).padStart(2, "0")}
              </div>
              <p className="mt-3 text-sm font-light leading-relaxed text-background/70">
                {selectedYear === null
                  ? `${visible.length === 1 ? "record" : "records"} across all years.`
                  : `${visible.length === 1 ? "milestone" : "milestones"} active in ${selectedYear}.`}
              </p>
              <div className="mt-10 border-t border-background/25 pt-5 font-mono text-[9px] uppercase tracking-widest text-background/65">
                Track / {track === "all" ? "complete record" : track}
              </div>
              <div className="mt-3 font-mono text-[9px] uppercase tracking-widest text-background/45">
                Date scope / {selectedYear ?? "all years"}
              </div>
            </div>

            <div className="p-4 sm:p-7">
              <AnimatePresence mode="wait">
                {visible.length > 0 ? (
                  <motion.div
                    key={`${track}-${selectedYear ?? "all"}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="grid border-l border-t border-border"
                  >
                    {visible.map((item, index) => {
                      const Icon = item.type === "work" ? Briefcase : GraduationCap

                      return (
                        <article
                          key={item.id}
                          className="group grid gap-4 border-b border-r border-border bg-background p-5 sm:grid-cols-[52px_minmax(0,1fr)] sm:p-6 xl:grid-cols-[52px_minmax(0,1fr)_170px]"
                        >
                          <span className="grid h-11 w-11 place-items-center border border-border bg-card transition-colors group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                            <Icon className="h-4 w-4" />
                          </span>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                              <span>{String(index + 1).padStart(2, "0")} / {item.type}</span>
                              {item.current && (
                                <span className="border border-emerald-500 px-2 py-0.5 text-emerald-500">
                                  Current
                                </span>
                              )}
                            </div>
                            <h3 className="mt-2 font-display text-xl font-black leading-tight sm:text-2xl">
                              {item.title}
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                              {item.organization}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-3 border-t border-border pt-4 sm:col-start-2 xl:col-start-auto xl:flex-col xl:items-end xl:justify-center xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
                            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground xl:text-right">
                              {item.duration}
                            </span>
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
                    className="grid min-h-[350px] place-items-center border border-dashed border-border p-8 text-center"
                  >
                    <div>
                      <CalendarRange className="mx-auto h-7 w-7 text-muted-foreground" />
                      <h3 className="mt-4 font-display text-2xl font-black uppercase">
                        No role in this year
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Choose a marked year or change the track filter.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col justify-between gap-2 font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground sm:flex-row">
          <span>Marked years contain at least one matching role or education record.</span>
          <Link href="/projects" className="text-foreground hover:underline">
            Explore project archive →
          </Link>
        </div>
      </div>
    </section>
  )
}
