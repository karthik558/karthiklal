import { Gauge, ScanEye, ShieldCheck, Target, CheckCheck } from "lucide-react"

const principles = [
  { title: "Make it clear", description: "Simple choices. Intuitive interfaces.", icon: ScanEye },
  { title: "Build in trust", description: "Secure defaults. Reliable foundations.", icon: ShieldCheck },
  { title: "Keep it fast", description: "Responsive screens. Efficient systems.", icon: Gauge },
]

function TreeConnector({ merge = false }: { merge?: boolean }) {
  return (
    <svg viewBox="0 0 1200 64" preserveAspectRatio="none" className="hidden h-16 w-full overflow-visible text-primary/50 md:block" fill="none" aria-hidden="true">
      <defs><marker id={merge ? "build-merge-arrow" : "build-branch-arrow"} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="m1 1 3 2.5L1 6" stroke="currentColor" strokeWidth="1.2" fill="none" /></marker></defs>
      {merge ? (
        <>
          <path d="M200 0v20q0 12 12 12h776q12 0 12-12V0M600 0v32" stroke="currentColor" vectorEffect="non-scaling-stroke" />
          <path d="M600 32v29" stroke="currentColor" vectorEffect="non-scaling-stroke" markerEnd="url(#build-merge-arrow)" />
        </>
      ) : (
        <>
          <path d="M600 0v24M200 61V36q0-12 12-12h776q12 0 12 12v25M600 24v37" stroke="currentColor" vectorEffect="non-scaling-stroke" />
          {[200, 600, 1000].map(x => <path key={x} d={`M${x} 55v6`} stroke="currentColor" vectorEffect="non-scaling-stroke" markerEnd="url(#build-branch-arrow)" />)}
        </>
      )}
    </svg>
  )
}

export default function PrinciplesSection() {
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
          <div className="mx-auto flex max-w-md items-center justify-center gap-3 border border-primary/40 bg-primary/[0.06] px-5 py-5 text-center">
            <Target aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
            <p className="font-display text-xl font-bold tracking-tight sm:text-2xl">Understand the problem.</p>
          </div>
          <TreeConnector />
          <svg aria-hidden="true" viewBox="0 0 360 32" preserveAspectRatio="none" className="h-8 w-full text-primary/50 md:hidden" fill="none"><path d="M180 0v8q0 8-8 8H20q-8 0-8 8v8" stroke="currentColor" vectorEffect="non-scaling-stroke" /></svg>
          <div className="relative ml-3 grid gap-3 border-l border-primary/40 pl-6 md:ml-0 md:grid-cols-3 md:gap-4 md:border-0 md:p-0">
            {principles.map(({ title, description, icon: Icon }) => (
              <article key={title} className="relative min-w-0 border border-border bg-card/60 p-5 sm:p-6">
                <svg aria-hidden="true" viewBox="0 0 24 12" className="absolute -left-[25px] top-1/2 h-3 w-6 -translate-y-1/2 text-primary/60 md:hidden" fill="none"><path d="M0 6h22m-4-4 4 4-4 4" stroke="currentColor" /></svg>
                <div className="flex items-center gap-3">
                  <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
                  <h3 className="font-display text-xl font-bold tracking-tight">{title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
          <TreeConnector merge />
          <svg aria-hidden="true" viewBox="0 0 360 32" preserveAspectRatio="none" className="h-8 w-full text-primary/50 md:hidden" fill="none"><path d="M12 0v8q0 8 8 8h152q8 0 8 8v6m-4-4 4 4 4-4" stroke="currentColor" vectorEffect="non-scaling-stroke" /></svg>
          <div className="mx-auto flex max-w-md items-center justify-center gap-3 border border-foreground/30 bg-card px-5 py-5 text-center">
            <CheckCheck aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
            <p className="font-display text-xl font-bold tracking-tight sm:text-2xl">Test. Refine. Deliver.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
