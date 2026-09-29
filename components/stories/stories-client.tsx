"use client"

import React, { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Search } from "lucide-react"
import type { Story } from "@/components/stories/story-reader"

interface StoriesClientProps {
  initialStories: Story[]
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toUpperCase()

export default function StoriesClient({ initialStories }: StoriesClientProps) {
  const [stories] = useState<Story[]>(initialStories)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Categories list
  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(stories.map((s) => s.category).filter(Boolean)))]
  }, [stories])

  // Filtered stories
  const filteredStories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    return stories.filter((story) => {
      const matchesSearch =
        query === "" ||
        story.title.toLowerCase().includes(query) ||
        (story.englishTitle && story.englishTitle.toLowerCase().includes(query)) ||
        story.excerpt.toLowerCase().includes(query) ||
        (story.tags && story.tags.some((tag) => tag.toLowerCase().includes(query)))
      const matchesCategory = selectedCategory === "All" || story.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [stories, searchQuery, selectedCategory])

  const featuredStory = useMemo(() => {
    return filteredStories.find((story) => story.featured) || filteredStories[0] || null
  }, [filteredStories])

  const regularStories = useMemo(() => {
    if (!featuredStory) return []
    return filteredStories.filter((story) => story.id !== featuredStory.id)
  }, [filteredStories, featuredStory])

  const isFiltered = searchQuery.trim() !== "" || selectedCategory !== "All"
  const visibleStories = isFiltered ? filteredStories : regularStories

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 border-t border-border">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Page Hero Header */}
        <div className="mb-14 border-b border-border pb-10">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            LITERARY ARCHIVE // STORIES
          </div>
          <h1 className="font-display text-5xl font-black uppercase tracking-tight text-foreground sm:text-7xl md:text-8xl">
            STORIES &amp; NARRATIVES
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-base md:text-lg text-muted-foreground font-light leading-relaxed">
            A curated collection of literary fiction, emotional novellas, and personal reflections exploring human relationships and quiet truths.
          </p>
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="mb-12 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 border-b border-border pb-8">
          <div className="relative min-w-[280px] lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH STORIES OR TAGS..."
              className="w-full bg-card border-2 border-border pl-10 pr-4 py-3 font-mono text-xs text-foreground uppercase placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 border transition-all duration-200 ${
                  selectedCategory === cat
                    ? "border-foreground bg-foreground text-background font-bold"
                    : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        {filteredStories.length > 0 ? (
          <div className="space-y-12">
            
            {/* Featured Story Card - Links to unique story page */}
            {featuredStory && !isFiltered && (
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="group border-2 border-foreground bg-card transition-all duration-300 hover:shadow-2xl grid grid-cols-1 lg:grid-cols-12 items-stretch overflow-hidden"
              >
                <Link 
                  href={`/stories/${featuredStory.id}`}
                  className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-muted border-b-2 lg:border-b-0 lg:border-r-2 border-foreground cursor-pointer min-h-[300px] lg:min-h-[420px] block"
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
                    FEATURED STORY
                  </div>
                </Link>

                <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between">
                  <div>
                    <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                      {featuredStory.category} {"//"} {formatDate(featuredStory.date)}
                    </div>

                    <Link href={`/stories/${featuredStory.id}`} className="block">
                      <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-foreground group-hover:underline underline-offset-4 mb-2 cursor-pointer">
                        {featuredStory.title}
                      </h2>
                    </Link>

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

                    {/* Direct Link Button */}
                    <Link
                      href={`/stories/${featuredStory.id}`}
                      className="inline-flex h-11 items-center gap-2 border-2 border-foreground bg-foreground px-6 font-mono text-xs font-bold uppercase tracking-wider text-background transition-colors hover:bg-background hover:text-foreground cursor-pointer shadow-sm"
                    >
                      READ STORY <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            )}

            {/* Stories Grid */}
            {visibleStories.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleStories.map((story, index) => (
                  <motion.article
                    key={story.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.04 }}
                    className="group border-2 border-border bg-card hover:border-foreground transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
                  >
                    <Link 
                      href={`/stories/${story.id}`}
                      className="relative aspect-[16/10] overflow-hidden bg-muted border-b-2 border-border cursor-pointer block"
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
        ) : (
          <div className="border-2 border-border bg-card p-12 text-center font-mono">
            <p className="text-muted-foreground uppercase text-sm mb-4">NO MATCHING STORIES FOUND</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("All") }}
              className="px-6 py-3 bg-foreground text-background font-bold text-xs uppercase tracking-wider"
            >
              RESET FILTERS
            </button>
          </div>
        )}

        {/* Bottom Section: About Karthik Lal's Literary Work */}
        <div className="mt-16 border-2 border-foreground bg-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-mono text-xs uppercase">
          <div className="space-y-1.5 max-w-2xl">
            <div className="font-bold text-foreground text-sm tracking-wider">
              ABOUT KARTHIK LAL&apos;S LITERARY WORK
            </div>
            <p className="text-muted-foreground normal-case font-sans text-sm leading-relaxed">
              Stories written from real human emotions, exploring love, silence, vulnerable conversations, and the delicate choices that define human connections.
            </p>
          </div>
          <div className="shrink-0 font-mono text-[10px] text-muted-foreground uppercase tracking-widest border border-border px-3 py-1.5 bg-background">
            LITERARY ARCHIVE // 2026
          </div>
        </div>

      </div>
    </div>
  )
}
