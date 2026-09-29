"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Scroll, 
  List, 
  Share2, 
  Check, 
  Maximize2, 
  Minimize2, 
  Sliders
} from "lucide-react"

export interface StoryPage {
  pageNumber: number
  title?: string
  highlightQuote?: string
  content: string
  image?: string
  imageCaption?: string
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

interface StoryReaderProps {
  story: Story
  onClose: () => void
}

type ReaderTheme = "midnight" | "sepia" | "light" | "espresso"

interface ThemeConfig {
  name: string
  bg: string
  text: string
  titleText: string
  muted: string
  border: string
  cardBg: string
  accent: string
  highlightBg: string
  highlightBorder: string
  highlightText: string
  btnBg: string
  btnHoverBg: string
  btnText: string
}

const THEMES: Record<ReaderTheme, ThemeConfig> = {
  midnight: {
    name: "Midnight",
    bg: "#0c0c0e",
    text: "#ededed",
    titleText: "#ffffff",
    muted: "#8e8e96",
    border: "#26262b",
    cardBg: "#16161a",
    accent: "#f59e0b",
    highlightBg: "rgba(245, 158, 11, 0.12)",
    highlightBorder: "rgba(245, 158, 11, 0.5)",
    highlightText: "#fef3c7",
    btnBg: "#1a1a20",
    btnHoverBg: "#26262e",
    btnText: "#ffffff",
  },
  sepia: {
    name: "Parchment",
    bg: "#f5ede2",
    text: "#22170f",
    titleText: "#18100a",
    muted: "#665445",
    border: "#dbcbb7",
    cardBg: "#ebdcc9",
    accent: "#8c4427",
    highlightBg: "rgba(140, 68, 39, 0.12)",
    highlightBorder: "rgba(140, 68, 39, 0.5)",
    highlightText: "#5a2612",
    btnBg: "#ebdcc9",
    btnHoverBg: "#dfceba",
    btnText: "#1c140d",
  },
  light: {
    name: "Editorial",
    bg: "#faf9f6",
    text: "#121214",
    titleText: "#000000",
    muted: "#575760",
    border: "#dededb",
    cardBg: "#f0efea",
    accent: "#18181b",
    highlightBg: "rgba(24, 24, 27, 0.08)",
    highlightBorder: "rgba(24, 24, 27, 0.4)",
    highlightText: "#18181b",
    btnBg: "#eae9e3",
    btnHoverBg: "#dedcd4",
    btnText: "#09090b",
  },
  espresso: {
    name: "Espresso",
    bg: "#1a1614",
    text: "#eae1d8",
    titleText: "#ffffff",
    muted: "#a89b90",
    border: "#38312b",
    cardBg: "#27211d",
    accent: "#fb923c",
    highlightBg: "rgba(251, 146, 60, 0.12)",
    highlightBorder: "rgba(251, 146, 60, 0.5)",
    highlightText: "#ffedd5",
    btnBg: "#27211d",
    btnHoverBg: "#352d27",
    btnText: "#ffffff",
  },
}

export default function StoryReader({ story, onClose }: StoryReaderProps) {
  const [mounted, setMounted] = useState(false)
  // Page index (0-based)
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)
  const [theme, setTheme] = useState<ReaderTheme>("midnight")
  const [fontSize, setFontSize] = useState<number>(19) // px
  const [lineHeight, setLineHeight] = useState<"normal" | "relaxed" | "loose">("relaxed")
  const [fontFamily, setFontFamily] = useState<"sans" | "serif">("sans")
  // Reading mode: "scroll" (Continuous novella) vs "book" (Single-page view)
  const [readingMode, setReadingMode] = useState<"scroll" | "book">("scroll")
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  
  // UI Panels
  const [tocOpen, setTocOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [resumeNotice, setResumeNotice] = useState<number | null>(null)

  const readerContainerRef = useRef<HTMLDivElement>(null)
  const contentScrollRef = useRef<HTMLDivElement>(null)

  const pages = story.pages || []
  const totalPages = pages.length || 1
  const currentPage = pages[currentPageIndex] || {
    pageNumber: 1,
    title: "",
    highlightQuote: "",
    content: "",
  }

  // Handle client mount for React Portal
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Lock body scroll and pause Lenis smooth scroll while reader is active
  useEffect(() => {
    if (typeof document === "undefined") return

    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = "hidden"
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    if (typeof window !== "undefined" && window.lenis) {
      window.lenis.stop()
    }

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
      if (typeof window !== "undefined" && window.lenis) {
        window.lenis.start()
      }
    }
  }, [])

