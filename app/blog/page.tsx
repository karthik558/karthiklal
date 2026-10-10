"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Search } from "lucide-react"
import blogsData from "@/public/data/blogs.json"

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

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toUpperCase()

const sortedBlogs = [...(blogsData.blogs as BlogPost[])].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
)

export default function BlogPage() {
  const [blogs] = useState<BlogPost[]>(sortedBlogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

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

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 border-t border-border">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Page Hero Header */}
        <div className="mb-14 border-b border-border pb-10">
          <div className="mb-3">
            <span className="paper-stamp">
              TECHNICAL JOURNAL // ARCHIVE &amp; DISPATCHES
            </span>
          </div>
          <h1 className="font-display text-5xl font-black uppercase tracking-tight text-foreground sm:text-7xl md:text-8xl">
            BLOG &amp; INSIGHTS
          </h1>
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
                    ? "border-foreground bg-foreground text-background font-bold shadow-sm"
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
                className="paper-sheet-stacked group border-2 border-border/80 hover:border-foreground/80 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 items-stretch"
              >
                <Link
                  href={`/blog/${featuredPost.id}`}
                  className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-muted border-b-2 lg:border-b-0 lg:border-r-2 border-border/80 cursor-pointer min-h-[300px] lg:min-h-[420px] block"
                >
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover grayscale contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:saturate-100 group-hover:contrast-100"
                  />
                  <div className="absolute top-4 left-4 bg-foreground text-background font-mono text-xs font-bold px-3 py-1 uppercase tracking-widest border border-foreground shadow-sm">
                    FEATURED READ
                  </div>
                </Link>

                <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between">
                  <div>
                    <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                      {featuredPost.category} {"//"} {formatDate(featuredPost.date)}
                    </div>
                    <Link href={`/blog/${featuredPost.id}`} className="block">
                      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-foreground group-hover:underline underline-offset-4 mb-4 cursor-pointer leading-tight">
                        {featuredPost.title}
                      </h2>
                    </Link>
                    <p className="font-sans text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                      {featuredPost.excerpt}
                    </p>
                    {featuredPost.tags && featuredPost.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6 font-mono text-xs">
                        {featuredPost.tags.slice(0, 5).map((tag) => (
                          <span key={tag} className="border border-border bg-background px-2.5 py-1 text-foreground uppercase font-bold text-[10px]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs font-bold uppercase">
                    <span className="text-muted-foreground">
                      READ TIME: {featuredPost.readTime.toUpperCase()}
                    </span>

                    <Link
                      href={`/blog/${featuredPost.id}`}
                      prefetch={false}
                      className="paper-button inline-flex h-11 items-center gap-2 border-2 border-foreground bg-foreground px-6 font-mono text-xs font-bold uppercase tracking-wider text-background transition-colors hover:bg-background hover:text-foreground cursor-pointer shadow-sm"
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
                  className="paper-sheet paper-folded-corner group border-2 border-border hover:border-foreground transition-all duration-300 flex flex-col justify-between"
                >
                  <Link
                    href={`/blog/${post.id}`}
                    className="relative aspect-[16/10] overflow-hidden bg-muted border-b-2 border-border cursor-pointer block"
                  >
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover grayscale contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:saturate-100 group-hover:contrast-100"
                    />
                    <div className="absolute top-3 left-3 bg-foreground text-background font-mono text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider shadow-sm">
                      {post.category}
                    </div>
                  </Link>

                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="font-mono text-[10px] uppercase text-muted-foreground mb-2 flex items-center gap-3">
                        <span>{formatDate(post.date)}</span>
                        <span>{"//"}</span>
                        <span>{post.readTime.toUpperCase()}</span>
                      </div>
                      <Link href={`/blog/${post.id}`}>
                        <h3 className="font-display text-2xl font-black uppercase text-foreground group-hover:underline underline-offset-4 mb-3 line-clamp-2 cursor-pointer">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="font-sans text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/60 flex items-center justify-between font-mono text-xs font-bold uppercase">
                      <Link
                        href={`/blog/${post.id}`}
                        prefetch={false}
                        className="paper-button inline-flex h-10 items-center gap-2 border-2 border-foreground bg-foreground px-4 font-mono text-xs font-bold uppercase tracking-wider text-background transition-colors hover:bg-background hover:text-foreground cursor-pointer shadow-sm"
                      >
                        READ ARTICLE <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

          </div>
        ) : (
          <div className="paper-sheet border-2 border-border p-12 text-center font-mono">
            <p className="text-muted-foreground uppercase text-sm mb-4">NO MATCHING ARTICLES FOUND</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("All") }}
              className="paper-button px-6 py-3 bg-foreground text-background font-bold text-xs uppercase tracking-wider"
            >
              RESET FILTERS
            </button>
          </div>
        )}

        {/* Bottom Section: About Karthik Lal's Technical Journal */}
        <div className="paper-sheet paper-index-card mt-16 border-2 border-border/80 hover:border-foreground/80 transition-all duration-300 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-mono text-xs uppercase">
          <div className="space-y-1.5 max-w-2xl">
            <div className="font-bold text-foreground text-sm tracking-wider">
              ABOUT KARTHIK LAL&apos;S TECHNICAL JOURNAL
            </div>
            <p className="text-muted-foreground normal-case font-sans text-sm leading-relaxed">
              Dispatches on vulnerability research, zero-day analysis, defensive network architecture, full-stack design patterns, and distributed systems engineering.
            </p>
          </div>
          <div className="shrink-0 font-mono text-[10px] text-muted-foreground uppercase tracking-widest border border-border px-3 py-1.5 bg-background">
            TECHNICAL DISPATCHES // 2021–2026
          </div>
        </div>

      </div>
    </div>
  )
}
