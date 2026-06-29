"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { SectionHeader } from "@/components/ui/section-header"
import { cn } from "@/lib/utils"
import { getBehanceUrl } from "@/lib/static-data"
import featuredDesignsData from "@/public/data/featured-designs.json"

const portfolioItems = featuredDesignsData.featuredDesigns

export default function PortfolioGallerySection() {
  const behanceUrl = useMemo(() => getBehanceUrl("#"), [])
  const [activeIndex, setActiveIndex] = useState(0)
  const activeItem = portfolioItems[activeIndex]

  return (
    <section id="portfolio-gallery" className="relative overflow-hidden bg-background py-20 md:py-28">
      <div className="absolute inset-0 section-gradient-blend bg-[linear-gradient(135deg,hsl(var(--secondary)/0.7),transparent_34%,hsl(var(--primary)/0.08)_100%)]" />

      <div className="container relative z-10">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Creative Archive"
            title="Featured"
            highlight="Designs"
            description="Selected visual systems, interface explorations, campaigns, and identity work."
            align="responsive"
          />

          <AnimatedButton href={behanceUrl} variant="outline" target="_blank" className="shrink-0 md:self-end">
            Explore Behance <ArrowRight className="ml-2 h-4 w-4" />
          </AnimatedButton>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.68fr)_minmax(340px,0.32fr)]">
          <Link
            href={behanceUrl}
            target="_blank"
            className="group relative min-h-[520px] overflow-hidden rounded-lg border border-border/80 bg-card shadow-sm md:min-h-[660px]"
            aria-label={`View ${activeItem.title} on Behance`}
          >
            <Image
              key={activeItem.image}
              src={activeItem.image}
              alt={activeItem.title}
              fill
              sizes="(min-width: 1024px) 68vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 text-white">
              <span className="rounded-md border border-white/15 bg-black/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-sm">
                Featured Design
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-md border border-white/15 bg-black/25 backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-black">
                <ExternalLink className="h-4 w-4" />
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-white/65">
                {String(activeIndex + 1).padStart(2, "0")} / {String(portfolioItems.length).padStart(2, "0")}
              </p>
              <h3 className="font-display text-4xl font-bold leading-none md:text-6xl">{activeItem.title}</h3>
            </div>
          </Link>

          <div className="rounded-lg border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur-sm md:p-5">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-border/70 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Archive Index</p>
                <h3 className="mt-2 font-display text-2xl font-bold">Browse the set</h3>
              </div>
              <span className="font-display text-4xl font-bold text-muted-foreground/25">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {portfolioItems.map((item, index) => {
                const isActive = index === activeIndex

                return (
                  <button
                    key={`${item.title}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "group/tile relative min-h-[132px] overflow-hidden rounded-md border bg-muted text-left transition-all duration-300",
                      isActive
                        ? "border-primary shadow-md ring-2 ring-primary/15"
                        : "border-border/70 hover:border-primary/40 hover:shadow-sm"
                    )}
                    aria-label={`Show ${item.title}`}
                    aria-pressed={isActive}
                  >
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 170px, 50vw"
                      className={cn(
                        "object-cover transition-transform duration-500 group-hover/tile:scale-105",
                        !isActive && "opacity-85"
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="block truncate text-sm font-semibold">{item.title}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
