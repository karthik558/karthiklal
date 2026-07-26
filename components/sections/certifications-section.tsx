"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Award,
  CalendarRange,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  ShieldCheck,
} from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { CERTIFICATIONS_DATA } from "@/lib/static-data"

interface Certification {
  id: number
  title: string
  issuer: string
  date: string
  expiryDate: string
  credentialId: string
  status: string
  link?: string
}

type CredentialFilter = "all" | "active" | "expired"

const INITIAL_ITEMS = 3
const certifications = CERTIFICATIONS_DATA.certifications as Certification[]
const years = Array.from({ length: 8 }, (_, index) => 2019 + index)

const getIssueYear = (date: string) => Number(date.match(/\b20\d{2}\b/)?.[0] ?? 2019)
const getIssueTime = (date: string) => {
  const [month, year] = date.split(" ")
  const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(month)
  return new Date(Number(year), Math.max(monthIndex, 0)).getTime()
}

const filterOptions: { label: string; value: CredentialFilter }[] = [
  { label: "All credentials", value: "all" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "expired" },
]

export default function CertificationsSection() {
  const [filter, setFilter] = useState<CredentialFilter>("all")
  const [selectedYear, setSelectedYear] = useState<number | null>(2026)
  const [showAll, setShowAll] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const filtered = useMemo(
    () =>
      certifications
        .filter((item) => (filter === "all" ? true : item.status === filter))
        .sort((a, b) => getIssueTime(b.date) - getIssueTime(a.date) || a.id - b.id),
    [filter]
  )

  const activeYears = useMemo(
    () => new Set(filtered.map((item) => getIssueYear(item.date))),
    [filtered]
  )

  const selectedCredentials = useMemo(
    () =>
      (selectedYear === null
        ? filtered
        : filtered.filter((item) => getIssueYear(item.date) === selectedYear)
      ).sort((a, b) => getIssueTime(b.date) - getIssueTime(a.date) || a.id - b.id),
    [filtered, selectedYear]
  )

  const visible =
    selectedYear === null || showAll
      ? selectedCredentials
      : selectedCredentials.slice(0, INITIAL_ITEMS)
  const hiddenCount = selectedCredentials.length - visible.length

  const selectFilter = (nextFilter: CredentialFilter) => {
    setFilter(nextFilter)
    setShowAll(false)

    if (nextFilter === "expired") {
      setSelectedYear(2021)
      return
    }
    setSelectedYear(2026)
  }

  const selectYear = (year: number) => {
    setSelectedYear((current) => (current === year ? null : year))
    setShowAll(false)
  }

  const handleCopy = async (id: number, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    window.setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <section id="certifications" className="section-shell overflow-hidden border-t border-border">
      <div className="section-container">
        <div className="section-heading-row">
          <div>
            <div className="section-kicker">07 // CREDENTIAL TIMELINE</div>
            <h2 className="section-title">CERTIFICATIONS</h2>
          </div>
          <p className="max-w-md text-sm font-light leading-relaxed text-muted-foreground">
            Explore verified credentials by issue year, status, and awarding organization.
          </p>
        </div>

        <div className="mb-7 flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => selectFilter(option.value)}
              aria-pressed={filter === option.value}
              className={`border px-4 py-2 font-mono text-[10px] font-black uppercase tracking-widest transition-colors ${
                filter === option.value
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
                  SELECT ISSUE YEAR
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
              <div className="relative grid grid-cols-4 gap-y-5 sm:grid-cols-8">
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
                Credential snapshot
              </div>
              <div className="mt-3 font-display text-6xl font-black">
                {String(selectedCredentials.length).padStart(2, "0")}
              </div>
              <p className="mt-3 text-sm font-light leading-relaxed text-background/70">
                {selectedYear === null
                  ? `${selectedCredentials.length === 1 ? "credential" : "credentials"} across all issue years.`
                  : `${selectedCredentials.length === 1 ? "credential" : "credentials"} issued in ${selectedYear}.`}
              </p>
              <div className="mt-10 border-t border-background/25 pt-5 font-mono text-[9px] uppercase tracking-widest text-background/65">
                Status / {filter === "all" ? "complete record" : filter}
              </div>
              <div className="mt-3 font-mono text-[9px] uppercase tracking-widest text-background/45">
                Date scope / {selectedYear ?? "all years"}
              </div>
            </div>

            <div className="p-4 sm:p-7">
              <AnimatePresence mode="wait">
                {visible.length > 0 ? (
                  <motion.div
                    key={`${filter}-${selectedYear}-${showAll}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="grid border-l border-t border-border"
                  >
                    {visible.map((item, index) => {
                      const isActive = item.status === "active"
                      const canCopy = item.credentialId && item.credentialId !== "Not Available"

                      return (
                        <article
                          key={item.id}
                          className="group grid gap-4 border-b border-r border-border bg-background p-5 sm:grid-cols-[52px_minmax(0,1fr)] sm:p-6 xl:grid-cols-[52px_minmax(0,1fr)_170px]"
                        >
                          <span className="grid h-11 w-11 place-items-center border border-border bg-card transition-colors group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                            <Award className="h-4 w-4" />
                          </span>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                              <span>{String(index + 1).padStart(2, "0")} / {item.issuer}</span>
                              <span
                                className={`border px-2 py-0.5 ${
                                  isActive ? "border-emerald-500 text-emerald-500" : "border-border"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <h3 className="mt-2 font-display text-xl font-black leading-tight sm:text-2xl">
                              {item.title}
                            </h3>
                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                              <span>Issued / <strong className="text-foreground">{item.date}</strong></span>
                              <span>Expiry / <strong className="text-foreground">{item.expiryDate}</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-3 border-t border-border pt-4 sm:col-start-2 xl:col-start-auto xl:flex-col xl:items-end xl:justify-center xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
                            {canCopy ? (
                              <button
                                type="button"
                                onClick={() => handleCopy(item.id, item.credentialId)}
                                className="inline-flex items-center gap-1.5 font-mono text-[9px] font-black uppercase text-muted-foreground hover:text-foreground"
                              >
                                {copiedId === item.id ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                                {copiedId === item.id ? "Copied ID" : "Copy ID"}
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 font-mono text-[9px] font-black uppercase text-muted-foreground">
                                <ShieldCheck className="h-3.5 w-3.5" /> Verified member
                              </span>
                            )}

                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-9 items-center gap-1.5 border border-border bg-card px-3 font-mono text-[9px] font-black uppercase hover:border-foreground hover:bg-foreground hover:text-background"
                              >
                                Verify <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
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
                      <Award className="mx-auto h-7 w-7 text-muted-foreground" />
                      <h3 className="mt-4 font-display text-2xl font-black uppercase">No credential in this year</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Choose a marked year or change the status filter.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {selectedYear !== null && (hiddenCount > 0 || showAll) && (
                <div className="mt-7 text-center">
                  <AnimatedButton
                    onClick={() => setShowAll((current) => !current)}
                    variant="outline"
                    className="h-12 border-border px-8 font-mono text-xs uppercase tracking-wider hover:border-foreground"
                  >
                    {showAll ? "Show fewer credentials" : `Load ${hiddenCount} more credentials`}
                    {showAll ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                  </AnimatedButton>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col justify-between gap-2 font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground sm:flex-row">
          <span>Timeline reflects issue dates recorded in the credential archive.</span>
          <span>Select the active year again to reveal every matching credential.</span>
        </div>
      </div>
    </section>
  )
}
