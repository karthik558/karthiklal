"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Clock, Calendar, User, Search, ArrowRight, Sparkles, Tag, X, Grid, List } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
            <div className="h-[400px] bg-muted rounded-xl w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[300px] bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background relative">
      {/* Background Elements - Contained to prevent overflow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore my <span className="text-gradient">Blog</span>
          </h1>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development, design, and technology.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start border-t border-border/50 pt-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${selectedCategory === null ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {selectedCategory === null && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">All</span>
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${selectedCategory === category ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {selectedCategory === category && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {filteredBlogs.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16"
            >
              {/* Featured Post */}
              {featuredPost && !searchQuery && !selectedCategory && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-px flex-1 bg-border/50" />
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Featured Post</span>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>

                  <Link href={`/blog/${featuredPost.id}`}>
                    <div className="group relative grid md:grid-cols-2 gap-8 bg-card/30 hover:bg-card/50 border border-border/50 rounded-3xl p-6 md:p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative aspect-video md:aspect-auto rounded-2xl overflow-hidden">
                        <Image
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-background/80 backdrop-blur-md text-foreground hover:bg-background/90">
                            {featuredPost.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center relative">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date(featuredPost.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="w-1 h-1 rounded-full bg-border" />
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {featuredPost.readTime}
                          </div>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                          {featuredPost.title}
                        </h2>

                        <p className="text-muted-foreground text-lg mb-6 line-clamp-3">
                          {featuredPost.excerpt}
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{featuredPost.author}</p>
                              <p className="text-xs text-muted-foreground">Author</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-primary font-medium group/btn">
                            Read Article
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Regular Posts Grid */}
              <div>
                {(!searchQuery && !selectedCategory) && (
                  <div className="flex items-center gap-2 mb-8">
                    <div className="h-px flex-1 bg-border/50" />
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Latest Articles</span>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(searchQuery || selectedCategory ? filteredBlogs : regularPosts).map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link href={`/blog/${post.id}`}>
                        <Card className="group h-full flex flex-col bg-card/30 hover:bg-card/50 border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 overflow-hidden">
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <Badge className="absolute top-4 right-4 bg-background/80 backdrop-blur-md text-foreground hover:bg-background/90 border-0">
                              {post.category}
                            </Badge>
                          </div>

                          <CardHeader className="flex-1">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(post.date).toLocaleDateString()}
                              </div>
                              <div className="w-1 h-1 rounded-full bg-border" />
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {post.readTime}
                              </div>
                            </div>
                            <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors duration-300">
                              {post.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 mt-2">
                              {post.excerpt}
                            </CardDescription>
                          </CardHeader>

                          <CardFooter className="pt-0 mt-auto border-t border-border/30 p-6">
                            <div className="w-full flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Tag className="w-3.5 h-3.5" />
                                <span className="line-clamp-1">{post.tags.slice(0, 2).join(", ")}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                Read
                                <ArrowRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </CardFooter>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No articles found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                We couldn't find any articles matching your criteria. Try adjusting your search or filters.
              </p>
              <Button
                variant="outline"
                onClick={clearSearch}
              >
                Clear all filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}