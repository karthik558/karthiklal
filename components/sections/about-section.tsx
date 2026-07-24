import { MapPin } from "lucide-react"
import Image from "next/image"

const stats = [
  {
    value: "2019",
    label: "ENTERPRISE IT CAREER",
    graphLabel: "YEARLY GROWTH",
    graphValue: "07 YRS",
    bars: [24, 34, 42, 52, 61, 73, 86, 100],
  },
  {
    value: "50",
    suffix: "+",
    label: "SYSTEMS & NODES SECURED",
    graphLabel: "SECURED ASSETS",
    graphValue: "50+",
    bars: [18, 30, 46, 39, 62, 75, 82, 100],
  },
  {
    value: "99.9",
    suffix: "%",
    label: "INFRASTRUCTURE UPTIME",
    graphLabel: "UPTIME SLA",
    graphValue: "99.9%",
    bars: [94, 96, 95, 98, 97, 99, 98, 100],
  },
  {
    value: "23",
    label: "PROJECTS IN PORTFOLIO",
    graphLabel: "PROJECT OUTPUT",
    graphValue: "23 TOTAL",
    bars: [20, 38, 31, 54, 68, 61, 82, 100],
  },
]

export default function AboutSection() {
  return (
    <section id="about" className="relative bg-background py-20 md:py-36">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Section Header */}
        <div className="mb-16 border-b border-border pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              01 // PHILOSOPHY & CAPABILITIES
            </div>
            <h2 className="font-display text-4xl font-black uppercase tracking-tight text-foreground sm:text-6xl md:text-7xl">
              ABOUT ME
            </h2>
          </div>

          <p className="max-w-md font-sans text-base text-muted-foreground font-light leading-relaxed">
            Cybersecurity research, engineering, and visual design brought together to create secure, useful, and memorable digital experiences.
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

          {/* Profile Statement */}
          <div className="lg:col-span-8 border-2 border-border bg-card p-6 md:p-10 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                RESEARCH // ENGINEERING // DESIGN
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-extrabold text-foreground leading-snug mb-6 uppercase">
                Securing digital landscapes while crafting intuitive, visually compelling experiences.
              </h3>
              <div className="space-y-4 font-sans text-base leading-relaxed text-muted-foreground">
                <p>
                  I&apos;m a cybersecurity researcher, designer, and developer working at the intersection of technology and creativity.
                  My experience spans Linux kernel development, full-stack web development, cybersecurity, and enterprise IT.
                </p>
                <p>
                  From security tools and browser extensions to Rust-based network monitoring and print or web design, I approach every
                  challenge with analytical thinking and artistic vision. Reverse engineering, security auditing, and refining UI/UX are
                  all part of the same goal: creating work that is innovative, usable, and impactful.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="group flex flex-col justify-center border-2 border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-foreground hover:shadow-xl motion-reduce:transform-none md:p-6"
            >
              <div className="font-display text-4xl font-black text-foreground md:text-5xl">
                {stat.value}
                {stat.suffix && <span className="text-muted-foreground">{stat.suffix}</span>}
              </div>
              <div className="mt-2 min-h-8 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground md:text-xs">
                {stat.label}
              </div>

              <div
                className="mt-5 border-t border-border pt-3"
                role="img"
                aria-label={`${stat.graphLabel}: ${stat.graphValue}`}
              >
                <div className="mb-2 flex items-center justify-between font-mono text-[8px] font-bold uppercase tracking-widest text-muted-foreground md:text-[9px]">
                  <span>{stat.graphLabel}</span>
                  <span className="text-foreground transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transform-none">
                    {stat.graphValue}
                  </span>
                </div>
                <div className="relative h-16 border-b border-l border-border px-1 pt-1" aria-hidden="true">
                  <span className="absolute inset-x-0 top-1/4 border-t border-dashed border-border/60" />
                  <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-border/60" />
                  <span className="absolute inset-x-0 top-3/4 border-t border-dashed border-border/60" />

                  <div className="relative z-10 flex h-full items-end gap-1.5">
                    {stat.bars.map((height, index) => {
                      const isLatest = index === stat.bars.length - 1

                      return (
                        <span
                          key={`${stat.label}-${index}`}
                          className="relative flex h-full min-w-1 flex-1 items-end"
                        >
                          <span
                            className={`relative block w-full origin-bottom scale-y-[0.55] transition-all duration-500 ease-out group-hover:scale-y-100 motion-reduce:scale-y-100 motion-reduce:transition-none ${
                              isLatest
                                ? "bg-foreground shadow-[0_0_0_1px_hsl(var(--foreground))]"
                                : "bg-foreground/20 group-hover:bg-foreground/70"
                            }`}
                            style={{
                              height: `${height}%`,
                              transitionDelay: `${index * 45}ms`,
                            }}
                          >
                            {isLatest && (
                              <span className="absolute -top-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-card bg-foreground transition-transform duration-300 group-hover:scale-125 motion-reduce:transition-none" />
                            )}
                          </span>
                        </span>
                      )
                    })}
                  </div>
                </div>
                <div className="mt-1 flex justify-between font-mono text-[7px] font-bold uppercase tracking-widest text-muted-foreground" aria-hidden="true">
                  <span>START</span>
                  <span>NOW</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
