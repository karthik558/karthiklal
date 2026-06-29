"use client"

import { useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useInView } from "framer-motion"
import {
  Award,
  Calendar,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Clock,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react"

import { AnimatedButton } from "@/components/ui/animated-button"
import { SectionHeader } from "@/components/ui/section-header"
import { cn } from "@/lib/utils"
import { CERTIFICATIONS_DATA } from "@/lib/static-data"

interface Certification {
  id: number
  title: string
  issuer: string
  date: string
  expiryDate: string
  credentialId: string
  status: string
  description?: string
  link?: string
}

type TimelineFilter = "all" | "active" | "expired"

const INITIAL_ITEMS = 4

export default function CertificationsSection() {
  const [showAll, setShowAll] = useState(false)
  const [filter, setFilter] = useState<TimelineFilter>("all")
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.12 })

  const certifications: Certification[] = CERTIFICATIONS_DATA.certifications
  
  // Sort certifications chronologically (newest first)
  const parseDateString = (dateStr: string) => {
    const parts = dateStr.split(" ")
    if (parts.length < 2) return new Date(0)
    const [month, year] = parts
    const months: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    }
    return new Date(parseInt(year), months[month] ?? 0)
  }

  const sortedCertifications = useMemo(() => {
    return [...certifications].sort((a, b) => parseDateString(b.date).getTime() - parseDateString(a.date).getTime())
  }, [certifications])

  const filteredCertifications = useMemo(() => {
    if (filter === "all") return sortedCertifications
    return sortedCertifications.filter((item) => item.status === filter)
  }, [sortedCertifications, filter])

  const visibleItems = showAll ? filteredCertifications : filteredCertifications.slice(0, INITIAL_ITEMS)
  const hiddenCount = filteredCertifications.length - visibleItems.length

  const stats = useMemo(() => {
    const activeCount = certifications.filter((item) => item.status === "active").length
    const expiredCount = certifications.filter((item) => item.status === "expired").length
    const uniqueIssuers = new Set(certifications.map((item) => item.issuer)).size

    return [
      { label: "Active", value: `${activeCount}`, icon: ShieldCheck },
      { label: "Expired", value: `${expiredCount}`, icon: Clock },
      { label: "Issuers", value: `${uniqueIssuers}`, icon: Award },
    ]
  }, [certifications])

  return (
    <section id="certifications" ref={containerRef} className="relative overflow-hidden bg-background py-16 md:py-24">
      {/* Background Gradients & Noise */}
      <div className="absolute inset-0 section-gradient-blend bg-[radial-gradient(900px_circle_at_16%_20%,hsl(var(--primary)/0.07),transparent_62%),radial-gradient(760px_circle_at_92%_76%,hsl(var(--accent)/0.06),transparent_62%)]" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.18fr_0.82fr] lg:gap-8">
          
          {/* Left Column (Toggle & item cards) - desktop: first, mobile: second */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-lg border border-border/70 bg-card/65 p-3 shadow-sm backdrop-blur order-2 lg:order-1"
          >
            <div className="mb-3 flex items-center justify-between gap-3 px-2 py-1">
              <p className="text-sm font-semibold text-foreground">Timeline</p>
              <p className="text-xs font-medium text-muted-foreground">{filteredCertifications.length} credentials</p>
            </div>

            <TimelineToggle
              value={filter}
              onChange={(nextFilter) => {
                setFilter(nextFilter)
                setShowAll(false)
              }}
            />

            <AnimatePresence mode="popLayout">
              <motion.div layout className="mt-4 space-y-3">
                {visibleItems.map((item, index) => (
                  <CertificationItem key={item.id} item={item} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>

            {hiddenCount > 0 || showAll ? (
              <motion.div layout className="mt-5 flex justify-center border-t border-border/70 pt-4">
                <AnimatedButton onClick={() => setShowAll((current) => !current)} variant="outline" className="h-10">
                  {showAll ? "Show Less" : `Show ${hiddenCount} More`}
                  {showAll ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                </AnimatedButton>
              </motion.div>
            ) : null}
          </motion.div>

          {/* Right Column (Sticky info & stats card) - desktop: second, mobile: first */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-28 lg:self-start order-1 lg:order-2"
          >
            <SectionHeader
              eyebrow="Credentials"
              title="Professional"
              highlight="Achievements"
              align="responsive"
            />

            <div className="mt-7 grid grid-cols-3 overflow-hidden rounded-lg border border-border/70 bg-card/70 shadow-sm backdrop-blur">
              {stats.map((stat, index) => {
                const Icon = stat.icon

                return (
                  <div key={stat.label} className={cn("p-3 text-center md:p-4", index > 0 && "border-l border-border/70")}>
                    <Icon className="mx-auto mb-2 h-4 w-4 text-primary" />
                    <div className="font-display text-2xl font-bold leading-none text-foreground">{stat.value}</div>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

function TimelineToggle({ value, onChange }: { value: TimelineFilter; onChange: (value: TimelineFilter) => void }) {
  const options: Array<{ label: string; value: TimelineFilter }> = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Expired", value: "expired" },
  ]

  return (
    <div className="grid grid-cols-3 gap-1 rounded-md border border-border/70 bg-background/70 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-md px-3.5 py-2.5 text-sm font-medium transition",
            value === option.value ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function CertificationItem({ item, index }: { item: Certification; index: number }) {
  const isActive = item.status === "active"
  const TypeIcon = isActive ? ShieldCheck : Clock
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault() // prevent triggering the card link
    e.stopPropagation() // prevent bubbling up
    navigator.clipboard.writeText(item.credentialId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.36, delay: Math.min(index * 0.04, 0.18) }}
      className="group relative rounded-lg border border-border/70 bg-background/70 p-4 transition hover:border-primary/30 hover:bg-background md:p-5"
    >
      <a
        href={item.link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-4"
      >
        <div className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-primary/10",
          isActive ? "border-green-500/20 text-green-500 bg-green-500/10" : "border-primary/20 text-primary"
        )}>
          <TypeIcon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
                  isActive ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-muted text-muted-foreground"
                )}
              >
                {isActive ? "Active" : "Expired"}
              </span>
              
              <span className="rounded-md bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary uppercase tracking-[0.12em]">
                {item.issuer}
              </span>
            </div>

            {item.credentialId && item.credentialId !== "Not Available" && (
              <button
                type="button"
                onClick={handleCopy}
                className={cn(
                  "relative flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono border rounded-md transition duration-200 outline-none z-20",
                  copied
                    ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
                    : "bg-background/80 border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title="Copy Credential ID"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span className="max-w-[100px] truncate">ID: {item.credentialId}</span>
                  </>
                )}
              </button>
            )}
          </div>

          <h3 className="text-lg font-bold leading-snug text-foreground transition group-hover:text-primary md:text-xl flex items-center gap-1.5">
            <span className="flex-1">{item.title}</span>
            <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0" />
          </h3>

          <div className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex min-w-0 items-start gap-2">
              <Award className="mt-1 h-4 w-4 shrink-0 text-primary/70" />
              <span className="min-w-0">{item.issuer}</span>
            </div>
            <div className="flex items-center gap-2 font-medium text-foreground/75">
              <Calendar className="h-4 w-4 shrink-0 text-primary/70" />
              <span>{item.date} {item.expiryDate && item.expiryDate !== "No Expiry" && ` - ${item.expiryDate}`}</span>
            </div>
          </div>
        </div>
      </a>
    </motion.article>
  )
}
