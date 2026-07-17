"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Check, ChevronDown, ChevronUp, Copy, ExternalLink } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { SectionHeader } from "@/components/ui/section-header"
import { cn } from "@/lib/utils"
import { CERTIFICATIONS_DATA } from "@/lib/static-data"

interface Certification { id: number; title: string; issuer: string; date: string; expiryDate: string; credentialId: string; status: string; link?: string }
type CredentialFilter = "all" | "active" | "expired"
const INITIAL_ITEMS = 6
const certifications = CERTIFICATIONS_DATA.certifications as Certification[]

const parseDate = (date: string) => {
  const [month, year] = date.split(" ")
  const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
  return new Date(Number(year), months[month] ?? 0).getTime()
}

function CredentialRow({ item, index }: { item: Certification; index: number }) {
  const [copied, setCopied] = useState(false)
  const canCopy = item.credentialId && item.credentialId !== "Not Available"
  const isActive = item.status === "active"

  const copyId = async () => {
    await navigator.clipboard.writeText(item.credentialId)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <motion.article layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.16) }} className="group grid gap-5 rounded-xl border border-border/70 bg-card/25 px-4 py-7 transition-colors duration-300 hover:border-primary/35 hover:bg-primary/[0.045] hover:shadow-[0_14px_36px_-28px_hsl(var(--primary)/0.55)] focus-within:border-primary/35 focus-within:bg-primary/[0.055] dark:hover:bg-primary/[0.08] dark:focus-within:bg-primary/[0.1] md:grid-cols-[56px_minmax(0,1fr)_150px_120px] md:items-center md:gap-6 md:px-5 md:py-8">
      <div className="font-display text-2xl font-bold text-muted-foreground/25 transition-colors duration-300 group-hover:text-primary/40">{String(index + 1).padStart(2, "0")}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{item.issuer}</p>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug tracking-tight transition-colors group-hover:text-primary md:text-xl">{item.title}</h3>
        <div className="mt-4 flex flex-wrap items-center gap-3 md:hidden">
          <span className={cn("rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em]", isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground")}>{item.status}</span>
          <span className="text-xs text-muted-foreground">Issued {item.date}</span>
        </div>
      </div>
      <div className="hidden md:block"><p className="text-xs font-semibold text-foreground">{item.date}</p><p className="mt-1 text-[11px] text-muted-foreground">{item.expiryDate === "No Expiry" ? "No expiry" : `Until ${item.expiryDate}`}</p></div>
      <div className="flex items-center justify-between gap-3 md:justify-end">
        <span className={cn("hidden rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] md:inline-flex", isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground")}>{item.status}</span>
        {canCopy && <button type="button" onClick={copyId} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-primary/25 bg-primary/10 text-primary shadow-sm transition hover:border-primary hover:bg-primary hover:text-primary-foreground" aria-label={`Copy credential ID for ${item.title}`}>{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}</button>}
        {item.link && <Link href={item.link} target="_blank" rel="noreferrer" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-primary/25 bg-primary/10 text-primary shadow-sm transition hover:border-primary hover:bg-primary hover:text-primary-foreground" aria-label={`View ${item.title} credential`}><ExternalLink className="h-3.5 w-3.5" /></Link>}
      </div>
    </motion.article>
  )
}

export default function CertificationsSection() {
  const [filter, setFilter] = useState<CredentialFilter>("all")
  const [showAll, setShowAll] = useState(false)
  const sorted = useMemo(() => [...certifications].sort((a, b) => parseDate(b.date) - parseDate(a.date)), [])
  const filtered = useMemo(() => filter === "all" ? sorted : sorted.filter((item) => item.status === filter), [filter, sorted])
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_ITEMS)
  const hiddenCount = filtered.length - visible.length
  const activeCount = certifications.filter((item) => item.status === "active").length
  const expiredCount = certifications.filter((item) => item.status === "expired").length
  const issuerCount = new Set(certifications.map((item) => item.issuer)).size

  return (
    <section id="certifications" className="relative overflow-hidden bg-background py-20 md:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 section-gradient-blend bg-[radial-gradient(900px_circle_at_12%_18%,hsl(var(--primary)/0.11),transparent_62%)]" />
      <div className="container relative z-10">
        <div className="mb-12 lg:mb-16"><SectionHeader eyebrow="Credentials" title="Professional" highlight="Achievements" align="left" /></div>

        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Browse credentials</p>
            <div className="mt-4 flex flex-wrap gap-2 lg:flex-col">
              {([
                { label: "All credentials", value: "all" as CredentialFilter, count: certifications.length },
                { label: "Active", value: "active" as CredentialFilter, count: activeCount },
                { label: "Expired", value: "expired" as CredentialFilter, count: expiredCount },
              ]).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={filter === option.value}
                  onClick={() => { setFilter(option.value); setShowAll(false) }}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition duration-300 lg:w-full",
                    filter === option.value
                      ? "border-primary bg-primary text-primary-foreground shadow-[0_10px_28px_-18px_hsl(var(--primary)/0.9)] ring-2 ring-primary/20"
                      : "border-border/70 bg-card/45 text-muted-foreground hover:border-primary/35 hover:bg-primary/[0.05] hover:text-foreground dark:hover:bg-primary/[0.1]"
                  )}
                >
                  {option.label}<span className="ml-4 text-xs opacity-60">{option.count}</span>
                </button>
              ))}
            </div>
            <div className="mt-7 hidden border-t border-border/70 pt-6 lg:block">
              <p className="font-display text-4xl font-bold">{issuerCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">Professional credential issuers</p>
            </div>
          </aside>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Credential index</p>
              <p className="text-xs text-muted-foreground">{filtered.length} achievements</p>
            </div>
            <AnimatePresence mode="popLayout"><motion.div layout className="space-y-3">{visible.map((item, index) => <CredentialRow key={item.id} item={item} index={index} />)}</motion.div></AnimatePresence>
            {(hiddenCount > 0 || showAll) && <motion.div layout className="mt-8"><AnimatedButton onClick={() => setShowAll((current) => !current)} variant="outline">{showAll ? "Show less" : `Show ${hiddenCount} more`}{showAll ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}</AnimatedButton></motion.div>}
          </div>
        </div>
      </div>
    </section>
  )
}
