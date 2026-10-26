"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getModelIcon } from "@/lib/admin-utils"
import { ThemeToggleAnimated } from "@/components/theme-toggle-animated"

interface ModelItem {
  id: string
  label: string
}

interface NavGroup {
  kicker: string
  items: ModelItem[]
}

const navGroups: NavGroup[] = [
  {
    kicker: "01 / PORTFOLIO WORK",
    items: [
      { id: "projects", label: "Projects" },
      { id: "featured-designs", label: "Design Work" },
      { id: "stories", label: "Stories" },
      { id: "blogs", label: "Journal & Blog" }
    ]
  },
  {
    kicker: "02 / EXPERTISE & EXPERIENCE",
    items: [
      { id: "services", label: "Services" },
      { id: "skills", label: "Technical Skills" },
      { id: "experiences", label: "Work Experience" },
      { id: "education", label: "Education" },
      { id: "certifications", label: "Certifications" }
    ]
  },
  {
    kicker: "03 / IDENTITY & COMMUNITY",
    items: [
      { id: "profile", label: "Profile & Bio" },
      { id: "socials", label: "Social Links" },
      { id: "testimonials", label: "Testimonials" }
    ]
  }
]

export default function AdminSidebar({ models = [] }: { models?: string[] }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const closeFrame = requestAnimationFrame(() => setMobileOpen(false))
    return () => cancelAnimationFrame(closeFrame)
  }, [pathname])

  // Collect any dynamic models not in the predefined groups
  const knownModelIds = new Set(navGroups.flatMap(g => g.items.map(i => i.id)))
  const extraModels = (models || []).filter(m => !knownModelIds.has(m))

  return (
    <>
      {/* Mobile Floating Menu Button */}
      <button 
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 px-4 py-3 border border-border/80 bg-card/95 text-foreground font-mono text-[11px] font-bold uppercase tracking-wider shadow-xl backdrop-blur-md flex items-center gap-2"
        aria-label="Open Admin Menu"
      >
        <Menu className="w-4 h-4 text-primary" />
        <span>MENU</span>
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity" 
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Shell */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col h-[100dvh] border-r border-border/80 bg-card/90 dark:bg-card/80 backdrop-blur-md transition-all duration-300 font-mono text-xs uppercase shrink-0 md:relative md:translate-x-0 select-none",
          mobileOpen ? "translate-x-0 w-72 shadow-2xl" : "-translate-x-full md:w-64",
          !mobileOpen && collapsed && "md:w-16"
        )}
      >
        {/* Header Bar */}
        <div className={cn(
          "flex items-center border-b border-border/80 h-14 shrink-0 transition-all",
          (!collapsed || mobileOpen) ? "justify-between px-4" : "justify-center px-2"
        )}>
          {(!collapsed || mobileOpen) && (
            <Link 
              href="/admin" 
              className="flex items-center gap-2 group"
              title="Admin Dashboard"
            >
              <span className="font-mono text-xs font-bold tracking-widest text-foreground uppercase">
                ADMIN
              </span>
            </Link>
          )}
          
          {/* Desktop Collapse / Expand Button */}
          <button 
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 border border-border/80 bg-background/60 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors shrink-0"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          {/* Mobile Close Button */}
          <button 
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden flex p-1.5 border border-border text-muted-foreground hover:text-foreground shrink-0"
            aria-label="Close Admin Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List */}
        <div className={cn(
          "flex-1 overflow-y-auto py-4 flex flex-col transition-all",
          (!collapsed || mobileOpen) ? "gap-6 px-3" : "gap-3 px-2"
        )}>
          
          {/* Main Dashboard Link */}
          <div>
            <Link
              href="/admin"
              title="Dashboard"
              className={cn(
                "nav-item flex items-center border transition-all text-[11px] font-bold tracking-wider",
                (!collapsed || mobileOpen) ? "gap-2.5 px-3 py-2" : "justify-center p-2.5",
                pathname === "/admin" 
                  ? "bg-foreground text-background border-foreground shadow-xs" 
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-background/80 hover:border-border/80"
              )}
            >
              <LayoutDashboard className="w-3.5 h-3.5 shrink-0 text-primary" />
              {(!collapsed || mobileOpen) && <span>DASHBOARD</span>}
            </Link>
          </div>

          {/* Grouped Model Navigation */}
          {navGroups.map((group, groupIdx) => {
            return (
              <div key={group.kicker} className="space-y-1">
                {(!collapsed || mobileOpen) ? (
                  <p className="studio-label text-[9px] px-2.5 mb-2 text-muted-foreground/90 font-mono tracking-widest">
                    {group.kicker}
                  </p>
                ) : (
                  groupIdx > 0 && <div className="h-px bg-border/40 my-1 mx-1" />
                )}
                <ul className="space-y-1">
                  {group.items.map((item, idx) => {
                    const Icon = getModelIcon(item.id)
                    const isActive = pathname === `/admin/${item.id}`
                    const indexStr = String(idx + 1).padStart(2, "0")

                    return (
                      <li key={item.id}>
                        <Link
                          href={`/admin/${item.id}`}
                          title={item.label}
                          className={cn(
                            "nav-item flex items-center border transition-all text-[11px] font-medium tracking-wider",
                            (!collapsed || mobileOpen) ? "gap-2.5 px-3 py-2" : "justify-center p-2.5",
                            isActive 
                              ? "bg-foreground text-background border-foreground shadow-xs font-bold" 
                              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-background/80 hover:border-border/80"
                          )}
                        >
                          {(!collapsed || mobileOpen) && (
                            <span className="text-[9px] font-mono opacity-60 w-4">{indexStr}</span>
                          )}
                          <Icon className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-background" : "text-primary")} />
                          {(!collapsed || mobileOpen) && (
                            <span className="truncate">{item.label}</span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}

          {/* Extra Models (if any dynamic ones exist) */}
          {extraModels.length > 0 && (
            <div className="space-y-1">
              {(!collapsed || mobileOpen) ? (
                <p className="studio-label text-[9px] px-2.5 mb-2 text-muted-foreground/90 font-mono tracking-widest">
                  OTHER MODULES
                </p>
              ) : (
                <div className="h-px bg-border/40 my-1 mx-1" />
              )}
              <ul className="space-y-1">
                {extraModels.map((model) => {
                  const Icon = getModelIcon(model)
                  const isActive = pathname === `/admin/${model}`

                  return (
                    <li key={model}>
                      <Link
                        href={`/admin/${model}`}
                        title={model.replace("-", " ")}
                        className={cn(
                          "nav-item flex items-center border transition-all text-[11px] font-medium tracking-wider",
                          (!collapsed || mobileOpen) ? "gap-2.5 px-3 py-2" : "justify-center p-2.5",
                          isActive 
                            ? "bg-foreground text-background border-foreground shadow-xs font-bold" 
                            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-background/80 hover:border-border/80"
                        )}
                      >
                        <Icon className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-background" : "text-primary")} />
                        {(!collapsed || mobileOpen) && (
                          <span className="truncate">{model.replace("-", " ")}</span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

        </div>

        {/* Footer / Controls */}
        <div className={cn(
          "border-t border-border/80 flex flex-col gap-2 bg-card/60 transition-all",
          (!collapsed || mobileOpen) ? "p-3" : "p-2 items-center"
        )}>
          <div className={cn("flex items-center", (!mobileOpen && collapsed) ? "justify-center w-full" : "justify-between px-2")}>
            {(!collapsed || mobileOpen) && (
              <span className="studio-label text-[9px]">THEME</span>
            )}
            <ThemeToggleAnimated />
          </div>
          
          <Link
            href="/"
            title="View Live Portfolio Site"
            className={cn(
              "flex items-center border border-border/70 bg-background/60 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors text-[10px] font-bold tracking-wider",
              (!collapsed || mobileOpen) ? "gap-2 px-3 py-2" : "justify-center p-2 w-full"
            )}
          >
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-primary" />
            {(!collapsed || mobileOpen) && <span>VIEW LIVE SITE</span>}
          </Link>
          
          <button
            type="button"
            onClick={async () => {
              await fetch('/api/admin/logout', { method: 'POST' })
              window.location.href = '/admin/login'
            }}
            title="Sign Out"
            className={cn(
              "flex items-center border border-border/70 bg-background/60 text-muted-foreground hover:text-destructive hover:border-destructive/60 transition-colors text-[10px] font-bold tracking-wider",
              (!collapsed || mobileOpen) ? "gap-2 px-3 py-2 w-full text-left" : "justify-center p-2 w-full"
            )}
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {(!collapsed || mobileOpen) && <span>SIGN OUT</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
