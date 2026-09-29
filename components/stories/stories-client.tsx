"use client"

import React, { useState, useMemo } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  BookOpen, 
  Search, 
  Clock, 
  Layers, 
  ArrowRight, 
  ChevronRight
} from "lucide-react"
import StoryReader, { type Story } from "@/components/stories/story-reader"

interface StoriesClientProps {
  initialStories: Story[]
}

export default function StoriesClient({ initialStories }: StoriesClientProps) {
  const [stories, setStories] = useState<Story[]>(initialStories)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  
  // Active reading modal / overlay state
  const [activeStory, setActiveStory] = useState<Story | null>(null)

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>()
    stories.forEach((s) => {
      if (s.category) set.add(s.category)
    })
    return ["All", ...Array.from(set)]
  }, [stories])

  // Filtered stories
  const filteredStories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return stories.filter((story) => {
      const matchQuery =
        !q ||
        story.title.toLowerCase().includes(q) ||
        (story.englishTitle && story.englishTitle.toLowerCase().includes(q)) ||
        story.excerpt.toLowerCase().includes(q) ||
        (story.tags && story.tags.some((t) => t.toLowerCase().includes(q)))

      const matchCategory = selectedCategory === "All" || story.category === selectedCategory

      return matchQuery && matchCategory
    })
  }, [stories, searchQuery, selectedCategory])

  const featuredStory = useMemo(() => {
    return filteredStories.find((s) => s.featured) || filteredStories[0] || null
  }, [filteredStories])

  const otherStories = useMemo(() => {
    if (!featuredStory) return []
    return filteredStories.filter((s) => s.id !== featuredStory.id)
  }, [filteredStories, featuredStory])

  const openStoryReader = (story: Story) => {
    setActiveStory(story)
  }

  return (
    <>
      <div className="min-h-screen bg-background pt-32 pb-24 border-t border-border selection:bg-foreground selection:text-background">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          
          {/* Hero Header */}
          <div className="mb-14 border-b border-border pb-10">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>സാഹിത്യ ശേഖരം // LITERARY ARCHIVE</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight text-foreground">
              STORIES &amp; NARRATIVES
            </h1>
            
            <p className="mt-4 max-w-2xl font-sans text-base md:text-lg text-muted-foreground font-light leading-relaxed">
              ഹൃദയസ്പർശിയായ കഥകൾ, അനുഭവങ്ങൾ, പ്രണയം, അകൽച്ചകൾ, വൈകിയ തിരിച്ചറിവുകൾ. A collection of literary reflections and novellas written by Karthik Lal.
            </p>
          </div>

          {/* Search & Categories Filter */}
          <div className="mb-12 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 border-b border-border pb-8">
            <div className="relative min-w-[280px] lg:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="കഥകൾ തിരയുക / SEARCH STORIES..."
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

          {/* Stories Showcase */}
          {filteredStories.length === 0 ? (
            <div className="border-2 border-dashed border-border bg-card p-16 text-center space-y-4 font-mono text-xs uppercase">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground opacity-60" />
              <h3 className="text-base font-bold text-foreground">കഥകൾ ഒന്നും കണ്ടെത്തിയില്ല / NO STORIES FOUND</h3>
              <p className="text-muted-foreground normal-case font-sans max-w-md mx-auto text-sm">
                No published stories matched your search query. Try clearing your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                }}
                className="px-4 py-2 border border-foreground bg-foreground text-background font-bold"
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Featured Hero Story Card */}
              {featuredStory && (
                <div className="border-2 border-foreground bg-card overflow-hidden shadow-2xl relative group">
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Left: Cinematic Cover Art */}
                    <div className="lg:col-span-6 relative min-h-[360px] lg:min-h-[520px] bg-black overflow-hidden border-b-2 lg:border-b-0 lg:border-r-2 border-border">
                      {featuredStory.coverImage ? (
                        <Image
                          src={featuredStory.coverImage}
                          alt={featuredStory.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-90"
                          priority
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-card text-muted-foreground font-mono text-xs">
                          NO COVER ARTWORK
                        </div>
                      )}
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent lg:hidden" />

                      {/* Top badges over image */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10 font-mono text-[10px] uppercase">
                        <span className="px-2.5 py-1 bg-foreground text-background font-bold tracking-wider shadow-md">
                          FEATURED STORY
                        </span>
                      </div>
                    </div>

                    {/* Right: Story Info & Reading Actions */}
                    <div className="lg:col-span-6 p-6 sm:p-8 lg:p-12 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground uppercase">
                          <span className="px-2.5 py-1 border border-border bg-background font-bold text-foreground">
                            {featuredStory.category}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5" />
                            {featuredStory.totalPages} PAGES
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {featuredStory.readTime}
                          </span>
                        </div>

                        {/* Story Title */}
                        <div className="space-y-1 pt-1">
                          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
                            {featuredStory.title}
                          </h2>
                          {featuredStory.englishTitle && (
                            <p className="font-mono text-xs md:text-sm text-muted-foreground uppercase tracking-widest font-bold">
                              {featuredStory.englishTitle}
                            </p>
                          )}
                        </div>

                        {/* Excerpt */}
                        <p className="font-sans text-base sm:text-lg text-foreground/80 leading-relaxed font-light pt-2">
                          {featuredStory.excerpt}
                        </p>

                        {/* First page quote teaser */}
                        {featuredStory.pages && featuredStory.pages[0]?.highlightQuote && (
                          <div className="border-l-4 border-foreground pl-4 py-2 font-serif italic text-sm text-muted-foreground">
                            &ldquo;{featuredStory.pages[0].highlightQuote}&rdquo;
                          </div>
                        )}

                        {/* Tags */}
                        {featuredStory.tags && featuredStory.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {featuredStory.tags.map((tag) => (
                              <span
                                key={tag}
                                className="font-mono text-[10px] text-muted-foreground px-2 py-0.5 border border-border/80 bg-background"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Call to Actions */}
                      <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center gap-3 font-mono text-xs uppercase">
                        {/* Primary: Read story */}
                        <button
                          onClick={() => openStoryReader(featuredStory)}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-foreground bg-foreground text-background font-bold hover:bg-background hover:text-foreground transition-all shadow-xl group/btn"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>കഥ വായിക്കുക // READ STORY</span>
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other Stories Grid (if additional stories exist) */}
              {otherStories.length > 0 && (
                <div className="space-y-6 pt-6">
                  <div className="flex items-center justify-between border-b-2 border-border pb-3 font-mono text-xs uppercase">
                    <span className="font-bold tracking-wider">MORE STORIES ({otherStories.length})</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherStories.map((story) => (
                      <div
                        key={story.id}
                        className="border-2 border-border bg-card flex flex-col justify-between hover:border-foreground transition-all group overflow-hidden shadow-lg"
                      >
                        <div className="space-y-4">
                          {/* Image */}
                          <div className="relative h-56 bg-black overflow-hidden border-b-2 border-border">
                            {story.coverImage ? (
                              <Image
                                src={story.coverImage}
                                alt={story.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-mono text-xs text-muted-foreground">
                                NO IMAGE
                              </div>
                            )}

                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 font-mono text-[9px] uppercase">
                              <span className="px-2 py-0.5 bg-background/90 text-foreground border border-border font-bold">
                                {story.category}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 space-y-3">
                            <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground uppercase">
                              <span>{story.totalPages} PAGES</span>
                              <span>•</span>
                              <span>{story.readTime}</span>
                            </div>

                            <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {story.title}
                            </h3>

                            {story.englishTitle && (
                              <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest font-bold">
                                {story.englishTitle}
                              </p>
                            )}

                            <p className="font-sans text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                              {story.excerpt}
                            </p>
                          </div>
                        </div>

                        {/* Footer Button */}
                        <div className="p-5 pt-0">
                          <button
                            onClick={() => openStoryReader(story)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 border border-border bg-background hover:bg-foreground hover:text-background font-mono text-xs uppercase font-bold transition-all"
                          >
                            <span>READ STORY</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Archive Information Card */}
              <div className="border-2 border-border bg-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-mono text-xs uppercase">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>ABOUT KARTHIK LAL&apos;S LITERARY WORK</span>
                  </div>
                  <p className="text-muted-foreground normal-case font-sans text-sm leading-relaxed">
                    Stories written from real human emotions, exploring love, silence, vulnerable conversations, and the delicate choices that define human connections.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="px-3.5 py-2 border border-border bg-background text-muted-foreground text-[11px]">
                    ARCHIVE FORMAT // STANDALONE
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* The Immersive Reader Overlay */}
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
