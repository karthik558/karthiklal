"use client"

import SectionHeading from "@/components/sections/section-heading"
import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  ArrowUpRight,
  Award,
  Check,
  Copy,
  Eye,
  X,
} from "lucide-react"
import RegistryFilters from "@/components/ui/registry-filters"
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

const INITIAL_ITEMS = 2
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
  const reduced = useReducedMotion()
  const [filter, setFilter] = useState<CredentialFilter>("all")
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
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

  const selectedCredentials = useMemo(
    () =>
      (selectedYear === null
        ? filtered
        : filtered.filter((item) => getIssueYear(item.date) === selectedYear)
      ).sort((a, b) => getIssueTime(b.date) - getIssueTime(a.date) || a.id - b.id),
    [filtered, selectedYear]
  )

  const visible =
    showAll
      ? selectedCredentials
      : selectedCredentials.slice(0, INITIAL_ITEMS)
  const hiddenCount = selectedCredentials.length - visible.length

  const selectFilter = (nextFilter: CredentialFilter) => {
    playClickSound()
    setFilter(nextFilter)
    setShowAll(false)
    setSelectedYear(null)
  }

  const selectYear = (year: number | null) => {
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
    <section id="certifications" className="section-shell overflow-hidden border-t border-border">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-heading-row">
          <div>
            <SectionHeading title="Knowledge earned." accent="Practice backed." />
          </div>
        </div>

        <RegistryFilters label="Credential status" options={filterOptions} value={filter} onChange={selectFilter} years={years} selectedYear={selectedYear} onYearChange={selectYear} count={selectedCredentials.length} />

        {/* Credentials List */}
        <AnimatePresence mode="wait">
          {visible.length > 0 ? (
            <motion.div
              key={`${filter}-${selectedYear}`}
              initial={{ opacity: 0, y: reduced ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -6 }}
              className="registry-list"
            >
              {visible.map((item, index) => {
                const isActive = item.status === "active"

                return (
                  <motion.article
                    key={item.id}
                    initial={reduced ? undefined : { opacity: 0, x: -18 }}
                    whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="registry-entry registry-entry-credential"
                    data-current={isActive || undefined}
                  >
                    <div className="registry-entry-meta">
                      <span className="registry-node"><Award className="h-4 w-4" /></span>
                      <span>Issued {item.date}</span>
                      <span className={`registry-status ${isActive ? "" : "registry-status-archived"}`}>{isActive ? "Active" : "Archived"}</span>
                    </div>
                    <div className="registry-entry-detail">
                      <p className="registry-kicker">{item.issuer}</p>
                      <h3>{item.title}</h3>
                      {item.expiryDate !== "No Expiry" && <p>Expires {item.expiryDate}</p>}
                    </div>

                    <button
                      type="button"
                      className="credential-inspect"
                      onClick={() => {
                        playModalOpenSound()
                        setInspectedCredential(item)
                      }}
                    >
                      Inspect <Eye size={15} aria-hidden="true" />
                    </button>
                  </motion.article>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid min-h-[220px] place-items-center border border-border bg-card/50 p-8 text-center"
            >
              <div>
                <Award className="mx-auto h-6 w-6 text-muted-foreground" />
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground">No credential in this year</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose another year or change the status filter.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Button */}
        {(hiddenCount > 0 || showAll) && selectedCredentials.length > INITIAL_ITEMS && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="review-toggle"
              onClick={() => {
                playClickSound()
                setShowAll((current) => !current)
              }}
            >
              {showAll ? "Show fewer" : "Load more"} <span>{showAll ? "−" : `(${hiddenCount})`}</span>
            </button>
          </div>
        )}
      </div>

      {/* Credential Verification Modal */}
      <AnimatePresence>
        {inspectedCredential && (
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => {
              playClickSound()
              setInspectedCredential(null)
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: reduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg border border-border bg-card p-6 sm:p-8 shadow-lg"
              role="dialog"
              aria-modal="true"
              aria-labelledby="credential-modal-title"
            >
              <button
                type="button"
                onClick={() => {
                  playClickSound()
                  setInspectedCredential(null)
                }}
                className="absolute right-5 top-5 grid h-10 w-10 place-items-center border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                aria-label="Close credential details"
              >
                <X className="h-4 w-4" />
              </button>

              <p className="registry-kicker">VERIFIED CREDENTIAL</p>

              <h3
                id="credential-modal-title"
                className="mt-3 pr-10 font-display text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-3xl"
              >
                {inspectedCredential.title}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Issued by <span className="font-medium text-foreground">{inspectedCredential.issuer}</span>
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-border py-5 text-sm">
                <div>
                  <dt className="registry-kicker">ISSUE DATE</dt>
                  <dd className="mt-1 font-medium text-foreground">{inspectedCredential.date}</dd>
                </div>
                <div>
                  <dt className="registry-kicker">EXPIRATION</dt>
                  <dd className="mt-1 font-medium text-foreground">{inspectedCredential.expiryDate}</dd>
                </div>
                <div>
                  <dt className="registry-kicker">STATUS</dt>
                  <dd className="mt-1">
                    <span className={`registry-status ${inspectedCredential.status === "active" ? "" : "registry-status-archived"}`}>
                      {inspectedCredential.status === "active" ? "Active" : "Archived"}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="registry-kicker">REGISTRY ID</dt>
                  <dd className="mt-1 truncate font-mono text-xs text-foreground" title={inspectedCredential.credentialId}>
                    {inspectedCredential.credentialId}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                {inspectedCredential.credentialId && inspectedCredential.credentialId !== "Not Available" ? (
                  <button
                    type="button"
                    onClick={() => handleCopy(inspectedCredential.id, inspectedCredential.credentialId)}
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {copiedId === inspectedCredential.id ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedId === inspectedCredential.id ? "Copied ID" : "Copy ID"}</span>
                  </button>
                ) : (
                  <span />
                )}

                {inspectedCredential.link && (
                  <a
                    href={inspectedCredential.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="studio-text-link"
                  >
                    Verify credential <ArrowUpRight size={16} aria-hidden="true" />
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
