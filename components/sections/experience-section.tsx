"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Briefcase, CalendarRange, ChevronDown, ChevronUp, GraduationCap } from "lucide-react"
import RegistryFilters from "@/components/ui/registry-filters"
import experiencesData from "@/public/data/experiences.json"
import { playClickSound } from "@/lib/sound-fx"

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

const INITIAL_ITEMS = 2

export default function ExperienceSection() {
  const reduced = useReducedMotion()
  const [track, setTrack] = useState<Track>("all")
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)

  const filtered = useMemo(
    () =>
      timeline
        .filter((item) => (track === "all" ? true : item.type === track))
        .sort((a, b) => {
          // 1. Current pursuits first
          if (a.current !== b.current) return a.current ? -1 : 1
          // 2. If both are current, put work first then education (latest work & latest education)
          if (a.current && b.current) {
            const typeOrder = { work: 0, education: 1 }
            return typeOrder[a.type] - typeOrder[b.type]
          }
          // 3. For past roles, sort by startYear descending, then endYear descending
          if (b.startYear !== a.startYear) return b.startYear - a.startYear
          return b.endYear - a.endYear
        }),
    [track]
  )

  const selectedRoles = useMemo(
    () =>
      selectedYear === null
        ? filtered
        : filtered.filter((item) => selectedYear >= item.startYear && selectedYear <= item.endYear),
    [filtered, selectedYear]
  )

  const visible =
    selectedYear !== null || showAll
      ? selectedRoles
      : selectedRoles.slice(0, INITIAL_ITEMS)
  const hiddenCount = selectedRoles.length - visible.length

  const selectTrack = (nextTrack: Track) => {
    playClickSound()
    setTrack(nextTrack)
    setShowAll(false)
  }

  const selectYear = (year: number | null) => {
    playClickSound()
    setSelectedYear((current) => (current === year ? null : year))
    setShowAll(false)
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

        <p className="registry-intro">A career built on curiosity. From hands-on infrastructure to leading secure digital operations.</p>
        <RegistryFilters label="Career track" options={trackOptions} value={track} onChange={selectTrack} years={years} selectedYear={selectedYear} onYearChange={selectYear} count={selectedRoles.length} />

        {/* Roles List */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {visible.length > 0 ? (
              <motion.div
                key={`${track}-${selectedYear ?? "all"}`}
                initial={{ opacity: 0, y: reduced ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -6 }}
                className="registry-list"
              >
                {visible.map((item, index) => {
                  const Icon = item.type === "work" ? Briefcase : GraduationCap

                  return (
                    <article key={item.id} className="registry-entry" data-current={item.current || undefined}>
                      <div className="registry-entry-meta">
                        <span className="registry-node"><Icon className="h-4 w-4" /></span>
                        <span>{item.duration}</span>
                        {item.current && <span className="registry-status">CURRENT</span>}
                      </div>
                      <div className="registry-entry-detail">
                        <p className="registry-kicker">{item.type === "work" ? "PROFESSIONAL EXPERIENCE" : "EDUCATION"}</p>
                        <h3>{item.title}</h3>
                        <p>{item.organization}</p>
                      </div>
                      <span className="registry-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
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
                  Select another year or choose all roles.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Load More Button */}
        {(hiddenCount > 0 || showAll) && selectedRoles.length > INITIAL_ITEMS && selectedYear === null && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                playClickSound()
                setShowAll((current) => !current)
              }}
              className="paper-button inline-flex items-center gap-2 h-11 border-2 border-border/80 bg-card px-8 font-mono text-xs uppercase tracking-wider text-foreground hover:border-foreground hover:bg-foreground hover:text-background shadow-xs cursor-pointer transition-colors"
            >
              {showAll ? "SHOW FEWER" : `LOAD MORE (${hiddenCount} MORE)`}
              {showAll ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
