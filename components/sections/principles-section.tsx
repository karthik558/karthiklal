"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Gauge, ScanEye, ShieldCheck, Target, CheckCheck } from "lucide-react"

const principles = [
  { title: "Make it clear", description: "Simple choices. Intuitive interfaces.", icon: ScanEye },
  { title: "Build in trust", description: "Secure defaults. Reliable foundations.", icon: ShieldCheck },
  { title: "Keep it fast", description: "Responsive screens. Efficient systems.", icon: Gauge },
]

function TreeConnector({ merge = false }: { merge?: boolean }) {
  const reduced = useReducedMotion()

  return (
    <svg viewBox="0 0 1200 64" preserveAspectRatio="none" className="hidden h-16 w-full overflow-visible text-primary/60 md:block" fill="none" aria-hidden="true">
      <defs>
        <marker id={merge ? "build-merge-arrow" : "build-branch-arrow"} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="m1 1 3 2.5L1 6" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </marker>
      </defs>
      {merge ? (
        <>
          <motion.path
            d="M200 0v20q0 12 12 12h776q12 0 12-12V0M600 0v32"
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
            initial={reduced ? undefined : { pathLength: 0, opacity: 0.2 }}
            whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.path
            d="M600 32v29"
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
            markerEnd="url(#build-merge-arrow)"
            initial={reduced ? undefined : { pathLength: 0, opacity: 0.2 }}
            whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          />
        </>
      ) : (
        <>
          <motion.path
            d="M600 0v24M200 61V36q0-12 12-12h776q12 0 12 12v25M600 24v37"
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
            initial={reduced ? undefined : { pathLength: 0, opacity: 0.2 }}
            whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          />
          {[200, 600, 1000].map((x, i) => (
            <motion.path
              key={x}
              d={`M${x} 55v6`}
              stroke="currentColor"
              vectorEffect="non-scaling-stroke"
              markerEnd="url(#build-branch-arrow)"
              initial={reduced ? undefined : { opacity: 0 }}
              whileInView={reduced ? undefined : { opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
            />
          ))}
        </>
      )}
    </svg>
  )
}

function MobileTreeConnector({ merge = false }: { merge?: boolean }) {
  const reduced = useReducedMotion()

  return (
    <div aria-hidden="true" className="relative h-8 md:hidden">
      <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="absolute left-3 top-0 h-8 w-[calc(50%-12px)] overflow-visible text-primary/60" fill="none">
        <motion.path
          d={merge ? "M0 0v8q0 8 8 8h84q8 0 8 8v8m-4-4 4 4 4-4" : "M100 0v8q0 8-8 8H8q-8 0-8 8v8"}
          stroke="currentColor"
          vectorEffect="non-scaling-stroke"
          initial={reduced ? undefined : { pathLength: 0, opacity: 0.2 }}
          whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </svg>
    </div>
  )
}

export default function PrinciplesSection() {
  const reduced = useReducedMotion()

  return (
    <section id="principles" className="section-shell border-t-2 border-border">
      <div className="section-container">
        <div className="section-heading-row">
          <div>
            <div className="mb-3"><span className="paper-stamp">02 // HOW I THINK</span></div>
            <h2 className="section-title max-w-4xl !text-4xl sm:!text-5xl lg:!text-6xl">HOW DO I BUILD ?<br className="hidden sm:block" /></h2>
          </div>
        </div>
        <div role="group" aria-label="My approach: understand the problem, design for clarity, security and speed, then test and refine">
          {/* Step 1: Understand */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group mx-auto flex max-w-md items-center justify-center gap-3 border border-primary/40 bg-primary/[0.06] px-5 py-5 text-center shadow-xs transition-colors hover:border-primary"
          >
            <motion.div
              animate={reduced ? undefined : { scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Target aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
            </motion.div>
            <p className="font-display text-xl font-bold tracking-tight sm:text-2xl">Understand the problem.</p>
          </motion.div>

          <TreeConnector />
          <MobileTreeConnector />

          {/* Step 2: Three Core Principles Grid */}
          <div className="relative ml-3 grid gap-3 border-l border-primary/50 pl-6 md:ml-0 md:grid-cols-3 md:gap-4 md:border-0 md:p-0">
            {principles.map(({ title, description, icon: Icon }, index) => (
              <motion.article
                key={title}
                initial={reduced ? undefined : { opacity: 0, y: 22 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={reduced ? undefined : { y: -4, borderColor: "hsl(var(--primary))" }}
                className="group relative min-w-0 border border-border bg-card/60 p-5 sm:p-6 transition-all duration-300 hover:shadow-[2px_2px_0px_hsl(var(--primary))]"
              >
                <svg aria-hidden="true" viewBox="0 0 26 12" className="absolute -left-[26px] top-1/2 h-3 w-[26px] -translate-y-1/2 text-primary/50 md:hidden" fill="none"><path d="M0 6h24m-4-4 4 4-4 4" stroke="currentColor" /></svg>
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-none border border-border bg-card text-primary transition-colors group-hover:border-primary group-hover:bg-primary/10">
                    <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
                  </span>
                  <h3 className="font-display text-xl font-bold tracking-tight">{title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </motion.article>
            ))}
          </div>

          <TreeConnector merge />
          <MobileTreeConnector merge />

          {/* Step 3: Deliver */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="group mx-auto flex max-w-md items-center justify-center gap-3 border border-foreground/30 bg-card px-5 py-5 text-center shadow-xs transition-colors hover:border-primary"
          >
            <CheckCheck aria-hidden="true" className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-hover:scale-115" strokeWidth={1.75} />
            <p className="font-display text-xl font-bold tracking-tight sm:text-2xl">Test. Refine. Deliver.</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

