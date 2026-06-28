"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { ArrowLeft, ArrowRight, ExternalLink, Pause, Play } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { SectionHeader } from "@/components/ui/section-header"
import { cn } from "@/lib/utils"
import { getBehanceUrl } from "@/lib/static-data"
import featuredDesignsData from "@/public/data/featured-designs.json"

const portfolioItems = featuredDesignsData.featuredDesigns
const AUTOPLAY_DELAY = 3800
const VISIBLE_CARDS = 5

export default function PortfolioGallerySection() {
  const behanceUrl = useMemo(() => getBehanceUrl("#"), [])
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPlaying, setIsPlaying] = useState(true)

  const goToSlide = useCallback((index: number, nextDirection = 1) => {
    setDirection(nextDirection)
    setActiveIndex((index + portfolioItems.length) % portfolioItems.length)
  }, [])

  const goNext = useCallback(() => {
    goToSlide(activeIndex + 1, 1)
  }, [activeIndex, goToSlide])

  const goPrevious = useCallback(() => {
    goToSlide(activeIndex - 1, -1)
  }, [activeIndex, goToSlide])

  useEffect(() => {
    if (!isPlaying) return

    const timer = window.setInterval(() => {
      setDirection(1)
      setActiveIndex((current) => (current + 1) % portfolioItems.length)
    }, AUTOPLAY_DELAY)

    return () => window.clearInterval(timer)
  }, [isPlaying])

  const deckItems = Array.from({ length: VISIBLE_CARDS }, (_, offset) => {
    const itemIndex = (activeIndex + offset) % portfolioItems.length
    return {
      item: portfolioItems[itemIndex],
      itemIndex,
      offset,
    }
  }).reverse()

  return (
    <section id="portfolio-gallery" className="relative overflow-hidden bg-background py-20 md:py-28">
      <div className="absolute inset-0 section-gradient-blend bg-[radial-gradient(920px_circle_at_14%_18%,hsl(var(--accent)/0.08),transparent_62%),radial-gradient(780px_circle_at_88%_72%,hsl(var(--primary)/0.08),transparent_62%)]" />
      <div className="absolute inset-0 bg-noise opacity-15 pointer-events-none" />

      <div className="container relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between"
        >
          <SectionHeader eyebrow="Creative Archive" title="Featured" highlight="Designs" align="responsive" />

          <AnimatedButton href={behanceUrl} variant="outline" target="_blank" className="hidden shrink-0 bg-background/50 backdrop-blur-sm md:flex">
            Explore Behance <ArrowRight className="ml-2 h-4 w-4" />
          </AnimatedButton>
        </motion.div>

        <div className="grid items-center gap-8 lg:grid-cols-[0.68fr_0.32fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="relative mx-auto h-[500px] w-full max-w-5xl md:h-[600px]"
          >
            <div className="absolute inset-x-6 bottom-4 top-10 rounded-[2rem] bg-primary/10 blur-3xl" />

            {deckItems.map(({ item, itemIndex, offset }) => (
              <DeckCard
                key={`${item.title}-${itemIndex}`}
                item={item}
                index={itemIndex}
                offset={offset}
                activeIndex={activeIndex}
                total={portfolioItems.length}
                behanceUrl={behanceUrl}
                direction={direction}
                onNext={() => {
                  setIsPlaying(false)
                  goNext()
                }}
                onPrevious={() => {
                  setIsPlaying(false)
                  goPrevious()
                }}
              />
            ))}

            <div className="absolute bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-border/70 bg-background/80 p-2 shadow-sm backdrop-blur">
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false)
                  goPrevious()
                }}
                className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Previous design"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying((current) => !current)}
                className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground transition hover:bg-primary/90"
                aria-label={isPlaying ? "Pause deck autoplay" : "Play deck autoplay"}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false)
                  goNext()
                }}
                className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Next design"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="rounded-lg border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur lg:self-center"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Swipe Deck</p>
                <h3 className="mt-2 text-2xl font-bold">Drag the front card</h3>
              </div>
              <span className="font-display text-4xl font-bold text-muted-foreground/25">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
            </div>

            <div
              className="scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent max-h-[340px] space-y-2 overflow-y-scroll overscroll-contain pr-2 touch-pan-y md:max-h-[380px] lg:max-h-[420px]"
              onWheel={(event) => {
                const target = event.currentTarget
                const canScrollUp = target.scrollTop > 0
                const canScrollDown = target.scrollTop + target.clientHeight < target.scrollHeight

                if ((event.deltaY < 0 && canScrollUp) || (event.deltaY > 0 && canScrollDown)) {
                  event.preventDefault()
                  event.stopPropagation()
                  target.scrollTop += event.deltaY
                }
              }}
              onPointerDown={(event) => event.stopPropagation()}
            >
              {portfolioItems.map((item, index) => {
                const isActive = index === activeIndex

                return (
                  <button
                    key={`${item.title}-nav-${index}`}
                    type="button"
                    onClick={() => {
                      setIsPlaying(false)
                      goToSlide(index, index > activeIndex ? 1 : -1)
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md border p-2 text-left transition",
                      isActive ? "border-primary bg-primary/10" : "border-transparent hover:border-border hover:bg-secondary/40"
                    )}
                  >
                    <span className="relative h-12 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                      <img src={item.image} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-foreground">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")} / {String(portfolioItems.length).padStart(2, "0")}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function DeckCard({
  item,
  index,
  offset,
  activeIndex,
  total,
  behanceUrl,
  direction,
  onNext,
  onPrevious,
}: {
  item: { image: string; title: string }
  index: number
  offset: number
  activeIndex: number
  total: number
  behanceUrl: string
  direction: number
  onNext: () => void
  onPrevious: () => void
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-260, 0, 260], [-14, 0, 14])
  const isFront = offset === 0
  const depth = offset

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipePower = Math.abs(info.offset.x) + Math.abs(info.velocity.x) * 0.18

    if (swipePower < 120) return

    if (info.offset.x < 0) {
      onNext()
    } else {
      onPrevious()
    }
  }

  return (
    <motion.article
      className={cn(
        "absolute inset-x-0 top-1/2 mx-auto h-[410px] w-[min(92vw,740px)] origin-center overflow-hidden rounded-[1.4rem] border border-white/10 bg-card shadow-2xl md:h-[500px]",
        isFront ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      )}
      style={{ x: isFront ? x : 0, rotate: isFront ? rotate : 0, zIndex: 20 - depth }}
      initial={{
        y: "-50%",
        opacity: 0,
        scale: 0.94,
        rotate: direction > 0 ? 10 : -10,
      }}
      animate={{
        y: `calc(-50% + ${depth * 22}px)`,
        opacity: 1 - depth * 0.12,
        scale: 1 - depth * 0.055,
        rotate: isFront ? 0 : depth % 2 === 0 ? depth * -2.2 : depth * 2.2,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.85 }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.28}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
    >
      <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading={offset <= 1 ? "eager" : "lazy"} decoding="async" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 text-white">
        <span className="rounded-md border border-white/15 bg-black/25 px-3 py-1.5 text-xs font-semibold backdrop-blur">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <Link
          href={behanceUrl}
          target="_blank"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-black/25 backdrop-blur transition hover:bg-white hover:text-black"
          aria-label={`View ${item.title} on Behance`}
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-white/65">Design Concept</p>
        <h3 className="font-display text-3xl font-bold tracking-tight md:text-5xl">{item.title}</h3>
      </div>
    </motion.article>
  )
}
