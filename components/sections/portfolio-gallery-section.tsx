"use client"

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { SectionHeader } from "@/components/ui/section-header"
import { getBehanceUrl } from "@/lib/static-data"
import featuredDesignsData from "@/public/data/featured-designs.json"

const portfolioItems = featuredDesignsData.featuredDesigns.slice(0, 8)

export default function PortfolioGallerySection() {
  const behanceUrl = useMemo(() => getBehanceUrl("#"), [])

  return (
    <section id="portfolio-gallery" className="relative overflow-hidden bg-background py-20 md:py-28 lg:py-32">
      <div className="container relative z-10">
        <div className="mb-12 grid gap-8 lg:mb-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <SectionHeader eyebrow="Creative Archive" title="Featured" highlight="Designs" align="responsive" />
          <AnimatedButton href={behanceUrl} variant="outline" target="_blank" className="w-fit shrink-0">Full design archive <ArrowRight className="ml-2 h-4 w-4" /></AnimatedButton>
        </div>
      </div>

      <div className="relative z-10 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max snap-x snap-mandatory gap-5 px-[max(1rem,calc((100vw-1280px)/2))] md:gap-7">
          {portfolioItems.map((item, index) => (
            <motion.div key={`${item.title}-${index}`} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.06 }} className="snap-start">
              <Link href={behanceUrl} target="_blank" className="group block w-[280px] sm:w-[340px] lg:w-[390px]" aria-label={`View ${item.title} on Behance`}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-border/70 bg-muted shadow-[0_25px_65px_-50px_rgba(0,0,0,0.6)]">
                  <Image src={item.image} alt={item.title} fill priority={index < 2} sizes="390px" className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/5" />
                  <span className="absolute left-5 top-5 font-mono text-xs text-white/65">{String(index + 1).padStart(2, "0")}</span>
                  <span className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur-md transition group-hover:rotate-45 group-hover:bg-white group-hover:text-black"><ArrowUpRight className="h-4 w-4" /></span>
                  <h3 className="absolute inset-x-0 bottom-0 p-6 font-display text-3xl font-bold tracking-tight text-white">{item.title}</h3>
                </div>
                <div className="mt-4 flex items-center justify-between border-b border-border/70 pb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <span>Visual study</span><span>{String(index + 1).padStart(2, "0")} / {String(portfolioItems.length).padStart(2, "0")}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
