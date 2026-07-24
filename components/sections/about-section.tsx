"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  CheckCircle2,
} from "lucide-react"
import Image from "next/image"

const pillars = [
  {
    id: "cybersecurity",
    num: "01",
    title: "CYBERSECURITY & DEVSECOPS",
    subtitle: "Vulnerability Assessments, Threat Mitigation & Defense Strategy",
    description: "Certified Ethical Hacker (CEH) with deep practical experience conducting penetration tests, network vulnerability audits, DDOS mitigation, and implementing zero-trust security postures across hotel networks and digital systems.",
    highlights: ["Penetration Testing & Audits", "Threat Analysis & Forensic Mitigation", "Firewall & WAF Configurations", "Employee Security Training & SOPs"]
  },
  {
    id: "fullstack",
    num: "02",
    title: "FULL STACK WEB ARCHITECTURE",
    subtitle: "TypeScript, React, Next.js, Node, Supabase & Cloud Infrastructure",
    description: "Architecting lightning-fast web applications, creator platforms, and internal tools with modern JavaScript/TypeScript ecosystems, tailored user interfaces, and serverless backend architecture.",
    highlights: ["Next.js App Router & Server Components", "RESTful & GraphQL API Engineering", "TailwindCSS & Framer Motion UI/UX", "Database Optimization & Cloudflare Workers"]
  },
  {
    id: "infrastructure",
    num: "03",
    title: "ENTERPRISE NETWORK SYSTEMS",
    subtitle: "Linux System Administration, Cisco Networking & Hospitality IT",
    description: "Managing enterprise IT infrastructure, high-density Wi-Fi networks, server virtualization, and hardware security appliances for premier hospitality brands like IHCL (Indian Hotels Company Limited).",
    highlights: ["Cisco / Mikrotik Network Deployment", "Linux Server Cluster Management", "High Density Hospitality Wi-Fi Ops", "99.9% Uptime SLA Governance"]
  },
  {
    id: "leadership",
    num: "04",
    title: "IT STRATEGY & MANAGEMENT",
    subtitle: "Budgeting, Vendor Management, Team Leadership & Compliance",
    description: "Combining technical mastery with business acumen to lead cross-functional IT departments, manage multi-million rupee hardware budgets, and drive digital transformation projects seamlessly.",
    highlights: ["IT Department Operations & SLA Lead", "Vendor Negotiations & Procurement", "Disaster Recovery & Business Continuity", "Compliance & PCI-DSS Guidelines"]
  }
]

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activePillar, setActivePillar] = useState<string>("cybersecurity")

  const currentPillarData = pillars.find((p) => p.id === activePillar) || pillars[0]

  return (
    <section id="about" ref={containerRef} className="relative bg-background py-28 md:py-36">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Section Header */}
        <div className="mb-16 border-b border-border pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              01 // PHILOSOPHY & CAPABILITIES
            </div>
            <h2 className="font-display text-4xl font-black uppercase tracking-tight text-foreground sm:text-6xl md:text-7xl">
              ABOUT & CORE PILLARS
            </h2>
          </div>

          <p className="max-w-md font-sans text-base text-muted-foreground font-light leading-relaxed">
            Bridging bulletproof cyber defense with cutting-edge full stack engineering to build resilient, elegant digital infrastructure.
          </p>
        </div>

        {/* Top Editorial Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
          {/* Portrait Image Block */}
          <div className="lg:col-span-4 relative group overflow-hidden border-2 border-foreground bg-card min-h-[380px] lg:min-h-full">
            <Image
              src="/user/about.jpg"
              alt="Karthik Lal"
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover grayscale contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:saturate-100 group-hover:contrast-100"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-0 left-0 p-6 z-10">
              <span className="inline-block bg-foreground text-background font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest mb-2">
                IT MANAGER // CEH
              </span>
              <h3 className="font-display text-2xl font-black uppercase text-foreground">KARTHIK LAL</h3>
              <p className="font-mono text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-foreground" /> KERALA, INDIA
              </p>
            </div>
          </div>

          {/* Statement & Interactive Tabs */}
          <div className="lg:col-span-8 border-2 border-border bg-card p-6 md:p-10 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                ENGINEERING MANIFESTO
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-extrabold text-foreground leading-snug mb-6 uppercase">
                &ldquo;Security is not a feature added at the end; it is the fundamental architecture upon which extraordinary products are built.&rdquo;
              </h3>
              <p className="font-sans text-muted-foreground text-base leading-relaxed mb-8">
                With enterprise IT experience since <strong className="text-foreground font-semibold">2019</strong> across leadership, penetration testing, and web development, I protect mission-critical operations while engineering high-speed digital solutions.
              </p>

              {/* Interactive Pillar Selectors */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-t border-border pt-6">
                {pillars.map((pillar) => {
                  const isActive = activePillar === pillar.id
                  return (
                    <button
                      key={pillar.id}
                      onClick={() => setActivePillar(pillar.id)}
                      className={`text-left p-3 border transition-all duration-200 ${
                        isActive
                          ? "border-foreground bg-foreground text-background font-bold"
                          : "border-border bg-background text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                      }`}
                    >
                      <div className="font-mono text-[10px] uppercase opacity-75">{pillar.num}</div>
                      <div className="font-mono text-xs font-bold uppercase tracking-tight mt-1 truncate">
                        {pillar.id}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Active Pillar Details Box */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-6 border-2 border-foreground/30 bg-background p-6"
              >
                <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                    PILLAR {currentPillarData.num} {"//"} {currentPillarData.title}
                  </span>
                </div>
                <p className="font-mono text-xs font-semibold text-muted-foreground mb-3">
                  {currentPillarData.subtitle}
                </p>
                <p className="font-sans text-sm text-foreground/90 leading-relaxed mb-4">
                  {currentPillarData.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentPillarData.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 font-mono text-xs text-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-foreground shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Stats Grid Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-2 border-border bg-card p-6 flex flex-col justify-center transition-colors hover:border-foreground">
            <div className="font-display text-4xl md:text-5xl font-black text-foreground">
              2019
            </div>
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mt-2">
              ENTERPRISE IT CAREER
            </div>
          </div>

          <div className="border-2 border-border bg-card p-6 flex flex-col justify-center transition-colors hover:border-foreground">
            <div className="font-display text-4xl md:text-5xl font-black text-foreground">
              50<span className="text-muted-foreground">+</span>
            </div>
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mt-2">
              SYSTEMS & NODES SECURED
            </div>
          </div>

          <div className="border-2 border-border bg-card p-6 flex flex-col justify-center transition-colors hover:border-foreground">
            <div className="font-display text-4xl md:text-5xl font-black text-foreground">
              99.9<span className="text-muted-foreground">%</span>
            </div>
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mt-2">
              INFRASTRUCTURE UPTIME
            </div>
          </div>

          <div className="border-2 border-border bg-card p-6 flex flex-col justify-center transition-colors hover:border-foreground">
            <div className="font-display text-4xl md:text-5xl font-black text-foreground">
              CEH
            </div>
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mt-2">
              EC-COUNCIL CERTIFIED
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
