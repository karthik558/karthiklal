"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { getBehanceUrl } from "@/lib/static-data"
import { AnimatedButton } from "@/components/ui/animated-button"
import featuredDesignsData from "@/public/data/featured-designs.json"

// Portfolio items showcasing design works from JSON
const portfolioItems = featuredDesignsData.featuredDesigns


export default function PortfolioGallerySection() {
  const behanceUrl = useMemo(() => getBehanceUrl("#"), [])
  const [showAll, setShowAll] = useState(false)

  // Number of items to show by default (7 perfectly fills the first Bento Box pattern block)
  const DEFAULT_COUNT = 7
  const visibleItems = showAll ? portfolioItems : portfolioItems.slice(0, DEFAULT_COUNT)

  return (
    <section id="portfolio-gallery" className="relative py-24 md:py-32 bg-background overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(1100px_circle_at_20%_15%,hsl(var(--accent)/0.05),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />

      <div className="container relative z-10 w-full mb-12 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div className="max-w-2xl mx-auto md:mx-0">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
              <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-primary/5 border-primary/20 text-primary text-xs font-semibold tracking-[0.2em] uppercase">
                Creative Archive
              </Badge>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
              Featured <span className="text-gradient">Designs</span>
            </h2>
          </div>
          
          <AnimatedButton href={behanceUrl} variant="outline" target="_blank" className="shrink-0 mx-auto md:mx-0 bg-background/50 backdrop-blur-sm border-border group hidden md:flex">
            Explore Behance <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </AnimatedButton>
        </motion.div>
      </div>

      {/* Spectacular Bento Box Grid Layout */}
      <div className="container relative z-10 w-full pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-4 md:gap-5 grid-flow-row-dense">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, index) => {
              // Pattern for a perfectly packed 4-column Bento Grid
              const i = index % 7
              let bentoClass = 'md:col-span-1 md:row-span-1'
              if (i === 0) bentoClass = 'md:col-span-2 md:row-span-2'
              if (i === 2) bentoClass = 'md:col-span-1 md:row-span-2'
              if (i === 4) bentoClass = 'md:col-span-2 md:row-span-1'
              
              return (
                <motion.div 
                  key={`portfolio-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`relative group rounded-2xl overflow-hidden border border-border bg-muted/20 shadow-lg hover:shadow-2xl transition-all duration-500 w-full h-full ${bentoClass}`}
                >
                  {/* Standard img tag to avoid Next.js domain config errors */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading={index < 4 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  
                  {/* Stunning Dark Gradient Reveal Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <div className="flex items-end justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-bold tracking-widest uppercase text-primary/80">
                          Design Concept
                        </p>
                        <h3 className="text-xl md:text-2xl font-bold text-white line-clamp-1">
                          {item.title}
                        </h3>
                      </div>
                      
                      <Link 
                        href={behanceUrl} 
                        target="_blank"
                        className="w-12 h-12 shrink-0 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 hover:bg-primary hover:border-primary transition-all duration-300 shadow-xl"
                        aria-label={`View ${item.title} on Behance`}
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* View More / Less Toggle Button */}
        {portfolioItems.length > DEFAULT_COUNT && (
          <motion.div 
            layout 
            className="mt-16 flex justify-center w-full"
          >
            <AnimatedButton 
              onClick={() => setShowAll(!showAll)}
              variant="outline" 
              className="group cursor-pointer bg-background/50 backdrop-blur-sm border-border"
            >
              {showAll ? "Show Less" : "View More Designs"} 
              <ArrowRight className={`ml-2 w-4 h-4 transition-transform duration-300 ${showAll ? '-rotate-90' : 'rotate-90 group-hover:translate-y-1'}`} />
            </AnimatedButton>
          </motion.div>
        )}
      </div>
    </section>
  )
}
