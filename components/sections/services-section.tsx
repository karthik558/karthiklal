"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

  return (
    <section id="services" className="relative bg-background py-28 md:py-36 border-t border-border">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Section Header */}
        <div className="mb-14 border-b border-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              05 // SERVICES & OFFERINGS
            </div>
            <h2 className="font-display text-4xl font-black uppercase tracking-tight text-foreground sm:text-6xl md:text-7xl">
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

            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`group relative border-2 transition-all duration-300 overflow-hidden ${
                  isExpanded ? "border-foreground bg-card shadow-2xl" : "border-border bg-card/60 hover:border-foreground/60"
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
                  onClick={() => setExpandedId(isExpanded ? null : service.id)}
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
                      <h3 className="font-display text-2xl md:text-3xl font-black uppercase text-foreground">
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
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-border px-6 md:px-8 py-8 bg-background relative z-10"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-6">
                          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                            SERVICE OVERVIEW
                          </div>
                          <p className="font-sans text-base text-foreground leading-relaxed mb-6 font-light">
                            {service.description}
                          </p>

                          <div className="p-4 border-l-4 border-foreground bg-card font-mono text-xs text-foreground/90 leading-relaxed">
                            &ldquo;{details.highlight}&rdquo;
                          </div>
                        </div>

                        <div className="lg:col-span-6">
                          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                            KEY DELIVERABLES
                          </div>

                          <div className="space-y-2.5 mb-8">
                            {details.deliverables.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-3 font-mono text-xs text-foreground">
                                <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>

                          <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-foreground bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider hover:bg-background hover:text-foreground transition-all duration-300"
                          >
                            INITIATE SERVICE INQUIRY <ArrowUpRight className="w-4 h-4" />
                          </Link>
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
