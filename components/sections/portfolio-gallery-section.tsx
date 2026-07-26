"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2, X } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { getBehanceUrl } from "@/lib/static-data"
import featuredDesignsData from "@/public/data/featured-designs.json"

const portfolioItems = featuredDesignsData.featuredDesigns

export default function PortfolioGallerySection() {
  const behanceUrl = useMemo(() => getBehanceUrl("#"), [])
  const [selectedImage, setSelectedImage] = useState<{ title: string; image: string } | null>(null)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const railRef = useRef<HTMLDivElement>(null)
  const activeItem = portfolioItems[galleryIndex]

  useEffect(() => {
    if (!selectedImage) return

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null)
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedImage])

  useEffect(() => {
    const rail = railRef.current
    const card = rail?.querySelector<HTMLElement>(`[data-design-index="${galleryIndex}"]`)
    if (!rail || !card) return

    rail.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - rail.clientWidth / 2,
      behavior: "smooth",
    })
  }, [galleryIndex])

  const selectDesign = (index: number) => {
    const boundedIndex = Math.max(0, Math.min(portfolioItems.length - 1, index))
    setGalleryIndex(boundedIndex)
  }

  const handleSectionKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      selectDesign(galleryIndex - 1)
    }
    if (event.key === "ArrowRight") {
      event.preventDefault()
      selectDesign(galleryIndex + 1)
    }
  }

  return (
    <section
      id="portfolio-gallery"
      className="section-shell border-t border-border"
      onKeyDown={handleSectionKeyDown}
    >
      <div className="section-container">
        <div className="section-heading-row">
          <div>
            <div className="section-kicker">08 // CREATIVE ARCHIVE</div>
            <h2 className="section-title">FEATURED DESIGNS</h2>
          </div>

          <div className="flex max-w-md flex-col items-start gap-5 md:items-end">
            <p className="font-sans text-sm font-light leading-relaxed text-muted-foreground md:text-right">
              A curated selection of identity, interface, and visual-system work—built to communicate clearly and leave a distinct impression.
            </p>
            <AnimatedButton
              href={behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              className="w-fit border-border font-mono text-xs uppercase tracking-wider hover:border-foreground"
            >
              VIEW BEHANCE <ArrowUpRight className="ml-2 h-4 w-4" />
            </AnimatedButton>
          </div>
        </div>

        <div className="grid overflow-hidden border border-border/80 bg-card/60 lg:grid-cols-[minmax(0,1.75fr)_minmax(300px,0.75fr)]">
          <div className="relative min-h-[330px] overflow-hidden border-b border-border bg-muted sm:min-h-[500px] lg:min-h-[620px] lg:border-b-0 lg:border-r">
            <Image
              key={activeItem.image}
              src={activeItem.image}
              alt={activeItem.title}
              fill
              priority={galleryIndex === 0}
              sizes="(min-width: 1280px) 820px, (min-width: 1024px) 65vw, 100vw"
              className="object-cover"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
            <div className="absolute left-4 top-4 border border-white/30 bg-black/65 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md sm:left-6 sm:top-6">
              SELECTED / {String(galleryIndex + 1).padStart(2, "0")}
            </div>
            <button
              type="button"
              onClick={() => setSelectedImage(activeItem)}
              className="absolute bottom-4 right-4 inline-flex min-h-11 items-center gap-2 border border-white/40 bg-black/65 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md transition-colors hover:border-white hover:bg-white hover:text-black sm:bottom-6 sm:right-6"
              aria-label={`View ${activeItem.title} full screen`}
            >
              <Maximize2 className="h-4 w-4" /> FULL VIEW
            </button>
          </div>

          <div className="relative flex min-h-[350px] flex-col justify-between p-6 sm:p-8 lg:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-3 -top-8 select-none font-display text-[10rem] font-black leading-none text-foreground/[0.035] sm:text-[13rem]"
            >
              {String(galleryIndex + 1).padStart(2, "0")}
            </div>

            <div className="relative z-10">
              <div className="mb-7 flex items-center justify-between border-b border-border pb-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                <span>DESIGN STUDY</span>
                <span>{String(galleryIndex + 1).padStart(2, "0")} / {String(portfolioItems.length).padStart(2, "0")}</span>
              </div>
              <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                {activeItem.discipline}
              </p>
              <h3 className="max-w-sm font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {activeItem.title}
              </h3>
              <p className="mt-6 max-w-sm text-sm font-light leading-relaxed text-muted-foreground">
                {activeItem.description}
              </p>
            </div>

            <div className="relative z-10 mt-10">
              <div className="mb-5 h-px overflow-hidden bg-border">
                <div
                  className="h-full origin-left bg-foreground"
                  style={{ width: `${((galleryIndex + 1) / portfolioItems.length) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  USE ARROWS TO EXPLORE
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => selectDesign(galleryIndex - 1)}
                    disabled={galleryIndex === 0}
                    className="inline-flex h-11 w-11 items-center justify-center border border-border bg-background text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Previous design"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => selectDesign(galleryIndex + 1)}
                    disabled={galleryIndex === portfolioItems.length - 1}
                    className="inline-flex h-11 w-11 items-center justify-center border border-border bg-background text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Next design"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <span>COMPLETE ARCHIVE</span>
          <span className="sm:hidden">SWIPE TO BROWSE</span>
          <span className="hidden sm:inline">SELECT A STUDY // SWIPE OR SCROLL</span>
        </div>

        <div
          ref={railRef}
          role="tablist"
          aria-label="Choose a featured design"
          className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {portfolioItems.map((item, index) => {
            const isActive = index === galleryIndex

            return (
              <button
                key={`${item.title}-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show ${item.title}`}
                data-design-index={index}
                onClick={() => selectDesign(index)}
                className={`group relative w-[44vw] max-w-[180px] shrink-0 snap-start overflow-hidden border text-left transition-all duration-300 sm:w-[160px] ${
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-foreground hover:border-foreground/60"
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="180px"
                    className={`object-cover transition duration-500 group-hover:scale-105 ${
                      isActive ? "grayscale-0" : "grayscale group-hover:grayscale-0"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-current/20 px-3 py-2.5">
                  <span className="truncate font-sans text-xs font-semibold">{item.title}</span>
                  <span className="font-mono text-[9px] font-bold">{String(index + 1).padStart(2, "0")}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedImage.title} preview`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[10000] flex cursor-zoom-out items-center justify-center bg-background/95 p-3 backdrop-blur-md sm:p-6"
          >
            <motion.div
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-6xl cursor-default border border-foreground bg-card p-3 shadow-2xl sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <div className="truncate font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  CREATIVE ARCHIVE // {selectedImage.title}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-border bg-background text-foreground transition-colors hover:bg-foreground hover:text-background"
                  aria-label="Close preview"
                  autoFocus
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative h-[70svh] w-full overflow-hidden border border-border bg-black">
                <Image
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
