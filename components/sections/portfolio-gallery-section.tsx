"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Component } from "@/components/ui/circular-gallery"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { getBehanceUrl } from "@/lib/static-data"

// Portfolio items showcasing design works - using higher resolution images
const portfolioItems = [
  {
    image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/00634e215516589.67cb14067e350.jpeg",
  },
  {
    image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/06a1c6198005031.664f4d2c07e1a.png",
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/1400/2b8ef1198005031.663a25afab140.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/1400/0300da198005031.663b38c0e793d.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/1400/bd3b4d174168173.649d2364da5e0.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/1400/8ca4ef174167957.649d222d7535e.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/1400/94f398149008519.62e286d4a6d9a.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/1400/41f9c5149008519.62dfe2d31023a.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/1400/138959140295881.623ef4a205c5d.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/1400/946118139026885.623bf32779298.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/1400/e22062188246697.66a9d29dc9560.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/1400/a79652134749859.61dbf42a779fb.jpg`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/1400/f1df08134749859.620251784767a.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/1400/60449a174168051.649d22bb84335.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/1400/0ef99e139027447.62482ffc0e5e7.png`,
  },
];

const PortfolioGallerySection = () => {
  const behanceUrl = useMemo(() => getBehanceUrl("#"), [])
  const [shouldRenderGallery, setShouldRenderGallery] = useState(false)
  const [useStaticGallery, setUseStaticGallery] = useState(false)
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const evaluate = () => {
      const prefersReducedMotion = reducedMotionQuery.matches
      setUseStaticGallery(prefersReducedMotion)
      if (prefersReducedMotion) {
        setShouldRenderGallery(true)
      }
    }

    evaluate()

    reducedMotionQuery.addEventListener("change", evaluate)

    return () => {
      reducedMotionQuery.removeEventListener("change", evaluate)
    }
  }, [])

  useEffect(() => {
    if (useStaticGallery || shouldRenderGallery) return
    if (typeof window === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRenderGallery(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" }
    )

    if (galleryRef.current) {
      observer.observe(galleryRef.current)
    }

    return () => observer.disconnect()
  }, [useStaticGallery, shouldRenderGallery])

  const fallbackItems = useStaticGallery ? portfolioItems.slice(0, 8) : portfolioItems
  return (
    <section
      id="portfolio-gallery"
      className="py-20 md:py-32 bg-background relative z-10"
    >
      <div className="container">
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-medium mb-2 animate-item">
            Design Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-item">
            <span className="text-gradient">Featured Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-item">
            Explore my creative journey through various design projects, from web development
            to cybersecurity solutions. Each piece represents innovation and attention to detail.
          </p>
        </div>

        <div className="flex w-full h-[80vh] justify-center items-center">
          <div
            ref={galleryRef}
            className="w-full max-w-screen-xl mx-auto h-full overflow-hidden relative border-none shadow-none"
          >
            {!shouldRenderGallery && (
              <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/10">
                <p className="text-muted-foreground text-sm md:text-base">
                  Preparing interactive gallery…
                </p>
              </div>
            )}

            {shouldRenderGallery && (
              useStaticGallery ? (
                <div className="flex h-full w-full gap-4 overflow-x-auto overflow-y-hidden p-4 snap-x snap-mandatory scrollbar-hide items-center">
                  {fallbackItems.map((item, index) => (
                    <div
                      key={`${item.image}-${index}`}
                      className="relative flex-shrink-0 w-[85vw] md:w-[45vw] aspect-[3/4] overflow-hidden rounded-2xl border border-border/50 bg-background shadow-lg snap-center transform transition-transform duration-300"
                    >
                      <img
                        src={item.image}
                        alt={`Portfolio item ${index + 1}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <span className="text-white font-medium text-lg">Design Project {index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Component
                  items={portfolioItems}
                  bend={1.5}
                  textColor="#ffffff"
                  borderRadius={0.08}
                  font="bold 28px DM Sans"
                />
              )

            )}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href={behanceUrl}>
            <Button
              size="lg"
              className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              View All Designs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioGallerySection;