  // Restore saved reading progress from LocalStorage
  useEffect(() => {
    try {
      const savedPage = localStorage.getItem(`karthiklal_story_${story.id}_page`)
      if (savedPage) {
        const pageNum = parseInt(savedPage, 10)
        if (pageNum > 1 && pageNum <= totalPages) {
          setResumeNotice(pageNum)
        }
      }
    } catch {
      // LocalStorage unavailable
    }
  }, [story.id, totalPages])

  // Save reading progress whenever page changes
  useEffect(() => {
    try {
      localStorage.setItem(`karthiklal_story_${story.id}_page`, String(currentPageIndex + 1))
    } catch {
      // Ignore
    }
  }, [currentPageIndex, story.id])

  // In scroll mode: track continuous scroll progress (0-100%) and active chapter in view
  useEffect(() => {
    if (readingMode !== "scroll") return
    const container = contentScrollRef.current
    if (!container) return

    const updateProgress = () => {
      const maxScroll = container.scrollHeight - container.clientHeight
      const currentScroll = container.scrollTop
      const rawPercent = maxScroll > 0 ? (currentScroll / maxScroll) * 100 : 0
      setScrollProgress(Math.min(100, Math.max(0, Math.round(rawPercent * 10) / 10)))

      const pageElements = container.querySelectorAll<HTMLElement>(".story-page-section")
      const containerTop = container.getBoundingClientRect().top
      let activeIdx = 0

      pageElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect()
        if (rect.top - containerTop <= 180) {
          activeIdx = index
        }
      })

      setCurrentPageIndex(activeIdx)
    }

