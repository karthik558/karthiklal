"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, ArrowUpRight, LayoutGrid, Rows, Star } from "lucide-react"
import testimonialsData from "@/public/data/testimonials.json"

interface Testimonial {
  id: number
  content: string
  name: string
  company: string
  position: string
  rating: number
  website?: string
}

const testimonials = testimonialsData.testimonials as Testimonial[]
const confettiPieces = [
  { left: "6%", color: "#f59e0b", drift: "-18px", rotation: "210deg", delay: "0ms" },
  { left: "14%", color: "#ec4899", drift: "14px", rotation: "-240deg", delay: "70ms" },
  { left: "24%", color: "#06b6d4", drift: "-10px", rotation: "280deg", delay: "120ms" },
  { left: "36%", color: "#84cc16", drift: "20px", rotation: "-190deg", delay: "30ms" },
  { left: "48%", color: "#8b5cf6", drift: "-16px", rotation: "250deg", delay: "150ms" },
  { left: "59%", color: "#f97316", drift: "18px", rotation: "-280deg", delay: "90ms" },
  { left: "70%", color: "#eab308", drift: "-20px", rotation: "220deg", delay: "20ms" },
  { left: "80%", color: "#14b8a6", drift: "12px", rotation: "-260deg", delay: "130ms" },
  { left: "90%", color: "#f43f5e", drift: "-14px", rotation: "200deg", delay: "55ms" },
  { left: "96%", color: "#3b82f6", drift: "8px", rotation: "-230deg", delay: "175ms" },
]

function ConfettiBurst() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 overflow-hidden" aria-hidden="true">
      {confettiPieces.map((piece, index) => (
        <span
          key={`${piece.left}-${piece.color}`}
          className={`testimonial-confetti absolute top-1 h-2.5 w-1.5 ${
            index % 3 === 0 ? "rounded-full" : index % 2 === 0 ? "rotate-45" : ""
          }`}
          style={{
            left: piece.left,
            backgroundColor: piece.color,
            "--confetti-drift": piece.drift,
            "--confetti-rotation": piece.rotation,
            "--confetti-delay": piece.delay,
          } as CSSProperties}
        />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel")
  const reduceMotion = useReducedMotion()
  const activeTestimonial = testimonials[activeIndex]

  useEffect(() => {
    if (isHovered || reduceMotion || viewMode === "grid" || testimonials.length < 2) return
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, 9000)
    return () => clearInterval(timer)
  }, [isHovered, reduceMotion, viewMode])

  if (!activeTestimonial) return null

  const showPrevious = () => setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
  const showNext = () => setActiveIndex((current) => (current + 1) % testimonials.length)

  return (
    <section id="testimonials" className="relative bg-background py-20 md:py-36 border-t border-border">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Section Header */}
        <div className="mb-14 border-b border-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              08 // CLIENT FEEDBACK & REVIEWS
            </div>
            <h2 className="font-display text-4xl font-black uppercase tracking-tight text-foreground sm:text-6xl md:text-7xl">
              TESTIMONIALS
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle Button */}
            <div className="flex items-center border-2 border-border bg-card p-1">
              <button
                onClick={() => setViewMode("carousel")}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                  viewMode === "carousel" ? "bg-foreground text-background font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Slideshow View"
              >
                <Rows className="w-3.5 h-3.5" /> SLIDES
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                  viewMode === "grid" ? "bg-foreground text-background font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
                title="All Reviews Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" /> ALL ({testimonials.length})
              </button>
            </div>

            {viewMode === "carousel" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={showPrevious}
                  className="p-3 border-2 border-border bg-card text-foreground hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
                  aria-label="Previous Testimonial"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={showNext}
                  className="p-3 border-2 border-border bg-card text-foreground hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
                  aria-label="Next Testimonial"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {viewMode === "carousel" ? (
          /* Testimonial Carousel Box */
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative overflow-hidden border-2 border-foreground bg-card p-8 shadow-2xl transition-all duration-500 hover:-translate-y-1 motion-reduce:transform-none md:p-14"
          >
            <ConfettiBurst />
            <div className="flex items-center justify-between border-b border-border pb-6 mb-8 font-mono text-xs uppercase relative z-10">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: activeTestimonial.rating || 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-foreground text-foreground transition-all duration-300 group-hover:scale-110 group-hover:fill-amber-400 group-hover:text-amber-500 group-hover:drop-shadow-[0_0_6px_rgba(245,158,11,0.65)] motion-reduce:transform-none"
                    style={{ transitionDelay: `${i * 45}ms` }}
                  />
                ))}
              </div>
              <span className="text-muted-foreground font-bold">
                FEEDBACK [{String(activeIndex + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}]
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="relative z-10"
              >
                <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase leading-snug text-foreground mb-10">
                  &ldquo;{activeTestimonial.content}&rdquo;
                </blockquote>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-border font-mono text-xs">
                  <div>
                    <div className="font-bold text-sm text-foreground uppercase">
                      {activeTestimonial.name}
                    </div>
                    <div className="text-muted-foreground uppercase">
                      {activeTestimonial.position} — {activeTestimonial.company}
                    </div>
                  </div>

                  {activeTestimonial.website && (
                    <a
                      href={activeTestimonial.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-foreground hover:underline uppercase font-bold"
                    >
                      VISIT WEBSITE <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          /* All Testimonials Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group relative flex flex-col justify-between overflow-hidden border-2 border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-foreground hover:shadow-xl motion-reduce:transform-none md:p-8"
              >
                <ConfettiBurst />
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-4 mb-4 font-mono text-xs uppercase">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-foreground text-foreground transition-all duration-300 group-hover:scale-110 group-hover:fill-amber-400 group-hover:text-amber-500 group-hover:drop-shadow-[0_0_5px_rgba(245,158,11,0.6)] motion-reduce:transform-none"
                          style={{ transitionDelay: `${i * 45}ms` }}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground font-bold">#{String(idx + 1).padStart(2, "0")}</span>
                  </div>

                  <p className="font-sans text-sm md:text-base leading-relaxed text-foreground font-normal mb-6">
                    &ldquo;{item.content}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between font-mono text-xs">
                  <div>
                    <div className="font-bold text-foreground uppercase">{item.name}</div>
                    <div className="text-muted-foreground text-[11px] uppercase">{item.position} @ {item.company}</div>
                  </div>
                  {item.website && (
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:underline font-bold"
                      title={`Visit ${item.company}`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
