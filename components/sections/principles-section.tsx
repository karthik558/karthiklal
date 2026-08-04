"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Gauge, Layers3, ScanEye, ShieldCheck, TriangleAlert } from "lucide-react"

const principles = [
  {
    title: "Security is part of UX",
    short: "Trust must be visible.",
    description: "Security decisions should reduce uncertainty, protect people by default, and communicate system state without adding friction.",
    practice: "Least privilege, clear feedback, guarded defaults, and privacy-aware interaction design.",
    icon: ShieldCheck,
  },
  {
    title: "Clarity before decoration",
    short: "Every element earns its place.",
    description: "Visual craft is strongest when hierarchy, language, and interaction make the next action immediately understandable.",
    practice: "Direct copy, deliberate contrast, restrained motion, and interfaces organized around intent.",
    icon: ScanEye,
  },
  {
    title: "Build for failure",
    short: "Resilience is designed early.",
    description: "Networks drop, dependencies fail, and people make mistakes. Recovery should be an intentional part of the product.",
    practice: "Safe fallbacks, useful error states, timeouts, validation, and observable system behavior.",
    icon: TriangleAlert,
  },
  {
    title: "Systems, not screens",
    short: "Consistency must scale.",
    description: "A durable product is a connected set of rules, components, data structures, and decisions—not a collection of isolated pages.",
    practice: "Reusable primitives, typed content, shared patterns, and maintainable technical boundaries.",
    icon: Layers3,
  },
  {
    title: "Performance is a feature",
    short: "Speed shapes perception.",
    description: "A product cannot feel premium if it delays the person using it. Performance, accessibility, and bandwidth are design constraints.",
    practice: "Progressive loading, responsive media, reduced-motion support, and efficient client behavior.",
    icon: Gauge,
  },
]

export default function PrinciplesSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = principles[activeIndex]
  const ActiveIcon = active.icon

  return (
    <section id="principles" className="section-shell overflow-hidden border-t-2 border-border">
      <div className="section-container">
        <div className="section-heading-row">
          <div>
            <div className="section-kicker">02 // OPERATING PRINCIPLES</div>
            <h2 className="section-title">HOW I BUILD</h2>
          </div>
          <p className="max-w-md text-sm font-light leading-relaxed text-muted-foreground md:text-base">
            Five principles connecting cybersecurity, engineering, and visual design into one practical way of working.
          </p>
        </div>

        <div className="grid border-2 border-foreground lg:grid-cols-[minmax(300px,.75fr)_minmax(0,1.25fr)]">
          <div className="border-b-2 border-foreground bg-card lg:border-b-0 lg:border-r-2">
            {principles.map((principle, index) => {
              const Icon = principle.icon
              const selected = activeIndex === index
              return (
                <button
                  key={principle.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={selected}
                  className={`group flex w-full items-center gap-4 border-b border-border px-5 py-5 text-left transition-colors last:border-b-0 sm:px-7 ${
                    selected ? "bg-foreground text-background" : "bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center border ${selected ? "border-background/35" : "border-border"}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-black uppercase sm:text-xl">{principle.title}</span>
                    <span className={`mt-1 block font-mono text-[9px] font-bold uppercase tracking-widest ${selected ? "text-background/60" : "text-muted-foreground"}`}>
                      {principle.short}
                    </span>
                  </span>
                  <ArrowUpRight className={`h-4 w-4 shrink-0 transition-transform ${selected ? "translate-x-0.5 -translate-y-0.5" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"}`} />
                </button>
              )
            })}
          </div>

          <div className="relative flex min-h-[460px] flex-col justify-between overflow-hidden bg-background p-7 sm:p-10 lg:min-h-[520px] lg:p-14">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/.22)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/.18)_1px,transparent_1px)] bg-[size:48px_48px]" />
            <div className="pointer-events-none absolute -right-5 -top-10 font-display text-[13rem] font-black leading-none text-foreground/[0.035]">
              {String(activeIndex + 1).padStart(2, "0")}
            </div>

            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={active.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex flex-1 flex-col justify-between"
              >
                <div>
                  <div className="mb-10 flex items-center justify-between border-b border-border pb-5 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <span>PRINCIPLE / {String(activeIndex + 1).padStart(2, "0")}</span>
                    <ActiveIcon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="max-w-3xl font-display text-4xl font-black uppercase leading-[.95] tracking-tight sm:text-6xl lg:text-7xl">
                    {active.title}
                  </h3>
                  <p className="mt-8 max-w-2xl text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
                    {active.description}
                  </p>
                </div>

                <div className="mt-12 border-l-2 border-foreground pl-5">
                  <div className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">IN PRACTICE</div>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground">{active.practice}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
