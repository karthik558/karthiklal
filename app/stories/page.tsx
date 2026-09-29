import { promises as fs } from "fs"
import path from "path"
import type { Metadata } from "next"
import StoriesClient from "@/components/stories/stories-client"
import type { Story } from "@/components/stories/story-reader"

export const metadata: Metadata = {
  title: "STORIES // സാഹിത്യ ശേഖരം",
  description: "A collection of poignant reflections, relationships, fiction, and untold emotional journeys by Karthik Lal.",
  openGraph: {
    title: "Stories & Narratives - Karthik Lal",
    description: "Read poignant Malayalam stories and emotional novellas by Karthik Lal.",
    images: [
      {
        url: "/stories/images/before-twelve-o-clock.webp",
        width: 1200,
        height: 630,
        alt: "Stories Archive - Karthik Lal",
      },
    ],
  },
}

export default async function StoriesPage() {
  let stories: Story[] = []

  try {
    const filePath = path.join(process.cwd(), "public", "data", "stories.json")
    const fileContents = await fs.readFile(filePath, "utf8")
    const parsed = JSON.parse(fileContents)
    const allStories: Story[] = parsed.stories || []
    // Only pass published stories to the public client
    stories = allStories.filter((s) => s.published !== false)
  } catch (err) {
    console.error("Failed to read stories.json on server:", err)
  }

  return <StoriesClient initialStories={stories} />
}
