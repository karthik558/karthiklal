import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

// Sample blog posts data - this should match the data in the main blog page
const posts = [
  {
    id: 1,
    title: "Getting Started with Next.js 13",
    excerpt: "Learn how to build modern web applications with Next.js 13 and its new app directory structure.",
    date: "2024-04-01",
    category: "Web Development",
    image: "/placeholder.svg?height=300&width=600",
    content: `
      Next.js 13 introduces several groundbreaking features that revolutionize how we build React applications. 
      The new app directory structure provides a more intuitive way to create routes, layouts, and handle server-side components.

      Key Features:
      - New app directory for better organization
      - Server and Client Components
      - Improved data fetching
      - Built-in SEO optimizations
      - Enhanced performance
      
      This comprehensive guide will walk you through setting up a Next.js 13 project from scratch and exploring its powerful features.
    `
  },
  {
    id: 2,
    title: "The Power of Framer Motion",
    excerpt: "Explore how to create stunning animations in React applications using Framer Motion.",
    date: "2024-03-28",
    category: "Animation",
    image: "/placeholder.svg?height=300&width=600",
    content: `
      Framer Motion is a powerful animation library for React that makes it easy to create beautiful animations with minimal code.
      In this tutorial, we'll explore how to create various types of animations using Framer Motion's intuitive API.

      Topics covered:
      - Basic animations
      - Gesture animations
      - Page transitions
      - Layout animations
      - Animation orchestration
      
      By the end of this guide, you'll have a solid understanding of how to implement engaging animations in your React projects.
    `
  },
  {
    id: 3,
    title: "Building with Three.js",
    excerpt: "A comprehensive guide to creating 3D experiences on the web using Three.js and React Three Fiber.",
    date: "2024-03-25",
    category: "3D Development",
    image: "/placeholder.svg?height=300&width=600",
    content: `
      Three.js is a powerful JavaScript library that makes it possible to create stunning 3D graphics in the browser.
      Combined with React Three Fiber, it becomes even more powerful for React developers.

      In this guide, we'll cover:
      - Three.js fundamentals
      - React Three Fiber basics
      - Creating 3D scenes
      - Adding lighting and shadows
      - Implementing controls
      - Performance optimization
      
      Follow along as we build an interactive 3D web application from the ground up.
    `
  }
]

interface BlogPostProps {
  params: {
    id: string
  }
}

export default function BlogPost({ params }: BlogPostProps) {
  const post = posts.find(p => p.id === parseInt(params.id))

  if (!post) {
    notFound()
  }

  return (
    <div className="py-20 md:py-32">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
          
          <span className="inline-block text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <p className="text-muted-foreground">{post.excerpt}</p>
          <div className="mt-4 text-sm text-muted-foreground">
            Published on {post.date}
          </div>
        </div>

        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="relative h-[400px] w-full">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle className="sr-only">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}