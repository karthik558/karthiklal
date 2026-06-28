"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EmptyState, FilterPills, PageHero, PageShell, PageToolbar, SearchField } from "@/components/ui/page-layout"

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

const formatDate = (date: string, style: "short" | "long" = "short") =>
  new Date(date).toLocaleDateString(undefined, {
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  })

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

  const clearSearch = () => {
    setSearchQuery("")
    setSelectedCategory("All")
  }

  if (isLoading) {
    return (
      <PageShell>
        <div className="space-y-8 animate-pulse">
          <div className="mx-auto h-36 max-w-2xl rounded-lg bg-muted" />
          <div className="h-16 rounded-lg bg-muted" />
          <div className="h-[430px] rounded-lg bg-muted" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-[360px] rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="My Blog"
        title="Insights &"
        gradientText="Stories"
        description="Clear notes on systems, cybersecurity, web development, and the decisions behind practical technical work."
      />

      <PageToolbar>
        <SearchField value={searchQuery} onChange={setSearchQuery} onClear={() => setSearchQuery("")} placeholder="Search articles..." />
        <FilterPills items={categories} activeItem={selectedCategory} onSelect={setSelectedCategory} layoutId="blogFilter" />
      </PageToolbar>

      <AnimatePresence mode="wait">
        {filteredBlogs.length > 0 ? (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
            {featuredPost && !isFiltered && (
              <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.65 }}>
                <Link href={`/blog/${featuredPost.id}`} className="group grid overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm transition hover:border-primary/30 md:grid-cols-[1.15fr_0.85fr]">
                  <div className="relative min-h-[320px] overflow-hidden md:min-h-[430px]">
                    <Image src={featuredPost.image} alt={featuredPost.title} fill className="object-cover transition duration-700 group-hover:scale-105" priority />
                  </div>
                  <div className="flex flex-col justify-between p-6 md:p-8 lg:p-10">
                    <div>
                      <Badge className="mb-5 rounded-md bg-primary/10 px-3 py-1 text-primary hover:bg-primary/10">{featuredPost.category}</Badge>
                      <h2 className="text-3xl font-bold leading-tight tracking-tight transition group-hover:text-primary md:text-4xl">
                        {featuredPost.title}
                      </h2>
                      <p className="mt-5 line-clamp-4 text-base leading-7 text-muted-foreground">{featuredPost.excerpt}</p>
                    </div>
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-5">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(featuredPost.date, "long")}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {featuredPost.readTime}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-2 font-medium text-primary">
                        Read article <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visiblePosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                >
                  <Link href={`/blog/${post.id}`} className="group flex h-full flex-col overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <Image src={post.image} alt={post.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
                      <Badge className="absolute left-4 top-4 rounded-md bg-background/90 px-3 py-1 text-foreground backdrop-blur hover:bg-background/90">
                        {post.category}
                      </Badge>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>{formatDate(post.date)}</span>
                        <span className="h-1 w-1 rounded-full bg-border" />
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="line-clamp-2 text-xl font-bold leading-snug transition group-hover:text-primary">{post.title}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-primary">
                        Read article <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </motion.div>
        ) : (
          <EmptyState title="No insights found" description="Try a different search term or category to find more articles." actionLabel="Clear filters" onAction={clearSearch} />
        )}
      </AnimatePresence>
    </PageShell>
  )
}