    updateProgress()
    container.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress, { passive: true })

    return () => {
      container.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [readingMode])

  // Navigation handlers for book mode
  const goToNextPage = useCallback(() => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex((prev) => prev + 1)
      if (contentScrollRef.current) {
        contentScrollRef.current.scrollTop = 0
      }
    }
  }, [currentPageIndex, totalPages])

  const goToPrevPage = useCallback(() => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1)
      if (contentScrollRef.current) {
        contentScrollRef.current.scrollTop = 0
      }
    }
  }, [currentPageIndex])

  // Mode switcher handler: smoothly switch between Scroll and Book mode
  const handleSetMode = (mode: "scroll" | "book") => {
    if (mode === readingMode) return
    setReadingMode(mode)
    if (mode === "scroll") {
      setTimeout(() => {
        const el = document.getElementById(`story-page-${currentPageIndex + 1}`)
        if (el) {
          el.scrollIntoView({ behavior: "auto", block: "start" })
        }
      }, 50)
    } else {
      if (contentScrollRef.current) {
        contentScrollRef.current.scrollTop = 0
      }
    }
  }

  // Jump to specific chapter from TOC drawer
  const handleJumpToPage = (idx: number) => {
    setCurrentPageIndex(idx)
    setTocOpen(false)
    if (readingMode === "scroll") {
      setTimeout(() => {
        const el = document.getElementById(`story-page-${idx + 1}`)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 50)
    } else {
      if (contentScrollRef.current) {
        contentScrollRef.current.scrollTop = 0
      }
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return

      if (e.key === "Escape") {
        if (tocOpen) {
          setTocOpen(false)
        } else if (settingsOpen) {
          setSettingsOpen(false)
        } else {
          onClose()
        }
      } else if (e.key === "ArrowRight") {
        if (readingMode === "book") goToNextPage()
      } else if (e.key === "ArrowLeft") {
        if (readingMode === "book") goToPrevPage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToNextPage, goToPrevPage, onClose, tocOpen, settingsOpen, readingMode])

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerContainerRef.current?.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  // Copy share link
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin + "/stories")
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  const currentTheme = THEMES[theme]
  const bookModePercent = Math.round(((currentPageIndex + 1) / totalPages) * 100)
  const activeProgress = readingMode === "scroll" ? scrollProgress : bookModePercent
  const displayPercent = Math.round(activeProgress)

  // Typography font-family string
  const activeFontFamily = fontFamily === "serif"
    ? "'Noto Serif Malayalam', 'Noto Serif', Georgia, 'Times New Roman', serif"
    : "'Manjari', var(--font-sans), system-ui, -apple-system, sans-serif"

  if (!mounted || typeof document === "undefined") {
    return null
  }

  const readerContent = (
    <motion.div
      ref={readerContainerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      data-lenis-prevent="true"
      style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.text,
      }}
      className="fixed inset-0 z-[999990] flex flex-col transition-colors duration-300 overflow-hidden font-sans select-text isolate"
    >
      {/* Top Controls Header Bar - Sleek, Balanced, World-Class Mobile & Desktop Header */}
      <header
        style={{
          backgroundColor: currentTheme.cardBg,
          borderColor: currentTheme.border,
        }}
        className="relative h-14 sm:h-16 px-3 sm:px-6 md:px-8 border-b flex items-center justify-between shrink-0 select-none z-30 shadow-sm backdrop-blur-md"
      >
        {/* Left: Refined Close Button & (on Desktop) Title */}
        <div className="flex items-center gap-2 sm:gap-3 truncate min-w-0">
          <button
            onClick={onClose}
            style={{
              backgroundColor: currentTheme.btnBg,
              color: currentTheme.titleText,
              borderColor: currentTheme.border,
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border hover:opacity-75 transition-all shrink-0 shadow-sm"
            title="Exit Reader (Esc)"
            aria-label="Close reader"
            id="story-reader-close-btn"
          >
            <X className="w-4 h-4 shrink-0" />
          </button>

          {/* Desktop Title & Subtitle (Hidden on mobile per user request) */}
          <div className="hidden sm:block truncate min-w-0">
            <h2 
              style={{ color: currentTheme.titleText }}
              className="font-display font-black text-sm md:text-base lg:text-lg truncate tracking-tight"
            >
              {story.title}
            </h2>
            <div 
              style={{ color: currentTheme.muted }}
              className="flex items-center gap-2 font-mono text-[10px] md:text-xs uppercase"
            >
              <span>{story.englishTitle || "Story"}</span>
              <span>•</span>
              <span style={{ color: currentTheme.titleText }} className="font-bold">
                PAGE {currentPageIndex + 1} OF {totalPages}
              </span>
              <span>({displayPercent}%)</span>
            </div>
          </div>
        </div>

        {/* Center on Mobile: Minimal Progress Badge */}
        <div className="sm:hidden flex items-center justify-center">
          <div 
            style={{
              backgroundColor: currentTheme.bg,
              borderColor: currentTheme.border,
              color: currentTheme.titleText,
            }}
            className="px-2.5 py-1 border text-[11px] font-mono font-bold tracking-wider shadow-sm"
          >
            {currentPageIndex + 1} / {totalPages}
          </div>
        </div>

        {/* Right: Symmetrical, Clean Icon Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Reading Mode Switcher Button */}
          <button
            onClick={() => handleSetMode(readingMode === "scroll" ? "book" : "scroll")}
            style={{
              backgroundColor: currentTheme.btnBg,
              borderColor: currentTheme.border,
              color: currentTheme.titleText,
            }}
            className="h-9 px-2.5 sm:h-10 sm:px-3 flex items-center gap-1.5 border hover:opacity-80 transition-all shadow-sm font-mono text-xs"
            title={readingMode === "scroll" ? "Switch to Book Mode" : "Switch to Scroll Mode"}
            id="story-reader-mode-toggle"
          >
            {readingMode === "scroll" ? (
              <>
                <Scroll className="w-4 h-4 text-primary shrink-0" />
                <span className="hidden md:inline font-bold text-[11px]">SCROLL</span>
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 text-primary shrink-0" />
                <span className="hidden md:inline font-bold text-[11px]">BOOK</span>
              </>
            )}
          </button>

          {/* Chapter / Pages Drawer Toggle */}
          <button
            onClick={() => setTocOpen(!tocOpen)}
            style={{
              backgroundColor: tocOpen ? undefined : currentTheme.btnBg,
              color: tocOpen ? undefined : currentTheme.titleText,
              borderColor: currentTheme.border,
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border ${
              tocOpen ? "border-primary bg-primary text-primary-foreground font-bold" : "hover:opacity-80"
            } transition-all shadow-sm`}
            title="Chapters Navigation"
            id="story-reader-toc-toggle"
          >
            <List className="w-4 h-4 shrink-0" />
          </button>

          {/* Settings Menu Toggle */}
          <div className="relative">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              style={{
                backgroundColor: settingsOpen ? undefined : currentTheme.btnBg,
                color: settingsOpen ? undefined : currentTheme.titleText,
                borderColor: currentTheme.border,
              }}
              className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border ${
                settingsOpen ? "border-primary bg-primary text-primary-foreground" : "hover:opacity-80"
              } transition-all shadow-sm`}
              title="Reader Settings (Themes, Font size, Font style)"
              id="story-reader-settings-toggle"
            >
              <Sliders className="w-4 h-4 shrink-0" />
            </button>

            {/* Settings Dropdown Popover */}
            <AnimatePresence>
              {settingsOpen && (
                <>
                  <div
                    onClick={() => setSettingsOpen(false)}
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      backgroundColor: currentTheme.cardBg,
                      borderColor: currentTheme.border,
                      color: currentTheme.text,
                    }}
                    className="fixed sm:absolute right-3 sm:right-0 top-16 w-[calc(100vw-24px)] sm:w-80 border-2 p-5 shadow-2xl z-50 font-mono text-xs uppercase space-y-4"
                  >
                    <div 
                      style={{ borderColor: currentTheme.border }}
                      className="flex items-center justify-between border-b pb-2.5"
                    >
                      <span 
                        style={{ color: currentTheme.titleText }}
                        className="font-bold tracking-wider"
                      >
                        READER PREFERENCES
                      </span>
                      <button onClick={() => setSettingsOpen(false)} className="hover:opacity-70 p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Paper Theme Switcher */}
                    <div className="space-y-2">
                      <label 
                        style={{ color: currentTheme.muted }}
                        className="text-[10px] tracking-widest font-bold"
                      >
                        PAPER THEME
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.keys(THEMES) as ReaderTheme[]).map((tKey) => {
                          const t = THEMES[tKey]
                          const isSelected = theme === tKey
                          return (
                            <button
                              key={tKey}
                              onClick={() => setTheme(tKey)}
                              style={{
                                backgroundColor: isSelected ? t.cardBg : t.bg,
                                color: t.text,
                                borderColor: isSelected ? currentTheme.accent : currentTheme.border,
                              }}
                              className={`p-2.5 border text-left flex items-center justify-between transition-all ${
                                isSelected ? "font-bold shadow-sm ring-1 ring-primary" : "hover:opacity-90"
                              }`}
                            >
                              <span>{t.name}</span>
                              <span 
                                style={{ backgroundColor: t.bg, borderColor: t.border }}
                                className="w-3.5 h-3.5 border shadow-inner" 
                              />
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Font Size Adjuster */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label 
                          style={{ color: currentTheme.muted }}
                          className="text-[10px] tracking-widest font-bold"
                        >
                          FONT SIZE
                        </label>
                        <span 
                          style={{ color: currentTheme.titleText }}
                          className="font-bold"
                        >
                          {fontSize}PX
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setFontSize(Math.max(16, fontSize - 2))}
                          style={{
                            backgroundColor: currentTheme.bg,
                            color: currentTheme.text,
                            borderColor: currentTheme.border,
                          }}
                          className="flex-1 py-2 border font-bold text-xs hover:opacity-80"
                        >
                          A- (SMALLER)
                        </button>
                        <button
                          onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                          style={{
                            backgroundColor: currentTheme.bg,
                            color: currentTheme.text,
                            borderColor: currentTheme.border,
                          }}
                          className="flex-1 py-2 border font-bold text-xs hover:opacity-80"
                        >
                          A+ (LARGER)
                        </button>
                      </div>
                    </div>

                    {/* Font Family Choice - Guaranteed to switch to authentic Noto Serif Malayalam */}
                    <div className="space-y-2">
                      <label 
                        style={{ color: currentTheme.muted }}
                        className="text-[10px] tracking-widest font-bold"
                      >
                        TYPOGRAPHY
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setFontFamily("sans")}
                          style={{
                            backgroundColor: fontFamily === "sans" ? currentTheme.bg : "transparent",
                            color: currentTheme.text,
                            borderColor: fontFamily === "sans" ? currentTheme.accent : currentTheme.border,
                            fontFamily: "'Manjari', var(--font-sans), sans-serif",
                          }}
                          className={`py-2 px-3 border transition-colors ${
                            fontFamily === "sans" ? "font-bold ring-1 ring-primary" : ""
                          }`}
                        >
                          MODERN SANS
                        </button>
                        <button
                          onClick={() => setFontFamily("serif")}
                          style={{
                            backgroundColor: fontFamily === "serif" ? currentTheme.bg : "transparent",
                            color: currentTheme.text,
                            borderColor: fontFamily === "serif" ? currentTheme.accent : currentTheme.border,
                            fontFamily: "'Noto Serif Malayalam', 'Noto Serif', Georgia, serif",
                          }}
                          className={`py-2 px-3 border transition-colors normal-case ${
                            fontFamily === "serif" ? "font-bold ring-1 ring-primary" : ""
                          }`}
                        >
                          Classic Serif
                        </button>
                      </div>
                    </div>

                    {/* Line Height */}
                    <div className="space-y-2">
                      <label 
                        style={{ color: currentTheme.muted }}
                        className="text-[10px] tracking-widest font-bold"
                      >
                        LINE SPACING
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                        {(["normal", "relaxed", "loose"] as const).map((lh) => (
                          <button
                            key={lh}
                            onClick={() => setLineHeight(lh)}
                            style={{
                              backgroundColor: lineHeight === lh ? currentTheme.bg : "transparent",
                              color: currentTheme.text,
                              borderColor: lineHeight === lh ? currentTheme.accent : currentTheme.border,
                            }}
                            className={`py-1.5 border capitalize transition-colors ${
                              lineHeight === lh ? "font-bold ring-1 ring-primary" : ""
                            }`}
                          >
                            {lh}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            style={{
              backgroundColor: currentTheme.btnBg,
              color: currentTheme.titleText,
              borderColor: currentTheme.border,
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 hidden sm:flex items-center justify-center border hover:opacity-80 transition-colors shadow-sm"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            style={{
              backgroundColor: currentTheme.btnBg,
              color: currentTheme.titleText,
              borderColor: currentTheme.border,
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 hidden sm:flex items-center justify-center border hover:opacity-80 transition-colors shadow-sm"
            title="Share Story Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Real-time Reading Progress Bar pinned at the bottom edge of the Header */}
        <div 
          style={{ backgroundColor: currentTheme.border }}
          className="absolute bottom-0 left-0 right-0 h-[3px] w-full overflow-hidden pointer-events-none z-40"
        >
          <div
            style={{
              width: `${activeProgress}%`,
              backgroundColor: currentTheme.accent || "hsl(var(--primary))",
            }}
            className="h-full bg-primary transition-[width] duration-75 ease-out shadow-sm"
          />
        </div>
      </header>

      {/* Resume Notice Toast */}
      <AnimatePresence>
        {resumeNotice !== null && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              backgroundColor: currentTheme.cardBg,
              borderColor: currentTheme.border,
              color: currentTheme.text,
            }}
            className="mx-auto mt-4 px-5 py-2.5 border-2 shadow-2xl font-mono text-xs uppercase flex items-center gap-4 z-40"
          >
            <span>YOU WERE PREVIOUSLY ON PAGE {resumeNotice}.</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  handleJumpToPage(resumeNotice - 1)
                  setResumeNotice(null)
                }}
                className="px-2.5 py-1 bg-primary text-primary-foreground font-bold text-[10px]"
              >
                RESUME
              </button>
              <button
                onClick={() => setResumeNotice(null)}
                style={{
                  borderColor: currentTheme.border,
                  color: currentTheme.muted,
                }}
                className="px-2.5 py-1 border text-[10px] hover:opacity-80"
              >
                DISMISS
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table of Contents / Pages Drawer */}
      <AnimatePresence>
        {tocOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTocOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              data-lenis-prevent="true"
              style={{
                backgroundColor: currentTheme.cardBg,
                borderColor: currentTheme.border,
                color: currentTheme.text,
              }}
              className="fixed left-0 top-0 bottom-0 w-80 sm:w-96 border-r-2 p-6 z-50 flex flex-col font-mono text-xs uppercase shadow-2xl"
            >
              <div 
                style={{ borderColor: currentTheme.border }}
                className="flex items-center justify-between border-b pb-4 mb-4 shrink-0"
              >
                <div>
                  <div 
                    style={{ color: currentTheme.muted }}
                    className="text-[10px] tracking-widest font-bold"
                  >
                    CHAPTER NAVIGATION
                  </div>
                  <h3 
                    style={{ color: currentTheme.titleText }}
                    className="font-bold text-sm"
                  >
                    ALL PAGES ({totalPages})
                  </h3>
                </div>
                <button
                  onClick={() => setTocOpen(false)}
                  style={{
                    backgroundColor: currentTheme.bg,
                    borderColor: currentTheme.border,
                    color: currentTheme.text,
                  }}
                  className="p-1.5 border hover:opacity-80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div
                data-lenis-prevent="true"
                className="flex-1 overflow-y-auto space-y-2 pr-1"
                style={{ overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" }}
              >
                {pages.map((p, idx) => {
                  const isActive = currentPageIndex === idx
                  const previewSnippet = (p.content || "").slice(0, 80).replace(/\n/g, " ")
                  return (
                    <div
                      key={idx}
                      onClick={() => handleJumpToPage(idx)}
                      style={{
                        backgroundColor: isActive ? undefined : currentTheme.bg,
                        borderColor: isActive ? undefined : currentTheme.border,
                        color: isActive ? undefined : currentTheme.text,
                      }}
                      className={`p-3.5 border cursor-pointer transition-all ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground font-bold shadow-md"
                          : "hover:border-primary"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold">PAGE {idx + 1}</span>
                        <span 
                          style={{ color: isActive ? "rgba(255,255,255,0.8)" : currentTheme.muted }}
                          className="text-[10px]"
                        >
                          {p.title || `Scene ${idx + 1}`}
                        </span>
                      </div>
                      <p 
                        style={{ color: isActive ? "rgba(255,255,255,0.9)" : currentTheme.muted }}
                        className="text-[11px] line-clamp-2 normal-case font-sans"
                      >
                        {previewSnippet || "..."}
                      </p>
                    </div>
                  )
                })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Reading Canvas - Clean natural scroll container with zero wheel hijacking */}
      <main
        ref={contentScrollRef}
        data-lenis-prevent="true"
        style={{
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        }}
        className="flex-1 overflow-y-auto relative px-4 sm:px-6 md:px-8 py-8 md:py-16 flex flex-col items-center select-text"
      >
        <div className="w-full max-w-2xl lg:max-w-3xl space-y-10">
          
          {/* MODE 1: SCROLL MODE (Continuous Reading View - Natural, Fluid, Highly Legible) */}
          {readingMode === "scroll" && (
            <div className="space-y-16">
              {/* Novella Hero Heading */}
              <div 
                style={{ borderColor: currentTheme.border }}
                className="text-center border-b pb-10 space-y-4"
              >
                <span 
                  style={{ color: currentTheme.muted }}
                  className="font-mono text-xs tracking-widest uppercase font-semibold"
                >
                  പൂർണ്ണ നോവൽ // {story.category}
                </span>
                <h1 
                  style={{ color: currentTheme.titleText }}
                  className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight"
                >
                  {story.title}
                </h1>
                {story.englishTitle && (
                  <p 
                    style={{ color: currentTheme.muted }}
                    className="font-sans text-base sm:text-lg uppercase tracking-widest font-medium"
                  >
                    {story.englishTitle}
                  </p>
                )}
                <div 
                  style={{ color: currentTheme.muted }}
                  className="font-mono text-xs pt-2 flex items-center justify-center gap-3"
                >
                  <span>എഴുതിയത്: {story.author}</span>
                  <span>•</span>
                  <span>{story.readTime}</span>
                  <span>•</span>
                  <span>{totalPages} PAGES</span>
                </div>
              </div>

              {/* Story Cinematic Artwork */}
              {story.coverImage && (
                <div 
                  style={{ borderColor: currentTheme.border }}
                  className="w-full border-2 overflow-hidden shadow-md space-y-0"
                >
                  <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
                    <Image
                      src={story.coverImage}
                      alt={story.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div 
                    style={{ 
                      backgroundColor: currentTheme.cardBg,
                      borderColor: currentTheme.border, 
                      color: currentTheme.muted 
                    }}
                    className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest border-t flex items-center justify-between"
                  >
                    <span>കഥാ ചിത്രം // STORY ARTWORK</span>
                    <span>{story.englishTitle || "COVER"}</span>
                  </div>
                </div>
              )}

              {/* All Pages Rendered Sequentially without interruptions */}
              {pages.map((p, idx) => (
                <article
                  key={idx}
                  id={`story-page-${idx + 1}`}
                  data-page-index={idx}
                  style={{ borderColor: currentTheme.border }}
                  className="story-page-section space-y-6 border-b pb-14 scroll-mt-24"
                >
                  <div 
                    style={{ borderColor: currentTheme.border }}
                    className="flex items-center justify-between font-mono text-xs uppercase tracking-widest border-b pb-2.5"
                  >
                    <span 
                      style={{ color: currentTheme.titleText }}
                      className="font-bold"
                    >
                      PAGE {idx + 1} OF {totalPages}
                    </span>
                    <span 
                      style={{ color: currentTheme.muted }}
                      className="text-[11px]"
                    >
                      {p.title || `Chapter ${idx + 1}`}
                    </span>
                  </div>

                  {p.highlightQuote && (
                    <div 
                      style={{
                        backgroundColor: currentTheme.highlightBg,
                        borderLeftColor: currentTheme.highlightBorder,
                        color: currentTheme.highlightText,
                        fontFamily: activeFontFamily,
                      }}
                      className={`border-l-4 p-4 md:p-5 my-5 text-sm md:text-base italic leading-relaxed ${
                        fontFamily === "serif" ? "story-font-serif" : "story-font-sans"
                      }`}
                    >
                      &ldquo;{p.highlightQuote}&rdquo;
                    </div>
                  )}

                  {/* Chapter Scene Artwork */}
                  {p.image && (
                    <div 
                      style={{ borderColor: currentTheme.border }}
                      className="w-full border-2 overflow-hidden shadow-sm my-6 space-y-0"
                    >
                      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
                        <Image
                          src={p.image}
                          alt={p.title || `Scene illustration`}
                          fill
                          sizes="(max-width: 768px) 100vw, 800px"
                          className="object-cover"
                        />
                      </div>
                      {p.imageCaption && (
                        <div 
                          style={{ 
                            backgroundColor: currentTheme.cardBg,
                            borderColor: currentTheme.border, 
                            color: currentTheme.muted 
                          }}
                          className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest border-t flex items-center justify-between"
                        >
                          <span>രംഗം // SCENE ARTWORK</span>
                          <span>{p.imageCaption}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    style={{
                      color: currentTheme.text,
                      fontSize: `${fontSize}px`,
                      lineHeight: lineHeight === "normal" ? 1.75 : lineHeight === "relaxed" ? 2.0 : 2.3,
                      fontFamily: activeFontFamily,
                    }}
                    className={`space-y-6 whitespace-pre-line leading-relaxed ${
                      fontFamily === "serif" ? "story-font-serif" : "story-font-sans"
                    }`}
                  >
                    {p.content}
                  </div>
                </article>
              ))}

              {/* Story Conclusion Card */}
              <div 
                style={{
                  backgroundColor: currentTheme.cardBg,
                  borderColor: currentTheme.border,
                  color: currentTheme.text,
                }}
                className="border-2 p-8 text-center space-y-4 font-mono text-xs uppercase shadow-sm"
              >
                <div className="text-primary font-bold tracking-[0.3em] text-sm">ശുഭം // THE END</div>
                <h3 
                  style={{ color: currentTheme.titleText }}
                  className="font-display text-xl font-bold"
                >
                  {story.title}
                </h3>
                <p 
                  style={{ color: currentTheme.muted }}
                  className="normal-case font-sans text-sm"
                >
                  കഥ വായിച്ചതിന് നന്ദി. കൂടുതൽ കഥകൾക്കായി ആർക്കൈവ് സന്ദർശിക്കുക.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all uppercase"
                  >
                    BACK TO STORIES SHELF
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: BOOK MODE (Single Page View with Footer Navigation) */}
          {readingMode === "book" && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPageIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="space-y-8"
              >
                {/* Page Header */}
                <div 
                  style={{ borderColor: currentTheme.border }}
                  className="text-center space-y-2 border-b pb-6"
                >
                  <div 
                    style={{ color: currentTheme.muted }}
                    className="font-mono text-[11px] tracking-[0.25em] uppercase flex items-center justify-center gap-2"
                  >
                    <span>{story.englishTitle || "STORY"}</span>
                    <span>//</span>
                    <span 
                      style={{ color: currentTheme.titleText }}
                      className="font-bold"
                    >
                      PAGE {currentPageIndex + 1} OF {totalPages}
                    </span>
                  </div>

                  {currentPage.title && (
                    <h3 
                      style={{ color: currentTheme.titleText }}
                      className="font-display text-xl sm:text-2xl font-bold tracking-tight"
                    >
                      {currentPage.title}
                    </h3>
                  )}
                </div>

                {/* Story Cover Artwork on Opening Page */}
                {currentPageIndex === 0 && story.coverImage && (
                  <div 
                    style={{ borderColor: currentTheme.border }}
                    className="w-full border-2 overflow-hidden shadow-md my-6"
                  >
                    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
                      <Image
                        src={story.coverImage}
                        alt={story.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                )}

                {/* Highlight Pull-Quote (if present) */}
                {currentPage.highlightQuote && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      backgroundColor: currentTheme.highlightBg,
                      borderLeftColor: currentTheme.highlightBorder,
                      color: currentTheme.highlightText,
                      fontFamily: activeFontFamily,
                    }}
                    className={`border-l-4 p-4 md:p-5 my-6 text-sm md:text-base italic leading-relaxed ${
                      fontFamily === "serif" ? "story-font-serif" : "story-font-sans"
                    }`}
                  >
                    &ldquo;{currentPage.highlightQuote}&rdquo;
                  </motion.div>
                )}

                {/* Chapter Scene Artwork for Current Page */}
                {currentPage.image && (
                  <div 
                    style={{ borderColor: currentTheme.border }}
                    className="w-full border-2 overflow-hidden shadow-md my-6 space-y-0"
                  >
                    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
                      <Image
                        src={currentPage.image}
                        alt={currentPage.title || "Scene illustration"}
                        fill
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="object-cover"
                      />
                    </div>
                    {currentPage.imageCaption && (
                      <div 
                        style={{ 
                          backgroundColor: currentTheme.cardBg,
                          borderColor: currentTheme.border, 
                          color: currentTheme.muted 
                        }}
                        className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest border-t flex items-center justify-between"
                      >
                        <span>രംഗം // SCENE ARTWORK</span>
                        <span>{currentPage.imageCaption}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Page Paragraphs Content */}
                <div
                  style={{
                    color: currentTheme.text,
                    fontSize: `${fontSize}px`,
                    lineHeight: lineHeight === "normal" ? 1.75 : lineHeight === "relaxed" ? 2.0 : 2.3,
                    fontFamily: activeFontFamily,
                  }}
                  className={`space-y-6 tracking-normal whitespace-pre-line ${
                    fontFamily === "serif" ? "story-font-serif" : "story-font-sans"
                  }`}
                >
                  {currentPage.content}
                </div>

                {/* Bottom Page Break Marker */}
                <div 
                  style={{ color: currentTheme.muted }}
                  className="pt-10 pb-4 text-center font-mono text-xs tracking-[0.3em] flex items-center justify-center gap-3"
                >
                  <div style={{ backgroundColor: currentTheme.border }} className="w-12 h-[1px]" />
                  <span style={{ color: currentTheme.titleText }} className="font-bold">{currentPageIndex + 1}</span>
                  <div style={{ backgroundColor: currentTheme.border }} className="w-12 h-[1px]" />
                </div>
              </motion.div>
            </AnimatePresence>
          )}

        </div>
      </main>

      {/* Bottom Footer Page Turn Bar (in Book Mode) */}
      {readingMode === "book" && (
        <footer
          style={{
            backgroundColor: currentTheme.cardBg,
            borderColor: currentTheme.border,
          }}
          className="h-16 px-4 md:px-8 border-t-2 flex items-center justify-between shrink-0 select-none z-30 shadow-lg"
        >
          {/* Previous Page Button */}
          <button
            onClick={goToPrevPage}
            disabled={currentPageIndex === 0}
            style={{
              backgroundColor: currentTheme.btnBg,
              color: currentTheme.btnText,
              borderColor: currentTheme.border,
            }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 border font-mono text-xs uppercase font-bold transition-all disabled:opacity-30 disabled:pointer-events-none hover:opacity-80"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">PREVIOUS</span>
          </button>

          {/* Interactive Page Jumper / Slider */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
            <span 
              style={{ color: currentTheme.titleText }}
              className="font-bold"
            >
              PAGE {currentPageIndex + 1}
            </span>
            <input
              type="range"
              min={0}
              max={totalPages - 1}
              value={currentPageIndex}
              onChange={(e) => {
                setCurrentPageIndex(Number(e.target.value))
                if (contentScrollRef.current) {
                  contentScrollRef.current.scrollTop = 0
                }
              }}
              className="w-20 sm:w-44 accent-primary h-1 bg-neutral-500/30 cursor-pointer"
            />
            <span style={{ color: currentTheme.muted }}>
              / {totalPages}
            </span>
          </div>

          {/* Next Page Button */}
          <button
            onClick={goToNextPage}
            disabled={currentPageIndex === totalPages - 1}
            style={{
              backgroundColor: currentTheme.titleText,
              color: currentTheme.bg,
              borderColor: currentTheme.titleText,
            }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 border-2 font-mono text-xs uppercase font-bold transition-all disabled:opacity-30 disabled:pointer-events-none hover:opacity-90"
          >
            <span className="hidden sm:inline">NEXT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </footer>
      )}
    </motion.div>
  )

  return createPortal(readerContent, document.body)
}
