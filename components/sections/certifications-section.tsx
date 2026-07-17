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
    <motion.article layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.16) }} className="group grid gap-5 border-b border-border/70 py-7 first:border-t md:grid-cols-[56px_minmax(0,1fr)_150px_120px] md:items-center md:gap-6 md:py-8">
      <div className="font-display text-2xl font-bold text-muted-foreground/25">{String(index + 1).padStart(2, "0")}</div>
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
        {canCopy && <button type="button" onClick={copyId} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border/70 text-muted-foreground transition hover:border-primary/30 hover:text-primary" aria-label={`Copy credential ID for ${item.title}`}>{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}</button>}
        {item.link && <Link href={item.link} target="_blank" rel="noreferrer" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border/70 text-muted-foreground transition hover:border-primary/30 hover:text-primary" aria-label={`View ${item.title} credential`}><ExternalLink className="h-3.5 w-3.5" /></Link>}
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

  return (
    <section id="certifications" className="relative overflow-hidden bg-background py-20 md:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 section-gradient-blend bg-[radial-gradient(900px_circle_at_12%_18%,hsl(var(--primary)/0.11),transparent_62%)]" />
      <div className="container relative z-10">
        <div className="mb-12 lg:mb-16"><SectionHeader eyebrow="Credentials" title="Professional" highlight="Achievements" align="left" /></div>

        <div className="mb-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Credential index</p><p className="mt-2 text-sm text-muted-foreground">{filtered.length} achievements</p></div>
          <div className="flex w-full gap-1 rounded-xl border border-border/70 bg-card/50 p-1 sm:w-auto">
            {(["all", "active", "expired"] as CredentialFilter[]).map((value) => <button key={value} type="button" onClick={() => { setFilter(value); setShowAll(false) }} className={cn("flex-1 rounded-lg px-5 py-2.5 text-xs font-semibold capitalize transition sm:flex-none", filter === value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>{value}</button>)}
          </div>
        </div>

        <AnimatePresence mode="popLayout"><motion.div layout>{visible.map((item, index) => <CredentialRow key={item.id} item={item} index={index} />)}</motion.div></AnimatePresence>
        {(hiddenCount > 0 || showAll) && <motion.div layout className="mt-8"><AnimatedButton onClick={() => setShowAll((current) => !current)} variant="outline">{showAll ? "Show less" : `Show ${hiddenCount} more`}{showAll ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}</AnimatedButton></motion.div>}
      </div>
    </section>
  )
}
