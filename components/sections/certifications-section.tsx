"use client"

import SectionHeading from "@/components/sections/section-heading"
import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  Award,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Eye,
  X,
} from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import RegistryFilters from "@/components/ui/registry-filters"
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
    <section id="certifications" className="section-shell overflow-hidden border-t-2 border-border">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-heading-row">
          <div>
            <SectionHeading number="07" label="CREDENTIALS" title="Knowledge earned." accent="Practice backed." />
          </div>
        </div>

        <p className="registry-intro">Always learning. A collection of professional credentials across security, technology, and leadership.</p>
        <RegistryFilters label="Credential status" options={filterOptions} value={filter} onChange={selectFilter} years={years} selectedYear={selectedYear} onYearChange={selectYear} count={selectedCredentials.length} />

        {/* Credentials List */}
        <AnimatePresence mode="wait">
          {visible.length > 0 ? (
            <motion.div
              key={`${filter}-${selectedYear}-${showAll}`}
              initial={{ opacity: 0, y: reduced ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -6 }}
              className="registry-list"
            >
              {visible.map((item, index) => {
                const isActive = item.status === "active"
                const canCopy = Boolean(item.credentialId && item.credentialId !== "Not Available")

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
                      <p>Expiry: {item.expiryDate}</p>
                    </div>

                    {/* Bottom Actions Footer */}
                    <div className="credential-actions">
                      {canCopy ? (
                        <button
                          type="button"
                          onClick={() => handleCopy(item.id, item.credentialId)}
                          className={buttonVariants({ variant: "outline", size: "sm" })}
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
                          <Award className="h-3.5 w-3.5" /> CREDENTIAL
                        </span>
                      )}

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            playModalOpenSound()
                            setInspectedCredential(item)
                          }}
                          className={buttonVariants({ variant: "default", size: "sm" })}
                        >
                          INSPECT <Eye className="h-3.5 w-3.5" />
                        </button>

                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={buttonVariants({ variant: "outline", size: "icon" })}
                            aria-label={`Verify ${item.title}`}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.article>
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
                  Choose another year or change the status filter.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Button */}
        {(hiddenCount > 0 || showAll) && selectedCredentials.length > INITIAL_ITEMS && (
          <div className="mt-8 text-center">
            <AnimatedButton
              onClick={() => {
                playClickSound()
                setShowAll((current) => !current)
              }}
              variant="outline"
              className="paper-button h-11 border-2 border-border/80 bg-card px-8 font-mono text-xs uppercase tracking-wider text-foreground hover:border-foreground hover:bg-foreground hover:text-background shadow-xs cursor-pointer transition-colors"
            >
              {showAll ? "Show fewer credentials" : `Load more (${hiddenCount} more)`}
              {showAll ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </AnimatedButton>
          </div>
        )}
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
              className="paper-sheet paper-folded-corner relative w-full max-w-lg overflow-hidden border-2 border-border/80 bg-card p-6 shadow-2xl sm:p-8"
              role="dialog"
              aria-modal="true"
            >
              <button
                type="button"
                onClick={() => {
                  playClickSound()
                  setInspectedCredential(null)
                }}
                className={`${buttonVariants({ size: "icon" })} absolute right-4 top-4`}
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
                    className={buttonVariants({ variant: "outline", size: "default" })}
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
                    className={buttonVariants({ variant: "default", size: "default" })}
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
