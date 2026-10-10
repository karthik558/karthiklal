"use client"

import React, { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import type { Story } from "@/components/stories/story-reader"
import storiesData from "@/public/data/stories.json"

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toUpperCase()

export default function StoriesSection() {
  // Fetch only genuine published stories
  const publishedStories = useMemo(() => {
    const all = (storiesData.stories || []) as Story[]
    return all.filter((s) => s.published !== false)
  }, [])

  const featuredStory = useMemo(() => {
    return publishedStories.find((s) => s.featured) || publishedStories[0] || null
  }, [publishedStories])

  const otherStories = useMemo(() => {
    if (!featuredStory) return []
    return publishedStories.filter((s) => s.id !== featuredStory.id)
  }, [publishedStories, featuredStory])

  if (!featuredStory) {
    return null
  }

  return (
    <section id="stories" className="section-shell border-t-2 border-border">
      <div className="section-container">
        
        {/* Section Header */}
        <div className="section-heading-row">
          <div>
            <div className="mb-3">
              <span className="paper-stamp">
                10 // LITERARY WORKS
              </span>
            </div>
            <h2 className="section-title">
              FEATURED STORIES
            </h2>
          </div>

          <div className="flex items-center">
            <AnimatedButton
              href="/stories"
              variant="outline"
              className="w-fit border-border font-mono text-xs uppercase tracking-wider hover:border-foreground"
            >
              VIEW ALL STORIES <ArrowUpRight className="ml-2 h-4 w-4" />
            </AnimatedButton>
          </div>
        </div>

        {/* Featured Story Card - Direct Link to unique story page /stories/[id] */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="paper-sheet-stacked group border-2 border-border/80 hover:border-foreground/80 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 items-stretch"
        >
          <Link 
            href={`/stories/${featuredStory.id}`}
            className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-muted border-b-2 lg:border-b-0 lg:border-r-2 border-border/80 cursor-pointer min-h-[300px] lg:min-h-[420px] block"
          >
            <Image
              src={featuredStory.coverImage}
              alt={featuredStory.title}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-foreground text-background font-mono text-xs font-bold px-3 py-1 uppercase tracking-widest border border-foreground shadow-sm">
              [FOLIO 01]
            </div>
          </Link>

          <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="paper-tag">{featuredStory.category}</span>
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{formatDate(featuredStory.date)}</span>
              </div>

              <Link href={`/stories/${featuredStory.id}`} className="block">
                <h3 className="font-display text-3xl sm:text-4xl font-black uppercase text-foreground group-hover:underline underline-offset-4 mb-2 cursor-pointer">
                  {featuredStory.title}
                </h3>
              </Link>

              {featuredStory.englishTitle && (
                <div className="font-mono text-xs text-muted-foreground font-bold uppercase tracking-wider mb-4">
                  {featuredStory.englishTitle}
                </div>
              )}
              
              {/* Pull Quote */}
              <blockquote className="paper-ruled-bg border-l-4 border-foreground pl-4 py-2 font-sans italic text-sm sm:text-base text-foreground/90 leading-relaxed mb-4 bg-muted/20">
                &ldquo;{featuredStory.subtitle || featuredStory.pages?.[0]?.highlightQuote || "ചില സ്നേഹങ്ങൾ നഷ്ടപ്പെട്ടശേഷമാണ് അവയുടെ വില നമ്മൾ മനസ്സിലാക്കുന്നത്."}&rdquo;
              </blockquote>

              <p className="font-sans text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                {featuredStory.excerpt}
              </p>
            </div>

            <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs font-bold uppercase">
              <span className="text-muted-foreground">
                READ TIME: {featuredStory.readTime.toUpperCase()} • {featuredStory.totalPages} PAGES
              </span>

              {/* Direct link to story page */}
              <Link
                href={`/stories/${featuredStory.id}`}
                className="paper-button inline-flex h-11 items-center gap-2 border-2 border-foreground bg-foreground px-6 font-mono text-xs font-bold uppercase tracking-wider text-background transition-colors hover:bg-background hover:text-foreground cursor-pointer shadow-sm"
              >
                READ STORY <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.article>

        {/* Other Genuine Stories Grid (if additional published stories exist) */}
        {otherStories.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherStories.map((story, index) => (
              <motion.article
                key={story.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="paper-sheet paper-folded-corner group relative flex flex-col justify-between border-2 border-border/80 bg-card transition-all duration-300 hover:border-foreground/80 hover:shadow-xl overflow-hidden"
              >
                {/* Background Giant Stroke Number Watermark */}
                <div className="absolute right-2 -bottom-2 pointer-events-none select-none overflow-hidden opacity-[0.06] dark:opacity-[0.1] z-0 transition-opacity duration-300 group-hover:opacity-20">
                  <span
                    className="font-display text-7xl font-black uppercase tracking-tighter text-transparent leading-none block"
                    style={{
                      WebkitTextStroke: "2.5px hsl(var(--foreground))",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {String(index + 2).padStart(2, "0")}
                  </span>
                </div>

                <Link 
                  href={`/stories/${story.id}`}
                  className="relative aspect-[16/10] overflow-hidden bg-muted border-b-2 border-border/80 cursor-pointer block z-10"
                >
                  <Image
                    src={story.coverImage}
                    alt={story.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-foreground text-background font-mono text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider">
                    {story.category}
                  </div>
                </Link>

                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="font-mono text-[10px] uppercase text-muted-foreground mb-2 flex items-center gap-3">
                      <span>{formatDate(story.date)}</span>
                      <span>{"//"}</span>
                      <span>{story.readTime.toUpperCase()}</span>
                    </div>

                    <Link href={`/stories/${story.id}`}>
                      <h3 className="font-display text-2xl font-black uppercase text-foreground group-hover:underline underline-offset-4 mb-2 line-clamp-2 cursor-pointer">
                        {story.title}
                      </h3>
                    </Link>

                    {story.englishTitle && (
                      <div className="font-mono text-xs text-muted-foreground uppercase mb-3">
                        {story.englishTitle}
                      </div>
                    )}
                    <p className="font-sans text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                      {story.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/60 flex items-center justify-between font-mono text-xs font-bold uppercase">
                    <Link
                      href={`/stories/${story.id}`}
                      className="inline-flex h-10 items-center gap-2 border-2 border-foreground bg-foreground px-4 font-mono text-xs font-bold uppercase tracking-wider text-background transition-colors hover:bg-background hover:text-foreground cursor-pointer shadow-sm"
                    >
                      READ STORY <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
