"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  Edit3, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  FileText, 
  Clock, 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  Copy, 
  ExternalLink, 
  Upload,
  AlertCircle
} from "lucide-react"

export interface StoryPage {
  pageNumber: number
  title?: string
  highlightQuote?: string
  content: string
}

export interface Story {
  id: string
  title: string
  englishTitle?: string
  excerpt: string
  coverImage: string
  author: string
  date: string
  category: string
  tags: string[]
  readTime: string
  published: boolean
  featured?: boolean
  totalPages: number
  pages: StoryPage[]
}

export default function AdminStoriesPage() {
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Editor mode state
  const [editingStory, setEditingStory] = useState<Story | null>(null)
  const [activeTab, setActiveTab] = useState<"details" | "pages" | "bulk" | "preview">("details")
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0)
  const [bulkInput, setBulkInput] = useState("")

  // Fetch stories on load
  const fetchStories = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/data/stories?t=${Date.now()}`, { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load stories data")
      const json = await res.json()
      setStories(json.stories || [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load stories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStories()
  }, [])

  // Save stories array to backend
  const saveStories = async (updatedStories: Story[]) => {
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      const res = await fetch("/api/admin/data/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stories: updatedStories }, null, 2),
      })
      if (!res.ok) throw new Error("Failed to save stories")
      setStories(updatedStories)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      router.refresh()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setIsSaving(false)
    }
  }

  // Quick toggle publish status
  const handleTogglePublish = async (storyId: string) => {
    const updated = stories.map((s) => (s.id === storyId ? { ...s, published: !s.published } : s))
    await saveStories(updated)
  }

  // Quick delete story
  const handleDeleteStory = async (storyId: string) => {
    if (!confirm("Are you sure you want to permanently delete this story?")) return
    const updated = stories.filter((s) => s.id !== storyId)
    await saveStories(updated)
    if (editingStory?.id === storyId) {
      setEditingStory(null)
    }
  }

  // Move story order
  const handleMoveStory = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= stories.length) return
    const updated = [...stories]
    const item = updated.splice(index, 1)[0]
    updated.splice(targetIndex, 0, item)
    await saveStories(updated)
  }

  // Start creating new story
  const handleStartCreate = () => {
    const newStory: Story = {
      id: `story-${Date.now()}`,
      title: "",
      englishTitle: "",
      excerpt: "",
      coverImage: "/stories/images/before-twelve-o-clock.webp",
      author: "കാർത്തിക് ലാൽ",
      date: new Date().toISOString().split("T")[0],
      category: "വൈകാരിക ഫിക്ഷൻ",
      tags: ["കഥ", "ജീവിതം"],
      readTime: "5 min read",
      published: false,
      featured: false,
      totalPages: 1,
      pages: [
        {
          pageNumber: 1,
          title: "അധ്യായം 1",
          highlightQuote: "",
          content: "",
        },
      ],
    }
    setEditingStory(newStory)
    setSelectedPageIndex(0)
    setActiveTab("details")
  }

  // Save currently edited story
  const handleSaveCurrentStory = async () => {
    if (!editingStory) return

    if (!editingStory.title.trim()) {
      alert("Please enter a title for the story.")
      setActiveTab("details")
      return
    }

    // Ensure page numbers are sequential
    const pagesWithSequentialNums = (editingStory.pages || []).map((p, idx) => ({
      ...p,
      pageNumber: idx + 1,
    }))

    // Calculate approximate read time
    const totalWords = pagesWithSequentialNums.reduce(
      (acc, p) => acc + (p.content ? p.content.split(/\s+/).filter(Boolean).length : 0),
      0
    )
    const calculatedMinutes = Math.max(1, Math.round(totalWords / 150))
    const readTime = `${calculatedMinutes} min read`

    const finalStory: Story = {
      ...editingStory,
      totalPages: pagesWithSequentialNums.length,
      pages: pagesWithSequentialNums,
      readTime: editingStory.readTime || readTime,
    }

    const exists = stories.some((s) => s.id === finalStory.id)
    const updatedStories = exists
      ? stories.map((s) => (s.id === finalStory.id ? finalStory : s))
      : [finalStory, ...stories]

    await saveStories(updatedStories)
    setEditingStory(finalStory)
  }

  // Page manipulations inside editor
  const handleAddPage = () => {
    if (!editingStory) return
    const currentPages = editingStory.pages || []
    const newPageNum = currentPages.length + 1
    const newPages: StoryPage[] = [
      ...currentPages,
      {
        pageNumber: newPageNum,
        title: `പേജ് ${newPageNum}`,
        highlightQuote: "",
        content: "",
      },
    ]
    setEditingStory({
      ...editingStory,
      totalPages: newPages.length,
      pages: newPages,
    })
    setSelectedPageIndex(newPages.length - 1)
  }

  const handleDeletePage = (index: number) => {
    if (!editingStory || editingStory.pages.length <= 1) {
      alert("A story must have at least 1 page.")
      return
    }
    if (!confirm(`Are you sure you want to delete Page ${index + 1}?`)) return
    const newPages = editingStory.pages.filter((_, i) => i !== index).map((p, i) => ({
      ...p,
      pageNumber: i + 1,
    }))
    setEditingStory({
      ...editingStory,
      totalPages: newPages.length,
      pages: newPages,
    })
    setSelectedPageIndex(Math.max(0, index - 1))
  }

  // Bulk import split by '---'
  const handleBulkImport = () => {
    if (!bulkInput.trim() || !editingStory) return
    const rawPages = bulkInput
      .split(/(?:---|--- PAGE \d+ ---|\n\s*\n---\s*\n)/i)
      .map((p) => p.trim())
      .filter(Boolean)

    if (rawPages.length === 0) {
      alert("No distinct pages found. Use '---' on a new line between pages.")
      return
    }

    const importedPages: StoryPage[] = rawPages.map((content, idx) => ({
      pageNumber: idx + 1,
      title: `പേജ് ${idx + 1}`,
      highlightQuote: "",
      content: content,
    }))

    setEditingStory({
      ...editingStory,
      totalPages: importedPages.length,
      pages: importedPages,
    })
    setSelectedPageIndex(0)
    setActiveTab("pages")
    alert(`Successfully generated ${importedPages.length} pages from bulk text!`)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] font-mono text-xs uppercase gap-4">
        <div className="w-10 h-10 border-4 border-foreground/20 border-t-foreground animate-spin" />
        <p className="text-muted-foreground">LOADING STORY STUDIO...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 bg-destructive/10 text-destructive border-2 border-destructive uppercase font-mono text-xs">
        <h2 className="text-lg font-bold mb-2">ERROR LOADING DATA</h2>
        <p>{error}</p>
      </div>
    )
  }

  // -------------------------------------------------------------
  // STORY EDITOR VIEW
  // -------------------------------------------------------------
  if (editingStory) {
    const currentPage = editingStory.pages[selectedPageIndex] || {
      pageNumber: 1,
      title: "",
      highlightQuote: "",
      content: "",
    }

    return (
      <div className="space-y-6 font-mono text-xs uppercase">
        {/* Top Sticky Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-2 border-foreground bg-card p-5 sticky top-0 z-30 gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm("Return to stories list? Unsaved changes will be discarded.")) {
                  setEditingStory(null)
                }
              }}
              className="p-2 border border-border bg-background hover:bg-foreground hover:text-background transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="text-[10px] text-muted-foreground tracking-widest">
                STORY STUDIO // {editingStory.published ? "STATUS: PUBLISHED" : "STATUS: DRAFT"}
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-black text-foreground truncate max-w-md">
                {editingStory.title || "UNTITLED STORY"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {/* Publish Toggle Button */}
            <button
              type="button"
              onClick={() =>
                setEditingStory({
                  ...editingStory,
                  published: !editingStory.published,
                })
              }
              className={`px-3.5 py-2 border text-xs font-bold transition-all ${
                editingStory.published
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {editingStory.published ? "✓ PUBLISHED" : "○ DRAFT MODE"}
            </button>

            {/* Save Button */}
            <button
              onClick={handleSaveCurrentStory}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 border-2 border-foreground bg-foreground text-background font-bold hover:bg-background hover:text-foreground transition-all shadow-md"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  <span>SAVING...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>SAVED!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>SAVE STORY</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap border-2 border-border bg-card p-1 gap-1">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex items-center gap-2 px-4 py-2 font-bold text-xs transition-colors ${
              activeTab === "details"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-background"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>METADATA & DETAILS</span>
          </button>

          <button
            onClick={() => setActiveTab("pages")}
            className={`flex items-center gap-2 px-4 py-2 font-bold text-xs transition-colors ${
              activeTab === "pages"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-background"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>PAGES & CHAPTERS ({editingStory.pages?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("bulk")}
            className={`flex items-center gap-2 px-4 py-2 font-bold text-xs transition-colors ${
              activeTab === "bulk"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-background"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>BULK IMPORTER</span>
          </button>

          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-2 px-4 py-2 font-bold text-xs transition-colors ${
              activeTab === "preview"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-background"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>LIVE READER PREVIEW</span>
          </button>
        </div>

        {/* TAB 1: DETAILS & METADATA */}
        {activeTab === "details" && (
          <div className="border-2 border-border bg-card p-6 space-y-6">
            <h3 className="font-bold text-sm tracking-wider border-b border-border pb-3">
              STORY METADATA
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title Malayalam */}
              <div className="space-y-2">
                <label className="font-bold text-muted-foreground">TITLE (മലയാളം ശീർഷകം) *</label>
                <input
                  type="text"
                  value={editingStory.title}
                  onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                  placeholder="ഉദാഹരണം: പന്ത്രണ്ട് മണിക്ക് മുമ്പ്"
                  className="w-full bg-background border-2 border-border p-3 text-sm text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              {/* English Title */}
              <div className="space-y-2">
                <label className="font-bold text-muted-foreground">ENGLISH / SECONDARY TITLE</label>
                <input
                  type="text"
                  value={editingStory.englishTitle || ""}
                  onChange={(e) => setEditingStory({ ...editingStory, englishTitle: e.target.value })}
                  placeholder="e.g. Before Twelve O'Clock"
                  className="w-full bg-background border-2 border-border p-3 text-sm text-foreground uppercase focus:outline-none focus:border-foreground"
                />
              </div>

              {/* Slug / ID */}
              <div className="space-y-2">
                <label className="font-bold text-muted-foreground">STORY ID / SLUG</label>
                <input
                  type="text"
                  value={editingStory.id}
                  onChange={(e) => setEditingStory({ ...editingStory, id: e.target.value })}
                  className="w-full bg-background border-2 border-border p-3 text-xs text-foreground uppercase focus:outline-none focus:border-foreground"
                />
              </div>

              {/* Author */}
              <div className="space-y-2">
                <label className="font-bold text-muted-foreground">AUTHOR</label>
                <input
                  type="text"
                  value={editingStory.author}
                  onChange={(e) => setEditingStory({ ...editingStory, author: e.target.value })}
                  className="w-full bg-background border-2 border-border p-3 text-xs text-foreground uppercase focus:outline-none focus:border-foreground"
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="font-bold text-muted-foreground">DATE PUBLISHED</label>
                <input
                  type="date"
                  value={editingStory.date}
                  onChange={(e) => setEditingStory({ ...editingStory, date: e.target.value })}
                  className="w-full bg-background border-2 border-border p-3 text-xs text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="font-bold text-muted-foreground">GENRE / CATEGORY</label>
                <input
                  type="text"
                  value={editingStory.category}
                  onChange={(e) => setEditingStory({ ...editingStory, category: e.target.value })}
                  placeholder="e.g. വൈകാരിക ഫിക്ഷൻ, പ്രണയം, നാടകം"
                  className="w-full bg-background border-2 border-border p-3 text-xs text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              {/* Estimated Read Time */}
              <div className="space-y-2">
                <label className="font-bold text-muted-foreground">ESTIMATED READ TIME</label>
                <input
                  type="text"
                  value={editingStory.readTime}
                  onChange={(e) => setEditingStory({ ...editingStory, readTime: e.target.value })}
                  placeholder="e.g. 12 min read"
                  className="w-full bg-background border-2 border-border p-3 text-xs text-foreground uppercase focus:outline-none focus:border-foreground"
                />
              </div>

              {/* Featured toggle */}
              <div className="space-y-2 flex flex-col justify-end">
                <label className="font-bold text-muted-foreground">FEATURED STORY</label>
                <button
                  type="button"
                  onClick={() => setEditingStory({ ...editingStory, featured: !editingStory.featured })}
                  className={`p-3 border-2 font-bold text-left transition-colors ${
                    editingStory.featured
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {editingStory.featured ? "★ FEATURED ON TOP" : "☆ STANDARD PLACEMENT"}
                </button>
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <label className="font-bold text-muted-foreground">EXCERPT / TEASER SUMMARY</label>
              <textarea
                value={editingStory.excerpt}
                onChange={(e) => setEditingStory({ ...editingStory, excerpt: e.target.value })}
                rows={3}
                placeholder="Brief summary or opening hook..."
                className="w-full bg-background border-2 border-border p-3 text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-3">
              <label className="font-bold text-muted-foreground">COVER IMAGE PATH</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="relative w-40 h-24 border-2 border-border bg-background shrink-0 overflow-hidden">
                  {editingStory.coverImage ? (
                    <Image
                      src={editingStory.coverImage}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      NO IMAGE
                    </div>
                  )}
                </div>
                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    value={editingStory.coverImage}
                    onChange={(e) => setEditingStory({ ...editingStory, coverImage: e.target.value })}
                    placeholder="/stories/images/before-twelve-o-clock.webp"
                    className="w-full bg-background border-2 border-border p-3 text-xs text-foreground uppercase focus:outline-none focus:border-foreground"
                  />
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <span className="text-muted-foreground">QUICK PRESET:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingStory({
                          ...editingStory,
                          coverImage: "/stories/images/before-twelve-o-clock.webp",
                        })
                      }
                      className="px-2 py-0.5 border border-border hover:border-foreground bg-background"
                    >
                      /stories/images/before-twelve-o-clock.webp
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2 border-t border-border pt-4">
              <label className="font-bold text-muted-foreground">TAGS (COMMA SEPARATED)</label>
              <input
                type="text"
                value={editingStory.tags.join(", ")}
                onChange={(e) =>
                  setEditingStory({
                    ...editingStory,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="പ്രണയം, ദാമ്പത്യം, തിരിച്ചറിവ്, കഥ"
                className="w-full bg-background border-2 border-border p-3 text-xs text-foreground focus:outline-none focus:border-foreground"
              />
            </div>
          </div>
        )}

        {/* TAB 2: PAGES & CHAPTERS */}
        {activeTab === "pages" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Page Strip / Thumbnails */}
            <div className="lg:col-span-4 border-2 border-border bg-card p-4 flex flex-col h-[750px]">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                <span className="font-bold text-xs tracking-wider">
                  PAGES LIST ({editingStory.pages?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={handleAddPage}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-foreground bg-foreground text-background font-bold text-[11px] hover:bg-background hover:text-foreground transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD PAGE</span>
                </button>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {(editingStory.pages || []).map((page, idx) => {
                  const isSelected = selectedPageIndex === idx
                  const snippet = (page.content || "").slice(0, 75).replace(/\n/g, " ")
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedPageIndex(idx)}
                      className={`p-3 border cursor-pointer transition-all ${
                        isSelected
                          ? "border-foreground bg-foreground text-background shadow-md"
                          : "border-border bg-background text-foreground hover:border-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs mb-1">
                        <span>PAGE {idx + 1}</span>
                        <span className="text-[10px] opacity-75 truncate max-w-[120px]">
                          {page.title || `Chapter ${idx + 1}`}
                        </span>
                      </div>
                      <p className="text-[11px] line-clamp-2 opacity-80 font-sans normal-case">
                        {snippet || "(Empty page content...)"}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Page Editor */}
            <div className="lg:col-span-8 border-2 border-border bg-card p-6 flex flex-col h-[750px] overflow-y-auto space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <div className="text-[10px] text-muted-foreground tracking-widest">
                    EDITING PAGE {selectedPageIndex + 1} OF {editingStory.pages.length}
                  </div>
                  <h4 className="font-bold text-sm text-foreground">
                    {currentPage.title || `PAGE ${selectedPageIndex + 1}`}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeletePage(selectedPageIndex)}
                    disabled={editingStory.pages.length <= 1}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-destructive/50 text-destructive hover:bg-destructive hover:text-white transition-colors text-xs font-bold disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>DELETE PAGE</span>
                  </button>
                </div>
              </div>

              {/* Page Title */}
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground text-[11px]">
                  PAGE / SCENE TITLE (മലയാളം അല്ലെങ്കിൽ ENGLISH)
                </label>
                <input
                  type="text"
                  value={currentPage.title || ""}
                  onChange={(e) => {
                    const newPages = [...editingStory.pages]
                    newPages[selectedPageIndex] = {
                      ...newPages[selectedPageIndex],
                      title: e.target.value,
                    }
                    setEditingStory({ ...editingStory, pages: newPages })
                  }}
                  placeholder="ഉദാ: നിശ്ശബ്ദതയുടെ തുടക്കം"
                  className="w-full bg-background border-2 border-border p-2.5 text-xs text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              {/* Highlight Quote */}
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground text-[11px]">
                  FEATURED HIGHLIGHT QUOTE (OPTIONAL PULL QUOTE)
                </label>
                <input
                  type="text"
                  value={currentPage.highlightQuote || ""}
                  onChange={(e) => {
                    const newPages = [...editingStory.pages]
                    newPages[selectedPageIndex] = {
                      ...newPages[selectedPageIndex],
                      highlightQuote: e.target.value,
                    }
                    setEditingStory({ ...editingStory, pages: newPages })
                  }}
                  placeholder="A poignant quote that highlights this page..."
                  className="w-full bg-background border-2 border-border p-2.5 text-xs text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              {/* Page Main Content */}
              <div className="space-y-1.5 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-muted-foreground text-[11px]">
                    STORY TEXT FOR THIS PAGE *
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    WORDS: {(currentPage.content || "").split(/\s+/).filter(Boolean).length} // CHARACTERS: {(currentPage.content || "").length}
                  </span>
                </div>
                <textarea
                  value={currentPage.content || ""}
                  onChange={(e) => {
                    const newPages = [...editingStory.pages]
                    newPages[selectedPageIndex] = {
                      ...newPages[selectedPageIndex],
                      content: e.target.value,
                    }
                    setEditingStory({ ...editingStory, pages: newPages })
                  }}
                  rows={14}
                  placeholder="Type or paste the story paragraph(s) for this page here in Malayalam or English..."
                  className="w-full flex-1 bg-background border-2 border-border p-4 text-sm leading-relaxed text-foreground font-sans focus:outline-none focus:border-foreground resize-none"
                />
              </div>

              {/* Page Next / Prev quick switcher */}
              <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedPageIndex(Math.max(0, selectedPageIndex - 1))}
                  disabled={selectedPageIndex === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-background disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>PREVIOUS PAGE</span>
                </button>
                <span className="font-bold">
                  PAGE {selectedPageIndex + 1} OF {editingStory.pages.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedPageIndex(
                      Math.min(editingStory.pages.length - 1, selectedPageIndex + 1)
                    )
                  }
                  disabled={selectedPageIndex === editingStory.pages.length - 1}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-background disabled:opacity-40"
                >
                  <span>NEXT PAGE</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BULK IMPORTER */}
        {activeTab === "bulk" && (
          <div className="border-2 border-border bg-card p-6 space-y-4">
            <div className="flex items-start gap-3 p-4 bg-muted/40 border border-border">
              <AlertCircle className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-xs">HOW BULK IMPORT WORKS</h4>
                <p className="text-[11px] text-muted-foreground normal-case font-sans">
                  Paste an entire story or manuscript here. To divide text into pages, simply place{" "}
                  <code className="bg-background px-1.5 py-0.5 border border-border font-mono font-bold">
                    ---
                  </code>{" "}
                  or{" "}
                  <code className="bg-background px-1.5 py-0.5 border border-border font-mono font-bold">
                    --- PAGE ---
                  </code>{" "}
                  on a new line wherever you want a page break. Clicking &quot;Split &amp; Import&quot; will
                  instantly create individual pages for you.
                </p>
              </div>
            </div>

            <textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              rows={16}
              placeholder="Paste complete story text with --- page separators..."
              className="w-full bg-background border-2 border-border p-4 text-sm font-sans leading-relaxed text-foreground focus:outline-none focus:border-foreground"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleBulkImport}
                disabled={!bulkInput.trim()}
                className="flex items-center gap-2 px-6 py-3 border-2 border-foreground bg-foreground text-background font-bold hover:bg-background hover:text-foreground transition-all disabled:opacity-40"
              >
                <Upload className="w-4 h-4" />
                <span>SPLIT &amp; IMPORT INTO PAGES</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: LIVE PREVIEW */}
        {activeTab === "preview" && (
          <div className="border-2 border-border bg-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="font-bold text-xs tracking-wider">
                LIVE READER PREVIEW // PAGE {selectedPageIndex + 1} OF {editingStory.pages.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPageIndex(Math.max(0, selectedPageIndex - 1))}
                  disabled={selectedPageIndex === 0}
                  className="p-1.5 border border-border bg-background disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedPageIndex(
                      Math.min(editingStory.pages.length - 1, selectedPageIndex + 1)
                    )
                  }
                  disabled={selectedPageIndex === editingStory.pages.length - 1}
                  className="p-1.5 border border-border bg-background disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulated Reader Container */}
            <div className="max-w-2xl mx-auto border-2 border-border bg-background p-8 md:p-12 shadow-2xl space-y-8 rounded-sm">
              <div className="text-center space-y-2 border-b border-border pb-6">
                <span className="text-[10px] font-mono tracking-[0.25em] text-muted-foreground uppercase">
                  {editingStory.englishTitle || "STORY ARCHIVE"} // PAGE {selectedPageIndex + 1}
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-black text-foreground">
                  {editingStory.title}
                </h3>
                {currentPage.title && (
                  <p className="font-sans text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    {currentPage.title}
                  </p>
                )}
              </div>

              {currentPage.highlightQuote && (
                <div className="border-l-4 border-foreground pl-4 py-2 italic text-muted-foreground font-serif text-sm">
                  &ldquo;{currentPage.highlightQuote}&rdquo;
                </div>
              )}

              <div className="font-sans text-base md:text-lg leading-relaxed text-foreground whitespace-pre-line space-y-4">
                {currentPage.content || (
                  <p className="text-muted-foreground italic">(This page has no content yet.)</p>
                )}
              </div>

              <div className="text-center pt-8 border-t border-border font-mono text-[10px] text-muted-foreground tracking-widest">
                — {selectedPageIndex + 1} —
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // -------------------------------------------------------------
  // STORIES LIST / SHELF VIEW (DEFAULT)
  // -------------------------------------------------------------
  const publishedCount = stories.filter((s) => s.published).length
  const draftCount = stories.length - publishedCount
  const totalPages = stories.reduce((acc, s) => acc + (s.totalPages || s.pages?.length || 0), 0)

  return (
    <div className="space-y-8 font-mono text-xs uppercase pb-20">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-2 border-foreground bg-card p-6 shadow-2xl gap-4">
        <div>
          <div className="text-[10px] text-muted-foreground tracking-widest mb-1">
            EDITORIAL ENGINE // LITERARY ARCHIVE
          </div>
          <h2 className="font-display text-3xl font-black text-foreground flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            <span>STORIES MANAGEMENT</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/stories"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 border border-border bg-background text-foreground font-bold hover:border-foreground transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>VIEW PUBLIC ARCHIVE (/STORIES)</span>
          </Link>

          <button
            onClick={handleStartCreate}
            className="flex items-center gap-2 px-5 py-2.5 border-2 border-foreground bg-foreground text-background font-bold hover:bg-background hover:text-foreground transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE NEW STORY</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border-2 border-border bg-card">
          <div className="text-[10px] text-muted-foreground tracking-widest">TOTAL STORIES</div>
          <div className="text-3xl font-black font-display text-foreground mt-1">
            {stories.length}
          </div>
        </div>

        <div className="p-4 border-2 border-border bg-card">
          <div className="text-[10px] text-muted-foreground tracking-widest">PUBLISHED LIVE</div>
          <div className="text-3xl font-black font-display text-emerald-500 mt-1">
            {publishedCount}
          </div>
        </div>

        <div className="p-4 border-2 border-border bg-card">
          <div className="text-[10px] text-muted-foreground tracking-widest">DRAFTS</div>
          <div className="text-3xl font-black font-display text-amber-500 mt-1">
            {draftCount}
          </div>
        </div>

        <div className="p-4 border-2 border-border bg-card">
          <div className="text-[10px] text-muted-foreground tracking-widest">TOTAL READING PAGES</div>
          <div className="text-3xl font-black font-display text-foreground mt-1">
            {totalPages}
          </div>
        </div>
      </div>

      {/* Stories Table / List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-border pb-3">
          <span className="font-bold text-xs tracking-wider">ALL CREATED STORIES ({stories.length})</span>
        </div>

        {stories.length === 0 ? (
          <div className="border-2 border-dashed border-border bg-card p-12 text-center space-y-4">
            <BookOpen className="w-10 h-10 mx-auto text-muted-foreground" />
            <h3 className="font-bold text-sm">NO STORIES CREATED YET</h3>
            <p className="text-muted-foreground normal-case font-sans max-w-sm mx-auto text-xs">
              Click the button below to write or publish your very first story.
            </p>
            <button
              onClick={handleStartCreate}
              className="px-5 py-2.5 border-2 border-foreground bg-foreground text-background font-bold hover:bg-background hover:text-foreground transition-all"
            >
              CREATE FIRST STORY
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map((story, index) => (
              <div
                key={story.id}
                className="border-2 border-border bg-card p-5 hover:border-foreground transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 sm:w-28 sm:h-20 border border-border bg-background shrink-0 overflow-hidden">
                    {story.coverImage ? (
                      <Image
                        src={story.coverImage}
                        alt={story.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">
                        NO COVER
                      </div>
                    )}
                  </div>

                  {/* Text details */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {story.published ? (
                        <span className="px-2 py-0.5 border border-emerald-600 bg-emerald-600/10 text-emerald-500 font-bold text-[10px]">
                          ✓ PUBLISHED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 border border-amber-600 bg-amber-600/10 text-amber-500 font-bold text-[10px]">
                          ○ DRAFT
                        </span>
                      )}

                      {story.featured && (
                        <span className="px-2 py-0.5 border border-foreground bg-foreground text-background font-bold text-[10px]">
                          ★ FEATURED
                        </span>
                      )}

                      <span className="text-[10px] text-muted-foreground">
                        {story.category || "FICTION"}
                      </span>
                    </div>

                    <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                      {story.title}
                    </h3>

                    {story.englishTitle && (
                      <p className="text-xs text-muted-foreground uppercase font-sans">
                        {story.englishTitle}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {story.totalPages || story.pages?.length || 0} PAGES
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {story.readTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
                  {/* Order buttons */}
                  <button
                    onClick={() => handleMoveStory(index, "up")}
                    disabled={index === 0}
                    className="p-2 border border-border bg-background hover:bg-foreground hover:text-background transition-colors disabled:opacity-20"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveStory(index, "down")}
                    disabled={index === stories.length - 1}
                    className="p-2 border border-border bg-background hover:bg-foreground hover:text-background transition-colors disabled:opacity-20"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Toggle publish status */}
                  <button
                    onClick={() => handleTogglePublish(story.id)}
                    className={`px-3 py-2 border font-bold text-[11px] transition-colors ${
                      story.published
                        ? "border-amber-500/50 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white"
                        : "border-emerald-500/50 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                    }`}
                  >
                    {story.published ? "UNPUBLISH" : "PUBLISH NOW"}
                  </button>

                  {/* Edit Story */}
                  <button
                    onClick={() => {
                      setEditingStory(story)
                      setSelectedPageIndex(0)
                      setActiveTab("details")
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 border-2 border-foreground bg-foreground text-background font-bold text-[11px] hover:bg-background hover:text-foreground transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>EDIT</span>
                  </button>

                  {/* Delete Story */}
                  <button
                    onClick={() => handleDeleteStory(story.id)}
                    className="p-2 border border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"
                    title="Delete story"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
