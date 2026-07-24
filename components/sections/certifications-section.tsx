"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, ChevronDown, ChevronUp, Copy, ExternalLink } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { CERTIFICATIONS_DATA } from "@/lib/static-data"

interface Certification { id: number; title: string; issuer: string; date: string; expiryDate: string; credentialId: string; status: string; link?: string }
type CredentialFilter = "all" | "active" | "expired"
const INITIAL_ITEMS = 3
const certifications = CERTIFICATIONS_DATA.certifications as Certification[]

const parseDate = (date: string) => {
  const [month, year] = date.split(" ")
  const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
  return new Date(Number(year), months[month] ?? 0).getTime()
}

export default function CertificationsSection() {
  const [filter, setFilter] = useState<CredentialFilter>("all")
  const [showAll, setShowAll] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const sorted = useMemo(() => [...certifications].sort((a, b) => parseDate(b.date) - parseDate(a.date)), [])
  const filtered = useMemo(() => (filter === "all" ? sorted : sorted.filter((item) => item.status === filter)), [filter, sorted])
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_ITEMS)
  const hiddenCount = filtered.length - visible.length

  const handleCopy = async (id: number, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <section id="certifications" className="relative bg-background py-20 md:py-36 border-t border-border">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Section Header */}
        <div className="mb-14 border-b border-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              07 // CREDENTIALS & AUDITS
            </div>
            <h2 className="font-display text-4xl font-black uppercase tracking-tight text-foreground sm:text-6xl md:text-7xl">
              CERTIFICATIONS
            </h2>
          </div>

          {/* Filter Options */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "ALL CERTIFICATES", value: "all" },
              { label: "ACTIVE", value: "active" },
              { label: "ARCHIVED", value: "expired" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setFilter(option.value as CredentialFilter)
                  setShowAll(false)
                }}
                className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-all duration-200 ${
                  filter === option.value
                    ? "border-foreground bg-foreground text-background font-bold"
                    : "border-border bg-card text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((item, index) => {
              const isActive = item.status === "active"
              const numStr = String(index + 1).padStart(2, "0")
              const canCopy = item.credentialId && item.credentialId !== "Not Available"

              return (
                <motion.article
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="group relative flex flex-col justify-between border-2 border-border bg-card p-6 md:p-8 transition-all duration-300 hover:border-foreground hover:shadow-xl overflow-hidden"
                >
                  {/* Background Giant Stroke Number Watermark */}
                  <div className="absolute right-2 -bottom-2 pointer-events-none select-none overflow-hidden opacity-[0.06] dark:opacity-[0.1] z-0 transition-opacity duration-300 group-hover:opacity-20">
                    <span
                      className="font-display text-7xl sm:text-8xl font-black uppercase tracking-tighter text-transparent leading-none block"
                      style={{
                        WebkitTextStroke: "2.5px hsl(var(--foreground))",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {numStr}
                    </span>
                  </div>

                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                        <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          [{numStr}] // {item.issuer}
                        </span>
                        <span className={`font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border ${
                          isActive ? "border-emerald-500 text-emerald-500" : "border-border text-muted-foreground"
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <h3 className="font-display text-2xl font-black uppercase text-foreground leading-tight mb-4 group-hover:underline underline-offset-4">
                        {item.title}
                      </h3>
                    </div>

                    <div>
                      <div className="font-mono text-xs text-muted-foreground space-y-1 pt-4 border-t border-border/60 mb-6">
                        <p>ISSUED: <strong className="text-foreground">{item.date}</strong></p>
                        <p>EXPIRY: <strong className="text-foreground">{item.expiryDate}</strong></p>
                      </div>

                      <div className="flex items-center justify-between font-mono text-xs">
                        {canCopy ? (
                          <button
                            onClick={() => handleCopy(item.id, item.credentialId)}
                            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground uppercase font-bold"
                          >
                            {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === item.id ? "COPIED ID" : "COPY CREDENTIAL ID"}</span>
                          </button>
                        ) : (
                          <span className="text-muted-foreground opacity-50">VERIFIED MEMBER</span>
                        )}

                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 border border-border bg-background text-foreground hover:bg-foreground hover:text-background transition-colors"
                            title="Verify Credential Link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Load More Trigger */}
        {(hiddenCount > 0 || showAll) && (
          <div className="mt-12 text-center">
            <AnimatedButton
              onClick={() => setShowAll((curr) => !curr)}
              variant="outline"
              className="h-12 px-8 font-mono text-xs uppercase tracking-wider border-border hover:border-foreground"
            >
              {showAll ? "SHOW FEWER CERTIFICATES" : `LOAD ${hiddenCount} MORE CERTIFICATES`}
              {showAll ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </AnimatedButton>
          </div>
        )}
      </div>
    </section>
  )
}
