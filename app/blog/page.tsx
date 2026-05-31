"use client"

import { useState, useEffect, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Clock, Calendar, Search, ArrowRight, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: any[]
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

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/data/blogs.json')
        const data: BlogData = await response.json()
        setBlogs(data.blogs)
      } catch (error) {
        console.error('Failed to fetch blogs:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const categories = useMemo(() => {
    const cats = new Set(blogs.map(blog => blog.category))
    return Array.from(cats)
  }, [blogs])

  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory ? blog.category === selectedCategory : true
      return matchesSearch && matchesCategory
    })
  }, [blogs, searchQuery, selectedCategory])

  const featuredPost = useMemo(() => {
    return filteredBlogs.find(blog => blog.featured) || filteredBlogs[0]
  }, [filteredBlogs])

  const regularPosts = useMemo(() => {
    return filteredBlogs.filter(blog => blog.id !== featuredPost?.id)
  }, [filteredBlogs, featuredPost])

  const clearSearch = () => {
    setSearchQuery("")
    setSelectedCategory(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="container px-4 md:px-6">
          <div className="space-y-8 animate-pulse">
            <div className="h-12 bg-muted rounded-lg w-1/3 mx-auto" />
            <div className="h-[500px] bg-muted rounded-3xl w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[400px] bg-muted rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-24 bg-background relative selection:bg-primary/30">
      {/* Immersive Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[80vh] bg-gradient-to-b from-primary/5 via-background to-background" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px]"
        />
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 pt-8 flex flex-col items-center"
        >
          <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full bg-primary/5 border-primary/20 text-primary text-xs font-semibold tracking-[0.2em] uppercase">
            My Blog
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
            Insights & <span className="text-gradient">Stories</span>
          </h1>
        </motion.div>

        {/* Floating Glass Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto"
        >
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-11 h-12 rounded-full bg-secondary/30 backdrop-blur-md border border-foreground/5 focus:border-primary/50 focus:bg-background transition-all duration-300 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex w-full md:w-auto overflow-x-auto no-scrollbar p-1.5 rounded-full bg-secondary/30 backdrop-blur-md border border-foreground/5 shadow-sm">
            <div className="flex items-center gap-2 min-w-max">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  selectedCategory === null ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {selectedCategory === null && (
                  <motion.div
                    layoutId="blogFilter"
                    className="absolute inset-0 bg-primary rounded-full shadow-md"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">All</span>
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                  className={cn(
                    "relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    selectedCategory === category ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {selectedCategory === category && (
                    <motion.div
                      layoutId="blogFilter"
                      className="absolute inset-0 bg-primary rounded-full shadow-md"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">

          {filteredBlogs.length > 0 ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-24"
            >
              {/* Cinematic Featured Post */}
              {featuredPost && !searchQuery && !selectedCategory && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <Link href={`/blog/${featuredPost.id}`} className="block group">
                    <div className="relative w-full aspect-[4/5] md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl">
                      <Image
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500" />
                      
                      <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                        <div className="max-w-3xl">
                          <div className="flex items-center gap-4 mb-6">
                            <Badge className="bg-primary text-primary-foreground border-none px-4 py-1.5 text-xs tracking-wider uppercase backdrop-blur-md">
                              {featuredPost.category}
                            </Badge>
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                              <Calendar className="w-4 h-4" />
                              {new Date(featuredPost.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                          </div>

                          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight group-hover:text-primary-100 transition-colors duration-300">
                            {featuredPost.title}
                          </h2>

                          <p className="text-white/70 text-lg md:text-xl line-clamp-2 md:line-clamp-3 mb-8 font-light max-w-2xl">
                            {featuredPost.excerpt}
                          </p>

                          <div className="flex items-center gap-2 text-white font-medium group/btn">
                            Read Article
                            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Minimal Borderless Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {(searchQuery || selectedCategory ? filteredBlogs : regularPosts).map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/blog/${post.id}`} className="group block h-full">
                      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-6 bg-secondary/50">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-background/80 backdrop-blur-md text-foreground border-none px-3 py-1 text-xs">
                            {post.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col flex-1 px-2">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                          <span>{new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-snug">
                          {post.title}
                        </h3>
                        
                        <p className="text-muted-foreground line-clamp-3 mb-6 font-light">
                          {post.excerpt}
                        </p>

                        <div className="mt-auto flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          Read Full Article <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-32"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/50 mb-8">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-3xl font-bold mb-4">No insights found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                We couldn't find any articles matching your search. Try exploring other topics.
              </p>
              <button
                onClick={clearSearch}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}