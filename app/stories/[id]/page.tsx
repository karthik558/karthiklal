import type { Metadata } from "next"
import { notFound } from "next/navigation"
import storiesData from "@/public/data/stories.json"
import StoryReaderClient from "@/components/stories/story-reader-client"
import type { Story } from "@/components/stories/story-reader"

const stories = (storiesData.stories || []) as Story[]

export const dynamicParams = true

export function generateStaticParams() {
  return stories.filter((s) => s.published !== false).map((s) => ({ id: s.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const story = stories.find((s) => s.id === id && s.published !== false)
  if (!story) return {}

  const pageTitle = `${story.title}${story.englishTitle ? ` (${story.englishTitle})` : ""} - Karthik Lal`
  const pageDescription = story.excerpt

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://karthiklal.in/stories/${story.id}`,
      type: "article",
      images: [
        {
          url: story.coverImage,
          width: 1200,
          height: 630,
          alt: story.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [story.coverImage],
    },
  }
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const story = stories.find((s) => s.id === id && s.published !== false)

  if (!story) {
    notFound()
  }

  return <StoryReaderClient story={story} />
}
