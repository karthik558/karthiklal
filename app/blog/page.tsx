"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Search } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: unknown[]
  author: string
  date: string
  category: string
  tags: string[]
  image: string
  readTime: string
  featured: boolean
}

interface BlogData {
  blogs: BlogPost[]
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toUpperCase()

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/data/blogs.json")
        const data: BlogData = await response.json()
        setBlogs(data.blogs)
      } catch (error) {
        console.error("Failed to fetch blogs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const categories = useMemo(() => ["All", ...Array.from(new Set(blogs.map((blog) => blog.category)))], [blogs])

  const filteredBlogs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    return blogs.filter((blog) => {
      const matchesSearch =
        query === "" ||
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt.toLowerCase().includes(query) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(query))
      const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [blogs, searchQuery, selectedCategory])

  const featuredPost = useMemo(() => filteredBlogs.find((blog) => blog.featured) || filteredBlogs[0], [filteredBlogs])
  const regularPosts = useMemo(() => filteredBlogs.filter((blog) => blog.id !== featuredPost?.id), [filteredBlogs, featuredPost])
  const isFiltered = searchQuery.trim() !== "" || selectedCategory !== "All"
  const visiblePosts = isFiltered ? filteredBlogs : regularPosts

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background pt-32 pb-24 border-t border-border">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="space-y-8 font-mono text-xs uppercase animate-pulse">
            <div className="h-32 bg-card border-2 border-border" />
            <div className="h-14 bg-card border-2 border-border" />
            <div className="grid gap-8 md:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-80 bg-card border-2 border-border" />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 border-t border-border">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Page Hero Header */}
        <div className="mb-14 border-b border-border pb-10">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            TECHNICAL JOURNAL // 03
          </div>
          <h1 className="font-display text-5xl font-black uppercase tracking-tight text-foreground sm:text-7xl md:text-8xl">
            BLOG & INSIGHTS
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-base md:text-lg text-muted-foreground font-light leading-relaxed">
            Notes, tutorials, and deep-dives on cybersecurity, network infrastructure, software engineering, and systems administration.
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
              placeholder="SEARCH ARTICLES OR TAGS..."
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
        {filteredBlogs.length > 0 ? (
          <div className="space-y-12">
            
            {/* Featured Article Card */}
            {featuredPost && !isFiltered && (
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="group border-2 border-foreground bg-card transition-all duration-300 hover:shadow-2xl grid grid-cols-1 lg:grid-cols-12 items-stretch overflow-hidden"
              >
                <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-muted border-b-2 lg:border-b-0 lg:border-r-2 border-foreground">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover grayscale contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:saturate-100"
                  />
                  <div className="absolute top-4 left-4 bg-foreground text-background font-mono text-xs font-bold px-3 py-1 uppercase tracking-widest border border-foreground">
                    FEATURED READ
                  </div>
                </div>

                <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between">
                  <div>
                    <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                      {featuredPost.category} {"//"} {formatDate(featuredPost.date)}
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-foreground group-hover:underline underline-offset-4 mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="font-sans text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-4 mb-6">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-border flex items-center justify-between font-mono text-xs font-bold uppercase">
                    <span className="text-muted-foreground">
                      READ TIME: {featuredPost.readTime.toUpperCase()}
                    </span>

                    <Link
                      href={`/blog/${featuredPost.id}`}
                      className="inline-flex items-center gap-1.5 text-foreground hover:underline"
                    >
                      READ ARTICLE <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visiblePosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className="group border-2 border-border bg-card hover:border-foreground transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted border-b-2 border-border">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover grayscale contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:saturate-100"
                    />
                    <div className="absolute top-3 left-3 bg-foreground text-background font-mono text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="font-mono text-[10px] uppercase text-muted-foreground mb-2 flex items-center gap-3">
                        <span>{formatDate(post.date)}</span>
                        <span>{"//"}</span>
                        <span>{post.readTime.toUpperCase()}</span>
                      </div>
                      <h3 className="font-display text-2xl font-black uppercase text-foreground group-hover:underline underline-offset-4 mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="font-sans text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/60 flex items-center justify-between font-mono text-xs font-bold uppercase">
                      <Link href={`/blog/${post.id}`} className="inline-flex items-center gap-1.5 text-foreground hover:underline">
                        READ ARTICLE <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

          </div>
        ) : (
          <div className="border-2 border-border bg-card p-12 text-center font-mono">
            <p className="text-muted-foreground uppercase text-sm mb-4">NO MATCHING ARTICLES FOUND</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("All") }}
              className="px-6 py-3 bg-foreground text-background font-bold text-xs uppercase tracking-wider"
            >
              RESET FILTERS
            </button>
          </div>
        )}

      </div>
    </main>
  )
}
