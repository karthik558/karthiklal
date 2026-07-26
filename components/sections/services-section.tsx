"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Check, Shield, Code2, Cloud, Palette, ChevronDown } from "lucide-react"
import Link from "next/link"
import servicesData from "@/public/data/services.json"

const iconMap = { Shield, Code2, Cloud, Palette }

const serviceDetails: Record<string, { deliverables: string[]; highlight: string }> = {
  "Network Security & Penetration Testing": {
    deliverables: [
      "Full Network Penetration Testing & Vulnerability Assessment",
      "WAF & Firewall Security Rule Configurations",
      "DDoS Defense & Incident Response Planning",
      "PCI-DSS Compliance Audits & Staff Training"
    ],
    highlight: "Securing corporate networks and hospitality infrastructures against zero-day threats."
  },
  "Full Stack Web Development": {
    deliverables: [
      "Custom Next.js & React Web Application Engineering",
      "High-Performance API Design & Supabase Backend Systems",
      "Framer Motion Micro-Interactions & Responsive UI/UX",
      "SEO Optimization, Analytics & Cloudflare Deployment"
    ],
    highlight: "Building hyper-fast, scalable digital products that deliver real user engagement."
  },
  "Cloud Hosting & Virtualization": {
    deliverables: [
      "VMware ESXi Cluster Setup & Server Virtualization",
      "AWS / Cloudflare Zero-Trust Network Architecture",
      "Disaster Recovery, Automated Backups & High Availability",
      "Linux Server Administration & System Performance Tuning"
    ],
    highlight: "Ensuring 99.9% uptime SLAs across server clusters and distributed networks."
  },
  "Graphic Design & Branding": {
    deliverables: [
      "Comprehensive Visual Identity & Brand Guidelines",
      "Ui/UX Wireframing & Interactive Prototypes",
      "High-Resolution Print & Digital Marketing Collateral",
      "Social Media Visual Systems & Video Post-Production"
    ],
    highlight: "Crafting memorable, bold visual languages for brands and digital products."
  }
}

export default function ServicesSection() {
  const [expandedId, setExpandedId] = useState<number | null>(1)
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="services" className="section-shell border-t border-border">
      <div className="section-container">
        
        {/* Section Header */}
        <div className="section-heading-row">
          <div>
            <div className="section-kicker">
              04 // SERVICES & OFFERINGS
            </div>
            <h2 className="section-title">
              WHAT I DELIVER
            </h2>
          </div>

          <p className="max-w-md font-sans text-sm text-muted-foreground font-light leading-relaxed">
            End-to-end technical execution from initial security hardening to full-stack platform launches.
          </p>
        </div>

        {/* Accordion / Cards List */}
        <div className="space-y-6">
          {servicesData.services.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap] || Shield
            const details = serviceDetails[service.title] || { deliverables: [], highlight: "" }
            const isExpanded = expandedId === service.id
            const numStr = String(index + 1).padStart(2, "0")
            const panelId = `service-details-${service.id}`

            return (
              <motion.article
                key={service.id}
                layout="position"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  opacity: { duration: 0.4, delay: index * 0.05 },
                  y: { duration: 0.4, delay: index * 0.05 },
                  layout: { duration: prefersReducedMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] },
                }}
                className={`group relative border transition-all duration-300 overflow-hidden ${
                  isExpanded ? "border-foreground/70 bg-card shadow-lg" : "border-border/80 bg-card/50 hover:border-foreground/50"
                }`}
              >
                {/* Background Giant Stroke Number Watermark */}
                <div className="absolute right-4 bottom-0 pointer-events-none select-none overflow-hidden opacity-[0.06] dark:opacity-[0.1] z-0 transition-opacity duration-300 group-hover:opacity-20">
                  <span
                    className="font-display text-8xl md:text-9xl font-black uppercase tracking-tighter text-transparent leading-none block"
                    style={{
                      WebkitTextStroke: "2.5px hsl(var(--foreground))",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {numStr}
                  </span>
                </div>

                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : service.id)}
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  className="w-full p-6 md:p-8 flex items-center justify-between text-left focus:outline-none relative z-10"
                >
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-xl md:text-2xl font-black text-muted-foreground">
                      [{numStr}]
                    </span>

                    <div className="flex items-center gap-4">
                      <div className="p-3 border border-foreground bg-foreground text-background hidden sm:block">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl font-black text-foreground">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs uppercase text-muted-foreground hidden md:block">
                      {isExpanded ? "COLLAPSE" : "EXPAND DETAILS"}
                    </span>
                    <div className={`p-2 border border-border transition-transform duration-300 ${isExpanded ? "rotate-180 bg-foreground text-background" : "bg-background text-foreground"}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Accordion Expanded Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      id={panelId}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: {
                          duration: prefersReducedMotion ? 0 : 0.52,
                          ease: [0.22, 1, 0.36, 1],
                        },
                        opacity: {
                          duration: prefersReducedMotion ? 0 : 0.28,
                          delay: isExpanded && !prefersReducedMotion ? 0.08 : 0,
                        },
                      }}
                      className="relative z-10 overflow-hidden"
                    >
                      <div className="border-t border-border bg-background px-6 py-8 md:px-8">
                        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                          <div className="lg:col-span-6">
                            <div className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                              SERVICE OVERVIEW
                            </div>
                            <p className="mb-6 font-sans text-base font-light leading-relaxed text-foreground">
                              {service.description}
                            </p>

                            <div className="border-l-2 border-foreground bg-card/60 p-4 font-sans text-sm italic leading-relaxed text-foreground/90">
                              &ldquo;{details.highlight}&rdquo;
                            </div>
                          </div>

                          <div className="lg:col-span-6">
                            <div className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                              KEY DELIVERABLES
                            </div>

                            <div className="mb-8 space-y-2.5">
                              {details.deliverables.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 font-sans text-sm text-foreground">
                                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>

                            <Link
                              href="/contact"
                              className="inline-flex items-center gap-2 border-2 border-foreground bg-foreground px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-background transition-all duration-300 hover:bg-background hover:text-foreground"
                            >
                              INITIATE SERVICE INQUIRY <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
