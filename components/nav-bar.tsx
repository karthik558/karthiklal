"use client"

import { useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { ArrowDown } from "lucide-react"
import NavHeader from "@/components/ui/nav-header"
import { useActiveSection } from "@/hooks/use-active-section"

const homeChapters = [
  { id: "home", label: "Introduction" },
  { id: "about", label: "Profile" },
  { id: "portfolio", label: "Selected work" },
  { id: "services", label: "Services" },
  { id: "skills", label: "Capabilities" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Credentials" },
  { id: "testimonials", label: "References" },
  { id: "portfolio-gallery", label: "Design archive" },
  { id: "cta", label: "Start a project" },
] as const
const homeChapterIds = homeChapters.map((chapter) => chapter.id)

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [pageProgress, setPageProgress] = useState(0)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollY = useRef(0)
  const pathname = usePathname()
  const activeSection = useActiveSection(homeChapterIds)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setPageProgress(scrollable > 0 ? Math.min(100, (currentScrollY / scrollable) * 100) : 0)

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
        setIsScrolled(currentScrollY > 40)
        lastScrollY.current = currentScrollY
      } else {
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolled(currentScrollY > 40)
          lastScrollY.current = currentScrollY
        }, 40)
      }
    }

    lastScrollY.current = window.scrollY
    const initialCheck = requestAnimationFrame(handleScroll)

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      cancelAnimationFrame(initialCheck)
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  const activeIndex = Math.max(0, homeChapters.findIndex((chapter) => chapter.id === activeSection))
  const activeChapter = homeChapters[activeIndex]
  const nextChapter = homeChapters[Math.min(activeIndex + 1, homeChapters.length - 1)]
  const routeLabel = pathname.startsWith("/projects/") ? "Case study" : pathname === "/projects" ? "Project directory" : pathname === "/blog" ? "Journal" : pathname === "/contact" ? "Contact" : "Portfolio"

  return (
    <nav className="fixed left-0 right-0 top-0 z-[9999] w-full isolate pointer-events-none">
      <div 
        className={`pointer-events-auto w-full transition-all duration-300 ${
          isScrolled 
            ? "border-b-2 border-border bg-background/90 py-3.5 backdrop-blur-xl shadow-md" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <NavHeader />
        </div>
        <div
          className={`grid overflow-hidden transition-all duration-300 ${
            isScrolled ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0">
            <div className="container mx-auto mt-3 flex max-w-7xl items-center gap-4 border-t border-border px-4 pt-2 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-muted-foreground md:px-6 md:text-[9px]">
              {pathname === "/" ? (
                <>
                  <span className="shrink-0 text-foreground">
                    {String(activeIndex + 1).padStart(2, "0")} / {String(homeChapters.length).padStart(2, "0")}
                  </span>
                  <span className="truncate">{activeChapter.label}</span>
                  <div className="h-px flex-1 overflow-hidden bg-border">
                    <div className="h-full bg-foreground" style={{ width: `${pageProgress}%` }} />
                  </div>
                  {activeIndex < homeChapters.length - 1 ? (
                    <a href={`/#${nextChapter.id}`} className="hidden shrink-0 items-center gap-1 text-foreground hover:underline sm:inline-flex">
                      Next / {nextChapter.label} <ArrowDown className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="hidden shrink-0 text-foreground sm:inline">Final chapter</span>
                  )}
                </>
              ) : (
                <>
                  <span className="text-foreground">{routeLabel}</span>
                  <div className="h-px flex-1 overflow-hidden bg-border">
                    <div className="h-full bg-foreground" style={{ width: `${pageProgress}%` }} />
                  </div>
                  <span>{Math.round(pageProgress)}% viewed</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
