"use client"

import PageIntro from "@/components/ui/page-intro"
import React, { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
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

  return <div className="page-shell story-archive"><div className="section-container">
    <PageIntro label="STORIES / BY KARTHIK LAL" title="Stories to get" accent="lost in." description="On people, silence, and the things that stay with us. Stories in Malayalam, told at their own pace.">
      <span className="studio-label">{stories.length} {stories.length === 1 ? "STORY" : "STORIES"} / THE COLLECTION</span>
    </PageIntro>
    <div className="archive-toolbar">
      <div className="book-filters" aria-label="Story categories">{categories.map(cat => <button key={cat} aria-pressed={selectedCategory === cat} onClick={() => setSelectedCategory(cat)}>{cat}</button>)}</div>
      <div className="archive-search"><Search size={16} aria-hidden="true" /><input aria-label="Search stories or tags" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search stories or tags" /></div>
    </div>
    <p className="studio-label archive-results" role="status">{filteredStories.length} {filteredStories.length === 1 ? "story" : "stories"} found</p>
    <div className="work-archive-grid">{filteredStories.map((story, index) => <article key={story.id} className="archive-entry">
      <Link href={`/stories/${story.id}`} className="archive-entry-image story-cover" aria-label={`Read ${story.englishTitle || story.title}`}><Image src={story.coverImage} alt={story.title} fill priority={index < 2} sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" /><span className="archive-image-action" aria-hidden="true"><ArrowUpRight size={22} /></span></Link>
      <div className="archive-entry-heading"><div><p className="studio-label">{story.category} / {story.readTime}</p><h2 lang="ml"><Link href={`/stories/${story.id}`}>{story.title}</Link></h2>{story.englishTitle && <p className="story-english-title">{story.englishTitle}</p>}</div></div>
      <p className="archive-entry-description" lang="ml">{story.excerpt}</p>
      <div className="archive-entry-footer"><span>{formatDate(story.date)} / {story.totalPages} PAGES</span><Link href={`/stories/${story.id}`} className="studio-text-link">READ STORY <ArrowUpRight size={16} /></Link></div>
    </article>)}</div>
    {!filteredStories.length && <div className="archive-empty"><h2>No stories found.</h2><p>Try another word or explore the full collection.</p><button className="studio-text-link" onClick={() => {setSearchQuery("");setSelectedCategory("All")}}>RESET FILTERS <ArrowUpRight size={16} /></button></div>}
    <div className="page-endnote"><p>Some stories start with a conversation.</p><Link href="/contact" className="studio-text-link">SAY HELLO <ArrowUpRight size={18} /></Link></div>
  </div></div>
}
