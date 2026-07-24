"use client"

import { useMemo, useRef, useState, type UIEvent } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, ArrowUpRight, X, Maximize2 } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { getBehanceUrl } from "@/lib/static-data"
import featuredDesignsData from "@/public/data/featured-designs.json"

const portfolioItems = featuredDesignsData.featuredDesigns

export default function PortfolioGallerySection() {
  const behanceUrl = useMemo(() => getBehanceUrl("#"), [])
  const [selectedImage, setSelectedImage] = useState<{ title: string; image: string } | null>(null)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const galleryRef = useRef<HTMLDivElement>(null)

  const handleGalleryScroll = (event: UIEvent<HTMLDivElement>) => {
    const track = event.currentTarget.querySelector<HTMLElement>("[data-gallery-track]")
    if (!track) return

    const viewportCenter = event.currentTarget.scrollLeft + event.currentTarget.clientWidth / 2
    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    Array.from(track.children).forEach((child, index) => {
      const card = child as HTMLElement
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const distance = Math.abs(cardCenter - viewportCenter)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    setGalleryIndex(closestIndex)
  }

  const scrollToDesign = (index: number) => {
    const viewport = galleryRef.current
    const track = viewport?.querySelector<HTMLElement>("[data-gallery-track]")
    const card = track?.children[index] as HTMLElement | undefined
    if (!viewport || !card) return

    viewport.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - viewport.clientWidth / 2,
      behavior: "smooth",
    })
  }

  return (
    <section id="portfolio-gallery" className="relative bg-background py-20 md:py-36 border-t border-border">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        
        <div className="mb-14 border-b border-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              03 // CREATIVE ARCHIVE
            </div>
            <h2 className="font-display text-4xl font-black uppercase tracking-tight text-foreground sm:text-6xl md:text-7xl">
              FEATURED DESIGNS
            </h2>
          </div>

          <AnimatedButton
            href={behanceUrl}
            target="_blank"
            variant="outline"
            className="w-fit font-mono text-xs uppercase tracking-wider border-border hover:border-foreground"
          >
            FULL BEHANCE ARCHIVE <ArrowUpRight className="ml-2 h-4 w-4" />
          </AnimatedButton>
        </div>

        <div className="mb-4 flex items-center justify-between gap-4 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <span>
            <span className="md:hidden">SWIPE THE ARC</span>
            <span className="hidden md:inline">DRAG OR SCROLL THE ARC // CENTER CARD IS ACTIVE</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="mr-2 text-foreground">
              {String(galleryIndex + 1).padStart(2, "0")} / {String(portfolioItems.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => scrollToDesign(Math.max(0, galleryIndex - 1))}
              disabled={galleryIndex === 0}
              className="border border-border bg-card p-2 text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Previous design"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => scrollToDesign(Math.min(portfolioItems.length - 1, galleryIndex + 1))}
              disabled={galleryIndex === portfolioItems.length - 1}
              className="border border-border bg-card p-2 text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Next design"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Arc Gallery */}
      <div
        ref={galleryRef}
        onScroll={handleGalleryScroll}
        role="region"
        aria-label="Featured design gallery"
        tabIndex={0}
        className="relative z-10 snap-x snap-proximity overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          data-gallery-track
          className="relative z-10 flex h-[585px] w-max items-start gap-6 px-4 pt-3 sm:h-[580px] sm:gap-8 sm:px-6 lg:h-[450px] lg:gap-10 lg:px-8 xl:px-12"
        >
          {portfolioItems.map((item, index) => {
            const numStr = String(index + 1).padStart(2, "0")
            const relativeIndex = index - galleryIndex
            const arcDistance = Math.min(Math.abs(relativeIndex), 4)
            const isActive = index === galleryIndex
            const rotation = Math.max(-4, Math.min(4, relativeIndex)) * 2.5
            const translateY = arcDistance * 15
            const scale = 1 - arcDistance * 0.015

            return (
              <div
                key={`${item.title}-${index}`}
                className="relative shrink-0 snap-center will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{
                  transform: `translate3d(0, ${translateY}px, 0) rotate(${rotation}deg) scale(${scale})`,
                  zIndex: isActive ? portfolioItems.length + 10 : portfolioItems.length - arcDistance,
                }}
              >
                <motion.article
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                  className={`group relative w-[82vw] max-w-[340px] overflow-hidden border-2 bg-card transition-all duration-500 hover:-translate-y-4 hover:scale-[1.035] hover:border-foreground hover:shadow-2xl motion-reduce:transform-none sm:w-[340px] lg:w-[260px] ${
                    isActive ? "border-foreground shadow-2xl" : "border-border shadow-md"
                  }`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted border-b-2 border-border">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      priority={index < 2}
                      sizes="(min-width: 1024px) 260px, 340px"
                      className={`object-cover contrast-125 transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 group-hover:saturate-100 group-hover:contrast-100 ${
                        isActive ? "grayscale-0" : "grayscale"
                      }`}
                    />

                    <div className="absolute top-3 left-3 bg-foreground text-background font-mono text-xs font-bold px-3 py-1 uppercase tracking-widest border border-foreground">
                      {numStr}
                    </div>

                    <button
                      onClick={() => setSelectedImage(item)}
                      className="absolute bottom-3 right-3 border border-border bg-background/90 p-2.5 text-foreground backdrop-blur-md transition-all duration-300 hover:bg-foreground hover:text-background lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:focus-visible:translate-y-0 lg:focus-visible:opacity-100"
                      aria-label={`Expand ${item.title}`}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 flex items-center justify-between font-mono text-xs">
                    <h3 className="font-bold uppercase tracking-tight text-foreground truncate pr-2">
                      {item.title}
                    </h3>
                    <a
                      href={behanceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground shrink-0 inline-flex items-center gap-1 uppercase font-semibold"
                    >
                      BEHANCE <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </motion.article>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl border-2 border-foreground bg-card p-4 md:p-6 shadow-2xl cursor-default"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2.5 border-2 border-border bg-background text-foreground hover:bg-foreground hover:text-background transition-colors"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3 font-bold">
                CREATIVE ARCHIVE // {selectedImage.title}
              </div>

              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full border-2 border-border overflow-hidden bg-black">
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
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
