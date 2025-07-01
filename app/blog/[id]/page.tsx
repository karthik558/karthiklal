"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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
          <blockquote key={index} className="border-l-4 border-primary pl-6 py-4 my-6 bg-primary/5 rounded-r-lg">
            <p className="text-foreground italic text-lg">"{block.text}"</p>
          </blockquote>
        )
      
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="py-20 md:py-32">
        <div className="container max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-32 mb-8"></div>
            <div className="h-12 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-muted rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="py-20 md:py-32">
        <div className="container max-w-4xl">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              {error === 'Blog post not found' ? 'Blog Post Not Found' : 'Error Loading Blog'}
            </h1>
            <p className="text-muted-foreground">
              {error === 'Blog post not found' 
                ? 'The blog post you\'re looking for doesn\'t exist or has been removed.'
                : 'There was an error loading the blog post. Please try again later.'
              }
            </p>
            <Button asChild className="mt-6">
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-20 md:py-32">
      <div className="container max-w-4xl">
        {/* Back Navigation */}
        <Button asChild variant="ghost" className="mb-8 hover:bg-accent">
          <Link href="/blog" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        {/* Article Header */}
        <article className="space-y-8">
          <header className="space-y-6">
            {/* Category and Featured Badge */}
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{blog.category}</Badge>
              {blog.featured && (
                <Badge className="bg-primary text-primary-foreground">Featured</Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(blog.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{blog.readTime}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Featured Image */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={blog.image}
                alt={blog.title}
                width={1200}
                height={600}
                className="w-full h-64 md:h-96 object-cover"
                priority
              />
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-xl text-muted-foreground mb-8 p-6 bg-secondary/30 rounded-lg border-l-4 border-primary">
              {blog.excerpt}
            </div>
            
            {blog.content.map((block, index) => renderContentBlock(block, index))}
          </div>

          {/* Share and Navigation */}
          <footer className="border-t pt-8 mt-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share Article
              </Button>
              
              <Button asChild>
                <Link href="/blog">View All Posts</Link>
              </Button>
            </div>
          </footer>
        </article>
      </div>
    </div>
  )
}