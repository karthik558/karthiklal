"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion"
import { Gauge, ScanEye, ShieldCheck, Target, CheckCheck } from "lucide-react"

const principles = [
  { title: "Make it clear", description: "Simple choices. Intuitive interfaces.", icon: ScanEye },
  { title: "Build in trust", description: "Secure defaults. Reliable foundations.", icon: ShieldCheck },
  { title: "Keep it fast", description: "Responsive screens. Efficient systems.", icon: Gauge },
]

function ScrollConnector({ progress, merge = false, mobile = false }: { progress: MotionValue<number>; merge?: boolean; mobile?: boolean }) {
  const reduced = useReducedMotion()
  const stage = useTransform(progress, merge ? [0.64, 0.94] : [0.08, 0.4], [0, 1])
  const offset = useTransform(stage, value => 0.12 - value)
  const opacity = useTransform(stage, [0, 0.03, 0.97, 1], [0, 1, 1, 0])
  const paths = mobile
    ? [merge ? "M0 0v8q0 8 8 8h84q8 0 8 8v8" : "M100 0v8q0 8-8 8H8q-8 0-8 8v8"]
    : merge
      ? ["M200 0v20q0 12 12 12h376q12 0 12 12v17", "M600 0v61", "M1000 0v20q0 12-12 12H612q-12 0-12 12v17"]
      : ["M600 0v12q0 12-12 12H212q-12 0-12 12v25", "M600 0v61", "M600 0v12q0 12 12 12h376q12 0 12 12v25"]

  return (
    <div aria-hidden="true" className={mobile ? "relative h-8 md:hidden" : "hidden h-16 md:block"}>
      <svg viewBox={mobile ? "0 0 100 32" : "0 0 1200 64"} preserveAspectRatio="none" className={mobile ? "build-path absolute left-3 top-0 h-8 w-[calc(50%-12px)] overflow-visible" : "build-path h-16 w-full overflow-visible"} fill="none">
        <g className="build-path-track">
          {paths.map(d => <path key={d} d={d} stroke="currentColor" vectorEffect="non-scaling-stroke" />)}
        </g>
        {!reduced && <motion.g className="build-path-light" style={{ opacity }}>
          {paths.map(d => <motion.path key={d} d={d} pathLength="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.12 1" style={{ strokeDashoffset: offset }} vectorEffect="non-scaling-stroke" />)}
        </motion.g>}
      </svg>
    </div>
  )
}

export default function PrinciplesSection() {
  const reduced = useReducedMotion()
  const diagramRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: diagramRef, offset: ["start 70%", "end 45%"] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
  const gridPosition = useTransform(progress, [0.4, 0.64], ["0%", "100%"])
  const gridOpacity = useTransform(progress, [0.4, 0.43, 0.61, 0.64], [0, 1, 1, 0])
  const deliveryGlow = useTransform(progress, [0.9, 1], ["0 0 0px hsl(var(--primary) / 0)", "0 0 20px hsl(var(--primary) / .18)"])

  return (
    <section id="principles" className="section-shell border-t-2 border-border">
      <div className="section-container">
        <div className="section-heading-row">
          <div>
            <div className="mb-3"><span className="paper-stamp">02 // HOW I THINK</span></div>
            <h2 className="section-title max-w-4xl !text-4xl sm:!text-5xl lg:!text-6xl">HOW DO I BUILD ?<br className="hidden sm:block" /></h2>
          </div>
        </div>
        <div ref={diagramRef} role="group" aria-label="My approach: understand the problem, design for clarity, security and speed, then test and refine">
          {/* Step 1: Understand */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group mx-auto flex max-w-md items-center justify-center gap-3 border border-primary/40 bg-primary/[0.06] px-5 py-5 text-center shadow-xs transition-colors hover:border-primary"
          >
            <div>
              <Target aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
            </div>
            <p className="font-display text-xl font-bold tracking-tight sm:text-2xl">Understand the problem.</p>
          </motion.div>

          <ScrollConnector progress={progress} />
          <ScrollConnector progress={progress} mobile />

          {/* Step 2: Three Core Principles Grid */}
          <div className="relative ml-3 grid gap-3 border-l border-primary/50 pl-6 md:ml-0 md:grid-cols-3 md:gap-4 md:border-0 md:p-0">
            {!reduced && <div aria-hidden="true" className="absolute -left-px inset-y-0 w-px md:hidden">
              <motion.div className="build-mobile-light absolute h-12 w-px -translate-y-full" style={{ top: gridPosition, opacity: gridOpacity }} />
            </div>}
            {principles.map(({ title, description, icon: Icon }, index) => (
              <motion.article
                key={title}
                initial={reduced ? undefined : { opacity: 0, y: 22 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={reduced ? undefined : { y: -4 }}
                className="group relative min-w-0 border border-border hover:border-primary bg-card/60 p-5 sm:p-6 transition-all duration-300 hover:shadow-[2px_2px_0px_hsl(var(--primary))]"
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

          <ScrollConnector progress={progress} merge />
          <ScrollConnector progress={progress} mobile merge />

          {/* Step 3: Deliver */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={reduced ? undefined : { boxShadow: deliveryGlow }}
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

