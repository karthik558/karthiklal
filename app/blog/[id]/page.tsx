"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

// Add Edge Runtime configuration for Cloudflare Pages compatibility
export const runtime = 'edge'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: ContentBlock[]
  author: string
  date: string
  category: string
  tags: string[]
  image: string
  readTime: string
  featured: boolean
}

interface ContentBlock {
  type: 'paragraph' | 'heading' | 'image' | 'code' | 'list' | 'quote'
  text?: string
  level?: number
  src?: string
  alt?: string
  caption?: string
  language?: string
  code?: string
  items?: string[]
}

interface BlogData {
  blogs: BlogPost[]
}

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch('/data/blogs.json')
        if (!response.ok) {
          throw new Error('Failed to fetch blogs')
        }

        const data: BlogData = await response.json()
        const foundBlog = data.blogs?.find(b => b?.id === resolvedParams.id)

        if (!foundBlog) {
          setError('Blog post not found')
        } else {
          setBlog(foundBlog)
        }
      } catch (error) {
        console.error('Failed to fetch blog:', error)
        setError('Failed to load blog post')
      } finally {
        setIsLoading(false)
      }
    }

    if (resolvedParams.id) {
      fetchBlog()
    }
  }, [resolvedParams.id])

  const handleShare = async () => {
    if (!blog) return

    const shareData = {
      title: blog.title,
      text: blog.excerpt,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        toast.success("Shared successfully!")
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied to clipboard!")
      }
    } catch (err) {
      console.error("Error sharing:", err)
      // Don't show error toast if user cancelled share
      if (err instanceof Error && err.name !== "AbortError") {
        toast.error("Failed to share")
      }
    }
  }

  const renderContentBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={index} className="text-muted-foreground leading-relaxed mb-6">
            {block.text}
          </p>
        )

      case 'heading':
        const headingClasses = {
          1: "text-3xl md:text-4xl font-bold mb-6 mt-8",
          2: "text-2xl md:text-3xl font-bold mb-4 mt-8",
          3: "text-xl md:text-2xl font-semibold mb-4 mt-6",
          4: "text-lg md:text-xl font-semibold mb-3 mt-6"
        }
        const className = headingClasses[block.level as keyof typeof headingClasses] || headingClasses[2]

        if (block.level === 1) {
          return <h1 key={index} className={className}>{block.text}</h1>
        } else if (block.level === 3) {
          return <h3 key={index} className={className}>{block.text}</h3>
        } else if (block.level === 4) {
          return <h4 key={index} className={className}>{block.text}</h4>
        } else {
          return <h2 key={index} className={className}>{block.text}</h2>
        }

      case 'image':
        return (
          <div key={index} className="my-8">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={block.src || '/placeholder.svg'}
                alt={block.alt || ''}
                width={800}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
            {block.caption && (
              <p className="text-sm text-muted-foreground text-center mt-2 italic">
                {block.caption}
              </p>
            )}
          </div>
        )

      case 'code':
        return (
          <div key={index} className="my-6">
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto">
              <code className={`language-${block.language || 'text'} text-sm`}>
                {block.code}
              </code>
            </pre>
          </div>
        )

      case 'list':
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
            {block.items?.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        )

      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-l-foreground border-y border-r border-border pl-6 py-4 my-8 bg-card font-mono text-sm">
            <p className="text-foreground italic text-base">&ldquo;{block.text}&rdquo;</p>
          </blockquote>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background pt-32 pb-24 border-t border-border">
        <div className="container mx-auto max-w-4xl px-4 font-mono text-xs uppercase animate-pulse">
          <div className="h-10 bg-card border-2 border-border w-36 mb-8" />
          <div className="h-20 bg-card border-2 border-border w-full mb-6" />
          <div className="h-96 bg-card border-2 border-border w-full mb-8" />
        </div>
      </main>
    )
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen bg-background pt-32 pb-24 border-t border-border text-center">
        <div className="container mx-auto max-w-4xl px-4 font-mono">
          <h1 className="font-display text-4xl font-black uppercase text-foreground mb-4">ARTICLE NOT FOUND</h1>
          <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-bold text-xs uppercase">
            <ArrowLeft className="w-4 h-4" /> RETURN TO BLOG
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-28 border-t border-border">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        
        {/* Back Navigation */}
        <div className="mb-8 font-mono text-xs font-bold uppercase">
          <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> BACK TO ALL ARTICLES
          </Link>
        </div>

        {/* Article Header */}
        <article className="space-y-8">
          <header className="border-b-2 border-border pb-10 space-y-6">
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase">
              <span className="bg-foreground text-background font-bold px-3 py-1">
                {blog.category}
              </span>
              <span className="text-muted-foreground">
                AUTHOR: {blog.author.toUpperCase()}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-foreground">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 font-mono text-xs uppercase text-muted-foreground border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>READ TIME: {blog.readTime.toUpperCase()}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 font-mono text-xs uppercase">
              {blog.tags.map((tag) => (
                <span key={tag} className="border border-border bg-card px-2.5 py-1 text-foreground font-bold">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="relative border-2 border-foreground bg-card overflow-hidden">
              <Image
                src={blog.image}
                alt={blog.title}
                width={1200}
                height={600}
                className="w-full h-72 md:h-[480px] object-cover"
                priority
              />
            </div>
          </header>

          {/* Abstract / Excerpt */}
          <div className="border-2 border-foreground bg-card p-6 md:p-8 font-sans text-base md:text-lg leading-relaxed text-foreground font-medium">
            {blog.excerpt}
          </div>

          {/* Content Blocks */}
          <div className="font-sans text-base md:text-lg leading-relaxed space-y-6">
            {blog.content.map((block, index) => renderContentBlock(block, index))}
          </div>

          {/* Share & Footer */}
          <footer className="border-t-2 border-border pt-8 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs uppercase">
            <Button variant="outline" className="border-2 border-border bg-card hover:border-foreground text-foreground font-bold px-6 py-3" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" /> SHARE ARTICLE
            </Button>

            <Link href="/blog" className="px-6 py-3 bg-foreground text-background font-bold hover:bg-foreground/90 transition-colors">
              VIEW ALL ARTICLES
            </Link>
          </footer>
        </article>
      </div>
    </main>
  )
}
