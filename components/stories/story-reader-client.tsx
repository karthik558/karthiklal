"use client"

import React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import StoryReader, { type Story } from "@/components/stories/story-reader"

interface StoryReaderClientProps {
  story: Story
}

export default function StoryReaderClient({ story }: StoryReaderClientProps) {
  const router = useRouter()

  const handleClose = () => {
    router.push("/stories")
  }

  return (
    <>
      {/* Semantic Fallback Container for SEO Crawlers & Initial Paint */}
      <div className="min-h-screen bg-background pt-32 pb-24 border-t border-border">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> ALL STORIES
          </Link>

          <article className="paper-sheet border-2 border-border/80 bg-card p-6 sm:p-10 md:p-12 space-y-6">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {story.category} • {story.readTime} • {story.totalPages} PAGES
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-black uppercase text-foreground leading-tight">
              {story.title}
            </h1>
            {story.englishTitle && (
              <p className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
                {story.englishTitle}
              </p>
            )}
            {story.coverImage && (
              <div className="relative aspect-[16/9] w-full overflow-hidden border-2 border-border/80 my-6">
                <Image
                  src={story.coverImage}
                  alt={story.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <blockquote className="border-l-2 border-foreground pl-4 py-2 font-sans italic text-base text-foreground/90 leading-relaxed">
              &ldquo;{story.excerpt}&rdquo;
            </blockquote>
          </article>
        </div>
      </div>

      {/* Full-Screen Immersive Reader */}
      <StoryReader story={story} onClose={handleClose} />
    </>
  )
}
