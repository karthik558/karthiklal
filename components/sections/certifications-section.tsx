"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Award,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Eye,
  ShieldCheck,
  X,
} from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { CERTIFICATIONS_DATA } from "@/lib/static-data"
import { playClickSound, playModalOpenSound, playSuccessSound } from "@/lib/sound-fx"

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
  const [inspectedCredential, setInspectedCredential] = useState<Certification | null>(null)

  useEffect(() => {
    if (!inspectedCredential) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInspectedCredential(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [inspectedCredential])

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
    playClickSound()
    setFilter(nextFilter)
    setShowAll(false)

    if (nextFilter === "expired") {
      setSelectedYear(2021)
      return
    }
    setSelectedYear(2026)
  }

  const selectYear = (year: number) => {
    playClickSound()
    setSelectedYear((current) => (current === year ? null : year))
    setShowAll(false)
  }

  const handleCopy = async (id: number, text: string) => {
    await navigator.clipboard.writeText(text)
    playSuccessSound()
    setCopiedId(id)
    window.setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <section id="certifications" className="section-shell overflow-hidden border-t-2 border-border">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-heading-row">
          <div>
            <div className="mb-3">
              <span className="paper-stamp">
                07 // CREDENTIAL REGISTRY
              </span>
            </div>
            <h2 className="section-title">CERTIFICATIONS</h2>
          </div>
          <p className="max-w-md text-sm font-light leading-relaxed text-muted-foreground">
            Explore verified credentials by issue year, status, and awarding organization.
          </p>
        </div>

        {/* Paper Controls Sheet */}
        <div className="paper-sheet border-2 border-foreground bg-card p-5 sm:p-7 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-2 border-border">
            {/* Status Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-1 hidden sm:inline">
                STATUS:
              </span>
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectFilter(option.value)}
                  aria-pressed={filter === option.value}
                  className={`paper-button font-mono text-xs uppercase tracking-wider px-4 py-2 border-2 transition-all duration-150 cursor-pointer ${
                    filter === option.value
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
              <span>SELECT ISSUE YEAR (SELECT ACTIVE AGAIN TO RESET)</span>
              <span>2019 — 2026</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
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
                    className={`paper-button font-mono text-xs py-2 px-1 text-center border-2 transition-all duration-150 cursor-pointer ${
                      selected
                        ? "border-foreground bg-foreground text-background font-bold shadow-xs"
                        : available
                          ? "border-foreground/60 bg-background text-foreground hover:border-foreground"
                          : "border-border/60 bg-muted/30 text-muted-foreground/40 hover:border-border"
                    }`}
                  >
                    {year}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Credentials Grid */}
        <AnimatePresence mode="wait">
          {visible.length > 0 ? (
            <motion.div
              key={`${filter}-${selectedYear}-${showAll}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {visible.map((item) => {
                const isActive = item.status === "active"
                const canCopy = Boolean(item.credentialId && item.credentialId !== "Not Available")

                return (
                  <article
                    key={item.id}
                    className="paper-sheet paper-folded-corner group relative flex flex-col justify-between border-2 border-border bg-card p-6 hover:border-foreground transition-all duration-200"
                  >
                    <div>
                      {/* Top Header: Issuer Tag & Status Badge */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="paper-tag font-bold text-[10px] truncate max-w-[180px]">
                          {item.issuer}
                        </span>
                        <span
                          className={`border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                            isActive
                              ? "border-foreground bg-foreground text-background"
                              : "border-border bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-lg sm:text-xl font-black leading-snug text-foreground group-hover:underline">
                        {item.title}
                      </h3>

                      {/* Dates */}
                      <div className="mt-5 pt-4 border-t border-dashed border-border/80 flex flex-col gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        <div className="flex justify-between items-center">
                          <span>ISSUED:</span>
                          <span className="font-bold text-foreground">{item.date}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>EXPIRY:</span>
                          <span className="font-bold text-foreground">{item.expiryDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions Footer */}
                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-2">
                      {canCopy ? (
                        <button
                          type="button"
                          onClick={() => handleCopy(item.id, item.credentialId)}
                          className="paper-button inline-flex items-center gap-1.5 border border-border bg-background px-2.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-foreground transition-colors cursor-pointer"
                        >
                          {copiedId === item.id ? (
                            <Check className="h-3.5 w-3.5 text-foreground" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          {copiedId === item.id ? "COPIED" : "COPY ID"}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 border border-border/60 bg-muted/30 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                          <ShieldCheck className="h-3.5 w-3.5" /> VERIFIED
                        </span>
                      )}

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            playModalOpenSound()
                            setInspectedCredential(item)
                          }}
                          className="paper-button inline-flex items-center gap-1 border-2 border-foreground bg-foreground px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-background hover:bg-background hover:text-foreground transition-colors cursor-pointer"
                        >
                          INSPECT <Eye className="h-3.5 w-3.5" />
                        </button>

                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="paper-button inline-flex items-center border-2 border-border bg-card p-1.5 font-mono text-[9px] font-bold uppercase hover:border-foreground hover:bg-background transition-colors"
                            aria-label={`Verify ${item.title}`}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
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
              className="grid min-h-[260px] place-items-center border-2 border-dashed border-border bg-card/60 p-8 text-center"
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

        {/* Load More Button */}
        {selectedYear !== null && (hiddenCount > 0 || showAll) && (
          <div className="mt-8 text-center">
            <AnimatedButton
              onClick={() => {
                playClickSound()
                setShowAll((current) => !current)
              }}
              variant="outline"
              className="paper-button h-11 border-2 border-foreground bg-card px-8 font-mono text-xs uppercase tracking-wider text-foreground hover:bg-foreground hover:text-background shadow-xs cursor-pointer"
            >
              {showAll ? "Show fewer credentials" : `Load ${hiddenCount} more credentials`}
              {showAll ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </AnimatedButton>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 flex flex-col justify-between gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:flex-row border-t border-border/60 pt-4">
          <span>Timeline reflects issue dates recorded in the credential archive.</span>
          <span>Select any credential to open official verification &amp; registry inspection.</span>
        </div>
      </div>

      {/* Credential Verification Modal */}
      <AnimatePresence>
        {inspectedCredential && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              className="paper-sheet paper-folded-corner relative w-full max-w-lg overflow-hidden border-2 border-foreground bg-card p-6 shadow-2xl sm:p-8"
              role="dialog"
              aria-modal="true"
            >
              <button
                type="button"
                onClick={() => {
                  playClickSound()
                  setInspectedCredential(null)
                }}
                className="paper-button absolute right-4 top-4 border-2 border-foreground bg-foreground p-1.5 text-background transition-transform hover:scale-105 cursor-pointer"
                aria-label="Close credential details"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="paper-stamp text-[10px]">VERIFIED CREDENTIAL // REGISTRY</span>
              </div>

              <h3 className="mt-4 font-display text-2xl font-black uppercase text-foreground sm:text-3xl leading-snug">
                {inspectedCredential.title}
              </h3>

              <div className="mt-3 font-mono text-xs font-bold text-muted-foreground flex items-center gap-2">
                <span>ISSUING BODY:</span>
                <span className="paper-tag font-bold text-foreground">{inspectedCredential.issuer}</span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-px border-2 border-border bg-border py-px font-mono text-xs">
                <div className="bg-background p-3">
                  <span className="block text-[9px] uppercase tracking-wider text-muted-foreground">ISSUE DATE</span>
                  <span className="font-bold text-foreground mt-0.5 block">{inspectedCredential.date}</span>
                </div>
                <div className="bg-background p-3">
                  <span className="block text-[9px] uppercase tracking-wider text-muted-foreground">EXPIRATION</span>
                  <span className="font-bold text-foreground mt-0.5 block">{inspectedCredential.expiryDate}</span>
                </div>
                <div className="bg-background p-3">
                  <span className="block text-[9px] uppercase tracking-wider text-muted-foreground">STATUS</span>
                  <span className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase mt-1 ${
                    inspectedCredential.status === "active"
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground"
                  }`}>
                    {inspectedCredential.status}
                  </span>
                </div>
                <div className="bg-background p-3">
                  <span className="block text-[9px] uppercase tracking-wider text-muted-foreground">REGISTRY ID</span>
                  <span className="font-mono text-xs font-bold text-foreground truncate block mt-0.5">
                    {inspectedCredential.credentialId}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                {inspectedCredential.credentialId && inspectedCredential.credentialId !== "Not Available" && (
                  <button
                    type="button"
                    onClick={() => handleCopy(inspectedCredential.id, inspectedCredential.credentialId)}
                    className="paper-button inline-flex h-10 items-center gap-2 border-2 border-border bg-background px-4 font-mono text-xs font-bold uppercase text-foreground hover:border-foreground cursor-pointer"
                  >
                    {copiedId === inspectedCredential.id ? <Check className="h-4 w-4 text-foreground" /> : <Copy className="h-4 w-4" />}
                    {copiedId === inspectedCredential.id ? "COPIED ID" : "COPY ID"}
                  </button>
                )}

                {inspectedCredential.link && (
                  <a
                    href={inspectedCredential.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="paper-button inline-flex h-10 items-center gap-2 border-2 border-foreground bg-foreground px-5 font-mono text-xs font-bold uppercase text-background transition-all hover:bg-background hover:text-foreground cursor-pointer"
                  >
                    VERIFY PORTAL <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
