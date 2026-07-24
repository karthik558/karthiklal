"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, X, Maximize2 } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { getBehanceUrl } from "@/lib/static-data"
import featuredDesignsData from "@/public/data/featured-designs.json"

const portfolioItems = featuredDesignsData.featuredDesigns.slice(0, 8)

export default function PortfolioGallerySection() {
  const behanceUrl = useMemo(() => getBehanceUrl("#"), [])
  const [selectedImage, setSelectedImage] = useState<{ title: string; image: string } | null>(null)

  return (
    <section id="portfolio-gallery" className="relative bg-background py-28 md:py-36 border-t border-border">
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
      </div>

      {/* Ticker Gallery Container */}
      <div className="relative z-10 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-6 px-4 md:px-6">
          {portfolioItems.map((item, index) => {
            const numStr = String(index + 1).padStart(2, "0")

            return (
              <motion.div
                key={`${item.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="group relative w-[290px] sm:w-[340px] md:w-[380px] border-2 border-border bg-card transition-all duration-300 hover:border-foreground">
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted border-b-2 border-border">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      priority={index < 2}
                      sizes="380px"
                      className="object-cover grayscale contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:saturate-100 group-hover:contrast-100"
                    />

                    <div className="absolute top-3 left-3 bg-foreground text-background font-mono text-xs font-bold px-3 py-1 uppercase tracking-widest border border-foreground">
                      {numStr}
                    </div>

                    <button
                      onClick={() => setSelectedImage(item)}
                      className="absolute bottom-3 right-3 p-2.5 bg-background/90 text-foreground hover:bg-foreground hover:text-background border border-border backdrop-blur-md transition-colors"
                      title="Expand Image"
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
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl border-2 border-foreground bg-card p-4 md:p-6"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 border border-border bg-background text-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                CREATIVE ARCHIVE // {selectedImage.title}
              </div>

              <div className="relative aspect-[4/3] w-full border-2 border-border overflow-hidden bg-muted">
                <Image
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  fill
                  className="object-contain bg-black"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
