"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { getBehanceUrl } from "@/lib/static-data"
import { AnimatedButton } from "@/components/ui/animated-button"

// Portfolio items showcasing design works
const portfolioItems = [
  { image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/00634e215516589.67cb14067e350.jpeg" },
  { image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/06a1c6198005031.664f4d2c07e1a.png" },
  { image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/2b8ef1198005031.663a25afab140.png" },
  { image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/0300da198005031.663b38c0e793d.png" },
  { image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/bd3b4d174168173.649d2364da5e0.png" },
  { image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/8ca4ef174167957.649d222d7535e.png" },
  { image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/94f398149008519.62e286d4a6d9a.png" },
  { image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/41f9c5149008519.62dfe2d31023a.png" },
  { image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/138959140295881.623ef4a205c5d.png" },
  { image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/946118139026885.623bf32779298.png" },
  { image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/e22062188246697.66a9d29dc9560.png" },
  { image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/a79652134749859.61dbf42a779fb.jpg" },
  { image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/f1df08134749859.620251784767a.png" },
  { image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/60449a174168051.649d22bb84335.png" },
  { image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/0ef99e139027447.62482ffc0e5e7.png" },
]

export default function PortfolioGallerySection() {
  const behanceUrl = useMemo(() => getBehanceUrl("#"), [])

  return (
    <section id="portfolio-gallery" className="relative py-24 md:py-32 bg-background overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(1100px_circle_at_20%_15%,hsl(var(--accent)/0.08),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-15 pointer-events-none" />

      <div className="container relative z-10 w-full mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full bg-primary/5 border-primary/20 text-primary text-xs font-semibold tracking-[0.2em] uppercase">
            Design Portfolio
          </Badge>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
                Featured <span className="text-gradient">Designs</span>
              </h2>
            </div>
            <AnimatedButton href={behanceUrl} variant="outline" className="shrink-0 bg-background/50 backdrop-blur-sm border-border">
              View Behance <ExternalLink className="ml-2 w-4 h-4" />
            </AnimatedButton>
          </div>
        </motion.div>
      </div>

      {/* Native CSS Horizontal Scroll Container */}
      <div className="relative z-10 w-full pb-12">
        <div className="flex gap-4 md:gap-8 px-4 md:px-8 lg:px-12 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 items-center" style={{ scrollBehavior: 'smooth' }}>
          {portfolioItems.map((item, index) => {
            // Alternate sizes for editorial feel
            const isTall = index % 3 === 0
            
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`relative shrink-0 group rounded-2xl md:rounded-3xl overflow-hidden border border-border bg-muted/20 shadow-xl snap-center transition-transform duration-500 hover:-translate-y-2
                  ${isTall ? 'w-[75vw] md:w-[45vw] lg:w-[30vw] aspect-[3/4]' : 'w-[85vw] md:w-[55vw] lg:w-[40vw] aspect-video'}
                `}
              >
                <img
                  src={item.image}
                  alt={`Design project ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading={index < 3 ? "eager" : "lazy"}
                  decoding="async"
                />
                
                {/* Sleek Glassmorphic Overlay on Hover */}
                <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                  <Link 
                    href={behanceUrl} 
                    target="_blank"
                    className="px-6 py-3 rounded-full bg-background/90 backdrop-blur-md border border-foreground/10 text-foreground font-semibold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl hover:bg-background hover:scale-105"
                  >
                    View Project <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
