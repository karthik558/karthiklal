"use client"

import EditorialHeading from "@/components/ui/editorial-heading"
import React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
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
      <div className="page-shell story-detail">
        <div className="section-container">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> ALL STORIES
          </Link>

          <article className="space-y-6">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {story.category} • {story.readTime} • {story.totalPages} PAGES
            </div>
            <EditorialHeading title={story.title} />
            {story.englishTitle && (
              <p className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
                {story.englishTitle}
              </p>
            )}
            {story.coverImage && (
              <div className="article-cover">
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
