"use client"

import React, { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import StoryReader, { type Story } from "@/components/stories/story-reader"
import storiesData from "@/public/data/stories.json"

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toUpperCase()

export default function StoriesSection() {
  const [activeStory, setActiveStory] = useState<Story | null>(null)

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
    <>
      <section id="stories" className="section-shell border-t-2 border-border">
        <div className="section-container">
          
          {/* Section Header */}
          <div className="section-heading-row">
            <div>
              <div className="section-kicker">
                10 // LITERARY WORKS
              </div>
              <h2 className="section-title">
                FEATURED STORIES
              </h2>
            </div>

            <div className="flex max-w-md flex-col items-start gap-5 md:items-end">
              <p className="font-sans text-sm font-light leading-relaxed text-muted-foreground md:text-right">
                A curated collection of literary fiction, emotional novellas, and personal reflections exploring human relationships and quiet truths.
              </p>
              <AnimatedButton
                href="/stories"
                variant="outline"
                className="w-fit border-border font-mono text-xs uppercase tracking-wider hover:border-foreground"
              >
                VIEW ALL STORIES <ArrowUpRight className="ml-2 h-4 w-4" />
              </AnimatedButton>
            </div>
          </div>

          {/* Featured Story Card - In full natural color always */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group border-2 border-foreground bg-card transition-all duration-300 hover:shadow-2xl grid grid-cols-1 lg:grid-cols-12 items-stretch overflow-hidden"
          >
            <div 
              onClick={() => setActiveStory(featuredStory)}
              className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-muted border-b-2 lg:border-b-0 lg:border-r-2 border-foreground cursor-pointer min-h-[300px] lg:min-h-[420px]"
            >
              <Image
                src={featuredStory.coverImage}
                alt={featuredStory.title}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-foreground text-background font-mono text-xs font-bold px-3 py-1 uppercase tracking-widest border border-foreground">
                [01]
              </div>
            </div>

            <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  {featuredStory.category} {"//"} {formatDate(featuredStory.date)}
                </div>
                <h3 
                  onClick={() => setActiveStory(featuredStory)}
                  className="font-display text-3xl sm:text-4xl font-black uppercase text-foreground group-hover:underline underline-offset-4 mb-2 cursor-pointer"
                >
                  {featuredStory.title}
                </h3>
                {featuredStory.englishTitle && (
                  <div className="font-mono text-xs text-muted-foreground font-bold uppercase tracking-wider mb-4">
                    {featuredStory.englishTitle}
                  </div>
                )}
                
                {/* Pull Quote */}
                <blockquote className="border-l-2 border-foreground pl-4 py-1.5 font-sans italic text-sm sm:text-base text-foreground/90 leading-relaxed mb-4 bg-muted/30">
                  &ldquo;ചിലപ്പോൾ ഒരു ബന്ധം തകരാൻ വലിയൊരു വഴക്ക് ആവശ്യമില്ല. ഒരു ചെറിയ നിശ്ശബ്ദത മതി.&rdquo;
                </blockquote>

                <p className="font-sans text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                  {featuredStory.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs font-bold uppercase">
                <span className="text-muted-foreground">
                  READ TIME: {featuredStory.readTime.toUpperCase()} • {featuredStory.totalPages} PAGES
                </span>

                <button
                  onClick={() => setActiveStory(featuredStory)}
                  className="inline-flex h-11 items-center gap-2 border-2 border-foreground bg-foreground px-6 font-mono text-xs font-bold uppercase tracking-wider text-background transition-colors hover:bg-background hover:text-foreground cursor-pointer shadow-sm"
                >
                  READ STORY <ArrowUpRight className="w-4 h-4" />
                </button>
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
                  className="group border-2 border-border bg-card hover:border-foreground transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
                >
                  <div 
                    onClick={() => setActiveStory(story)}
                    className="relative aspect-[16/10] overflow-hidden bg-muted border-b-2 border-border cursor-pointer"
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
                  </div>

                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="font-mono text-[10px] uppercase text-muted-foreground mb-2 flex items-center gap-3">
                        <span>{formatDate(story.date)}</span>
                        <span>{"//"}</span>
                        <span>{story.readTime.toUpperCase()}</span>
                      </div>
                      <h3 
                        onClick={() => setActiveStory(story)}
                        className="font-display text-2xl font-black uppercase text-foreground group-hover:underline underline-offset-4 mb-2 line-clamp-2 cursor-pointer"
                      >
                        {story.title}
                      </h3>
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
                      <button
                        onClick={() => setActiveStory(story)}
                        className="inline-flex h-10 items-center gap-2 border-2 border-foreground bg-foreground px-4 font-mono text-xs font-bold uppercase tracking-wider text-background transition-colors hover:bg-background hover:text-foreground cursor-pointer shadow-sm"
                      >
                        READ STORY <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Interactive Story Reader Overlay */}
      <AnimatePresence>
        {activeStory && (
          <StoryReader
            story={activeStory}
            onClose={() => setActiveStory(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
