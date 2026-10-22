"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Check, Shield, Code2, Cloud, Palette, ChevronDown } from "lucide-react"
import Link from "next/link"
import servicesData from "@/public/data/services.json"

const iconMap = { Shield, Code2, Cloud, Palette }

const serviceDetails: Record<string, { title: string; outcome: string; deliverables: string[] }> = {
  "Network Security & Penetration Testing": {
    title: "Security & penetration testing",
    outcome: "Find weaknesses, strengthen your defenses, and prepare your team to respond.",
    deliverables: ["Network testing & vulnerability assessment", "Firewall configuration & threat protection", "Incident response & security training"],
  },
  "Full Stack Web Development": {
    title: "Web development",
    outcome: "Turn your idea into a responsive application that is fast, usable, and easy to maintain.",
    deliverables: ["React & Next.js applications", "APIs, databases & integrations", "Performance, SEO & deployment"],
  },
  "Cloud Hosting & Virtualization": {
    title: "Cloud & infrastructure",
    outcome: "Keep your systems dependable, with infrastructure built for daily operations and recovery.",
    deliverables: ["Cloud hosting & server virtualization", "Backups & disaster recovery", "Linux administration & monitoring"],
  },
  "Graphic Design & Branding": {
    title: "Design & branding",
    outcome: "Give your brand a consistent visual identity across screens, campaigns, and print.",
    deliverables: ["Visual identity & brand guidelines", "Interface design & prototypes", "Digital campaigns & print collateral"],
  },
}

export default function ServicesSection() {
  const [expandedId, setExpandedId] = useState<number | null>(1)
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="services" className="section-shell border-t-2 border-border">
      <div className="section-container">
        
        {/* Section Header */}
        <div className="section-heading-row">
          <div>
            <div className="mb-3">
              <span className="paper-stamp">
                04 // SERVICES &amp; CAPABILITIES
              </span>
            </div>
            <h2 className="section-title">
              WHAT I DELIVER
            </h2>
          </div>
        </div>

        <div className="border-t border-border">
          {servicesData.services.map(service => {
            const Icon = iconMap[service.icon as keyof typeof iconMap] || Shield
            const details = serviceDetails[service.title] || { title: service.title, outcome: service.description, deliverables: [] }
            const isExpanded = expandedId === service.id
            const panelId = `service-details-${service.id}`
            const headingId = `service-heading-${service.id}`
            return (
              <article key={service.id} className="border-b border-border">
                <h3>
                  <button
                    id={headingId}
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : service.id)}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    className="flex w-full items-center gap-4 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary sm:gap-6 sm:py-8"
                  >
                    <Icon className="hidden h-6 w-6 shrink-0 text-primary sm:block" strokeWidth={1.5} />
                    <span className="min-w-0 flex-1 font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{details.title}</span>
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors ${isExpanded ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={headingId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 pb-8 sm:pl-12 lg:grid-cols-2 lg:gap-16">
                        <div>
                          <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">{details.outcome}</p>
                          <Link href="/contact" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline decoration-primary underline-offset-8 hover:text-primary">
                            Let’s talk <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </div>
                        <ul className="space-y-3">
                          {details.deliverables.map(item => (
                            <li key={item} className="flex items-start gap-3 text-sm leading-relaxed sm:text-base"><Check className="mt-1 h-4 w-4 shrink-0 text-primary" /><span>{item}</span></li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
